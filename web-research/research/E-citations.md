# Research pack E: How citations are made, carried and checked

Session 2, "Web search and research". Compiled 25 October 2026.

Tags: **[verified]** = checked against a primary source this session (link inline). **[verified-2nd]** = checked, but only against secondary or community sources. **[unverified]** = found but not confirmed. **[calc]** = my arithmetic or my reading of verified material.

Overlap with pack D: D §4.6 already has the headline citation-failure numbers (Tow Center, DeepTRACE 40–80%, LiveResearchBench, DeepResearch Bench 78–90%). D §2.3 covers Anthropic's multi-agent architecture. This pack covers the mechanics underneath: how the pointer gets made, what survives handoffs, and how checking works.

---

## Executive summary

1. There are four ways vendors make citations: **(a)** markers that point at retrieved result IDs, **(b)** pointers resolved by the API into exact quoted text, **(c)** spans of the answer aligned to sources, with optional scores, and **(d)** evidence attached to each field of a structured output. Most products mix them.
2. Anthropic is strictest. The model emits a pointer, and the API fills in `cited_text` from the source, so document citations "are guaranteed to contain valid pointers". The pointer is valid, but the support is not guaranteed: the quote can still fail to back the sentence.
3. OpenAI, Gemini's new Interactions API and Parallel's chat endpoint now all return the same shape: `url_citation` annotations with `url`, `title`, `start_index` and `end_index`. No quote text is included, and none of them documents whether the URL must come from the retrieved set.
4. Perplexity's Agent API returns plain `[n]` or `[web:n]` markers in the text, plus a separate `search_results` list. Its own prompt template tells the model "do not invent source numbers", so inventing them must be possible.
5. **The presenter is right about forced fields.** PhantomFill (Jun 2026) found that a required JSON field drives fabrication to 100% in 10 of 13 models. GPT-5.5 admits missing data 98% of the time in prose, yet fabricates 40 times out of 40 when the field is required. OpenAI's own docs warn that schemas "can result in hallucinations if the input is completely unrelated".
6. Good services keep citations outside your schema. Parallel's `basis` and Exa's `grounding` attach per-field citations, excerpts and a high/medium/low confidence next to your JSON. Exa says outright: make unverifiable fields nullable "so the agent can return `null` instead of fabricating a value". Anthropic rejects Citations combined with structured outputs (400 error). Gemini Deep Research does not support structured outputs at all.
7. Multi-agent systems mostly carry sources as plain text and renumber them at every merge. Anthropic is the exception: it adds citations at the very end with a CitationAgent that may only add tags, never change the report's text.
8. No study measures citation loss per agent hop directly. The indirect evidence is poor. Deep research agents fabricate 3–13% of URLs, and in WANDR 57.5–86.6% of excerpts fail to fully support their claim.
9. SAFE (DeepMind, 2024) made automated fact-checking cheap. It agreed with crowd workers 72% of the time, won 76% of disagreements, and cost $0.19 per response against $4 for humans. Its successors fix specific gaps: unverifiable claims (VeriScore), padding (Core), speed (VeriFastScore) and cited-page checks (FACT, WANDR). None of them can judge omissions or source quality.
10. Slide line: **"A citation proves the model pointed at something. It doesn't prove the source says what the sentence says."**

---

## 1. How each provider produces citations (from API docs)

### 1.1 Anthropic (Claude API)

