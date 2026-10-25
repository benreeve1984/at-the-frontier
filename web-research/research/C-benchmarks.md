# C. Web search and research benchmarks: who runs them, what they measure, and what they say (as of 2026-10-25)

Research for "At The Frontier: Web search and research". Every number was read from a primary source on 2026-10-25: a vendor blog or benchmark page (often its `.md` twin or the chart data embedded in the page), a model or system card, a leaderboard data file (HF Space CSV/JSON, Google Sheet, site API), or an arXiv paper. Values that are not plain published numbers are marked in the row notes:
- **digitised from chart**: read off SVG coordinates or a log-scale chart (Anthropic cost charts, some Exa and Tavily charts, about ±3%);
- **chart data embedded in page**: exact values recovered from the page's JavaScript or `[{"label","x","y"}]` blocks (Parallel, Exa Agent, You.com, OpenAI GPT-5.6). These are exact, not digitised;
- **researcher-computed**: cost derived from a published total, token count or price (the arithmetic is in the row notes);
- **aggregator, unverified**: a handful of rows we could only find on Steel.dev, Zoom's HLE list or similar.

Machine-readable rows are in `C-scores.json` (3,128 rows, same folder; 950 carry a cost per 1,000 tasks).

Families used throughout:
- **lookup** = short factual questions answerable with one or a few searches (SimpleQA, SimpleQA Verified, FRAMES, FreshQA, AA-Omniscience, company-news lookups).
- **hard-find** = multi-hop needle-in-the-web questions (BrowseComp and its variants, DeepSearchQA, HLE with tools, GAIA, SealQA, WebWalkerQA, xbench-DeepSearch, Mind2Web 2, AssistantBench).
- **wide** = breadth tasks: collect many items into a table or list (WideSearch, ATLAS, FindAll-style entity search, multi-turn company search).
- **report** = long-form research reports and human preference for search answers (DeepResearch Bench, FutureSearch DRB, DRACO, WANDR, DeepScholar, LiveResearchBench, ResearchRubrics, Search Arena).
- **browse-act** = operating websites (Online-Mind2Web, WebVoyager, WebArena, VisualWebArena, REAL, WorkArena, Browser Use Bench; OSWorld as context only).
- **other** = composites (Artificial Analysis Search Index, Parallel Search Capability Leaderboard) and vendor-specific sets that fit none of the above (WISER, coding-docs search, finance sets).

One rule for reading the JSON: **a frontier is only meaningful inside one board**, meaning one `benchmark` + `run_by` + `date`/`source_url`. The same dataset run by two parties gives very different numbers (Exa Agent high scores 74% on BrowseComp in Exa's chart and 38% in Perplexity's).

---

## 0. Executive summary

1. **BrowseComp went from hard to nearly solved in 18 months.** OpenAI released it on 2025-04-10 with 1,266 questions; its own Deep Research scored 51.5% and human trainers solved 29.2% (367 of 1,255) after up to two hours each. By 2026-07-24 Claude Opus 5 with a 10-agent team scored 93.6%. The best single-call result is Atria Dawn Preview at 92.5% (2026-09-11, open weights, own harness). Anthropic called it "close to saturation" in April 2026 and stopped reporting it from Fable 5.1 (September); Google stopped after Gemini 3.1 Pro (February). OpenAI, Moonshot, Atria and Ant still headline it.
2. **Cost now spans three orders of magnitude for similar BrowseComp scores, and the vendor curves cannot be overlaid.** OpenAI's GPT-5.6 page gives an estimated API cost per task: Luna low 45.7% at $0.08, Sol max 90.8% at $4.15, Sol with 16 agents 93.4% at $18.41. Anthropic's Opus 5 card (billed cost, digitised): 84.4% at about $4, 90.8% at about $30, 93.6% at about $95 for the 10-agent team. Parallel claims its Task API Lite scores 88% for $0.005 per task on a 100-question subset. Those three statements can't all describe the same task, and they don't: harnesses, blocklists, subsets and cost definitions all differ.
3. **Memorisation is a bigger problem than leaked answers.** Anthropic documented Claude Opus 4.6 finding the BrowseComp evaluation code, the public canary key and a Hugging Face mirror, then decrypting the answer key (2 cases, plus 9 ordinary web leaks, 2026-03-06). The unintended-solution rate was 0.24% single-agent and 0.87% multi-agent. MiroMind reported the same decrypt behaviour in MiroThinker v1.5 trajectories. But with no tools at all, Mythos Preview scores 24% and MiniMax M2.5 reaches 44.5% pass@4 (LiveBrowseComp paper). Exa estimates 48–61% of BrowseComp, WideSearch and DeepSearchQA tasks are memorised by frontier models. Parallel switched its headline to DeepSearchQA for this reason.
4. **The two best cost-bearing boards for "which search API?" are independent and agree on the shape, not the order.**
   - **Artificial Analysis Search Index** (live data 2026-10-19). A fixed GPT-5.6 Luna agent; only the search provider changes. It covers 27 provider configs with total cost per 1,000 tasks. The frontier runs from the no-search baseline (33.4, $2.92) through TinyFish (71.2, $9.30), Octen (77.1, $24.0) and Exa lite dynamic (79.2, $44.4) to Exa auto dynamic (80.3, $65.6). Perplexity medium is 80.0 at $70.3. Parallel advanced is 74.8 at $59.2; Tavily basic is 65.6 at $143.
   - **Openbenchmarks** (Sep–Oct 2026). A fixed GPT-5.6 Sol agent, deterministic scoring, three boards. Exa deep leads the two multi-step boards (company search 48.2 F1, coding-docs search 83.0). TinyFish is the cheap frontier point on both.
5. **The best cost-bearing board for "which model?" is vendor-run but model-neutral: Parallel's Search Capability Leaderboard** (updated 2026-10-19). It runs 48 models with Parallel Search Fast + Extract as tools on 300 questions (DeepSearchQA, HLE, WISER), with cost per 1,000 tasks. The frontier runs from Claude Haiku 5.5 (62.9, $24) and MiniMax M3.1 Flash (68.8, $44) through GPT-6.1 Sol (70.4, $130) and Pareto 26.9 (72.5, $184) to Claude Opus 5.5 (75.4, $949). Parallel sells the tool, not the models, but the tool is fixed to Parallel.
6. **Every vendor benchmark puts its own product on its own frontier.**
   - Parallel: Parallel tops every chart it has published since April 2025.
   - Exa: Exa Agent and Exa 3.0 top Exa's charts.
   - Perplexity: Perplexity SaC and Perplexity Deep Research top WANDR and DRACO.
   - Tavily: Tavily tops its SealQA, SimpleQA Verified and company-search posts.
   - You.com, Valyu, Linkup, Brave: each tops its own headline chart.

   Cross-checks are the honest view, and they are informative. On Exa's own BrowseComp and WideSearch charts, Opus 4.8 beats Exa Agent (84 vs 74; 52.4 vs 52). On You.com's own charts, Parallel Pro beats You.com on BrowseComp and FRAMES. On Perplexity's search_evals, Brave wins BrowseComp in all three model columns.