**Citations on documents** (launched 23 Jan 2025 [unverified this session: the [blog page](https://claude.com/blog/introducing-citations-api) now shows only June 2025 dates])
- You turn it on per document with `"citations": {"enabled": true}` on `document` blocks: plain text, PDF or "custom content" ([docs](https://platform.claude.com/docs/en/build-with-claude/citations)) [verified].
- Response: the answer comes back as several `text` blocks. Each claim block carries a `citations` array. Types are `char_location` (`start_char_index`, `end_char_index`, 0-indexed, end exclusive), `page_location` (`start_page_number`, `end_page_number`, 1-indexed) and `content_block_location` (`start_block_index`, `end_block_index`). All three include `cited_text`, `document_index` and `document_title` [verified].
- Granularity: plain text and PDFs are "chunked into sentences". Custom content is cited at the level of the blocks you supply. Images inside PDFs cannot be cited [verified].
- How it is produced: "Internally, the model outputs citations in a standardized format, and those citations are then parsed into cited text and document location indices." So it happens during generation, and the API then resolves the quote. `cited_text` costs no output tokens [verified].
- Constraint: "Because the API ... extracts `cited_text` directly, citations are guaranteed to contain valid pointers to the provided documents" [verified]. The pointer cannot reference text that is not in the document. Whether the quote supports the claim is still the model's judgement [calc].
- Vendor-reported results: Endex cut "source hallucinations and formatting issues from 10% to 0%", and recall accuracy was up to 15% higher than custom implementations ([blog](https://claude.com/blog/introducing-citations-api)) [verified].
- No confidence score [verified: none documented].

**Web search tool** ([docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)) [verified]
- "Citations are always enabled for web search." Each citation has type `web_search_result_location` with `url`, `title`, `encrypted_index` ("must be passed back for multi-turn conversations") and `cited_text` ("Up to 150 characters of the cited content").
- Search results arrive as `web_search_result` items with `url`, `title`, `page_age` and `encrypted_content`. If `encrypted_content` is missing or modified on a later turn, the request fails with a 400.
- Citation fields do not count toward input or output tokens. Display rule: "citations must be included to the original source" when you show outputs to end users.
- Constraint: `encrypted_index` is an opaque reference into a retrieved result, and `cited_text` is extracted from it. That is the same parse-and-resolve design as document citations [calc: the docs do not say "guaranteed" for web search].
- Newer versions (`web_search_20260209` and later) can filter results in code before they reach the model ("dynamic filtering") [verified].

**Web fetch tool** ([docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool)): citations are "optional ... and disabled by default". When on, a fetched page is cited like a document, using `char_location` with `cited_text` [verified].

**Search result blocks for your own RAG** ([docs](https://platform.claude.com/docs/en/build-with-claude/search-results)) [verified]
- Pass `{"type": "search_result", "source": ..., "title": ..., "content": [text blocks], "citations": {"enabled": true}}` in a tool result or at the top level. `source` can be any stable string, such as a URL or `kb://article-1234`.
- Citations come back as `search_result_location` with `source`, `title`, `cited_text`, `search_result_index`, `start_block_index` and `end_block_index`.
- "Citations are all-or-nothing": mixing enabled and disabled results in one request is an error.
- This is the closest thing to a provider-native **evidence ledger**: your stable ID goes in, and the same ID comes back on each claim [calc].

**Structured outputs:** "Citations cannot be used together with structured outputs." Enabling citations on `document` or `search_result` blocks together with `output_config.format` "returns a 400 error", "because citations require interleaving citation blocks with text output" ([docs](https://platform.claude.com/docs/en/build-with-claude/citations)) [verified]. The docs do not say what happens to web-search citations when you use a JSON schema [unverified].

### 1.2 OpenAI (Responses API)

- **Web search** ([docs](https://developers.openai.com/api/docs/guides/tools-web-search)) [verified]. Output has a `web_search_call` item (action `search`, `open_page` or `find_in_page`) and a `message` whose `content[0].annotations` holds `url_citation` objects with `url`, `title`, `start_index` and `end_index`. No quote text is returned.
- The `sources` field (`include: ["web_search_call.action.sources"]`) lists every URL consulted. "The number of sources is often greater than the number of citations" [verified]. Checking that every cited URL appears in `sources` is a cheap validity test [calc].
- Display rule: "inline citations must be made clearly visible and clickable in your user interface" [verified].
- **File search**: annotations of type `file_citation` with `index`, `file_id` and `filename`. Each one points to a position in the text and a whole file, not a passage. The `file_search_call` returns `search_results: null` unless you `include` them ([docs](https://developers.openai.com/api/docs/guides/tools-file-search)) [verified].
- **Deep research** (`o3-deep-research`, `o4-mini-deep-research`): the final `message` uses the same annotations (`url`, `title`, `start_index`, `end_index`) ([docs](https://developers.openai.com/api/docs/guides/deep-research)) [verified].
- Whether the URL is restricted to retrieved results, and whether annotations are made during or after generation, is not documented [unverified]. No confidence score.
- **Structured outputs with web search:** no documented rule. Developers have reported since Mar 2025 that `annotations` comes back empty (`[]`) when a JSON schema is used, even though the search ran ([forum, Mar 2025](https://community.openai.com/t/web-search-tool-annotations-for-structured-outputs/1145382); [forum, Nov 2025](https://community.openai.com/t/structured-output-breaks-annotation/1365140)). No staff reply appears in either thread [verified-2nd].

### 1.3 Google Gemini

There are two API shapes, and both are live.

- **Interactions API** (now the default in the Gemini API docs, e.g. `gemini-3.8-flash`). With `{"type": "google_search"}`, the answer's text block carries `annotations` of type `url_citation` with `url`, `title`, `start_index` and `end_index`. There are also `google_search_call` steps (holding `queries`) and `google_search_result` steps (holding `search_suggestions` HTML) ([docs](https://ai.google.dev/gemini-api/docs/google-search)) [verified]. This is the same wire shape as OpenAI.
- **generateContent / Vertex AI** (`groundingMetadata`) ([API ref](https://ai.google.dev/api/generate-content); [Vertex docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/grounding/grounding-with-google-search)) [verified]:
  - `groundingChunks[]`: each is `web` (`uri`, `title`), `image`, `retrievedContext` or `maps`.
  - `groundingSupports[]`: each has a `segment` (`partIndex`, `startIndex`, `endIndex` **in bytes**, plus `text`), `groundingChunkIndices[]` and `confidenceScores[]` (0–1, "must have the same size as the groundingChunkIndices").
  - `webSearchQueries[]`, `searchEntryPoint.renderedContent` (the Search Suggestions widget) and `retrievalMetadata.googleSearchDynamicRetrievalScore`.
- Constraint: supports point by index into `groundingChunks`, which are retrieved items, so a support cannot name an unretrieved URL [calc]. No quote text is returned, only the segment of the answer.
- How it is produced: Google does not say. Byte-offset segments with per-chunk scores look like alignment after generation (family c), but that is my inference [unverified].
- **Confidence scores in 3.x:** the field is still in the API reference, and the Vertex sample response shows values such as `0.8662828`. Forum reports say scores vanished for some models from May 2025 onward ([Google dev forum](https://discuss.google.dev/t/gemini-2-0-suddenly-drops-confidencescore-when-grounding-with-a-data-store/188575)). I could not confirm whether Gemini 3.x returns them [unverified].
- Display rules: Search Suggestions "must" be shown in production, and "Displaying grounding support is required" (Vertex docs) [verified].
- **URL context tool:** same `url_citation` annotations, plus a `url_context_result` step with each retrieval's `status` (e.g. `"unsafe"`). It tries an index cache first, then fetches live ([docs](https://ai.google.dev/gemini-api/docs/url-context)) [verified].
- **Structured outputs with tools:** "Gemini 3 lets you combine Structured Outputs with built-in tools, including Grounding with Google Search" (preview) ([docs](https://ai.google.dev/gemini-api/docs/structured-output)) [verified]. Whether annotations survive alongside the JSON is not documented [unverified]. The same page warns: "Implement robust error handling for schema-compliant but semantically incorrect outputs" [verified].
- **Gemini Deep Research** (agent `deep-research-preview-04-2026`): produces "detailed, cited reports". "The Deep Research agent currently doesn't support structured outputs." Google advises "reviewing the `citations` provided in the response" ([docs](https://ai.google.dev/gemini-api/docs/deep-research)) [verified]. The exact citation fields are not documented on that page [unverified].
- **Check grounding API** (Vertex AI Agent Search): covered in §4.4.

### 1.4 Perplexity (Agent API and Search API)

- "Sonar Chat Completions support ended on September 27, 2026." Synchronous requests are being reformulated as Agent API requests ([docs](https://docs.perplexity.ai/docs/getting-started/overview)) [verified].
- Old Sonar shape: a top-level `citations` array of URLs plus `search_results` (`title`, `url`, `date`, `last_updated`, `snippet`), with `[n]` markers in the text [verified, from the migration example].
- Agent API shape: an `output` item of `type: "search_results"` whose `results[]` hold `id`, `url`, `title`, `snippet`, `date`, `last_updated` and `source`. `id` is the "Stable index used to reference the result in citations". The answer is `output_text` with `annotations: []` ([web search docs](https://docs.perplexity.ai/docs/agent-api/tools/web-search)) [verified].
- Markers live in the text itself: `fast` effort uses `[1]`, and `low`/`medium`/`high` use `[web:1]`. "Whether the model adds markers to the answer is prompt-dependent". Perplexity says to treat `id` and `url` "as the source of truth for citations" [verified].
- Constraint: none from the API. The recommended prompt says "only cite a source that actually contains that information. Do not cite a source you did not use, do not invent source numbers" ([migration guide](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/how-to)) [verified]. This is family (a), enforced by prompt alone [calc].
- The Search API returns ranked results only, with no generated answer and so no citations ([docs index](https://docs.perplexity.ai/llms.txt)) [verified].

### 1.5 Parallel, Exa, Tavily, You.com

**Parallel Task API: `basis`** ([docs](https://docs.parallel.ai/task-api/guides/access-research-basis)) [verified]
- `output.content` is your JSON. `output.basis[]` is a list of FieldBasis objects with `field`, `citations[]` (`url`, `excerpts[]`), `reasoning`, and `confidence` ("high", "medium" or "low", or null).
- There is one entry per top-level field, plus one per list element (`key_executives.0`). Since 24 Aug 2026 this is the default.
- When evidence is thin, the documented example shows low confidence and reasoning saying so: "No official company documentation confirming their internal CRM system was found" [verified]. For empty fields, Parallel's own example schemas say "If unavailable, return null" [verified].
- Calibration (vendor blog, testing May 2025): high-confidence fields were 97.2%, 97.5% and 85.9% correct across three difficulty groups, versus 64.5%, 37.5% and 36.1% for low ([blog](https://parallel.ai/blog/introducing-basis-with-calibrated-confidences)) [verified-2nd: read via summariser, group labels inferred].
- Parallel's chat endpoint returns OpenAI-style `url_citation` annotations ("the stock wire format"), and "A span may carry multiple citations" ([docs](https://docs.parallel.ai/responses-api/features/citations)) [verified].

**Exa** [verified]
- Deep Search and the Agent return `output.content` plus `output.grounding[]` entries of `field` (e.g. `companies[0].amount`), `citations[]` (`title`, `url`) and `confidence`. "Do not add citation or confidence fields to your own schema; Exa returns them automatically" ([docs](https://exa.ai/docs/search/deep-search)).
- From the Agent docs: "Make fields that may not be verifiable nullable and leave them out of `required`, so the agent can return `null` instead of fabricating a value". Their example uses a `cannot_verify` verdict, separate from `absent` ([docs](https://exa.ai/docs/agent/quickstart)).
- `/answer` returns an answer plus `citations[]` (title, url, publishedDate, author, optional text) at answer level. These are the "Search results used to generate the answer" ([ref](https://exa.ai/docs/reference/answer)).

**Tavily**: `/search` can return an LLM `answer` alongside scored `results`, with no link between sentences and sources. `/research` returns `content`, which is markdown or your `output_schema` object, plus `sources[]` (`title`, `url`, `favicon`). `citation_format` is `numbered`, `mla`, `apa` or `chicago` ([research ref](https://docs.tavily.com/documentation/api-reference/endpoint/research)) [verified]. Citations are written into the text by the model [calc].

**You.com Research API**: `output.content` is markdown with `[1]` markers, and `output.sources[]` holds `url`, `title` and `snippets[]` ([guide](https://you.com/docs/examples/research)) [verified].

### 1.6 Microsoft

- **Grounding with Bing Search** (Foundry Agent Service): website URLs come back in the `annotations` field, and the Bing query URL comes from run-step details. "These two references must be retained and displayed in the exact form provided by Microsoft" ([docs](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/how-to/tools/bing-grounding)) [verified]. "Agents (classic) ... will be retired on March 31, 2027" [verified].
- Azure OpenAI's `web_search` tool is said to mirror OpenAI's `url_citation` shape [unverified].
- Azure AI Content Safety **groundedness detection** is a checker, not a citer: see §4.4.

### 1.7 Comparison table

| Provider / API | Citation field(s) | Granularity | Quote text returned? | Pointer constrained to retrieved items? | When made | Confidence |
|---|---|---|---|---|---|---|
| Anthropic documents | `citations[]`: `char_location` / `page_location` / `content_block_location` | Sentence chunks or your blocks; char, page or block indices | Yes, `cited_text` (exact, free) | **Yes, "guaranteed valid pointers"** | During generation, resolved by API | None |
| Anthropic web search | `web_search_result_location` | Text block (claim) | Yes, ≤150 chars | Pointer is `encrypted_index` into results [calc] | During generation | None |
| Anthropic `search_result` | `search_result_location` + `source` | Your content blocks | Yes | Yes, indexes your results [calc] | During generation | None |
| OpenAI web search / deep research | `annotations[]` `url_citation` | Character span of output | No | Not documented | Not documented | None |
| OpenAI file search | `file_citation` (`index`, `file_id`, `filename`) | Position in text, then whole file | No | Not documented | Not documented | None |
| Gemini Interactions | `annotations[]` `url_citation` | Character span | No | Not documented | Not documented | None |
| Gemini generateContent / Vertex | `groundingSupports[]` to `groundingChunks[]` | Byte segment | Segment of the answer only | Yes, indices into chunks [calc] | Not documented; looks post-hoc [unverified] | `confidenceScores[]` (0–1) when returned |
| Perplexity Agent API | `[n]` / `[web:n]` in text + `search_results[].id` | Sentence (by prompt) | Result `snippet` only | **No, prompt only** | During generation | None |
| Parallel Task | `basis[]`: `citations`, `excerpts`, `reasoning`, `confidence` | Field and list element | Yes, `excerpts` | Not documented | Not documented | high / medium / low |
| Exa Deep / Agent | `grounding[]`: `field`, `citations`, `confidence` | Field path | No (title, url) | Not documented | Not documented | high / medium / low |
| Tavily / You.com research | Markers in text + `sources[]` | Free text | You.com: `snippets` | No | During generation | None |
| Bing grounding (Foundry) | `annotations` + Bing query URL | Text span | No | Not documented | Not documented | None |

### 1.8 Families of approach

| Family | How it works | Who | Strength | Weakness |
|---|---|---|---|---|
| **(a) Numbered markers to result IDs** | Model writes `[3]`, and the app maps 3 to a result | Perplexity Agent API, You.com, Tavily, LangChain/GPT Researcher prompts, ALCE-style systems | Simple; works with any model | Nothing stops `[9]` when only 8 results exist, or a real ID on the wrong sentence |
| **(b) Extractive pointer, resolved by the API** | Model emits a structured pointer; the API copies the exact source text | Anthropic Citations, web search, `search_result` | Quote always exists in the source; cheap to audit | Support still judged by the model; no JSON schema at the same time |
| **(c) Span-to-source alignment** | Answer spans linked to retrieved chunks, optionally scored | Gemini `groundingSupports`; OpenAI, Gemini and Parallel `url_citation` spans (mechanism undisclosed); RARR; Vertex check grounding | Fine-grained; can add scores | Opaque; spans can be over-broad; scores not documented as calibrated |
| **(d) Field-level evidence** | Each JSON field gets citations, excerpts, reasoning and confidence, outside your schema | Parallel `basis`, Exa `grounding` | Fits data pipelines; confidence shows where to review | Confidence ≠ source quality (Parallel's own UI example cites Reddit at "High confidence") |

A fifth, older pattern, **(e) free-text URLs**, has the model type URLs into prose. This is where fabricated links come from (see §3.3).

### 1.9 Research lineage

| Work | Year | Idea | Result worth quoting |
|---|---|---|---|
| WebGPT ([2112.09332](https://arxiv.org/abs/2112.09332)) | Dec 2021 | Model browses and must "collect references while browsing" so humans can check facts | Preferred to human demonstrators 56% of the time [verified] |
| AIS ([2112.12870](https://arxiv.org/abs/2112.12870)) | Dec 2021 | "Attributable to Identified Sources": a human annotation standard for support | Basis for later NLI checkers [verified] |
| RARR ([2210.08726](https://arxiv.org/abs/2210.08726)) | Oct 2022 | Generate first, then research and revise: finds evidence after the fact, fixes unsupported text, outputs an attribution report | Post-hoc attribution for any model; auto-AIS vs human r = 0.74 (paper Fig. 10) [verified] |
| Attributed QA ([2212.08037](https://arxiv.org/abs/2212.08037)) | Dec 2022 | Benchmark where answers must carry an attribution; automatic metric correlated with human AIS | Framed "attributed LLMs" as a task [verified] |
| ALCE ([2305.14627](https://arxiv.org/abs/2305.14627)) | May 2023 | Citation recall (do the cited passages entail the statement?) and precision (is each citation needed?), judged by an NLI model | "Even the best models lack complete citation support 50% of the time" on ELI5 [verified] |
| LongCite ([2409.02897](https://arxiv.org/abs/2409.02897)) | Sep 2024 | Supervised fine-tuning on 45k synthetic examples for sentence-level citations in long context | 8–9B models beat GPT-4o on citation quality [verified] |
| DR Tulu ([2511.19399](https://arxiv.org/abs/2511.19399)) | Nov 2025 | RL with evolving rubrics plus an auxiliary **citation reward** | Citation reward switched off after 650 steps, then back on at steps 3350–4000 "due to citation performance dropping". A negative rubric suppresses "verbatim copying of retrieved content to maximize citation precision", a form of reward hacking [verified] |
| CaRR / C-GRPO ([2601.06021](https://arxiv.org/abs/2601.06021)) | Jan 2026 | RL reward requiring correct citations and a complete evidence chain to the answer | Beats outcome-only RL; discourages shortcuts [verified] |

---

## 2. Structured outputs and forced citations

### 2.1 Does a required field force invention? Yes, measurably.

- **PhantomFill** ([arXiv 2607.20492](https://arxiv.org/abs/2607.20492), Jun 2026) [verified]. Thirteen models got unanswerable inputs, and only the answer format changed. In prose, GPT-5.5 says data is missing 98% of the time. With a required sentiment field it "invents an answer 40 times out of 40". "Required fields drive fabrication to 100% in ten of thirteen models." An "insufficient evidence" option "rescues only the frontier: all nine open-weight models ignore it". Fabrication "hides ... in required enums and minimum-count arrays, fields where no disclaimer fits".
- **OpenAI's own guide** ([structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)) [verified]:
  - The model "will always try to adhere to the provided schema, which can result in hallucinations if the input is completely unrelated to the schema."
  - "Structured Outputs can still contain mistakes."
  - "All fields must be required", but you can "emulate an optional parameter by using a union type with `null`". Refusals are exposed separately.
- **Gemini:** "always validate values"; handle "schema-compliant but semantically incorrect outputs" [verified].
- **Anthropic:** schema compliance is "guaranteed" for field types and required fields. On a safety refusal, "the output might not match your schema" (`stop_reason: "refusal"`). Its hallucination guide says to let Claude say "I don't have enough information" and to "retract the claim" if no supporting quote is found ([guide](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)) [verified].
- **Format pressure also hurts reasoning.** "Let Me Speak Freely?" ([2408.02442](https://arxiv.org/abs/2408.02442)) found "a significant decline in LLMs reasoning abilities under format restrictions" [verified]. FACTS Grounding's judge tests point the same way: Claude 3.5 Sonnet as judge scored macro-F1 70.2 with a span-level prompt but 56.0 with a JSON prompt ([2501.03200](https://arxiv.org/abs/2501.03200)) [verified].

### 2.2 What good services do instead

| Pattern | Who does it | Effect |
|---|---|---|
| Citations live **outside** the user schema | Parallel `basis`, Exa `grounding`; Anthropic refuses to combine them | The model is never asked to type a URL into a required string |
| Nullable fields, not in `required` | Exa guidance; OpenAI `["string","null"]`; Parallel examples | A legal way to say "not found" |
| Separate `cannot_verify` from `absent` | Exa Agent example | A failed fetch is not negative evidence |
| Confidence per field | Parallel, Exa (high/medium/low); Gemini `confidenceScores` | Routes review effort; Parallel claims about 2x fewer errors when only low-confidence fields are reviewed [verified-2nd] |
| Reasoning text per field | Parallel `reasoning` | Says why the evidence is weak |

### 2.3 Which providers block citations plus JSON schema?

- **Anthropic:** blocked; a 400 error for document and `search_result` citations with `output_config.format` [verified].
- **Gemini Deep Research:** no structured outputs [verified]. Gemini 3 models do allow structured output with Google Search, in preview [verified].
- **OpenAI:** allowed, but community reports say annotations disappear [verified-2nd].
- **Perplexity:** `response_format` JSON schema supported, with no word on citations inside it ([docs](https://docs.perplexity.ai/docs/agent-api/output-control)) [verified]. Sources still arrive in `search_results` [calc].
- **Parallel and Exa:** designed for it [verified].

### 2.4 Recommended schema design (synthesis) [calc]

1. Keep the answer schema citation-free. Get evidence from the provider's own channel (`basis`, `grounding`, annotations), or run two passes: a cited prose answer first, then a schema-only extraction over that text.
2. If you must carry evidence in your JSON, make it `{"value": X|null, "status": "found"|"not_found"|"cannot_verify", "evidence": [{"source_id": <enum of retrieved IDs>, "quote": "..."}]}`. Constrain `source_id` to an enum built from the retrieved set, so the grammar cannot emit an unretrieved ID.
3. After generation, check that every `quote` appears verbatim in the fetched page (string match), and that every URL is in the provider's `sources` list.
4. Never use `minItems` on citation arrays. PhantomFill finds fabrication concentrates in minimum-count arrays.

### 2.5 Verdict on the presenter's intuition

**Correct, with one refinement.** A mandatory citation field with no escape route does make most models invent something. That is now measured, not just suspected. Good services avoid it in three ways: they keep citations out of the user's schema, they make "no source" a legal value (null, low confidence, `cannot_verify`), or they build the pointer from retrieved items so it cannot name something unseen (Anthropic's extractive pointers, Gemini's chunk indices). The refinement is that a valid pointer is not a supporting pointer. Anthropic guarantees the quote exists, not that it backs the sentence. Field-level confidence describes the evidence, not the quality of the source.

### 2.6 Example payloads for slides (abridged; field names exactly as documented; values illustrative)

**Anthropic Messages API, web search tool:**
```json
{"type": "text",
 "text": "Spain won Euro 2024, beating England 2-1 in the final in Berlin.",
 "citations": [{
   "type": "web_search_result_location",
   "url": "https://www.uefa.com/euro2024/news/...",
   "title": "Spain beat England to win EURO 2024",
   "encrypted_index": "Eo8BCioIAhgBIiQy...",
   "cited_text": "Spain are European champions for a record fourth time after Mikel Oyarzabal's late winner gave them a 2-1 victory over England in Berlin..."
 }]}
```

**OpenAI Responses API, web search tool** (the same sentence, after a 14-character lead-in):
```json
{"type": "message", "role": "assistant",
 "content": [{
   "type": "output_text",
   "text": "Short answer: Spain won Euro 2024, beating England 2-1 in the final in Berlin.",
   "annotations": [{
     "type": "url_citation",
     "start_index": 14, "end_index": 78,
     "url": "https://www.uefa.com/euro2024/news/...",
     "title": "Spain beat England to win EURO 2024"
   }]}]}
```
Slide point: Anthropic hands you the quote, while OpenAI hands you a span and a link, so you must fetch the page to check it. Gemini's Interactions API now looks like the OpenAI version. Gemini's `generateContent` instead returns `groundingSupports: [{segment: {startIndex, endIndex, text}, groundingChunkIndices: [0], confidenceScores: [0.87]}]` [verified field names].

---

## 3. Keeping citations through multiple agents and rounds

### 3.1 How published systems do it

| System | How sources travel | Where citations are attached | Source |
|---|---|---|---|
| **Anthropic Research** | Subagents return findings to the lead. The engineering post also recommends subagents write to a filesystem and "pass lightweight references back to the coordinator" to "minimize the 'game of telephone'" | At the end: "passes all findings to a CitationAgent, which processes the documents and research report to identify specific locations for citations" | [Anthropic, Jun 2025](https://www.anthropic.com/engineering/multi-agent-research-system) [verified] |
| Anthropic CitationAgent prompt (published) | Gets `<synthesized_text>` plus the source documents | Rules: "Do NOT modify the <synthesized_text> in any way"; "ONLY add citations where the source documents directly support claims". Output text with tags removed "will be compared to the original report ... If the text is not identical, your result will be rejected" | [cookbook prompt](https://github.com/anthropics/anthropic-cookbook/blob/main/patterns/agents/prompts/citations_agent.md) [verified] |
| OpenAI deep research | One model in one context (see pack D §2.1); annotations on the final message | During final generation | [docs](https://developers.openai.com/api/docs/guides/deep-research) [verified]; mechanism [unverified] |
| Gemini Deep Research | Planner and task models share state (pack D §2.2) | "cited reports"; format not documented | [unverified] |
| LangChain open_deep_research | Each researcher's notes go through `compress_research`, which must "return inline citations for each source" and end with "### Sources". "It's really important not to lose any sources. A later LLM will be used to merge this report with others." Final writer renumbers: "Assign each unique URL a single citation number" | Every stage re-cites in text; URLs carried as plain text | [prompts.py](https://github.com/langchain-ai/open_deep_research/blob/main/src/open_deep_research/prompts.py) [verified] |
| GPT Researcher | Context with URLs; writer told "You MUST write all used source urls at the end" as markdown hyperlinks | Model types URLs into prose (family e) | [prompts.py](https://github.com/assafelovic/gpt-researcher/blob/master/gpt_researcher/prompts.py) [verified] |
| STORM (Stanford) | Simulated expert conversations collect references. For each section, relevant snippets are retrieved by embedding similarity and "the LLM is then prompted to generate the section with citations" | Per-section, at write time | [2402.14207](https://arxiv.org/abs/2402.14207) [verified] |

Note on the open_deep_research webpage summariser: it aims for "about 25-30 percent of the original length" [verified]. Exact quotes are lost before the writer ever sees the page [calc].

### 3.2 Failure modes, with what is measured

| Failure | Evidence |
|---|---|
| Citations renumbered or dropped at each merge | A design risk in text-carried systems (open_deep_research's prompt pleads "not to lose any sources"). **No paper found that measures loss per hop** [unverified gap]. A Feb 2026 position paper proposes metrics for it ("provenance coverage, provenance soundness, contradiction transparency, and audit effort") ([2602.13855](https://arxiv.org/abs/2602.13855)) [verified] |
| Fabricated URLs | 3–13% of citation URLs "have no record in the Wayback Machine and likely never existed"; 5–18% don't resolve. Deep research agents "hallucinate URLs at higher rates" than search-augmented LLMs. Gemini 2.5 Pro DR worst at 13.3%; OpenAI DR 3.5% fabricated but 10.1% non-resolving. A URL-checking tool cut non-resolving URLs 6–79x, to under 1% ([2604.03173](https://arxiv.org/abs/2604.03173), Apr 2026) [verified] |
| Caveat on that study | DRBench URLs were regex-extracted from report text. ExpertQA URLs came from search-result blocks (OpenAI `sources`, Anthropic `web_search_tool_result`, Google grounding metadata), where failures are more likely link rot or bot walls than invention [verified method; reading is calc] |
| Real page, wrong claim | WANDR: 33.6–68.3% of submitted pages fail at least one requirement; 57.5–86.6% of excerpts don't fully support the claim ([Perplexity, Jul 2026](https://www.perplexity.ai/hub/blog/wandr-benchmark-evaluating-research-agents-that-must-search-wide-and-deep)) [verified] |
| Accurate pointers ≠ accurate reports | DeepResearch Bench FACT: Claude 3.5/3.7 Sonnet with API search scored 94.0%/93.7% citation accuracy, the highest of all, against 39.4% for Perplexity Sonar Reasoning Pro. OpenAI DR scored 78.0% and Gemini 2.5 Pro DR 81.4%, but with 40.8 and 111.2 effective citations per task ([2506.11763](https://arxiv.org/abs/2506.11763), Table 1) [verified]. Extractive pointers seem to help precision; volume and precision trade off [calc] |
| Unsupported inference, not invention | STORM: unsupported sentences "stem from drawing improper inferences and inaccurate paraphrasing, rather than hallucinating non-existent contents"; editors flagged "red herring fallacy or overspeculation" [verified] |
| Citation as decoration | ReportBench separates "statement hallucination" from "citation hallucination" and finds deep research agents produce both ([2508.15804](https://arxiv.org/abs/2508.15804)) [verified] |

### 3.3 Recommended patterns (synthesis) [calc]

1. **Evidence ledger with stable IDs.** Every fetch gets an ID (`src_017`) recorded with URL, fetch time, and the exact passage used. Agents pass IDs and quotes, never just URLs, and never renumber. Anthropic's `search_result.source` field accepts such IDs natively.
2. **Pass quotes, not summaries.** Summaries strip the text a later checker needs. Keep a verbatim excerpt per claim, as Parallel's `excerpts` and WANDR's `{item, url, excerpts, answer}` record do.
3. **Write to files and pass references.** This is Anthropic's own recommendation for multi-agent handoffs [verified above].
4. **Cite at the end, against the original sources**, with a text-preserving check (Anthropic's CitationAgent rejects any change to the text).
5. **Verifier pass.** Re-fetch every cited URL, confirm the quote string is on the page, and run an entailment check. Drop or soften unsupported sentences, as RARR and WANDR do. Use a URL liveness and Wayback check for links.
6. **Make "not found" an allowed outcome** at every hop, not just at the end.

---

## 4. Automatic checking: SAFE and its successors

### 4.1 SAFE (Wei et al., Google DeepMind, [arXiv 2403.18802](https://arxiv.org/abs/2403.18802), Mar 2024; NeurIPS 2024) [all verified]

- **Pipeline** (Fig. 1):
  1. Split the response into individual facts.
  2. Revise each fact to be self-contained (replace "It" with "The Eiffel Tower").
  3. Check whether each fact is relevant to the prompt.
  4. For each relevant fact, issue Google Search queries in several steps: "three search results per query", "five" steps in their setup. Then reason to "supported" or "not supported".
- Implementation: `gpt-3.5-turbo-0125` plus the Serper Google Search API.
- **LongFact:** 2,280 fact-seeking prompts across 38 topics, written by GPT-4.
- **F1@K:** precision is the share of supported facts. Recall is supported facts divided by K, a "user's preferred response length". The paper reports K = 64 (median facts per response) and K = 178 (maximum).
- **Results:**
  - Agreed with crowd annotators on 72.0% of 16,011 facts.
  - On 100 disagreements, re-labelled by the authors with full internet access, SAFE was right 76% of the time and the humans 19%.
  - Cost $96.31 for 496 responses ($0.19 each) against $4 per response for crowd annotation, so "more than 20 times cheaper".
  - Larger models were generally more factual across 13 models.
- **Why SAFE failed** (its own analysis of 24 errors): mostly reasoning errors by the model, then search results lacking the needed information, then failures to make facts self-contained.
- **Limits stated by the authors:** "relies on Google Search as a knowledge source", which "may lack profundity in expert-level domains such as law and medicine". A weak model may split facts badly. SAFE "does not assess the global accuracy of a fact".
- **Critiques:**
  - The human baseline was crowd workers judging against a single Wikipedia page. Over a third of their errors were label confusion, and much missing information "was readily available elsewhere on the internet" (paper A.4) [verified].
  - Gary Marcus argued that "superhuman" meant beating underpaid crowd workers, not expert fact-checkers [verified-2nd].
  - The paper's Fig. 3 itself shows SAFE marking a subjective claim ("contributions have been significant") as supported. Search results can confirm opinions and popularity, not truth [calc].
  - It is circular when the web contains LLM-written text [calc].

### 4.2 Predecessor and successors

| Method | What it fixes | Result | Cost / limits |
|---|---|---|---|
| FActScore ([2305.14251](https://arxiv.org/abs/2305.14251), May 2023) | First "atomic fact" precision metric, checked against Wikipedia | ChatGPT 58% on biographies; automated estimator "less than a 2% error rate"; 6,500 generations "would have cost $26K" with humans | Wikipedia only; precision only; biographies |
| SAFE (2024) | Open web instead of Wikipedia; adds recall through F1@K | See above | Google results as ground truth |
| VeriScore ([2406.19276](https://arxiv.org/abs/2406.19276), Jun 2024) | Extracts only **verifiable** claims; FActScore and SAFE "assume that every claim is verifiable" | 16 models, 8 tasks; scores don't transfer across tasks | Many LLM calls |
| Core ([2407.03572](https://arxiv.org/abs/2407.03572), Jul 2024) | Scores could be "manipulated by adding obvious or repetitive subclaims"; Core keeps unique, informative subclaims | Makes several metrics "substantially more robust" | A plug-in filter, not a verifier |
| DnDScore ([2412.13175](https://arxiv.org/abs/2412.13175), Dec 2024) | Splitting and decontextualising facts pull in opposite directions; verifies subclaims with their context | "The choice of strategy matters in the resulting factuality scores" | Shows splitting choices change scores |
| VeriFastScore ([2505.16973](https://arxiv.org/abs/2505.16973), May 2025) | Speed: one fine-tuned Llama 3.1 8B extracts and verifies in one pass | r = 0.80 per example and 0.94 per system against VeriScore; 6.6x faster | Approximates VeriScore, not truth |
| Factcheck-Bench ([2311.09000](https://arxiv.org/abs/2311.09000)) and OpenFactCheck ([2405.05583](https://arxiv.org/abs/2405.05583)) | Benchmarks the checkers themselves at claim, sentence and document level | Best automatic checker F1 = 0.63 at catching false claims | Checkers are weak at finding false claims |
| FACTS Grounding ([2501.03200](https://arxiv.org/abs/2501.03200), Dec 2024 / Jan 2025) | Is a long answer fully grounded in a supplied document (up to 32k tokens)? | 860 public + 859 private prompts; three judge models "to reduce the bias", since judges favour their own outputs | Document grounding only, no web |
| FACTS suite ([2512.10791](https://arxiv.org/abs/2512.10791), Dec 2025) | Four parts: Multimodal, Parametric, **Search** (all models use the Brave Search API) and Grounding v2 | Gemini 3 Pro ranked first at launch | Judged by Gemini 2.0 Flash for Search; vendor-run |
| DeepResearch Bench **FACT** ([2506.11763](https://arxiv.org/abs/2506.11763), Jun 2025) | Extracts statement–URL pairs, removes duplicates, fetches the page (Jina Reader), and an LLM judges support | Citation accuracy and effective citations per task (table in §3.2) | Checks only cited claims; uncited claims escape |
| DeepTRACE ([2509.04499](https://arxiv.org/abs/2509.04499), Sep 2025) | Eight metrics from citation and support matrices: one-sided answers, overconfidence, relevant statements, uncited sources, unsupported statements, source necessity, citation accuracy, citation thoroughness | Citation accuracy 40–80% (pack D) | Needs a judge that agrees with humans; debate-style queries |
| ReportBench ([2508.15804](https://arxiv.org/abs/2508.15804), Aug 2025) | Checks cited statements against sources **and** checks uncited claims on the web | Commercial DR beats search-augmented LLMs | Academic survey topics only |
| LiveResearchBench / DeepEval ([2510.14240](https://arxiv.org/abs/2510.14240), Oct 2025) | Citation accuracy **and association** plus coverage and depth, across 17 systems | o3 DR worst at citation association (pack D) | Expert-curated, 100 tasks |
| **WANDR** (Perplexity, Jul 2026) | Grader "re-fetches the cited page", checks the page is usable, the excerpts are on the page, and they support every requirement. Browser retry for JS and bot walls. Binary verdict per record | Best hard F1 0.133; excerpt failure rates above | Excerpt-matching rewards copying; list-building tasks only |

### 4.3 What none of these can do [calc, drawing on the limits above]

- **Omissions.** Precision metrics reward short, safe answers. F1@K, coverage rubrics and recall in WANDR or DeepTRACE only partly fix this.
- **Source quality.** "Supported by a page" includes content farms and Reddit. Only rubric judges and DeepTRACE's source metrics touch this.
- **The evidence can be wrong.** Search results and fetched pages are treated as ground truth.
- **Splitting errors.** Core and DnDScore show the score depends on how you split.
- **Judgement and synthesis.** STORM's "red herring" problem, wrong inferences across correctly cited facts, sits above the fact level.

### 4.4 Is claim verification shipped as a product?

| Product | What it does | Status |
|---|---|---|
| **Vertex AI check grounding** ([guide](https://docs.cloud.google.com/generative-ai-app-builder/docs/check-grounding), [REST](https://docs.cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1/projects.locations.groundingConfigs/check)) | `answerCandidate` (≤4,096 tokens) + up to 200 `facts` (≤10k chars each) → `supportScore` (0–1), `claims[]` (`claimText`, `startPos`/`endPos` in bytes, `citationIndices`, `groundingCheckRequired`, `score`), `citedChunks`. `citationThreshold` setting; "latency less than 500ms" | Documented and available [verified]; GA status not checked |
| **Azure AI Content Safety groundedness detection** ([docs](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/groundedness)) | Flags ungrounded text against your sources; reasoning and non-reasoning modes; optional **correction** rewrites the ungrounded text | Correction in preview; "English language content only" [verified] |
| **Amazon Bedrock Guardrails contextual grounding check** ([docs](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-contextual-grounding-check.html)) | Grounding and relevance checks against a reference source; "Any new information introduced in the response will be considered un-grounded" | Documented [verified]; GA status not checked |
| Anthropic, OpenAI | No standalone claim-verification API found. Anthropic's closest feature is extractive Citations; OpenAI's is the `sources` list | [unverified: absence] |
| Parallel / Exa | Per-field confidence (not a verifier, but a review signal) | [verified] |

All three cloud checkers verify against **sources you supply**. None re-searches the open web the way SAFE does [calc].

---

## 5. Images

All files are in `/Users/reeve/Developer/at-the-frontier/assets/web-research/vendor/`. Each was checked with `file` and is under 1.5 MB (largest 300 KB).

| Filename | Source URL | What it shows | Credit |
|---|---|---|---|
| `cite-safe-pipeline.png` (1648×628) | Cropped from Fig. 1 of https://arxiv.org/pdf/2403.18802v4 | SAFE's four steps on "What is the Eiffel Tower?": split, make self-contained, check relevance, rate with Google Search. Output: 2 supported, 1 not, 1 irrelevant | Wei et al., Google DeepMind, 2024 |
| `cite-safe-multistep-search-example.png` (1648×720) | Cropped from Fig. 3 of the same PDF | SAFE runs three searches and rates "Elsa Pataky's contributions have been significant" as supported; the human says not supported. Useful both as a method and as a critique | Wei et al., 2024 |
| `cite-alce-task-setup.png` (1830×1042) | https://arxiv.org/html/2305.14627v2/main.png | ALCE task: question, retrieval corpus, answer with [1][2] citations, scored on fluency, correctness and citation quality | Gao et al., Princeton, 2023 |
| `cite-alce-citation-nli-evaluation.png` (1744×2039) | https://arxiv.org/html/2305.14627v2/citation.png | How citation recall and precision are computed with an NLI model (premise = cited passages, hypothesis = statement) | Gao et al., 2023 |
| `cite-rarr-research-and-revision.png` (432×544, small) | https://arxiv.org/html/2210.08726v3/fate_api9e.png | Post-hoc attribution: model output, then research and revision against a corpus, then a corrected text plus an attribution report | Gao et al., Google, 2022 |
| `cite-gemini-google-search-grounding-flow.png` (1860×1081) | https://ai.google.dev/static/gemini-api/docs/images/google-search-tool-overview.png | User → Gemini decides to search → query generation → Google Search → synthesis with sources | Google, Gemini API docs |
| `cite-wandr-evaluation-pipeline.png` (1880×1756) | https://cdn.sanity.io/images/aqo64vfr/production/b6daf1f0957350cae7b3ef467b92e30633b402e4-1880x1756.svg (rendered to PNG with `fm=png`) | WANDR grading: Solve → Fetch every cited page (browser retry) → Judge each record (atomic checks, no partial credit) → Score | Perplexity, Jul 2026 |
| `cite-parallel-basis-confidence-ui.png` (1280×852) | https://cdn.sanity.io/images/5hzduz3y/production/0a5bf3b45a7c6fd1d26232847f72f6b182ae50b8-1280x852.png | Parallel's field-level basis: "competitors" field at High confidence with reasoning and five numbered sources, the first a Reddit thread | Parallel Web Systems, 2025 |

Already in the folder from pack D and worth reusing: `dr-anthropic-multi-agent-process-flow.png` shows the CitationAgent step at the end of Anthropic's research loop.

Suggested slide pairings: SAFE pipeline next to the WANDR pipeline ("check facts by searching" vs "check citations by re-fetching"); ALCE's NLI figure for "what citation precision means"; the Parallel screenshot for "high confidence, Reddit source".

---

## 6. What I could not verify

- Whether OpenAI's or Gemini Interactions' `url_citation` URLs are restricted to retrieved results, or made during or after generation. Neither provider documents it.
- Whether Gemini 3.x still returns `confidenceScores` (forum reports of disappearance only).
- The citation field format of Gemini Deep Research's output.
- What Anthropic's API does with web-search citations plus `output_config.format`. The documented 400 covers only `document` and `search_result` blocks.
- OpenAI's position on empty annotations with structured outputs (community reports only, no staff reply).
- Azure OpenAI `web_search` field names; Gary Marcus's exact wording on SAFE.
- Parallel calibration figures were read through a summariser, and the group labels were inferred.
- **No published measurement of citation loss per agent hop.** I found only proposals (AAR metrics) and design advice.
- No vendor ships an open-web claim verifier like SAFE as a product. The cloud checkers only check against sources you supply.

---

## 7. Presenter notes: likely questions

- **"So does Claude never hallucinate a citation?"** On documents, the pointer always lands on real text, guaranteed by the API. It can still cite a real sentence that doesn't support the claim.
- **"Should I put a `sources` field in my JSON schema?"** Not as a required field. Make it nullable, constrain IDs to what was retrieved, or use a provider that returns evidence beside your schema.
- **"What's the cheapest check I can add?"** Re-fetch each URL and string-match the quote. The URL study cut dead links to under 1% this way, and WANDR grades on exactly this.
- **"Is SAFE good enough to grade our reports?"** For fact precision on general topics, yes, cheaply. It can't tell you what's missing, whether the source is any good, or whether the argument holds.