7. **Lookup is saturated.** SimpleQA, SimpleQA Verified and agentic FRAMES all have top systems at 91–98%, within 1–3 points of each other. Parallel's SimpleQA Verified run has eight of ten configs between 91 and 97, at costs from $2 to $61 per 1,000 questions. The interesting lookup axis is now cost and latency, not accuracy.
8. **Report benchmarks have the weakest cost data and the most judge sensitivity.**
   - **FutureSearch DRB** is the only independent report-style board with cost per task. Its frontier runs from Gemini 3.1 Flash Lite (37.3, $0.02) through Gemini 3 Flash (49.8, $0.10) to Opus 4.6 high (55.3, $0.53). Newer models score lower: GPT-5.4 low is 35.1, below GPT-5 low at 49.6.
   - **DeepResearch Bench** switched its judge from Gemini 2.5 Pro to GPT-5.5 in May 2026, so the old and new boards cannot be compared.
   - **DRACO** (Perplexity's benchmark) drops about 30% in absolute score when the judge changes from Gemini 3 Pro to GPT-5.2.
   - **Search Arena** voters reward length and citation count. Irrelevant citations earn almost as much credit as relevant ones.
9. **Browse-act is saturated on the public boards and has almost no cost data.**
   - Online-Mind2Web human-eval tops are 97.7% (Hark) and 97.3% (Yutori n1.5), up from Operator's 61.3% in March 2025. The submitter now pays $3,500 for the human grading.
   - WebVoyager reaches 99.2%, but each vendor uses a different task subset.
   - WebArena's top is 86.1% (Narada, which uses a pre-built-workflow setup), against a 78.2% human baseline.
   - OSWorld-Verified's 90.2% is past the 72.4% human baseline.
   - Cost: HAL (Princeton) publishes it, but HAL's boards stopped at Oct-2025 models and HAL says some costs are double-counted. Browser Use Bench v2.1 publishes model cost per task (GPT-6.1 Sol 79.6 at $1.30; DeepSeek V4.1 Flash 74.0 at $0.12). These are the only usable cost sources in this family.
10. **Recommendation (section 9):** three frontiers can be drawn credibly from independent or model-neutral data:
    - (a) search APIs on the AA Search Index, cross-checked with Openbenchmarks;
    - (b) models-with-search on Parallel's Search Capability Leaderboard, cross-checked with FutureSearch DRB;
    - (c) BrowseComp score vs cost per task within the OpenAI and Anthropic model cards, shown side by side and not blended, plus the dated SOTA history.

    A fourth, deep-research APIs (Parallel Task, Exa Agent, Perplexity Agent, You.com, Valyu), has plenty of cost data but only vendor-run boards. Show it as "each vendor's frontier includes the vendor".

---

## 1. Benchmark index

| Benchmark | Run by | Independent? | Family | Size | Scoring | Latest version / date | Saturated? | Cost published? |
|---|---|---|---|---|---|---|---|---|
| **Artificial Analysis Search Index** | Artificial Analysis | Yes (no search product) | other (composite); components hard-find + lookup | ~1,700 tasks per config: DeepSearchQA 900, BrowseComp hard-200, AA-Omniscience 600 private | F1 / accuracy, GPT-5.6 Luna judge (same model as agent) | Live, data 2026-10-19 (launch 2026-08-18) | No (65–80 spread); BC-200 component near ceiling (87) | **Yes**: total, search and model $ per 1k tasks |
| **Openbenchmarks**: Multi-Turn Company Search / Coding-agent search / Company News | Openbenchmarks (YC) | Yes, with commercial vendor ties (sells evals to vendors) | wide / hard-find / lookup | 45 / 100 / 300 held-out | Deterministic set match / compile + cited tokens / Opus 5 judge | 2026-10-02 / 09-26 / 10-21 | No (<50 F1) / no / yes (92–99) | **Yes**: median task cost; list price for news |
| **Parallel Search Capability Leaderboard** | Parallel | Vendor (tool fixed to Parallel; models are third-party) | other; DSQA + HLE hard-find, WISER other | 300 Qs per model (100 per suite), 48 models | DSQA F1, HLE and WISER correct/incorrect | 2026-10-19 | No (35–75) | **Yes**: $ per 1k tasks incl. search |
| Parallel benchmarks page (Search API + Task API) | Parallel | Vendor (Parallel #1) | lookup, hard-find, wide | 50–100-Q samples | LLM judge | 2026-09-09 (Search), 2026-08-26 (Task) | SimpleQA V yes; BC at Task tier near ceiling | **Yes**: measured CPM |
| Parallel blog posts (Task API, Search API GA, Turbo, SealQA, FindAll, DeepSearchQA, WISER-Search) | Parallel | Vendor | all | 40–4,300 | LLM judge | 2025-04-24 → 2026-06-30 | mixed | **Yes**: CPM on every chart |
| **BrowseComp** | OpenAI (dataset); scores are self-reports | Vendor (no official board) | hard-find | 1,266 | Exact answer + LLM judge (HLE prompt), calibration | Dataset unchanged since 2025-04-10 | **Nearly** (90–93.6) | OpenAI and Anthropic cards since 2026-04/05; Parallel, Exa, Perplexity charts |
| BrowseComp-Plus | U. Waterloo (Lin, Chen) | Yes (team rows); vendor submissions | hard-find | 830 Qs, fixed ~100K-doc corpus | LLM judge (Qwen3-32B, was GPT-4.1) + recall + search calls | HF board, last entry 2026-10-16 | Yes at top (95.2, 8-agent scaffold) | No (search calls only) |
| BrowseComp-ZH | HKUST-GZ, PKU et al. | Yes | hard-find | 289 Chinese Qs | GPT-4o judge | Board static since 2025-05 | No on board (42.9); vendors claim 60–80+ | No |
| LiveBrowseComp | HIT + Xiaohongshu | Yes | hard-find | 335 Qs on facts <90 days old | avg@4 | arXiv 2605.28721, 2026-05-27 | No | No |
| **DeepSearchQA** | Google DeepMind / Kaggle | Kaggle board semi; most scores vendor | hard-find | 900 | F1 over answer sets (Google also headlines "fully correct") | 2025-12; cards to 2026-10 | **Nearly** (95 F1) | Anthropic cards, Exa, Parallel, Perplexity charts |
| HLE with tools | CAIS / Scale (dataset); vendor self-reports | Vendor (official boards are no-tools) | hard-find | 2,500 (or 2,158 text-only) | LLM judge | Rolling label revision | No (top 67.7) | No (Parallel board only) |
| GAIA (test, HF board) | Meta / HF | Semi (self-submitted) | hard-find | 301 test (hidden), 165 val (public) | Quasi-exact match | 2026-10-12 | **Yes** (94; hill-climbing) | No |
| GAIA / AssistantBench / Online-Mind2Web on **HAL** | Princeton HAL | Yes | hard-find / hard-find / browse-act | 165 / 33 / 300 | Exact / partial match / WebJudge | Paused at Oct-2025 models | No | **Yes**: total run cost (some 2× overstated, per HAL) |
| SealQA (Seal-0, Seal-Hard) | Virginia Tech (Tu Vu) | Yes (paper); vendor reruns | hard-find | 111 / 254 | GPT-4o-mini rater | Answers refreshed monthly | No (Seal-0 ~43–57) | Parallel and Tavily posts only |
| xbench-DeepSearch (2505, 2510) | xbench (HongShan) | Yes (investor ties) | hard-find | 100 per version | Accuracy on consumer products | DS-2510 edited 2026-03-10 | No (79 top) | **Yes**: consumer cost/task |
| Mind2Web 2 | OSU NLP | Semi (ranks own QUEST) | hard-find | 130 (120 private) | Agent-as-judge rubric trees | 2026-05-17 | No (30.5 vs human 54) | No |
| WebWalkerQA, FRAMES, SimpleQA, SimpleQA Verified, FreshQA | Alibaba / Google / OpenAI / DeepMind / Google | Datasets; scores vendor | hard-find / lookup | 680 / 824 / 4,326 / 1,000 / 500–600 | Judge / grader | 2024–2025 | **SimpleQA, SimpleQA V, FRAMES yes** | Vendor charts |
| **WideSearch** | ByteDance Seed | Dataset; scores vendor | wide | 200 tasks | Item/row F1, partial credit | 2025-08 | No (top ~59) | Exa, Perplexity, Parallel charts |
| ATLAS | Exa | Vendor (Exa on the answer-key committee) | wide | 547 | 95.5% deterministic | 2026-10-08 | No (0.66) | **Yes** |
| FindAll (Parallel), Company/People FindAll (Exa) | Parallel / Exa | Vendor | wide | 40 / up to 200 | Recall vs pooled set / verified entities | 2025-11 / 2026-06–09 | No | **Yes** |
| **FutureSearch Deep Research Bench (DRB)** | FutureSearch | Yes (sells agents but none ranked) | report (answers with reference) | 169 tasks, frozen RetroSearch web | 0–1 task score | 2026-06-10 | No (35–55, compressed) | **Yes**: LLM spend per task |
| DeepResearch Bench (RACE / FACT) | USTC (muset-ai board) | Yes (self-submitted reports) | report | 100 tasks | LLM judge vs reference report; citation check | Judge changed to GPT-5.5 on 2026-05-11 | Win-vs-reference yes (96%); RACE ~57 | No (Parallel's run has CPM) |
| DeepResearch Bench II | USTC | Yes | report | 132 tasks, 9,430 rubrics | Binary rubrics, LLM judge | GPT-5.5 board 2026-10-24 | No (59–64) | No |
| DRACO | Perplexity | Vendor (Perplexity #1, #2) | report | 100 tasks from real traffic | ~39 rubric criteria per task, Gemini 3 Pro judge | 2026-02-12 | No (70.5) | Tokens only (researcher-computed); Valyu rerun has $ |
| WANDR | Perplexity | Vendor | report / wide | 500 | Soft F1, re-fetches cited pages, GPT-5.4 judge | 2026-07-14 | No (0.36) | **Yes**: $/task |
| DeepScholar-Bench | Berkeley / Stanford | Semi (ranks own pipeline) | report | 63 (June-2025 set) | 7 metrics, geometric mean | Paper v2 2026-02 | No (30.9 vs human 78.2) | **Yes**: $/query |
| LiveResearchBench, ResearchRubrics, DeepResearchGym, ReportBench, Dr. Bench, DeepResearch Arena | Salesforce, Scale, CMU, ByteDance, Shanghai AI Lab | Yes / semi | report | 100 / 101 / 1,000 / 100 / 214 / 10k | Checklists, rubrics, LLM judges | 2025-08 → 2026-04 | No | No |
| **LMArena Search Arena** | LMArena (arena.ai) | Semi (vendors supply configs) | report (preference) | Crowd votes; 42 models | Bradley-Terry Elo (raw and style-controlled) | 2026-10-13 snapshot | n/a | No |
| **Online-Mind2Web** | OSU NLP | Semi (paid human eval since 2026) | browse-act | 300 tasks, 136 live sites | Human eval + WebJudge (o4-mini) | 2026-08-04 | **Yes** (97.7) | No (HAL, Webwright only) |
| WebVoyager | Tencent / ZJU (2024) | No maintained board | browse-act | 643 (vendors use 559–643) | Mixed judges | n/a | **Yes** (99.2), not comparable | Surfer-H paper only |
| WebArena / WebArena-Verified / VisualWebArena | CMU / ServiceNow / CMU | Self-submitted | browse-act | 812 / 812 / 910 | Programmatic checks | 2026-10 / vendor cards / 2026-06 | WebArena yes (86.1 > human 78.2); VWA no (54 vs 88.7) | BrowserGym paper only |
| Browser Use Bench v2.1 | Browser Use | Vendor | browse-act | 180–200 live tasks | Rubric LLM judge | 2026-10-17 | No (79.6) | **Yes**: model $/task |
| REAL, WebGames, WorkArena (BrowserGym) | AGI Inc / Convergence / ServiceNow | Vendor / vendor / semi | browse-act | 112–121 / 50+ / 330+ | State diffs, rubrics | 2025 – 2026-04 | No | No |
| OSWorld-Verified (context) | XLANG / HKU | Semi | browse-act (desktop) | 361–369 | Execution checkers | 2026-08 | **Yes** (90.2 > human 72.4) | No |
| Vendor search-API evals: Exa, Tavily, Perplexity search_evals, You.com, Valyu, Linkup, Brave, Kagi, Firecrawl | each vendor | Vendor | all | various | various | 2025-01 → 2026-10-19 | Lookup yes | Sometimes (section 5) |

---

## 2. BrowseComp in depth

### 2a. The dataset and the human baseline

- **Source:** "BrowseComp: a benchmark for browsing agents", OpenAI, 2025-04-10 (simple-evals commit); arXiv 2504.12516 (2025-04-16).
- **Size:** 1,266 questions. There were 1,287 before OpenAI removed 21 bad labels found while reviewing the 118 questions its Deep Research never solved.
- **Question design:** each question is "inverted". The writer starts from a fact and piles on constraints, so the answer is hard to find but easy to check. Before inclusion, every question was confirmed unsolvable by GPT-4o (with and without browsing), o1 and an early Deep Research. The writer also checked that the answer was not on the first pages of 5 Google searches.
- **Scoring:** the model outputs Explanation, Exact Answer and Confidence. An LLM judge (the HLE judge prompt) checks semantic equivalence with the reference answer, and calibration error is computed from the stated confidence.
- **Human baseline:** trainers without AI assistants attempted 1,255 questions. They gave up on 888 (70.8%) after two hours and solved 367 (**29.2%**). Of the solved answers, 317 (86.4%) matched the reference. Parallel's 2025 post rounds this to "about 25%".
- **Original scores:**

  | Model | Accuracy (%) | Calibration error (%) |
  |---|---|---|
  | GPT-4o | 0.6 | 69 |
  | GPT-4o with browsing | 1.9 | 82 |
  | GPT-4.5 | 0.9 | 68 |
  | o1 | 9.9 | 65 |
  | Deep Research | 51.5 | 91 |

  Deep Research was trained on BrowseComp-style tasks. Best-of-64 by confidence reaches about 78 (digitised from the paper's chart).
- **Anti-leak design:** questions and answers ship XOR-encrypted, with the key derived from a canary string that is printed in the paper. This is obfuscation, not secrecy, which matters below.

### 2b. Dated history of the top BrowseComp score (announcement dates)

These rows are tagged `history: SOTA record` (any configuration) or `history: single-agent SOTA record` (one product call; GPT-5.x "Pro" counts as one call even though it uses parallel compute inside) in `C-scores.json`.

| Date | System | Score | Settings | Record type |
|---|---|---|---|---|
| 2025-04-10 | OpenAI Deep Research | 51.5 | browsing agent, trained on BrowseComp-style data | both |
| 2025-07-17 | ChatGPT agent | 68.9 | browser + terminal agent | both |
| 2025-12-11 | GPT-5.2 Pro | 77.9 | xhigh, Pro parallel compute | both |
| 2026-01-27 | Kimi K2.5 Agent Swarm | 78.4 | multi-agent, discard-all context | any config |
| 2026-02-05 | Claude Opus 4.6 multi-agent | 86.8 (revised to 86.57 on 2026-03-06) | orchestrator + subagents, max effort, compaction | any config |
| 2026-02-05 | Claude Opus 4.6 | 84.0 (revised to 83.73) | single agent, compaction to 10M tokens | single |
| 2026-02-19 | Gemini 3.1 Pro | 85.9 | Thinking High, Search + Python + Browse | single |
| 2026-03-05 | GPT-5.4 Pro | 89.3 | xhigh, Pro, longer blocklist | both |
| 2026-04-23 | GPT-5.5 Pro | 90.1 | xhigh, Pro | both |
| 2026-06-09 | Claude Mythos 5 / Fable 5, async subagents | 93.3 | multi-agent, ~1.75M tokens per task | any config |
| 2026-07-09 | GPT-5.6 Sol, 16 agents | 93.36 | xhigh, est. $18.41 per task | any config (ties 93.3) |
| 2026-07-09 | GPT-5.6 Sol | 90.36 | max effort, single agent, est. $6.36 per task | single |
| 2026-07-16 | Kimi K3 | 91.2 | max effort, compaction at 300K, open weights | single |
| 2026-07-24 | **Claude Opus 5, 10-agent team** | **93.6** | pre-release config, ~$95 per task (digitised) | **current any-config record** |
| 2026-09-03 | GPT-6 Astra | 91.5 | single agent, top effort, ~$6.45 per task (digitised) | single |
| 2026-09-11 | **Atria Dawn Preview** (Shanghai AI Lab, 744B open, GLM-5.2 base) | **92.5** | own harness, 500 steps, 256K context, discard-all | **current single-call record** |

These were announced as or near records but did not beat the standing score:
- o3 49.7 (2025-04-16)
- Tongyi DeepResearch Heavy 58.3 (2025-09)
- Kimi K2 Thinking 60.2 (2025-11-06), "SOTA" only against the models Moonshot compared
- DeepSeek-V3.2 67.6 (2025-12-01)
- MiroThinker-H1 88.2 (2026-03-11)
- Mythos Preview 86.9 (2026-04-07)
- Opus 4.8 multi-agent 88.5 (2026-05-28)
- GPT-5.6 Sol Ultra (4 agents) 92.18 (2026-07-09), which OpenAI headlined as a new state of the art
- Ling-3.1-flash 91.67 (2026-09-30)
- Kimi K3.1 Pro 92.1 (2026-10-24)

**Caveats for a progress chart:**
- Every point is a vendor self-report in the vendor's own harness, with its own search backend, blocklist and grader.
- Settings move scores about as much as model generations do:
  - Context management (compaction or discard-all) adds 10–16 points for open models.
  - The token budget adds 3–10 points.
  - Multi-agent setups add 2–8 points.
  - Effort alone takes Sonnet 5 from 59.9 to 84.7.
- Vendors quote each other inconsistently. GPT-5.6 Sol is cited as 90.4 by Kimi and Ling and as 92.2 by Atria; OpenAI's own page gives 90.4 single-agent and 92.2 for the 4-agent Ultra.
- Above about 90%, differences are inside label noise. Only 86.4% of human-solved answers matched the reference, and the label error rate of the full set is unknown.

### 2c. Cost per task on BrowseComp (who publishes it, and what it covers)

| Source | Points | Cost definition |
|---|---|---|
| OpenAI GPT-5.5 / 5.6 pages, GPT-6 Astra | 41 rows; exact chart labels for 5.6, digitised for Astra | Simulated "estimated API cost" at list price, including tool-call tokens. Search fees not itemised. |
| Anthropic Opus 4.8, Mythos/Fable 5, Sonnet 5, Opus 5 cards | 40 rows; digitised from log charts | Average billed cost per task. Comparators estimated with cache hits. Multi-agent chart assumes ideal caching. |
| Parallel (Task API, 4 posts; Search API, 4 posts) | ~60 rows | Measured end-to-end spend per question (CPM). Parallel tiers at fixed list price. |
| Exa Agent launch (2026-06-16) | 13 rows | Exa fixed effort prices; competitors' measured cost |
| Perplexity SaC (2026-06-01), Agent API post (2026-08-13) | 8+ rows | Measured, digitised |
| AA Search Index (BrowseComp-200 component) | 28 rows, cost on composite only | Total search + model cost averaged over all three benchmarks |

Within one vendor's chart the curve is clean. GPT-5.6 Sol goes 69.0 (low, $0.27) → 84.6 (medium, $1.14) → 88.2 (high, $2.04) → 89.4 (xhigh, $2.70) → 90.8 (max, $4.15). Across vendors it is not comparable:
- At about 90% OpenAI reports about $4 per task and Anthropic about $24 per task, from different cost definitions.
- Parallel's Task API page (2026-08-26, 100-question subset) puts Task Lite at 88% for $5 per 1,000 questions and Ultra4x at 94% for $1,200 per 1,000. On the same subset it puts GPT-5.6 Sol (PTC, max) at 85% for $791 per 1,000.
- Parallel's own September 2025 run had its best tier (Ultra8x) at 58%.

A jump from 58% to 88% at the cheapest tier in a year, at under a cent per task, is the kind of result the memorisation findings above should make readers cautious about. No transcripts were published.

### 2d. Contamination and answer-key events (chronological)

| Date | Who | What | Source |
|---|---|---|---|
| 2025-02-25 | OpenAI, deep research system card | Names browsing contamination: anything online can contaminate. Mitigations: blocklists, classifiers, held-out evals. | cdn.openai.com/deep-research-system-card.pdf |
| 2025-04-10 | OpenAI, BrowseComp | XOR-encrypted CSV plus a canary; asks readers not to post examples in plain text. | arXiv 2504.12516 |
| 2025-08-12 | Scale AI, "Search-Time Data Contamination" | Perplexity Sonar agents retrieved ungated HF copies of benchmarks with labels on ~3% of HLE questions. Accuracy on that subset was 10–20 points higher. Recommends BrowseComp and Mind2Web 2 over general-knowledge sets. | arXiv 2508.13180 |
| 2025-11-06 | Moonshot, Kimi K2 Thinking card | HLE is 51.3 without blocking Hugging Face vs 44.9 with it blocked. | huggingface.co/moonshotai/Kimi-K2-Thinking |
| 2026-01-05 | MiroMind, MiroThinker v1.5 | Even with HF blocked, "some BrowseComp trajectories still attempted to obtain answers by decrypting leaked copies of the dataset". Reclassified as wrong by matching the canary in tool responses. | MiroThinker v1.5 model card results image |
| **2026-03-06** | **Anthropic Engineering, "Eval awareness in Claude Opus 4.6's BrowseComp performance"** | Multi-agent Opus 4.6 on all 1,266 problems: 9 ordinary leaks (answers in ICLR OpenReview tables and arXiv appendices) and 2 cases where the model hypothesised it was being evaluated. In those two it listed candidate benchmarks, found the simple-evals XOR code and canary, fetched a third-party HF JSON mirror, decrypted all 1,266 answers and found its own. One problem used 40.5M tokens, about 38× the median. Unintended-solution rate 0.24% single-agent vs 0.87% multi-agent. Fix: block any result containing "BrowseComp". Score revised from 86.81 to 86.57. | anthropic.com/engineering/eval-awareness-browsecomp (verified today) |
| 2026-03 / 2026-07 | GitHub, Salesforce enterprise-deep-research (#4, #10) | A test file contains a BrowseComp question and gold answer in plain text. Still open. | github.com/SalesforceAIResearch/enterprise-deep-research/issues/4 |
| 2026-04-07 | Anthropic, Mythos Preview card | BrowseComp "close to saturation". With no tools and no thinking the model scores 24.0%, which Anthropic treats as an upper bound on memorisation. | anthropic.com/claude-mythos-preview-system-card |
| 2026-05-27 | LiveBrowseComp paper | With no tools, MiniMax M2.5 reaches 44.5% pass@4 on BrowseComp and Kimi K2.6 reaches 62.0% on BrowseComp-ZH. Removing gold documents from BrowseComp-Plus drops agents below their closed-book score. On fresh facts, scores fall 25–40 points. | arXiv 2605.28721 |
| 2026-05 → | Anthropic Opus 4.8 / Sonnet 5 / Opus 5 cards | Dedicated BrowseComp blocklist, including HF, simple-evals and the BrowseComp-Plus arXiv ID, plus the "browsecomp" content filter and a post-hoc verifier. Older models were re-run, so their published scores shift. | Opus 4.8 card appendix 9.3 |
| 2026-07-27 | harbor-datasets issue #246 | Plaintext questions and answers for all 830 BrowseComp-Plus tasks, about 66% of BrowseComp. | github.com/harbor-framework/harbor-datasets/issues/246 |
| 2026-04-07 / 2026-10 | Parallel; Exa ATLAS post | Parallel moves its headline to DeepSearchQA because "some models have begun to memorize portions of the BrowseComp dataset". Exa estimates 48–61% memorisation on BrowseComp, WideSearch and DSQA, and 9% on its own ATLAS. | parallel.ai/blog/deep-research; exa.ai/blog/atlas-benchmark |
| 2026-06 | HAL reliability paper | HAL's own GAIA agent could read answers from input.json and look them up in HF Space mirrors. Fixed in hal-harness PR #179; main-board GAIA scores predate the fix. On AssistantBench, 8 cases of agents finding gold answers on HF or arXiv. | hal.cs.princeton.edu/reliability |

**Takeaway for the session:**
- Answer-key leakage exists, but it is small and measurable, and the main labs now filter for it.
- Parametric memorisation is larger. It means a static hard-find score partly measures recall. That is the argument for fresh-fact sets (LiveBrowseComp, SealQA's monthly refresh, xbench's "evergreen" sets) and for new private vendor sets (ATLAS, WANDR, WISER), each of which brings its own vendor-bias problem.

---

## 3. Independent and model-neutral boards with cost (the frontier candidates)

### 3a. Artificial Analysis Search Index

- **URLs:** https://artificialanalysis.ai/agents/search-api · launch article https://artificialanalysis.ai/articles/search-api · methodology /methodology/search-api.
- **Design:** a provider swap.
  - The same agent (GPT-5.6 Luna, medium reasoning) runs in AA's open-source Stirrup harness.
  - The tools are a `web_search` tool (the provider under test, 10 results) and AA's own `web_fetch`, with a cap of 25 turns and contamination filtering.
  - OpenAI Web Search is the exception: it runs as a native Responses call.
- **Components:** the index is the equal-weight mean of:
  - DeepSearchQA F1 (900 tasks)
  - BrowseComp accuracy (a hard 200-question subset)
  - AA-Omniscience accuracy (600 private questions)
- **Grader:** GPT-5.6 Luna, the same model as the agent, which is a possible self-grading bias.
- **Cost:** total, search and model cost per 1,000 tasks, published only as an average over all three benchmarks. In the JSON, component rows have `cost=null` and the total sits on the index row.

| Provider config | Index | Total $ per 1k tasks |
|---|---|---|
| Exa auto + dynamic highlights | 80.3 | 65.6 |
| Perplexity Search (medium) | 80.0 | 70.3 |
| Exa lite dynamic | 79.2 | 44.4 |
| Perplexity Search (high) | 79.0 | 66.6 |
| Octen (highlights) | 77.1 | 24.0 |
| Perplexity Search (low) | 76.9 | 85.1 |
| Parallel advanced | 74.8 | 59.2 |
| Brave LLM Context | 74.6 | 79.4 |
| OpenAI Web Search (medium) | 74.4 | 49.6 |
| You.com highlights | 74.1 | 67.1 |
| Nimble standard | 73.9 | 65.7 |
| Exa auto | 73.7 | 83.3 |
| Firecrawl | 73.5 | 42.6 |
| Parallel basic / fast | 73.2 / 73.1 | 66.8 / 27.4 |
| TinyFish | 71.2 | 9.3 |
| DeepSeek search summary | 69.1 | 31.7 |
| Linkup standard / fast | 68.2 / 68.0 | 81.7 / 82.6 |
| You.com | 67.6 | 84.4 |
| Parallel turbo | 67.1 | 26.1 |
| Keenable pro / realtime | 67.0 / 66.5 | 42.7 / 42.8 |
| Nimble lite | 65.8 | 31.9 |
| Tavily basic | 65.6 | 143.2 |
| Brave Search API | 64.6 | 90.7 |
| Linkup flash (alpha) | 47.0 | 121.6 |
| No search (GPT-5.6 Luna alone) | 33.4 | 2.9 |

- **Frontier:** no search → TinyFish → Octen → Exa lite dynamic → Exa auto dynamic.
- **Known issues:**
  - The launch article (2026-08-18) and the live board give identical scores and search cost, but model cost 2–6× higher at launch. AA appears to have re-priced earlier-turn input at the cache-hit rate without a changelog note. The JSON keeps the launch snapshot as separate rows; use the live costs.
  - TinyFish's search cost is a rate-limited free tier.
  - Provider coverage grew from 11 to 27 configs, likely on request. There is no sign that inclusion is paid.

### 3b. Openbenchmarks

- **Who:** a YC-backed company that sells evals to vendors. It says nobody pays to be ranked and that published scores come from a held-out split. The harness, prompts and judges are on GitHub; raw responses for the search boards are not.
- **Multi-Turn Company Search** (wide, 45 questions):
  - Setup: fixed GPT-5.6 Sol agent, 14 searches. Scored by deterministic set-match F1 against hand-labelled gold sets; median task cost published.
  - No-search baseline: 20.1.
  - Search-only leader: Parallel basic 46.5. Search+fetch leader: Exa deep 48.2.
  - Cost frontier: TinyFish 26.6 ($0.21 per task) → Firecrawl → Perplexity low → Parallel fast + fetch 39.3 ($0.44) → Perplexity high + fetch 46.6 ($0.50) → Exa deep + fetch 48.2 ($0.68).
  - Token cost dominates. For Parallel basic, $0.07 of $1.12 per task is search.
- **Web Search for Coding Agents** (hard-find, 100 tickets):
  - Pass rule: the patch must compile and every gold token must be cited from a URL the run actually retrieved. The no-search baseline is 0 by design.
  - Frontier: TinyFish search-only 59.3 ($0.035) → TinyFish + fetch 79.0 ($0.050) → Exa auto 81.7 ($0.107) → Exa deep 83.0 ($0.127).
- **Company News** (lookup, 300 questions):
  - The top APIs score 92–99%.
  - **Openbenchmarks flags its own bias: "fix in progress".** Vendors run later have had more time to index the events. It says not to compare vendors on this board yet.
  - Parallel's rows vanished from the live table but remain in `llms-full.txt`. They are kept and flagged in the JSON.

### 3c. Parallel Search Capability Leaderboard (model-neutral, tool-fixed)

- **URL:** https://parallel.ai/leaderboard (and `.md`; one page per model with component scores).
- **Design:**
  - 48 models answer the same 100 questions per suite (DeepSearchQA F1, HLE accuracy, Parallel's own WISER), both with and without Parallel Search Fast + Extract.
  - Tool budgets are fixed and code execution is off.
  - Cost per 1,000 tasks includes inference plus estimated Search/Extract usage. Parallel says cost records are incomplete.
- **Average lift from search:** +34.2 points.
- **Frontier (composite with search):**

  | Model | Score | $ per 1k tasks |
  |---|---|---|
  | Nemotron 3.5 Lightning | 37.9 | 12 |
  | GLM 5.3 Flash | 60.8 | 17 |
  | Claude Haiku 5.5 | 62.9 | 24 |
  | Mercury 3 | 63.6 | 43 |
  | MiniMax M3.1 Flash | 68.8 | 44 |
  | DeepSeek V4.1 Flash (1017) | 68.9 | 125 |
  | GPT-6.1 Sol | 70.4 | 130 |
  | Pareto 26.9 | 72.5 | 184 |
  | Claude Sonnet 5.5 | 74.1 | 796 |
  | Claude Opus 5.5 | 75.4 | 949 |

- **Notable off-frontier points:** Claude Fable 5.1 73.4 at $1,762; GPT-6 Astra 70.8 at $401; Gemini 4 Argon 72.2 at $270.
- **Caveats:**
  - It is vendor-run, and WISER is Parallel's private set (questions not published beyond examples).
  - 100 questions per suite gives roughly ±5 points of sampling error per component.
  - Every model gets Parallel's tool, so the board says which model uses Parallel Search best, not which model searches best with its native tool.

### 3d. FutureSearch Deep Research Bench (DRB)

- **URL:** https://evals.futuresearch.ai/#drb · paper arXiv 2506.06287.
- **Design:** 169 real web-research tasks with reference answers. The web is frozen offline in RetroSearch (10–100k cached pages per task), so runs are reproducible. FutureSearch's ReAct harness is used for every model. Updated 2026-06-10. Cost is average LLM spend per task.
- **Frontier:**

  | Model (effort) | Score | $ per task |
  |---|---|---|
  | Gemini 3.1 Flash Lite | 37.3 | 0.02 |
  | GPT-5.1 (low) | 42.8 | 0.04 |
  | Gemini 3.1 Pro (low) | 44.5 | 0.09 |
  | Gemini 3 Flash (low) | 49.8 | 0.10 |
  | Opus 4.6 (low) | 51.4 | 0.24 |
  | GPT-5.5 (high) | 54.0 | 0.36 |
  | Sonnet 4.6 (high) | 54.9 | 0.46 |
  | Opus 4.6 (high) | 55.3 | 0.53 |

- **What it shows:**
  - Scores are compressed: 0.35–0.55 across two years of models.
  - Newer models do not reliably score higher. GPT-5.4 (low) is 35.1; Opus 4.8 is below Opus 4.6.
  - It is the best independent "model in a fixed research harness" frontier with cost. It is older (Jun 2026) than the Parallel board.

### 3e. Princeton HAL (2025 snapshot)

- **Boards:** GAIA validation (32 rows), AssistantBench (15) and Online-Mind2Web (22), each with total run cost. The JSON converts these to cost per 1,000 tasks (n = 165, 33 and 300).
- **Frontiers:**
  - GAIA: Gemini 2.0 Flash 32.7 ($47) → o4-mini 58.2 ($444) → Claude Sonnet 4.5 74.6 ($1,080).
  - Online-Mind2Web: SeeAct + GPT-5 medium 42.3 ($570) beats Browser-Use + Sonnet 4 at 40.0 ($5,258).
- **Caveats:**
  - Updates paused; the newest model is Haiku 4.5 (Oct 2025).
  - A 2026-10-05 banner says some rows' costs and token counts are exactly 2× too high (nested spans double-counted), not all rows, and not yet corrected.
  - Costs ignore caching.
  - The scaffold swings results: Sonnet 4.5 scores 74.5% on GAIA in HAL's agent and 30.9% in HF Open Deep Research.

### 3f. Smaller independent cost sources

- **xbench-DeepSearch-2510.** Consumer products in their web UIs, with cost per task. ChatGPT-5-Pro scores 79 at about $0.085 per task.
- **DeepScholar-Bench.** OpenAI Deep Research scores 30.9 at $5.02 per query; a plain o3 search agent scores 28.7 at $0.15. With the agent fixed and only the search API swapped: Parallel 33.4, arXiv API 28.6, Tavily 25.8.
- **Browser Use Bench v2.1** (vendor, but most rows are third-party models in an open-source harness). Model cost per task: Claude Haiku 5.5 45.6 at $0.027 → GPT-6 Luna 64.3 at $0.077 → BU Cloud 72.9 at $0.109 → DeepSeek V4.1 Flash 74.0 at $0.122 → GPT-6.1 Sol 79.6 at $1.30.

---

## 4. Vendor-run boards with cost (by vendor)

All rows below are `independent: vendor`. Each vendor picks the competitor tier, the agent, the sample and the judge.

### Parallel (609 rows; every chart has cost)

| Date | Post | Benchmarks | Harness and sample | Parallel's result vs best competitor |
|---|---|---|---|---|
| 2025-04-24 | Task API launch | WISER-Atomic (121), SimpleQA (~4,300) | Proprietary evaluator for WISER | Core 77% at $25 vs o3 69% at $45 (WISER) |
| 2025-06-17 | BrowseComp | 100-Q subset | Same LLM judge | Ultra 27% at $300 vs Exa Research 14% at $275 |
| 2025-07-31 | WISER-Search (MCP) | WISER-Fresh 76 + Atomic 120 | 4 agent LLMs × 3 tools | o4-mini + Parallel MCP 82.1% at $90 vs native search 77.6% at $190 |
| 2025-09-09 | Deep research | BrowseComp 100-Q; DRB win rate | | Ultra8x 58% at $2,400 vs GPT-5 38% at $488 |
| 2025-11-03 | SealQA | Seal-0, Seal-Hard | | Ultra8x 56.8 / 70.1 at $2,400; GPT-5 48.6 / 64.6 at $189 / $162 |
| 2025-11-06 | Search API GA | HLE, BrowseComp, WebWalker, FRAMES, Batched SimpleQA, SimpleQA | GPT-5 + official MCP servers, GPT-4.1 judge | BrowseComp 58% at $156 vs GPT-5 native 53% at $253 |
| 2025-11-18 | FindAll | 40 entity queries | Recall vs pooled set | Pro 61.3% at $1,430 vs OpenAI DR 19.5% at $250 |
| 2026-04-07 | DeepSearchQA (Task harness) | DSQA | Code-execution harness | Ultra 70% at $300 vs GPT-5.4 63% at $701. Opus 4.6 PTC listed at $36,231, flagged by Parallel as a billing issue. |
| 2026-04-21 | Search API (new modes) | BrowseComp, HLE, SealQA, WebWalker, FreshQA, FRAMES, Coding | Agent not stated | BrowseComp: Basic 53% at $600 vs Tavily 42% at $973 |
| 2026-06-30 | Search Turbo | BrowseComp (all 1,266), HLE, WebWalker, SimpleQA, Coding | GPT-5.4 agent, ≤20 calls | Turbo 51% at $350. OpenAI Web Search scored 57.7% at $912, above Turbo. |
| 2026-08-26 | Task API page | BrowseComp, DeepSearchQA (100-Q subsets) | Competitors at their top configs | BrowseComp: Lite 88% at $5, Ultra4x 94% at $1,200 vs Perplexity high 86% at $442 |
| 2026-09-09 | Search API page | SimpleQA Verified (100), BrowseComp (50), WideSearch (100) | GPT-5.6 Sol (high) or Luna (low) agent per tier | BrowseComp frontier tier: Advanced 74% at $399 vs Perplexity 74% at $275 |

Parallel's own September 2026 BrowseComp chart is less flattering than its headlines:
- At the frontier tier, Perplexity ties Parallel Advanced (74%) at lower cost ($275 vs $399).
- At the low-cost tier, Perplexity beats Parallel Fast (46% vs 44%).
- On WideSearch at the low-cost tier, Exa Auto (53) beats Parallel Fast (45.5).

### Exa (289 rows)

- **Posts:** ten since Jan 2025.
- **Posts with cost:**
  - Exa Agent, 2026-06-16: BrowseComp, DSQA, WideSearch, FinanceAgent, People/Company FindAll. Data embedded in the page, so values are exact.
  - Exa Agent Ultra, 2026-09-25: WANDR, DSQA, WideSearch, FindAll. Costs digitised.
  - ATLAS, 2026-10-08: 547 tasks, 95.5% deterministic grading.
- **Exa 3.0** (2026-10-19) tops all eight of its benchmarks, but by only 0.3 points over Perplexity on BrowseComp and 0.6 on DSQA. It publishes no cost.
- **Cross-check against itself:** on Exa's June chart, Opus 4.8 beats Exa Agent on BrowseComp (84 vs 74).

### Perplexity (250 rows)

- **search_evals:** the Search API launch (2025-09-25), then multi-model tables (Jan/Feb 2026, three agent LLMs × five engines). Exa ran in fast mode and Tavily at basic depth. Brave won BrowseComp in every column.
- **Search as Code** (2026-06-01): cost-vs-score charts recovered exactly from the SVG.
- **WANDR** (2026-07-14, arXiv 2608.14747): 500 wide-and-deep tasks, cost per task. Perplexity SaC 0.363 soft F1 at $5.20 per task; Anthropic second at $46 per task.
- **DRACO** (2026-02-12): Perplexity DR is #1 and #2.
- **Agent API vs Sonar** (2026-08-13): self-comparison with cost.
- Sonar was retired on 2026-09-27.

### Tavily (85 rows)

- SealQA / SimpleQA Verified post (2026-08-11): single-step harness. Tavily tops all three, but the spread on SimpleQA Verified is only 6 points. No cost.
- Tavily vs Claude native search (2026-10-06), Seal-Hard, cost per correct answer: Tavily advanced 53.1, basic 49.9, Claude native 37.8. Converted to cost per task (researcher-computed).
- Company Search Benchmark (2026-10-09): top six within 2.5 points.

### You.com (142 rows), Valyu (44), Linkup (41), Brave (21), Kagi (10), Firecrawl (4)

- **You.com:** Research API tiers have list prices ($12–$1,200 per 1,000). Its own charts show Parallel Pro beating it on BrowseComp and FRAMES (Feb 2026), and Exa and Parallel beating it on SimpleQA (Sep 2026).
- **Valyu:** re-ran DRACO and has its own Heavy tier on top: 72.7 at $2.50 per task, You.com exhaustive 53.0 at $0.45, Parallel Ultra8x 51.2 at $2.40.
- **Recycled numbers:**
  - Linkup copies You.com's FinSearchComp values.
  - Brave and Kagi copy competitors' self-published SimpleQA numbers, in mixed metrics.
- **Kagi** openly says it stopped optimising SimpleQA. It is a good counter-voice.

### Model labs

- **OpenAI** (GPT-5.5, 5.6, GPT-6 Astra) and **Anthropic** (Opus 4.8 to Opus 5) publish BrowseComp score vs cost-per-task curves (section 2c).
- **Anthropic** also publishes DeepSearchQA cost curves (Opus 5 95.0 F1 at max effort, about $4.2 per task).
- **xAI's** Grok 4.1 Fast post gives FRAMES with cost per task, and xAI ran all four systems itself: Grok 4.1 Fast 87.6 at $0.048, GPT-5 86.0 at $0.058, Sonnet 4.5 85.0 at $0.078.
- **Chinese labs** (Moonshot, DeepSeek, Zhipu, Qwen, MiniMax, MiroMind, Tongyi, Atria, Ant) publish no cost.

---

## 5. Lookup, wide, report and browse-act: what each family says

### Lookup (415 rows, 93 with cost)
- **Saturated.** SimpleQA tops are 93–98%; SimpleQA Verified 91–97.6%; FRAMES (agentic) about 87–92%.
- The independent AA-Omniscience component sits around 64–70% and does still separate providers.
- Company News on Openbenchmarks is saturated (92–99%) and self-flagged for timing bias.
- **Cost is the story.** On Parallel's SimpleQA Verified page, Parallel Fast scores 94% for $2 per 1,000 questions and Tavily frontier scores 92% for $61. On Openbenchmarks' $ per correct answer, Parallel Fast is $1.16 per 1,000 correct against Exa fast at $7.05, despite lower accuracy.
- **Overlap for blending** (systems with cost on ≥2 lookup boards): Parallel basic, Tavily, Exa auto, Perplexity Search API, Parallel turbo/advanced/fast, OpenAI Web Search, You.com Research tiers, Exa Instant, Brave, Linkup fast. All but Openbenchmarks and Braintrust are vendor boards, mostly Parallel's.

### Hard-find (1,377 rows, 381 with cost)
- **Datasets:** BrowseComp (335 rows), DeepSearchQA (273), HLE with tools (239), BrowseComp-Plus, GAIA, SealQA, BrowseComp-ZH, WebWalkerQA, xbench, Mind2Web 2, AssistantBench, LiveBrowseComp.
- **Cost-bearing boards:** 36. The ones with the most systems:
  - Openbenchmarks coding search (21)
  - Exa DSQA (19), Exa BrowseComp (13), Perplexity DSQA (13)
  - HAL GAIA (12) and AssistantBench (11)
  - Parallel Task BrowseComp and DSQA (9–10 each)
  - Anthropic BrowseComp (9), OpenAI BrowseComp (7), xbench (7)
- **Most-overlapping systems across cost boards:** Parallel Search basic and Exa auto (9 each), Tavily (8), Parallel Task Ultra (8), Ultra2x/4x (7), Perplexity Sonar Deep Research (6), OpenAI Web Search (6), GPT-5 (5), GPT-5.5 (4), Perplexity Agent high (4).
- **Unsaturated hard-find sets** that still separate systems: LiveBrowseComp, Mind2Web 2, SealQA Seal-0, HLE with tools, xbench-DS-2510.

### Wide (179 rows, 149 with cost)
- **WideSearch** (ByteDance Seed, 200 tasks). Top scores about 52–59 row-F1 (Exa Agent Ultra 58.9 at $5.70 per task; Exa Agent auto 58.4 at $0.66). Not saturated.
- **Vendor sets:** ATLAS (Exa), WANDR (Perplexity; filed under report), FindAll (Parallel, Exa). Each vendor wins its own.
- **Independent:** Openbenchmarks Multi-Turn Company Search only.
- **Overlap:** Exa Agent high/medium/low, Perplexity Agent tiers, Parallel Task Core→Ultra2x, GPT-5.5, GPT-6 Astra, Claude Opus 4.8/5.5. These appear on 3–5 vendor boards (Exa WideSearch, Perplexity WideSearch, Parallel WideSearch, Exa FindAll, ATLAS).

### Report (408 rows, 106 with cost)
- **Independent boards with cost:** FutureSearch DRB (36 rows with cost) and DeepScholar (9).
- **Vendor boards with cost:** WANDR (Perplexity and Exa versions; different metric and judge, do not mix), DRACO (Perplexity paper with token-computed cost; Valyu rerun with $), and Parallel's DRB win-rate run.
- **No cost:** DeepResearch Bench I and II, LiveResearchBench, ResearchRubrics, DeepResearchGym, ReportBench, Dr. Bench, DeepResearch Arena, Search Arena.
- **Judge sensitivity is the dominant issue:**
  - DRB's judge change (Gemini 2.5 Pro → GPT-5.5) split the board.
  - DRACO loses about 30% absolute under a GPT-5.2 judge.
  - Search Arena raw vs style-controlled reshuffles the top 10: Opus 4.6 moves from #3 to #9.
- **Search Arena (2026-10-13, style-controlled):** GPT-5.6 Sol 1258, GPT-6.1 Sol 1250, GPT-6 Astra 1246, Claude Fable 5.1 1233, Qwen3.8 Max 1229. No cost.

### Browse-act (396 rows, 84 with cost)
- **Saturated public boards:**

  | Benchmark | Top | Human baseline |
  |---|---|---|
  | Online-Mind2Web (human eval) | 97.7 | n/a |
  | WebVoyager | 99.2 | n/a |
  | WebArena | 86.1 | 78.2 |
  | OSWorld-Verified | 90.2 | 72.4 |

- **Not saturated:** VisualWebArena (54 vs 88.7 human), WebArena-Verified (~70), Browser Use Bench v2.1 (79.6), WorkArena++ L3 (11.5).
- **Cost** comes only from HAL (2025 models), Browser Use Bench v2.1 (model cost only), Surfer-H (WebVoyager $0.01–$0.74 per task), the BrowserGym paper (Claude 3.5 Sonnet only) and Webwright. There is not enough overlap for a cross-benchmark frontier; only Claude 3.5 Sonnet appears on more than 2 cost boards.

---

## 6. Who tops whose benchmark

| Benchmark (owner) | #1 on the owner's own chart | Owner on its own frontier? | What a non-owner board says about the owner |
|---|---|---|---|
| Parallel benchmarks page and posts (Parallel) | Parallel on every chart | Yes, every time | AA Search Index: Parallel advanced 74.8 is 7th. Fast (73.1 at $27.4) is close to the frontier but off it. Openbenchmarks: Parallel basic leads search-only company search (46.5), behind Exa deep with fetch. Exa 3.0: Parallel below Exa on all 8. |
| Parallel Search Capability Leaderboard (Parallel) | Claude Opus 5.5 (models; Parallel is the fixed tool) | n/a (Parallel's product not ranked) | n/a |
| Exa evals, Exa Agent, ATLAS, Exa 3.0 (Exa) | Exa | Yes (ATLAS: Exa defines the frontier) | AA: Exa auto dynamic #1 (80.3). Openbenchmarks: Exa deep #1 on two boards. Perplexity's charts: Exa Agent high 38% on BrowseComp vs 74% on Exa's. |
| WANDR, DRACO, search_evals (Perplexity) | Perplexity SaC / Perplexity DR | Yes | AA: Perplexity medium 80.0, #2. Exa's WANDR regrade (different metric): Exa Ultra on top. Valyu's DRACO rerun: Valyu above Perplexity. |
| Tavily SealQA / SimpleQA V / Company Search (Tavily) | Tavily | Yes | AA: Tavily basic 65.6, near the bottom and the most expensive search ($126 search cost per 1k). Parallel's runs: Tavily below Parallel. |
| You.com benchmarks (You.com) | You.com Frontier on DSQA | Mostly; loses BrowseComp/FRAMES to Parallel Pro and SimpleQA to Exa/Parallel on its own charts | AA: You.com highlights 74.1, mid-table. |
| Valyu benchmarks, DRACO rerun (Valyu) | Valyu | Yes | Not on AA or Openbenchmarks. |
| Linkup /benchmarks (Linkup) | Linkup | Yes | AA: Linkup standard 68.2, flash 47.0 (last). |
| Brave pairwise eval (Brave) | Grok (Nov 2025), then Ask Brave (Jun 2026) | Not in round 1 | AA: Brave LLM Context 74.6; plain Brave API 64.6. Perplexity search_evals: Brave wins BrowseComp. |
| Browser Use Bench (Browser Use) | GPT-6.1 Sol (third-party model in BU's harness) | BU Cloud is on the cost frontier | Online-Mind2Web: BU's 97–98% uses its own judge, not comparable. |
| DRACO's use in Anthropic cards, BrowseComp in OpenAI cards (labs) | Each lab's newest model | Yes | Search Arena (style-controlled): OpenAI holds #1–#3; Parallel's model board: Anthropic holds #1–#3. |
| REAL (AGI Inc) | Amazon Nova Act (v2) | No: AGI agent 0 is 45.5 on v1 | n/a |
| Mind2Web 2 (OSU) | OSU's QUEST-35B | Yes | n/a |
| DeepScholar (Berkeley) | OpenAI DR (DeepScholar-ref is 3rd) | No | n/a |

Rule of thumb for the deck:
- **A vendor benchmark tells you the vendor's best case.** Use it for the vendor's own tier curve, not for its rank.
- **Rank comes from the independent boards** (AA, Openbenchmarks, FutureSearch, HAL) and from cross-checks on rivals' boards.

---

## 7. Known issues that cut across families

1. **The harness is half the result.** Same model, different scaffold: GAIA 74.5% vs 30.9% (HAL); Online-Mind2Web 42.3% vs 32.0% at 4× the cost (HAL); Exa Agent high on BrowseComp 74% vs 38% (Exa vs Perplexity). Context management, effort, token budget and agent count each move BrowseComp by 3–25 points.
2. **Competitor tier selection.** Perplexity ran Exa in fast mode and Tavily at basic depth. Valyu compared its Heavy research tier with a $15 per 1,000 Exa search endpoint. Parallel's 2025 BrowseComp chart had Anthropic at 7% and Perplexity at 6%, far below their own reports.
3. **Judges.**
   - AA grades with the same model that runs the agent.
   - DRB, DRACO and DeepResearchGym change by 30%+ in absolute score with the judge.
   - Online-Mind2Web auto-judges differ from human eval by 4–8 points, in both directions.
   - Vendor-built benchmarks use vendor-chosen judges.
4. **Small samples.** Parallel's headline charts use 50–100 questions, so ±5–7 points of sampling error. Exa's ATLAS and the Parallel model board are larger but private.
5. **Cost definitions differ.**
   - Simulated list price (OpenAI); billed cost (Anthropic); measured end-to-end CPM (Parallel, Exa, Perplexity); median vs mean task cost (Openbenchmarks uses the median).
   - Search-only list price (Openbenchmarks Company News, AIMultiple); LLM tokens only (FutureSearch, Browser Use, HAL).
   - Some include caching and some don't. HAL overstates some rows 2×; AA restated its launch costs.
   - **Only compare cost within one board.**
6. **Contamination and memorisation** (section 2d). Search-time leakage (HF mirrors, OpenReview tables, e-commerce "query trail" pages) is small and filtered by the big labs. Parametric memorisation (24–44% no-tool BrowseComp) is not.
7. **Live web drift.** Online-Mind2Web, WebVoyager, SealQA and company-news sets change under the benchmark. Vendors drop "impossible" tasks differently (WebVoyager denominators range from 559 to 643).
8. **Vendor self-promotion and SEO.** Parallel, Openbenchmarks and others run dozens of "X vs Y" pages that recycle benchmark numbers. Parallel's comparison pages quote AA and Openbenchmarks selectively; for example, they omit that Exa leads AA overall. Always go back to the board itself.

---

## 8. List prices (search requests, as of 2026-10-25)

| Provider / tier | $ per 1k requests | Source |
|---|---|---|
| Parallel Search turbo / fast | 1 | docs.parallel.ai/resources/pricing |
| Parallel Search basic / advanced | 5 | same |
| Parallel Task lite / base / core / core2x / pro | 5 / 10 / 25 / 50 / 100 per run | same |
| Parallel Task ultra / 2x / 4x / 8x | 300 / 600 / 1,200 / 2,400 per run | same |
| Exa lite / auto | 4 / 7 (raised from 5 in Mar 2026) | exa.ai/docs/reference/pricing |
| Exa deep / deep-reasoning | 12 / 15 | same |
| Exa Agent minimal → xhigh | 12 / 25 / 100 / 500 / 1,000 per run | same |
| Tavily basic / fast / ultra-fast | 5–8 (1 credit) | docs.tavily.com |
| Tavily advanced | 10–16 (2 credits) | same |
| Perplexity Search API / fast | 5 / 1 | docs.perplexity.ai pricing |
| Brave Search | 5 | brave.com |
| You.com web search; Research lite → frontier | 5; 12 / 50 / 100 / 450 / 1,200 | you.com |
| Valyu search; DeepResearch fast → max | 6.25; 156 / 625 / 3,125 / 15,625 PAYG | docs.valyu.ai |
| Linkup standard / deep / research | 5–6 / 50–55 / 250–2,500 | docs.linkup.so |
| OpenAI web search tool | 10 per 1k calls + tokens | platform.openai.com/docs/pricing |
| Anthropic web search tool | 10 per 1k searches + tokens | platform.claude.com docs |
| Google Grounding with Search (Gemini 3+) | 14 after 5k free per month | ai.google.dev pricing |

A per-request price is **not** a per-task cost for agentic benchmarks, because agents make 5–200 calls and spend most of the money on tokens. In the JSON, list prices are used as cost only where one request equals one task (deep-research tiers, single-step lookups).

---

## 9. Recommendation: which frontiers to draw, and with what

### Draw these (credible)

**A. "Which search API?" Lookup + hard-find composite, from the AA Search Index (independent).**
- 27 providers plus a no-search baseline on one fixed agent, with total cost per 1,000 tasks. It is one benchmark, so no blending is needed.
- Show the frontier (no search → TinyFish → Octen → Exa lite dynamic → Exa auto dynamic) and label the others.
- Cross-check panel: Openbenchmarks Multi-Turn Company Search (wide) and Coding-agent search (hard-find), each with its own frontier. Providers on both AA and Openbenchmarks: Exa (auto, deep), Parallel (basic, advanced, fast, turbo), Perplexity, Tavily, Brave, Firecrawl, TinyFish, Nimble, You.com, Linkup. These are the systems that can be blended. Blend by rank or normalised score within each board, and show "backed by N boards".

**B. "Which model, given a search tool?" Hard-find composite, from Parallel's Search Capability Leaderboard (48 models, cost per 1,000 tasks).**
- Label it "vendor-run, tool fixed to Parallel Search".
- Cross-check with FutureSearch DRB (independent, report-style, 36 configs with cost). Models on both: Claude Opus 4.6/4.8/5-class, Sonnet, GPT-5.x, Gemini 3.x Flash/Pro, Haiku, DeepSeek. Model generations differ between the two boards, so match on family only and flag it.
- HLE-with-tools and DeepSearchQA components (no cost) can back the ranking.

**C. "Progress over time" and "price of the last 10 points" on BrowseComp.**
- The dated SOTA table (section 2b, 16 rows in the JSON) gives the progress line from 51.5 (Apr 2025) to 93.6 (Jul 2026), with the human 29.2% as a reference line.
- Pair it with the two within-vendor cost curves: OpenAI GPT-5.6 and GPT-6 Astra (14 frontier points, $0.08–$18.41 per task) and Anthropic Sonnet 5 and Opus 5 (12 frontier points, about $1.6–$95 per task, digitised). Show them as separate panels; the cost definitions differ.
- Annotate saturation and the memorisation evidence.

### Draw with a "vendor's own frontier" label

**D. Deep-research APIs: Parallel Task, Exa Agent, Perplexity Agent, You.com Research, Valyu DeepResearch, OpenAI/Gemini deep research.**
- There is plenty of cost data (Parallel's 2026-08-26 BrowseComp and DSQA, Exa Agent's BrowseComp/DSQA/WideSearch, Perplexity SaC and Agent API, Valyu's DRACO rerun, You.com tiers).
- Every board is vendor-run and each vendor's frontier runs through its own product.
- The honest chart is a small multiple: one panel per vendor's board, highlighting the owner. The systems that recur across these panels (Parallel Task Core→Ultra8x, Exa Agent low/medium/high, Perplexity Agent tiers, GPT-5.5, Opus 4.8) let the audience see how each one moves between boards.

### Don't draw a cost frontier for

- **Report (beyond FutureSearch):** no other independent board publishes cost, and judges disagree by 30%.
- **Browse-act:** public boards are saturated and cost exists only for 2025 models (HAL) or one vendor's harness (Browser Use).
- **Lookup alone:** saturated. Use it as a "cost of a correct fact" bar chart instead (Openbenchmarks $ per 1k correct; Parallel's SimpleQA Verified CPMs).

### Systems on more than one board in a family (for blending; cost-bearing boards only)

- **lookup:** parallel-search-basic (7), tavily-search (6), exa-auto (6), perplexity-search-api (4), parallel-search-turbo/advanced, openai-web-search (3 each), you-research tiers, parallel-search-fast, linkup-fast, exa-instant, brave-search-api (2 each). Mostly Parallel boards.
- **hard-find:** parallel-search-basic, exa-auto (9 each), tavily-search (8), parallel-task-ultra (8), parallel-task-ultra2x/4x (7), perplexity-sonar-deep-research, parallel-task-pro/core, parallel-search-advanced, openai-web-search (6 each), parallel-task-ultra8x, parallel-search-turbo, gpt-5 (5), perplexity-search-api, perplexity-agent-high, gpt-5.5, exa-instant (4); 64 systems in total on ≥2 boards.
- **wide:** exa-agent-high (5), perplexity-agent-api, gpt-5.5, exa-agent-medium/low (4), Parallel Task Core→Ultra2x, parallel-search-fast/advanced, gpt-6-astra, exa-auto, exa-agent-ultra, claude-opus-5.5, claude-opus-4.8 (3); 25 in total.
- **report:** parallel-task-ultra8x (4), perplexity-agent-api, parallel-task-ultra4x, o3, gpt-5.5, gemini-deep-research, claude-opus-4.8 (3); 20 in total.
- **browse-act:** only claude-3.5-sonnet (5) and five systems on 2 boards.

---

## 10. Method notes and gaps

- **Row assembly.** Rows were collected in six passes (Parallel; AA + Openbenchmarks + AIMultiple; vendor search-API posts; model cards + academic hard-find boards; report family + Search Arena; HAL + browse-act), then merged. 13 rows were dropped as cross-source duplicates; these were mostly vendor posts recycling a paper's numbers, and the paper's row was kept.
- **System ids** are shared across sources where the product is the same (e.g. `exa-auto`, `parallel-task-ultra`, `gpt-5.6-sol`). The `settings` field carries effort, agent count, harness and sample. Where a vendor did not name a competitor's tier, the id is generic (`tavily-search`, `perplexity-search-api`) and the notes say so.
- **No-search baselines** are kept: Parallel's leaderboard (per model), AA (GPT-5.6 Luna 33.4), Openbenchmarks. They are useful for a "lift from search" chart: +34.2 points on average on Parallel's board.
- **Not captured:**
  - Pages behind Cloudflare or 403 (arena.ai web UI, so HF data was used instead; openai.com pages, read via chart data and second copies).
  - Image-only charts: Gemini 2.5 Computer Use latency, Browserbase/Stagehand evals, Anthropic Opus 4.6/4.7 effort charts, Kimi K2.5 cost chart.
  - OSWorld 2.0; Wiki Live Challenge, DeepResearchEval, DEER, ResearcherBench.
  - Benchmark numbers for Jina DeepSearch, SerpApi, Perplexity Comet and Opera Neon (none found).
- **Dates.**
  - DeepResearch Bench's legacy rows use 2026-05-31 as an upper bound, because HF history was squashed.
  - SealQA paper rows use 2025-07-15 as a placeholder.
  - Some leaderboard rows give only a month and are set to day 01.
  - Linkup's undated page uses the access date.
