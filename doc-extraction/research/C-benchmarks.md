# C. Document-extraction benchmarks: who runs them, what they measure, and what they say (as of 2026-10-22)

Research for "At The Frontier: Document Extraction". Every number here was read from a primary source on 2026-10-22: a vendor blog, a GitHub CSV, a Hugging Face data file or an arXiv PDF. Some values are not published numbers and are marked:
- **digitised**: read off an SVG chart's coordinates;
- **transcribed from image**;
- **researcher-computed**: recomputed from a published raw-results file.

Machine-readable rows are in `C-scores.json` (4,301 rows, same folder).

Families used throughout:
- **everyday** = clean or typical pages: text present and reading order correct.
- **hard** = complex tables, degraded scans, handwriting, formulas, charts, non-Latin scripts, rotated pages.
- **extraction** = structured fields or JSON from business documents.
- **overall** = a published composite.
- **other** = a dimension that doesn't map cleanly to the three families (layout labelling, semantic formatting, visual grounding).

---

## 0. Executive summary

1. **Datalab's newest benchmark is OmniParseBench, released 2026-10-08.** Datalab made it after concluding that olmOCR-Bench is saturated (Nov 2025) and that LlamaIndex's ParseBench mostly measures formatting conventions (Oct 2026). Datalab says it will report every future release on OmniParseBench.
   - It has 16,288 pass/fail unit tests on 2,937 pages in 92 languages. Scoring is deterministic with no LLM judge, and the code is Apache-2.0. Every parser's verdict on every test is public in `results.parquet`.
   - Its headline is effectively the "typical-page reliability" number: the top 10 commercial systems sit between 83 and 93.
   - Its tags (handwriting, degraded, rotated, tiny, math, form, non-Latin) give the "very hard cases" view. There, best-vs-median gaps open up: handwriting best 81.4 vs median 72.2, degraded best 85.6 vs median 78.6, non-Latin best 88.6 vs median 81.5 (Datalab's figures).
   - On my own split of the same data, every top system scores 83–93% on plain Latin-script content. Hard-rendering content spreads systems from about 39% to about 89%.
2. **Datalab tops its own benchmark.** Datalab accurate scores 92.9 headline (HF table; 92.7 in the blog) at about $7.50 per 1k pages, and the homepage claims 93.5 for its Oct-20 model.
   - Gemini 3.8 Flash ties at 92.9 but costs about $37 per 1k pages. It also helped build some of the tests.
   - Then come Datalab balanced 91.6 (about $3 per 1k), Reducto 90.8 ($10), LlamaParse Agentic Plus 90.4 (about $56), Mistral OCR 89.5 ($4), Claude Sonnet 5.5 88.7 (about $34), GPT-5.6 Sol 87.8 (about $95), Extend 83.3 (about $34) and Azure Layout 83.0 ($5).
   - On Datalab's own cost chart, the Pareto frontier is Datalab balanced then Datalab accurate. The vendor drew the frontier through its own product.
3. **Every vendor benchmark puts its own product on the cost-accuracy frontier:**
   - ParseBench (LlamaIndex): LlamaParse Cost-Effective → Agentic → Agentic Plus.
   - ExtractBench (LlamaIndex): LlamaExtract tiers.
   - IDP Leaderboard (Nanonets): Nanonets OCR-3.
   - LongExtractionBench (commissioned by Reducto): Reducto.
   - LongArray-Extract and RealDoc-Bench (Extend): Extend.
   - OmniExtractBench (Datalab): Datalab.

   Cross-checking vendors on each other's benchmarks is the honest move. For example, Reducto is 2nd on Extend's long-array benchmark and Extend 2nd on Reducto's. On ParseBench, Datalab is 45th at 69.95. On OmniParseBench, LlamaParse is 5th.
4. **Independent, frequently updated benchmarks are few:**
   - OmniDocBench (OpenDataLab, which also builds MinerU): v1.6, updated 2026-09-11.
   - OCRBench v2 (HUST, private set): quarterly, latest 2026.09.
   - DocVQA 2026 (CVC): a one-off, only 160 questions.
   - Assorted academic one-offs: Dr.DocBench, MPDocBench, a French PDF-to-Markdown benchmark, and a bank-cheques paper.

   None of the frequent ones publishes cost. The only cost axes come from vendor boards (ParseBench, ExtractBench, OmniParseBench, IDP Leaderboard, RealDoc-Bench) and from AI2's olmOCR cost plot (2025).
5. **Saturation is the theme of 2026:**
   - olmOCR-Bench's top systems are within about 2 points of each other (85–87.6). Benchmark-specific post-processing alone adds 0.7–1.7 points.
   - OmniDocBench v1.6's top three are at 96.3–96.9.
   - DocVQA sits at 97.1 against a human 98.1.
   - Separation now lives in the hard tails: handwriting, degraded scans, non-Latin scripts, long documents (on LongExtractionBench, Claude Opus 4.8 and Gemini 3.1 Pro called directly complete only about half of the 225 documents, which average 358 pages), charts and long-tail extraction (ExtractBench Pro: best system perfect on only 58% of documents).
6. **Benchmark design decides the winner.** Unit tests (olmOCR, OmniParseBench, French bench) behave differently from edit distance (OmniDocBench), formatting rules (ParseBench), LLM-judge or Elo scoring (Datalab Dec-2025 pages, OCR Arena), and value-F1 with exact strings (ExtractBench).
   - Datalab showed a 650M model jumping from 23rd to 3rd on ParseBench's four non-chart dimensions after 70 RL steps.
   - Pulse gained 22.6 points on ParseBench Semantic Formatting from a prompt change.
   - Datalab's ExtractBench score went from 64.5 to 93.6 after fixing an adapter bug and string-format matching.

---

## 1. Benchmark index

| Benchmark | Run by | Independent? | Latest version / date | Families | Size | Cost published? |
|---|---|---|---|---|---|---|
| **OmniParseBench** | Datalab | No (Datalab #1 or #2) | HF main, run 2026-10-08 (living, versioned) | overall; text ≈ everyday; tables = hard; layout = other; tags give hard slices | 16,288 tests, 2,937 pages, 92 languages | Yes (chart; $ per 1k pages) |
| OmniExtractBench | Datalab | No (Datalab #1) | 2026-09-16 | extraction | 620 docs pooled from 4 vendors' benchmarks | No |
| olmOCR-Bench | AI2 | Semi (AI2 has its own model) | Data frozen Aug 2025; official table Oct 2025; vendor self-reports through Oct 2026 | everyday (base, H&F, multi-col, long tiny) + hard (math, tables, old scans) | 1,403 PDFs / 7,010 tests | Yes (AI2 plot, 2025) |
| OmniDocBench | OpenDataLab (MinerU authors) | Mostly | v1.6, board 2026-09-11 | everyday (text, reading order) + hard (tables TEDS, formula CDM) | 1,651 pages, ~50% Chinese | No |
| ParseBench | LlamaIndex | No (LlamaParse 1, 2, 4) | leaderboard.csv 2026-10-19 (148 systems) | overall; content faithfulness = everyday; tables + charts = hard; formatting and grounding = other | ~2,078 pages, 169k rules | **Yes**, every API row |
| ExtractBench (+ Pro) | LlamaIndex (+ Kaggle) | No (LlamaExtract #1) | leaderboard.csv 2026-10-20 (49 systems; Pro 13) | extraction (short, medium, long; Pro long-tail) | 370 docs / 4,869 pages; Pro 100 docs | **Yes** |
| IDP Leaderboard v1.5 | Nanonets | No (Nanonets OCR-3 #1) | 2026-03-11, adds to about Apr 2026 | overall; KIE = extraction; OCR and tables = hard | olmOCR + OmniDoc + IDP Core (6.4k samples) | Yes (some models) |
| RD-TableBench | Reducto | No (Reducto #1) | Nov 2024; Pulse re-run Apr 2026 | hard (tables) | 1,000 tables | No |
| LongExtractionBench | micro1 for Reducto | No (Reducto #1) | Jun 2026 | extraction (very long tables) | 225 docs (50 public), average 358 pages | No |
| RealDoc-Bench / LongArray-Extract | Extend | No (Extend #1) | 2026-05 to 08 / 2026-06 | extraction (+ layout = hard) | 581 docs QA; 45 long PDFs | RealDoc yes |
| Mistral OCR posts | Mistral | No | OCR 4 2026-06-23 (4.1 not benchmarked) | overall / hard / multilingual | internal | Own price only |
| SCORE-Bench | Unstructured | No | Dataset Dec 2025; page updated 2026 | overall (content, hallucination) + hard (tables) | 224 docs | No |
| LandingAI DocVQA parse-QA | LandingAI | No | 2025-11-12 | everyday | DocVQA val | No |
| CC-OCR | Alibaba Qwen | Semi | 2024 board; Qwen self-reports 2026 | everyday / hard / **extraction (KIE)** | 7,058 images | No |
| OCRBench v2 | HUST | **Yes** (private set) | 2026.09 (quarterly) | everyday (recognition), extraction, hard (parsing) | 10k public QA + 1.5k private | No |
| DocVQA / DocVQA 2026 | CVC-UAB | **Yes** | 2020– (saturated) / ICDAR 2026 report Sep 2026 | everyday / hard reasoning | 50k QA / 160 test Qs | No |
| OCR Arena | Extend | No (hosted by vendor) | live | overall (preference Elo) | user uploads | No (latency) |
| Dr.DocBench, MPDocBench-Parse, French PDF→MD, Bank-cheques paper | academic / industry labs | Yes (MPDoc: Alibaba co-author) | Feb–Sep 2026 | hard / everyday / extraction | various | Cheques paper only |
| Datalab Benchmark pages (Dec 2025) | Datalab | No | 2025-12-09 | overall (LLM-judge Bradley-Terry Elo) | ~8k pages | No; not captured (interactive) |

---

## 2. Datalab's benchmark story (2025 → Oct 2026)

Datalab (datalab.to) maintains Marker, Surya, Chandra and Indra and sells a hosted API. Its benchmark arc runs in five stages.

| Date | Post | What it says |
|---|---|---|
| 2025-10 / 2025-11 | Chandra launch; **"Saturating the olmOCR Benchmark"** (2025-11-13) | olmOCR-Bench is "our favorite external benchmark", but string matching penalises correct output. When Gemini re-checked Chandra's failed tests (without the image), Chandra went from **85.5% to 93.9%**. Datalab estimates 3–4% of tests are wrong or opinionated, so the ceiling is about 96–97%. |
| 2025-12-09 | Datalab Benchmarks + Evals | About 8k pages pooled from OmniDocBench, olmOCR-bench, Chunkr Layout, the OmniAI benchmark, ColPali and finepdfs. Pairwise **LLM-as-judge** with Bradley-Terry Elo per document class, on Datalab fast/balanced/accurate vs olmOCR, dots.ocr, DeepSeek-OCR and RolmOCR. These are interactive pages; no numeric table was captured. |
| 2026-03-18 | **Chandra OCR 2** | olmOCR-bench **85.9** (open 4B model), up from 83.1; Datalab API 86.7. Internal multilingual benchmark (43 languages): Chandra 2 77.8, Chandra 1 69.4, Gemini 2.5 Flash 67.6, GPT-5 Mini 60.5. |
| 2026-06 / 2026-09 | Extraction fights: "We lead an external extraction benchmark" (07-14), "Datalab leads another competitor's extraction benchmark" (08-13), **OmniExtractBench** (09-16) | Datalab re-ran Reducto's LongExtractionBench (50 public docs): recall Datalab 99.1 vs Reducto 98.3. It re-scored LlamaIndex's ExtractBench, where it says a `_meta`-key adapter bug cut its score to 64.5; corrected it gets 91.3, and 93.6 with format-agnostic matching. It then pooled 620 docs from four vendors' sets into OmniExtractBench with a deterministic verdict-based scorer (Datalab-accurate 93.85, Reducto deep 93.47, Claude Opus 5 90.96, Extend 90.17, Gemini 3.7 Flash 86.79, LlamaExtract 84.93, GPT-5.6 Sol 83.85, Mistral OCR 4.1 76.78, Azure CU 61.08). |
| **2026-10-08 / 2026-10-12** | **OmniParseBench** launch + **"Why we built OmniParseBench"** | The replacement benchmark. It keeps olmOCR's unit-test design but adds content tags, provenance per test, format-agnostic normalisation, removal of trivially passable tests, and a headline that is the mean of three family scores (text, tables, layout) so test counts cannot tilt it. The "why" post attacks ParseBench: Surya (650M) went from 23rd to 3rd after 70 RL steps; a Pulse prompt change was worth 22.6 points; 73% of chart rules are VLM-estimated values scored as exact; visual-grounding ground truth follows LlamaParse's conventions. |
| 2026-10-14 to 2026-10-20 | Chandra 2.5, script-confusions research, Indra OCR 1.1, homepage | Chandra 2.5: OmniParseBench accurate 92.7 / balanced 91.6; olmOCR raw 85.4 / own post-processing 86.9 / LightOn PP3 87.4; median latency down 40–43%. Script confusions (wrong-alphabet words) per page on about 5,600 hard pages: Datalab API 0.16%, Gemini 3.8 Flash 0.61%, Claude Opus 5.5 0.89%, Chandra 2.4 1.19%, LightOnOCR-3 3.04%, DeepSeek-OCR 2 6.08%. The homepage now shows **93.5** for Datalab accurate (Oct-20 model). |

**How the "simple cases vs very hard cases" story maps onto OmniParseBench.** Datalab presents two lenses on the same benchmark:
- **Reliability on typical content**: the headline and the families. Every serious system is above 83, and the top six are within 2.8 points.
- **Hard cases**: tag slices. The post names the best and median scores on non-Latin, degraded and handwriting content, and shows a per-tag weak-spots grid.

The post also says Datalab removed tests that every system, plain pdftotext, PyMuPDF or Tesseract, or a judge model found trivial. This was done to create headroom.

### 2a. OmniParseBench: methodology

- **URLs:** https://www.datalab.to/blog/omni-parse-bench · https://www.datalab.to/blog/why-we-built-omniparsebench · https://github.com/datalab-to/omni_parse_bench · https://huggingface.co/datasets/datalab-to/omni_parse_bench · https://www.datalab.to/benchmarks
- **Tests:**
  - `present` (7,275), `order` (1,189) and `repeat` (35) make up the **text** family.
  - `table_cell` (5,386) checks that a cell sits under these headings and beside these neighbours; this is the **tables** family.
  - `layout_kind` (2,403) checks that the block holding a line is a heading, text or table; this is the **layout** family.
  - **Headline = mean of the three family pass rates.**
- **Data:** 22 suites, including olmOCR-bench conversions, PMC JATS tables, filled, blank and scanned federal forms, handwriting samples, a French handwriting benchmark, ParseBench docs, tiny-text engineering plans, rotation/skew and finepdfs multilingual.
- **Answer provenance per test:** text layer, publisher markup, upstream olmOCR, or a model panel with human adjudication.
- **Fairness rules:**
  - No custom prompts for any vendor.
  - Every API runs its most accurate documented settings: Datalab `mode=accurate`, Reducto r-1, LlamaParse `agentic_plus`, Extend `parse_performance` with agentic passes, Azure prebuilt-layout (api 2025-11-01) and Mistral `/v1/ocr`.
  - The same short prompts for GPT, Gemini and Claude (via OpenRouter).
  - The same timeouts and retries for all.
  - Models used to build tests are flagged.
- **Cost:** list price per 1k pages from the credits each response reports; LLM cost from billed tokens; Datalab's price includes its data-retention discount.
- **Latency:** median seconds per page over 200 sampled pages with 8 in flight, queue and polling included.
- **Living benchmark:** versioned HF revisions. More handwriting, federal forms, newspapers and script-leak suites are coming.

### 2b. OmniParseBench: full published leaderboard

Source: HF dataset card (run 2026-10-08). The blog table differs slightly for Datalab accurate: 92.7 / 90.8 / 91.8 / 95.6. Cost and latency are **digitised** from the blog's SVG charts, about ±2%. Cost is plotted only for the 10 API or LLM systems.

| Parser | Weights | Headline | Text | Tables | Layout | $ / 1k pages | Median s/page |
|---|---|---|---|---|---|---|---|
| Datalab accurate | closed | 92.9 | 91.2 | 92.0 | 95.6 | ~7.5 | ~14.8 |
| Gemini 3.8 Flash* | closed | 92.9 | 91.3 | 95.2 | 92.2 | ~37 | ~21 |
| Datalab balanced | closed | 91.6 | 90.0 | 89.2 | 95.5 | ~3.0 | ~9.7 |
| Reducto (r-1) | closed | 90.8 | 85.4 | 91.2 | 95.8 | ~10 | ~6.0 |
| LlamaParse (agentic_plus) | closed | 90.4 | 88.2 | 92.6 | 90.4 | ~56 | ~33 |
| chandra-ocr-2 | open | 90.1 | 87.4 | 87.4 | 95.4 | – | – |
| Mistral OCR | closed | 89.5 | 82.8 | 91.9 | 93.8 | ~4.0 | ~2.9 |
| Claude Sonnet 5.5* | closed | 88.7 | 93.1 | 95.4 | 77.5 | ~34 | ~12 |
| dots.mocr | open | 87.9 | 82.5 | 88.6 | 92.5 | – | – |
| GPT-5.6 Sol | closed | 87.8 | 85.4 | 91.6 | 86.5 | ~95 | ~29 |
| MinerU2.5-Pro | open | 87.1 | 77.4 | 92.1 | 91.7 | – | – |
| Infinity-Parser2-Pro | open | 87.0 | 83.3 | 84.1 | 93.5 | – | – |
| Extend (parse_performance) | closed | 83.3 | 64.1 | 92.5 | 93.4 | ~34 | ~13 |
| Surya OCR 2 | open | 83.1 | 80.6 | 74.3 | 94.3 | – | – |
| Azure (DI prebuilt-layout) | closed | 83.0 | 74.6 | 81.7 | 92.8 | ~5.0 | ~2.4 |
| LightOnOCR-3-4B | open | 82.9 | 83.9 | 70.8 | 94.0 | – | – |
| LightOnOCR-3-0.8B | open | 81.6 | 81.1 | 72.1 | 91.7 | – | – |
| GLM-OCR | open | 81.5 | 71.0 | 84.2 | 89.3 | – | – |
| Unlimited-OCR | open | 79.3 | 70.2 | 76.5 | 91.1 | – | – |
| PaddleOCR-VL-1.6 | open | 78.7 | 61.7 | 83.7 | 90.7 | – | – |
| Infinity-Parser2-Flash | open | 78.4 | 78.4 | 66.5 | 90.4 | – | – |
| DeepSeek-OCR-2 | open | 75.2 | 64.2 | 70.0 | 91.4 | – | – |
| Indra OCR (CPU, 1M params) | open | 69.5 | 60.3 | 58.1 | 90.1 | – | – |
| HunyuanOCR-1.5 | open | 64.6 | 50.5 | 61.9 | 81.4 | – | – |
| olmOCR-2 / Nanonets-OCR2-3B / Tesseract | open | none (no layout) | 71.3 / 68.2 / 17.6 | 56.6 / 62.6 / 0.0 | unsupported | – | – |

\* Used to create or verify some tests.

Further vendor updates:
- The homepage (2026-10-22) shows **Datalab accurate 93.5** for its "current model, Oct 20"; the other rows were not re-run.
- Indra OCR 1.1: 66.7, or 71.4 with `--math`.

Low-cost options to note:
- Datalab balanced at about $3 sits on the frontier.
- Mistral OCR is the fastest at about 3 s per page and $4.
- Azure Layout is cheap and fast but weak on text (74.6), largely because of handwriting and multilingual content.
- Extend's low text score (64.1) is driven mainly by math (38.0 on math-tagged tests).

### 2c. OmniParseBench "easy vs hard" split (**researcher-computed** from `results.parquet`)

I recomputed every system's family scores and headline from the public per-test verdicts, and they match the HF table exactly. I then cut the same tests four ways:

- **Plain**: 2,784 tests with no table, math, form, handwriting, tiny, rotated or degraded tag, and Latin script only. Mostly text and layout tests; my proxy for "everyday reliability".
- **Hard-render**: 2,874 tests tagged handwriting, tiny, rotated or degraded.
- **Non-Latin**: 1,303 tests.
- Single tags.

Values are simple pass rates. Datalab's own published "best/median" figures use reported systems only and differ by up to about 0.7 points; for example, it gives degraded-best as 85.6 where I get 84.9.

| System | Headline | Plain (everyday) | Hard-render | Handwriting | Degraded | Rotated | Tiny | Non-Latin | Table tag | Math tag | Form tag |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Datalab accurate | 92.9 | **93.0** | 87.6 | 76.2 | 84.9 | 92.1 | 94.7 | **89.3** | 92.7 | 93.5 | 92.6 |
| Gemini 3.8 Flash* | 92.9 | 89.5 | **89.2** | **81.4** | 84.7 | **93.0** | 93.6 | 88.1 | **94.8** | 95.0 | 91.0 |
| Datalab balanced | 91.6 | 92.6 | 81.3 | 72.2 | 83.7 | 73.9 | 92.9 | 87.1 | 90.1 | 93.8 | 88.9 |
| Reducto | 90.8 | 91.1 | 82.4 | 69.6 | 79.5 | 83.9 | 92.4 | 64.3 | 91.6 | 93.7 | 88.6 |
| LlamaParse | 90.4 | 90.4 | 85.7 | 75.3 | 78.6 | 91.5 | 89.1 | 84.4 | 92.9 | 90.0 | 83.6 |
| chandra-ocr-2 (open) | 90.1 | 90.9 | 80.1 | 70.3 | 81.5 | 72.9 | 92.8 | 80.9 | 88.3 | 93.2 | 83.9 |
| Mistral OCR | 89.5 | 87.6 | 76.3 | 67.5 | 68.7 | 89.0 | 71.4 | 81.5 | 91.6 | 89.4 | 84.0 |
| Claude Sonnet 5.5* | 88.7 | 83.4 | 88.4 | 77.9 | 84.3 | 92.7 | **94.8** | 84.7 | 94.5 | **96.2** | **93.4** |
| GPT-5.6 Sol | 87.8 | 85.2 | 80.3 | 70.2 | 78.0 | 77.3 | 89.3 | 76.3 | 91.5 | 89.3 | 85.9 |
| Extend | 83.3 | 85.3 | 84.5 | 75.9 | 77.9 | 88.3 | 89.9 | 71.5 | 93.2 | 38.0 | 89.7 |
| Azure Layout | 83.0 | 85.6 | 68.9 | 42.3 | 56.0 | 80.1 | 88.2 | 49.6 | 82.8 | 85.2 | 82.0 |
| MinerU2.5-Pro | 87.1 | 86.4 | 71.0 | 41.6 | 61.2 | 84.3 | 87.1 | 51.3 | 91.9 | 91.4 | 81.7 |
| LightOnOCR-3-4B | 82.9 | 89.9 | 76.3 | 70.6 | 78.9 | 63.3 | 87.7 | 53.7 | 75.2 | 94.1 | 85.5 |
| PaddleOCR-VL-1.6 | 78.7 | 81.0 | 59.6 | 45.8 | 50.2 | 72.2 | 61.4 | 52.3 | 83.7 | 63.8 | 68.1 |
| DeepSeek-OCR-2 | 75.2 | 77.9 | 38.5 | 34.8 | 44.3 | 15.5 | 54.6 | 55.9 | 71.2 | 81.7 | 59.8 |
| Tesseract | n/a | 33.8 | 14.8 | 1.6 | 5.2 | 3.7 | 44.2 | 21.8 | 3.2 | 1.6 | 27.0 |

Reading:
- On plain content the top 10 commercial systems span about 83–93.
- On hard rendering they span about 69–89, and handwriting spans 42–81.
- Claude Sonnet 5.5 is *best-in-class on hard content* (tiny text, math, forms) but last of the ten commercial systems on plain pages. Its weakness is layout labelling (77.5), not reading.
- Reducto and the open models fall apart on non-Latin scripts: Reducto 64%, MinerU 51%, LightOn 54%.
- Small open models are competitive on plain pages but fall away on hard-render content (DeepSeek-OCR-2 at 38.5%).

### 2d. OmniParseBench strengths and limitations

- **Strengths:**
  - Deterministic, inspectable unit tests with per-test provenance.
  - Content-level tags make "documents like mine" slices possible.
  - Format-agnostic normalisation: HTML or Markdown, LaTeX compared by KaTeX render.
  - Trivially passable tests removed.
  - Per-family headline, so test counts can't tilt it.
  - Publishes cost and latency.
  - All verdicts public; frontier LLMs and open models included.
- **Limitations:**
  - **Datalab built it and wins it**, and Datalab says so itself.
  - Datalab chose the suites, and some come from its customers' failure modes, where it may have optimised. Datalab says it does not train on the benchmark pages, but this can't be verified.
  - Gemini 3.8 Flash and Claude Sonnet 5.5 helped create tests (flagged).
  - The layout family rewards emitting typed blocks; Claude's 77.5 there drags its headline.
  - About 62% of tests are English, and many non-English slices are thin (32 languages have one document).
  - Cost and latency are single 200-page runs; costs are list prices, and LLM token costs depend on prompt and output length.
  - The headline was released two weeks ago and has no independent replication yet.
  - The homepage already shows a newer Datalab number (93.5) without re-running competitors.

---

## 3. ParseBench (LlamaIndex): full leaderboard with cost

- **Run by:** LlamaIndex (vendor). Launched Apr 2026 (arXiv 2604.08538), with an Apache-2.0 harness.
- **Status:** a live leaderboard of 148 systems in `leaderboard.csv`, last commit 2026-10-19 (adding Nemotron-3.5-Parse). Website parsebench.ai.
- **Data:** about 2,078 human-verified pages from 1,211 enterprise documents (insurance, finance, government).
- **Five dimensions, each with its own metric:**
  - Tables: GTRM = GriTS + TableRecordMatch.
  - Charts: ChartDataPointMatch, 4,864 rules.
  - Content Faithfulness: 141k rules covering omissions, hallucinations and reading order.
  - Semantic Formatting: bold, strike, super/subscript, title hierarchy.
  - Visual Grounding: element pass rate.
  - Overall = mean of the five.
- **Cost:** ¢ per page in the CSV, converted to $ per 1k pages in the JSON.
- **Families:** content faithfulness = everyday; tables and charts = hard; formatting and grounding = other.

Selected rows (all 148 are in JSON):

| Rank | System | Overall | Tables | Charts | Content | Sem. Fmt | Vis. Ground | $ / 1k pages |
|---|---|---|---|---|---|---|---|---|
| 1 | LlamaParse Agentic Plus | 90.20 | 93.37 | 94.18 | 92.25 | 87.12 | 84.09 | 56.25 |
| 2 | LlamaParse Agentic | 87.01 | 88.88 | 88.68 | 91.78 | 81.44 | 84.25 | 12.50 |
| 3 | Pulse Ultra 2 | 81.60 | 90.35 | 89.70 | 87.63 | 73.97 | 66.35 | 15.00 |
| 4 | LlamaParse Cost Effective | 80.61 | 84.19 | 77.91 | 89.87 | 67.29 | 83.77 | 3.75 |
| 5 | anyformat (Standard) | 80.30 | 86.46 | 85.56 | 87.35 | 79.04 | 63.07 | 43.00 |
| 6 | Anthropic Opus 5.5 (Effort High) | 79.85 | 94.25 | 70.89 | 91.72 | 77.04 | 65.33 | 61.30 |
| 7 | Anthropic Fable 5.1 | 78.92 | 91.52 | 67.06 | 91.19 | 76.52 | 68.30 | 160.50 |
| 14 | OpenAI GPT-5.6 Sol (Reasoning High) | 75.35 | 91.39 | 68.68 | 88.16 | 77.16 | 51.35 | 80.80 |
| 15 | Extend (2.0) | 75.33 | 84.82 | 78.31 | 84.59 | 60.31 | 68.61 | 25.00 |
| 17 | LightOnOCR-3-4B (open) | 75.10 | 83.80 | 66.10 | 89.90 | 67.60 | 68.30 | – |
| 18 | Google Gemini 3 Flash (Thinking High) | 75.05 | 91.50 | 64.79 | 90.87 | 68.31 | 59.77 | 24.10 |
| 20 | Databricks AI Parse | 74.71 | 83.67 | 70.17 | 88.25 | 55.25 | 76.23 | 3.50 |
| 27 | Reducto (Agentic) | 72.97 | 80.42 | 73.40 | 86.37 | 57.60 | 67.07 | 47.60 |
| 30 | Google Gemini 3.8 Flash (Thinking High) | 72.08 | 89.12 | 32.34 | 89.68 | 76.36 | 72.91 | 34.10 |
| 41 | Anthropic Sonnet 5.5 | 70.18 | 91.04 | 37.69 | 91.64 | 71.63 | 58.92 | 27.40 |
| 43 | Chandra-ocr-2 (open) | 70.10 | 89.20 | 65.10 | 83.70 | 61.40 | 51.20 | – |
| 45 | Datalab Accurate | 69.95 | 90.29 | 62.40 | 83.87 | 40.79 | 72.38 | 10.00 |
| 49 | Datalab Balanced | 69.51 | 89.10 | 62.05 | 83.63 | 39.74 | 73.05 | 4.00 |
| 50 | Google Gemini 3.1 Pro | 69.14 | 91.00 | 41.13 | 90.16 | 52.43 | 70.99 | 84.90 |
| 54 | Mistral OCR 4 (Annotation) | 68.23 | 73.94 | 40.11 | 89.55 | 66.37 | 71.17 | 5.00 |
| 57 | Reducto | 67.83 | 70.33 | 56.99 | 86.37 | 56.75 | 68.71 | 23.80 |
| 80 | Reducto (r-1) | 62.37 | 85.15 | 2.76 | 89.19 | 73.99 | 60.75 | 10.00 |
| 88 | Mistral OCR 4 | 60.68 | 73.94 | 2.35 | 89.55 | 66.37 | 71.17 | 4.00 |
| 91 | Azure Document Intelligence (Layout) | 59.64 | 86.00 | 1.56 | 84.93 | 51.93 | 73.78 | 10.00 |
| 103 | Extend | 55.75 | 85.05 | 1.59 | 84.08 | 47.36 | 60.67 | 25.00 |
| 113 | Google Cloud Document AI | 50.39 | 55.10 | 1.44 | 83.65 | 50.51 | 61.26 | 10.00 |
| 116 | AWS Textract | 47.88 | 84.58 | 5.97 | 74.76 | 3.71 | 70.36 | 15.00 |
| 122 | LandingAI | 45.23 | 73.72 | 10.88 | 88.60 | 27.87 | 25.08 | 30.00 |
| 147 | PyMuPDF (Text) | 16.02 | 0.00 | 0.00 | 68.28 | 0.95 | 10.86 | – |

Ranks are by Overall among all 148 rows.

What the full board shows:
- **Content Faithfulness, the closest thing to "everyday reliability", is compressed.** Nearly every serious system scores 83–92, and Anthropic Haiku 5.5 reaches 90.24 at $1.40 per 1k pages.
- **Charts and formatting drive the spread.** Products without a chart-to-table pipeline score 1–10 on Charts.

Datalab's critique, in the "Why we built OmniParseBench" post:
- Semantic Formatting depends on output conventions: Datalab moved from 46.27 to 77.35 by turning on documented options, with identical text.
- 73% of chart rules are VLM-estimated values scored as exact.
- Visual-grounding ground truth is derived from LlamaParse output. Its tiers sit at 83.8–84.3 across a 15× price range; the best non-LlamaParse system scores 80.61 and the best frontier model 72.91.

These are a competitor's claims, but they are specific and checkable.

## 4. ExtractBench (LlamaIndex + Kaggle): field extraction with cost

- **Data:** 370 docs, 4,869 pages, 67 types.
- **Metric:** schema-guided JSON scored by unified value F1, averaged over documents, with separate short, medium and long scores.
- **Cost:** in $ per page in the CSV, converted to $ per 1k in the JSON.
- **ExtractBench Pro:** 100 long-tail docs, 2,622 pages, scored on value F1 and % of documents perfect.
- **Freshness:** leaderboard.csv last commit 2026-10-20. Vendor-run; LlamaExtract is #1.

| System | Category | Overall F1 | Short | Medium | Long | $ / 1k pages |
|---|---|---|---|---|---|---|
| LlamaExtract Agentic Plus | vendor | 96.17 | 97.02 | 94.30 | 94.65 | 75.0 |
| Reducto Deep Extract | API | 96.08 | 96.84 | 94.80 | 92.85 | 63.5 |
| Pulse (Effort) | API | 96.07 | 96.83 | 94.70 | 93.24 | 105.0 |
| LlamaExtract Agentic | vendor | 95.65 | 96.06 | 94.79 | 94.73 | 31.2 |
| Claude Code (Sonnet 5.5 Evidence) | coding agent | 94.68 | 96.22 | 92.97 | 83.69 | 56.9 |
| Codex (GPT-6 Sol Evidence) | coding agent | 94.57 | 95.99 | 92.42 | 87.25 | 98.0 |
| Pulse (Non-effort) | API | 94.51 | 95.39 | 92.49 | 93.31 | 30.0 |
| LlamaExtract Cost-Effective | vendor | 94.21 | 95.49 | 91.58 | 90.86 | 10.0 |
| OpenAI GPT-6 Astra | plain VLM | 91.91 | 97.22 | 90.56 | 31.70 | 110.9 |
| Codex (GPT-6 Luna Evidence) | coding agent | 91.01 | 93.09 | 87.71 | 80.88 | 9.7 |
| Qwen3.8 Flash Next | OSS | 89.88 | 94.82 | 87.81 | 37.74 | – |
| Extend (Max Context) | API | 88.62 | 92.32 | 78.75 | 90.46 | 100.0 |
| DeepSeek V4.1 Flash | VLM | 87.11 | 94.44 | 81.49 | 22.23 | 3.2 |
| Extend Extract | API | 85.72 | 89.39 | 84.14 | 47.21 | 68.0 |
| Datalab (Accurate + Balanced) | API | 85.70 | 89.40 | 85.08 | 42.04 | 35.0 |
| Reducto Extract | API | 83.79 | 92.35 | 73.29 | 27.28 | 45.7 |
| Kimi K3 | VLM | 83.17 | 94.64 | 69.64 | 4.99 | 67.5 |
| Google Gemini 3.8 Flash | VLM | 80.71 | 88.14 | 72.23 | 28.70 | 4.3 |
| Lift Datalab 9B | OSS | 78.43 | 87.64 | 65.69 | 24.78 | – |
| OpenAI GPT-5.4 Nano | VLM | 74.90 | 77.43 | 76.37 | 35.81 | 2.1 |

All 49 rows are in the JSON.

**ExtractBench Pro** (value F1 / % perfect documents / $ per 1k pages):

| System | Value F1 | % perfect | $ / 1k pages |
|---|---|---|---|
| Codex GPT-6 Astra | 94.53 | 58 | 952 |
| Claude Code Opus 5.5 | 74.87 | 51 | 412 |
| LlamaExtract Agentic Plus | 77.70 | 38 | 75 |
| Extend Operator | 73.87 | 34 | 98.8 |
| Claude Code Sonnet 5.5 | 73.62 | 32 | 199.8 |
| Gemini CLI (Gemini 4 Argon Medium) | 42.44 | 30 | 181.7 |
| LlamaExtract Agentic | 71.32 | 20 | 31.2 |
| Pulse Effort | 70.53 | 18 | 105 |
| Codex GPT-6.1 Sol | 74.06 | 12 | 138.6 |
| Reducto Deep | 56.35 | 3 | 61.8 |
| Datalab Accurate | 43.93 | 2 | 157.5 |

Notes:
- **Short documents are saturated:** about 93–97 for anything competent.
- **Long documents separate pipelines from plain model calls** (plain VLMs score 5–38 on Long).
- On the long-tail Pro set, **coding agents** that write and run their own extraction code lead, at roughly 5–15× the cost.
- Datalab's corrected score from its own re-run is about 94; the current LlamaIndex row shows 85.70. See `ExtractBench (Datalab re-run)` in the JSON.

---

## 5. Which benchmarks can be honestly blended within each family, and how

**Principle.** Raw scores are not on a common scale. Unit-test pass rates, edit distance, TEDS, value F1, Elo and win rates measure different things with different ceilings and noise floors. Never average raw numbers across benchmarks. Blend **within a family** only, after normalising **within each benchmark**, and show coverage.

**Recommended method (per family):**
1. **Pick one primary metric per benchmark per family.** Choose the most directly relevant column, not the composite. Flip the sign of lower-is-better metrics such as edit distance and error rates.
2. **Restrict each benchmark to a comparable reference field.** Use systems that appear on at least two benchmarks in the family, and drop `—`/unsupported rows. Normalisation depends on which systems are in the pool, so fix the pool before normalising.
3. **Normalise within each benchmark.** Two options:
   - **Rank-normalise (default):** percentile = 1 − (rank − 1)/(n − 1). This is robust to saturated top ends (olmOCR at 85–87.6, OmniDocBench at 96–97, DocVQA at 97) and to differently scaled metrics.
   - **Min-max against anchors:** 0 = a fixed floor system (Tesseract, PyMuPDF or a plain OCR API such as Textract), 1 = the benchmark's best. This keeps magnitudes ("how far behind"), but saturated benchmarks inflate small gaps. Prefer it only when every benchmark shares the anchor systems.
4. **Average a system's normalised scores across the benchmarks it appears in, weighting each benchmark equally.** Optionally down-weight vendor-run benchmarks where the scored system is the publisher's own product (exclude "own product on own benchmark" rows, or weight them 0.5). Report n (benchmarks covered) next to every blended score, and don't plot systems with n = 1 on a blended chart; show them as single-benchmark points with a different marker.
5. **Cost axis.** Use list price per 1k pages from a single source: the B.md pricing table, checked 2026-10-22. Don't mix in benchmark-reported costs, which differ by tier, by token usage and by Datalab's retention discount. For LLMs, take token-billed costs from ParseBench, ExtractBench or OmniParseBench and say so. Plot each vendor's tiers as separate points, since tiers are where the trade-offs live.
6. **Uncertainty.** Treat gaps under about 1 point on olmOCR, OmniDocBench and OmniParseBench, and under about 2 points on ExtractBench, as ties (single runs, ±0.5–1 per Datalab and AI2 bootstrap CIs). DocVQA 2026 (160 questions) and the IDP table subsets (50 docs each) are too small to rank closely.

**Family 1: Everyday reliability.** These can be blended:
- OmniParseBench *plain* slice (researcher-computed) or its *text* family.
- ParseBench *Content Faithfulness*.
- olmOCR-Bench *Base + Headers&Footers + Multi-column + Long tiny text*. AI2's official runs only; vendor self-reports drop H&F.
- OmniDocBench v1.6 *Text edit* and *Reading-order edit* (inverted).
- French PDF→MD *baseline*.
- OCR Arena Elo (as a vibe check only).

Caveats:
- All of these are near ceiling. Expect blended spreads among frontier systems to be small, and say so: this is the "everyone's good enough on clean pages" slide.
- OmniDocBench is about 50% Chinese, and its edit distance punishes formatting.
- Coverage of commercial APIs is thin outside OmniParseBench and ParseBench. olmOCR and OmniDocBench mostly cover open models and older LLMs.

**Family 2: Hard pages.** These can be blended:
- OmniParseBench tag slices: handwriting, degraded, rotated, tiny, math, non-Latin and table.
- ParseBench *Tables* and *Charts*. Charts measure chart-to-table pipelines and VLM-estimated values; consider excluding them or keeping them separate.
- olmOCR *Old scans, Old scans math, ArXiv, Tables*.
- OmniDocBench *Table TEDS, Formula CDM*.
- RD-TableBench, which is 2024 and covers few current systems.
- IDP Core *OCR handwriting* and *long sparse tables*.
- Dr.DocBench, MPDocBench-Parse, French bench *handwritten/forms*.
- OCRBench v2 *Parsing*.

Split into two sub-families if space allows: **"hard tables & formulas"** (structure) and **"hard rendering"** (handwriting, scans, rotation, script). Systems rank very differently on them. For example, Claude is strong on structure and Reducto weak on scripts.

Coverage caveats:
- Commercial APIs are mainly on OmniParseBench, ParseBench and RD-TableBench.
- Frontier LLMs are on OmniParseBench, ParseBench, IDP and Dr.DocBench.
- Open models are on everything.

**Family 3: Field extraction.** These can be blended:
- ExtractBench (overall value F1; also report Long separately).
- OmniExtractBench (accuracy; already pools four vendors' corpora).
- RealDoc-Bench QA (per-field).
- IDP Core KIE.
- CC-OCR KIE (2024 models only).
- OCRBench v2 Extraction.
- Bank-cheques paper (micro-F1).
- LongExtractionBench and LongArray-Extract (recall or accuracy, **with coverage**).

Caveats:
- Pipeline differences (schema, extractor LLM, chunking) dominate. RealDoc fixes the extractor LLM, while the others let each vendor extract natively.
- **Long-document extraction should be its own sub-family.** Plain LLM calls drop from about 95 on short documents to 5–40 on long ones, and averaging hides that.
- Score only completed documents *times* coverage, or count failures as 0, as Extend and ExtractBench do. micro1's "accuracy on completed docs" overstates frontier LLMs.
- Overlap: OmniExtractBench reuses ExtractBench, LongExtract and LongArray documents. Don't count it as independent evidence alongside them; use it *instead of* them, or exclude the overlap.

**Sparse coverage to flag:**
- Mistral OCR 4.1, Azure, Textract and Google DocAI appear on at most 2–4 current benchmarks.
- Claude and Gemini versions differ across benchmarks: Sonnet 5.5 here, 4.6 there; Gemini 3.1 Pro vs 3.8 Flash. **Don't merge versions** under one system_id. The JSON keeps versioned ids.
- Most independent benchmarks don't include commercial parsing APIs at all.
- Vendor tiers are named inconsistently. For example, "LlamaParse" on OmniParseBench = agentic_plus, and "Reducto" on OmniParseBench = r-1, while on ParseBench "Reducto" = legacy and "Reducto (r-1)" is separate. The JSON maps OmniParseBench rows to tier-specific ids (`reducto-r-1`, `llamaparse-agentic-plus`, `extend-parse-performance`, `mistral-ocr-4.1`, `azure-di-layout`). For the Mistral version, I inferred `mistral-ocr-4.1` from the run date and the harness calling `/v1/ocr`; it is not stated.

**A defensible Pareto chart with the data available today.** Use **one benchmark per chart**, not a blend, for any chart where cost is an axis. Three vendor-run boards publish their own cost and accuracy for many systems:

| Board | Who is on the frontier (cost ↑, score ↑) | Note |
|---|---|---|
| OmniParseBench | Datalab balanced ($3, 91.6) → Datalab accurate ($7.5, 92.9) | Datalab's board |
| ParseBench | GPT-6 Luna tiers ($0.9–2.9, 53–64) → Databricks AI Parse ($3.5, 74.7) → LlamaParse Cost-Effective ($3.75, 80.6) → LlamaParse Agentic ($12.5, 87.0) → Agentic Plus ($56, 90.2) | LlamaIndex's board |
| ExtractBench | GPT-5.4 Nano ($2.1, 74.9) → DeepSeek V4.1 Flash ($3.2, 87.1) → Codex GPT-6 Luna ($9.7, 91.0) → LlamaExtract Cost-Effective ($10, 94.2) → Pulse ($30, 94.5) → LlamaExtract Agentic ($31, 95.7) → Reducto Deep ($63.5, 96.1) → LlamaExtract Agentic Plus ($75, 96.2) | LlamaIndex's board |

Each publisher's own product sits on its own frontier. Show two or three boards side by side; that is itself the lesson.

**Known conflicts between sources** (check these before putting a number on a slide):
- **RealDoc-Bench (Extend).** The web page (updated 2026-08-27) shows Extend Performance Parse 2.0 at 95.7% overall and $0.020 per page. The arXiv paper (June 2026) shows Extend Performance v2 at 96.0 per-field and $0.040 per page. Both are kept in the JSON as separate benchmark names.
- **LongExtractionBench (micro1).** The failure-count labels for Claude and Gemini are swapped in one micro1 table. Reducto's image and guide differ from micro1's page. Appendix B's reading is used.
- **OmniParseBench, Datalab accurate.** The blog says 92.7 (text 90.8, tables 91.8); the HF card and `results.parquet` give 92.9 (91.2, 92.0); the homepage, with a newer model, gives 93.5.
- **IDP Leaderboard (Nanonets).** For Gemini 3.1 Pro, GPT-5.4 and Nanonets OCR-3, the site's task scores differ from Nanonets' own public raw results.
- **Mistral OCR on olmOCR-Bench.** Mistral reports 85.20 for OCR 4. LightOn's table has Mistral OCR 4.1 at 81.9, and AI2's official table has the 2025 Mistral OCR API at 72.0.

---

The appendices below are the detailed per-benchmark write-ups with full tables and sources.


---

## Appendix A: Part A — olmOCR-Bench, OmniDocBench, CC-OCR, OCRBench v2

Research date: 2026-10-22. Every number below comes from a primary source fetched today; source URLs are given per table. "Self-reported" means the vendor ran its own model, and possibly its competitors. Downloaded copies of all sources are in `scratchpad/research/raw_A/`.

**Family key:** *everyday* = clean or typical pages, text and reading order. *hard* = tables, formulas, bad scans, handwriting, multilingual. *extraction* = key fields or JSON from business documents. *overall* = composite score.

---

### 1. olmOCR-Bench (Allen Institute for AI)

| Item | Detail |
|---|---|
| Runs it | AI2 (allenai/olmocr). AI2 also builds the olmOCR model, so it has a conflict of interest. The official table reproduces most baselines in-house but takes some rows from model authors (marked *). |
| Independence | Semi-independent. AI2 sells nothing, but it competes on the board with its own model. In 2026 the vendors (Datalab, LightOn, INF, rednote) publish the newest numbers themselves. |
| Latest version | Dataset `allenai/olmOCR-bench`. Test data has been frozen since 2025-08-01; the last commit (an eval.yaml) is 2026-02-19 at rev `54a96a6`. The benchmark launched on 2025-05-19. The official results table was last updated 2025-10-23 (olmOCR 2 release); the AI2 cost plot dates from 2025-11-14. |
| Cadence | Ad hoc, tied to AI2 model releases. AI2 has added no new official leaderboard rows since Nov 2025. |
| URL | https://github.com/allenai/olmocr/tree/main/olmocr/bench · https://huggingface.co/datasets/allenai/olmOCR-bench |
| Size (verified by downloading the JSONL) | **1,403 single-page PDFs and 7,010 unit tests**: arXiv math 522 PDFs / 2,927 tests; old scans math 36 / 458; tables 188 / 1,020; old scans 98 / 526; headers and footers 266 / 753; multi-column 231 / 884; long tiny text 62 / 442. The scorer also adds automatic per-page "baseline" tests. Datalab's run counted 8,413 tests in total, including 1,394 baseline tests. |
| Task and metric | PDF to Markdown or plain text. Each test is a binary pass/fail **unit test**: text present, text absent (headers, footers, page numbers), natural reading order between blocks, table cell neighbour relations, and math formulas rendered with KaTeX and compared symbol by symbol. Text matching is fuzzy and Unicode, hyphens and quotes are normalised; Markdown styling is ignored. **Overall = mean of the per-category pass rates** (macro average over document sources), with a bootstrap confidence interval of about ±1. |
| Doc types and languages | Almost all English. Sources are arXiv math papers, Internet Archive math textbooks and dictionaries, Library of Congress letters, and AI2's crawled PDF pool (tables, headers and footers, multi-column). Test cases were partly generated with GPT-4o, Gemini Flash 2 and Claude Sonnet 3.7, then reviewed by hand. |
| Cost data | **Yes.** It is the only benchmark of the four that publishes cost. See the cost table below. |

**Family mapping of categories.** *Everyday*: Base (simple pages, near 100% for everyone), Headers & footers (whether they are stripped), Multi-column (reading order), Long tiny text. *Hard*: ArXiv (math LaTeX), Old scans math, Tables, Old scans (historical typewritten or handwritten letters, the hardest category, about 30–58%). Field extraction is not covered.

#### 1a. Official table (AI2 README / olmOCR 2 paper arXiv 2510.19817, 2025-10-23)
Source: https://github.com/allenai/olmocr/blob/main/olmocr/bench/README.md. AI2 reproduced these results in-house except rows marked *, which model authors reported.

| System | ArXiv | Old scans math | Tables | Old scans | Headers & footers | Multi column | Long tiny text | Base | Overall |
|---|---|---|---|---|---|---|---|---|---|
| Mistral OCR API | 77.2 | 67.5 | 60.6 | 29.3 | 93.6 | 71.3 | 77.1 | 99.4 | 72.0±1.1 |
| Marker 1.10.1 | 83.8 | 66.8 | 72.9 | 33.5 | 86.6 | 80.0 | 85.7 | 99.3 | 76.1±1.1 |
| MinerU 2.5.4* | 76.6 | 54.6 | 84.9 | 33.7 | 96.6 | 78.2 | 83.5 | 93.7 | 75.2±1.1 |
| DeepSeek-OCR | 77.2 | 73.6 | 80.2 | 33.3 | 96.1 | 66.4 | 79.4 | 99.8 | 75.7±1.0 |
| Nanonets-OCR2-3B | 75.4 | 46.1 | 86.8 | 40.9 | 32.1 | 81.9 | 93.0 | 99.6 | 69.5±1.1 |
| PaddleOCR-VL* | 85.7 | 71.0 | 84.1 | 37.8 | 97.0 | 79.9 | 85.7 | 98.5 | 80.0±1.0 |
| Infinity-Parser 7B* | 84.4 | 83.8 | 85.0 | 47.9 | 88.7 | 84.2 | 86.4 | 99.8 | 82.5±? |
| Chandra OCR 0.1.0* | 82.2 | 80.3 | 88.0 | 50.4 | 90.8 | 81.2 | 92.3 | 99.9 | 83.1±0.9 |
| olmOCR v0.4.0 (olmOCR 2) | 83.0 | 82.3 | 84.9 | 47.7 | 96.1 | 83.7 | 81.9 | 99.7 | 82.4±1.1 |
| olmOCR (first release, Feb 2025) | 63.3 | 67.5 | 62.3 | 38.6 | 93.4 | 67.6 | 54.8 | 97.9 | 68.2±1.1 |

The olmOCR 2 paper's overview table also lists overall-only scores: GPT-4o 68.9, Qwen 2 VL 7B 31.5, Gemini Flash 2 57.8, Qwen 2.5 VL 7B 65.5, MinerU 1.3.10 61.5, Nanonets OCR S 64.5, MonkeyOCR Pro 3B 75.8*, Infinity-Parser 7B (Jun 2025) 79.1*, dots.OCR 79.1*.

#### 1b. General-purpose LLMs, from the olmOCR v1 paper (arXiv 2502.18443v3, 2 Jul 2025, run by AI2)
"Anchored" means the model also received text extracted from the PDF's digital layer as a prompt hint.

| System | ArXiv | Old scans math | Tables | Old scans | Headers & footers | Multi column | Long tiny text | Base | Overall |
|---|---|---|---|---|---|---|---|---|---|
| GOT OCR | 52.7 | 52.0 | 0.2 | 22.1 | 93.6 | 42.0 | 29.9 | 94.0 | 48.3±1.1 |
| Marker v1.7.5 | 76.0 | 57.9 | 57.6 | 27.8 | 84.9 | 72.9 | 84.6 | 99.1 | 70.1±1.1 |
| MinerU v1.3.10 | 75.4 | 47.4 | 60.9 | 17.3 | 96.6 | 59.0 | 39.1 | 96.6 | 61.5±1.1 |
| Mistral OCR API | 77.2 | 67.5 | 60.6 | 29.3 | 93.6 | 71.3 | 77.1 | 99.4 | 72.0±1.1 |
| GPT-4o (No Anchor) | 51.5 | 75.5 | 69.1 | 40.9 | 94.2 | 68.9 | 54.1 | 96.7 | 68.9±1.1 |
| GPT-4o (Anchored) | 53.5 | 74.5 | 70.0 | 40.7 | 93.8 | 69.3 | 60.6 | 96.8 | 69.9±1.1 |
| Gemini Flash 2 (No Anchor) | 32.1 | 56.3 | 61.4 | 27.8 | 48.0 | 58.7 | 84.4 | 94.0 | 57.8±1.1 |
| Gemini Flash 2 (Anchored) | 54.5 | 56.1 | 72.1 | 34.2 | 64.7 | 61.5 | 71.5 | 95.6 | 63.8±1.2 |
| Qwen 2 VL (No Anchor) | 19.7 | 31.7 | 24.2 | 17.1 | 88.9 | 8.3 | 6.8 | 55.5 | 31.5±0.9 |
| Qwen 2.5 VL (No Anchor) | 63.1 | 65.7 | 67.3 | 38.6 | 73.6 | 68.3 | 49.1 | 98.3 | 65.5±1.2 |
| olmOCR v0.1.75 (No Anchor) | 71.5 | 71.4 | 71.4 | 42.8 | 94.1 | 77.7 | 71.0 | 97.8 | 74.7±1.1 |
| olmOCR v0.1.75 (Anchored) | 74.9 | 71.2 | 71.0 | 42.2 | 94.5 | 78.3 | 73.3 | 98.3 | 75.5±1.0 |

No Claude, GPT-5.x or Gemini 3 rows appear on any official olmOCR-Bench table. Frontier general-purpose LLMs are essentially absent after GPT-4.1 and Gemini 2.5 Flash, which appear only in the cost plot.

#### 1c. Published cost per page (the main reason this benchmark matters for a cost slide)
**olmOCR v1 paper, cost table (Jul 2025):**

| System | Hardware | Pages/USD | $ per 1M pages | $ per 1k pages |
|---|---|---|---|---|
| GPT-4o | API | 80 | 12,480 | 12.48 |
| GPT-4o | Batch API | 160 | 6,240 | 6.24 |
| Marker v1.7.5 (force OCR) | H100 | 674 | 1,484 | 1.48 |
| Mistral OCR | API | 1,000 | 1,000 | 1.00 |
| MinerU | L40S | 1,678 | 596 | 0.60 |
| Gemini Flash 2 | API | 2,004 | 499 | 0.50 |
| Gemini Flash 2 | Batch API | 4,008 | 249 | 0.25 |
| olmOCR | L40S | 5,697 | 176 | 0.18 |
| olmOCR | H100 | 5,632 | 178 | 0.18 |

**AI2 Pareto plot (README image `ocr_pareto.png`, data in `scripts/plots/pareto_plot.py`, 2025-11-14).** Self-hosted costs are a RunPod GPU-hour price from 3 Nov 2025 (A100 $1.39/h, H100 $2.69/h, L40S $0.79/h) divided by measured pages per second. Commercial costs are API list prices. I recomputed the derived values from the script's formulas.

| System (plot label) | Overall | $ per 1M pages | $ per 1k pages | Basis |
|---|---|---|---|---|
| olmOCR 2 ("Ours") | 82.3 | 164.9 | 0.165 | H100 |
| DeepSeek-OCR | 75.7 | 166.8 | 0.167 | A100, 200k pages/day |
| Qwen 2.5 VL | 64.5 | 164.9 | 0.165 | H100 |
| MinerU 2.5.4 | 75.2 | 182.1 | 0.182 | A100, 2.12 pages/s |
| Qwen 3 VL 8B | 61.4 | 243.4 | 0.243 | scaled from olmOCR |
| PaddleOCR-VL | 80.0 | 315.4 | 0.315 | A100, 1.22 pages/s |
| Gemini Flash 2 | 66.3 | 342 | 0.342 | API |
| Nanonets-OCR2-3B | 69.5 | 702.0 | 0.702 | A100, 0.55 pages/s |
| Mistral OCR | 72.0 | 1,000 | 1.00 | API |
| Gemini Flash 2.5 | 62.1 | 1,042 | 1.04 | API |
| Marker v1.10.1 | 76.1 | 1,492 | 1.49 | prior measurement |
| Chandra OCR API | 83.1 | 4,000 | 4.00 | Datalab API price (tweet) |
| GPT-4.1 | 71.0 | 6,112 | 6.11 | API |
| GPT-4o | 69.9 | 7,951 | 7.95 | API (rescaled from paper) |

The plot's scores differ slightly from the paper tables in places (Gemini Flash 2 is 66.3 in the plot against 57.8/63.8 in the paper; Qwen 2.5 VL is 64.5 against 65.5). The olmOCR README headline is "less than $200 USD per million pages". Hosted olmOCR-2 endpoints cost $0.07–0.10 per 1M input tokens and $0.15–0.20 per 1M output tokens (Cirrascale, DeepInfra, Parasail; README).

#### 1d. 2026 vendor-reported scores (all SELF-REPORTED, none reproduced by AI2)

**Chandra OCR 2 (Datalab), launch release notes, 2026-03-18:** 85.9 overall (ArXiv 90.2, Old scans math 89.3, Tables 89.9, Multi-column 83.5). https://github.com/datalab-to/chandra/releases/tag/v0.2.0

**Datalab Chandra README table** ("Own benchmarks"; scores changed in the 2026-06-26 commit "Adjust scores"): https://github.com/datalab-to/chandra

| System | ArXiv | Old scans math | Tables | Old scans | Headers & footers | Multi column | Long tiny text | Base | Overall | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| Datalab API (hosted) | 90.4 | 90.2 | 90.7 | 54.6 | 91.6 | 83.7 | 92.3 | 99.9 | 86.7±0.8 | Own |
| Chandra 2 | 86.9 | 89.1 | 92.1 | 51.1 | 91.4 | 82.1 | 93.7 | 99.9 | 85.8±0.8 | Own |
| dots.ocr 1.5 | 85.9 | 85.5 | 90.7 | 48.2 | 94.0 | 85.3 | 81.6 | 99.7 | 83.9 | dots repo |
| Chandra 1 | 82.2 | 80.3 | 88.0 | 50.4 | 90.8 | 81.2 | 92.3 | 99.9 | 83.1±0.9 | Own |
| Datalab Marker v1.10.0 | 83.8 | 69.7 | 74.8 | 32.3 | 86.6 | 79.4 | 85.7 | 99.6 | 76.5±1.0 | Own |
| Deepseek OCR | 75.2 | 72.3 | 79.7 | 33.3 | 96.1 | 66.7 | 80.1 | 99.7 | 75.4±1.0 | Own |
| Qwen 3 VL 8B | 70.2 | 75.1 | 45.6 | 37.5 | 89.1 | 62.1 | 43.0 | 94.3 | 64.6±1.1 | Own |

Note that the Chandra 2 per-category values in the README (ArXiv 86.9, Tables 92.1) differ from the launch release notes (ArXiv 90.2, Tables 89.9). The headline moved from 85.9 to 85.8.

**LightOnOCR-3 launch blog (LightOn, 2026-10-08):** https://huggingface.co/blog/lightonai/lightonocr-3. LightOn's own rows use its "PP3" benchmark postprocessing; the other rows are "PP" (postprocessed).

| System | Size (B) | ArXiv | Old scans math | Tables | Old scans | Headers & footers | Multi column | Long tiny text | Base | Overall |
|---|---|---|---|---|---|---|---|---|---|---|
| Infinity Parser Pro (Infinity-Parser2-Pro) | 35.1 | 88.1 | 91.3 | 91.2 | 58.2 | 95.8 | 83.7 | 92.5 | 99.9 | 87.6 |
| LightOnOCR-3-4B | 4.0 | 91.1 | 89.1 | 90.2 | 52.5 | 89.2 | 85.6 | 93.2 | 99.5 | 86.3 |
| Chandra 2 | 4.0 | 86.9 | 89.1 | 92.1 | 51.1 | 91.4 | 82.1 | 93.7 | 99.9 | 85.8 |
| LightOnOCR-3-0.8B | 0.8 | 89.6 | 87.6 | 90.8 | 48.7 | 88.2 | 85.2 | 94.1 | 99.7 | 85.5 |
| LightOnOCR-3-1B | 1.0 | 90.4 | 80.6 | 89.9 | 48.3 | 87.6 | 85.9 | 93.7 | 99.5 | 84.5 |
| dots.mocr | 3.0 | 85.9 | 85.5 | 90.7 | 48.2 | 94.0 | 85.3 | 81.6 | 99.7 | 83.9 |
| jina-ocr-v1 | 3.4 | 86.1 | 82.3 | 88.8 | 42.6 | 88.7 | 85.5 | 93.2 | 99.9 | 83.4 |
| Surya OCR 2 | 0.7 | 88.3 | 81.4 | 86.6 | 41.8 | 92.5 | 82.4 | 93.7 | 99.7 | 83.3 |
| LightOnOCR-2-1B* | 1.0 | 89.6 | 85.6 | 89.0 | 42.2 | 19.7 | 84.8 | 91.4 | 99.6 | 83.2* (excl. H&F) |
| MistralOCR4.1 | -- | 82.6 | 72.3 | 85.9 | 47.9 | 91.4 | 84.5 | 91.2 | 99.5 | 81.9 |

**Raw vs postprocessed overall (LightOn blog figure, transcribed from image):** Chandra 2 85.1 raw → 85.8 PP. LightOnOCR-3-4B 85.0 raw → 86.3 PP3 (Old scans math +7.0). Infinity-Parser2-Pro 85.9 raw → 87.6 PP (Old scans math +7.7). **Benchmark-specific postprocessing alone is worth 0.7–1.7 points, which is larger than the gaps between the top models.**

**Chandra 2.5 blog (Datalab, 2026-10-14; Chandra 2.5 is API-only).** Headers & footers are excluded from these overalls; olmocr 0.4.27, bench rev 54a96a6. https://www.datalab.to/blog/chandra-2-5

| System | Raw | Own postprocessing | With LightOn PP3 |
|---|---|---|---|
| Chandra 2.5 | 85.4 | 86.9 | 87.4 |
| Chandra OCR 2 | 85.1 | 85.8 | 86.2 |
| LightOnOCR-3-4B (Datalab's reproduction; LightOn reports 86.3) | 85.0 | 85.4 | 86.0 |

Datalab states: "We don't think benchmark-specific postprocessing is good practice." The 86.9 figure for Chandra 2.5 is its own-postprocessing score with H&F excluded, not a standard full overall.

**Infinity-Parser2 model card (INF, released 2026-05-11):** Infinity-Parser2-Pro 87.6, Infinity-Parser2-Flash 86.0. The card's comparators are PaddleOCR-VL-1.5 78.5, DeepSeek-OCR-2 76.3 and MinerU2.5 75.2. The card's bar chart (transcribed from image) adds Chandra-OCR-2 85.9, dots.mocr 83.9, LightOnOCR-2 83.2, Infinity-Parser-7B 82.5, olmOCR-2 82.4, Falcon-OCR 80.3, PaddleOCR-VL 80.0, Qianfan-OCR 79.8, GLM-OCR 75.2, FireRed-OCR 70.2 and NanoNets-OCR2-3B 69.5. https://huggingface.co/infly/Infinity-Parser2-Pro

**dots.mocr model card (rednote hi lab, arXiv 2603.13032, Mar 2026):** dots.mocr 83.9±0.9 (85.9 / 85.5 / 90.7 / 48.2 / 94.0 / 85.3 / 81.6 / 99.7). dots.ocr 79.1±1.0. https://huggingface.co/rednote-hilab/dots.mocr

**Unverified:** a web search surfaced an Unsiloed AI claim of 88.0 deterministic and 94.8 with an LLM-judge correction. I could not open the primary post, so it is excluded from the JSON.

#### 1e. Strengths and limitations
- **Strengths:** binary unit tests rather than edit distance, so each failure has a clear explanation. Runs on real PDFs. Decontaminated against olmOCR-mix by URL. Bootstrap confidence intervals. Reproducible open scorer. Publishes cost.
- **Saturation:** the top cluster sits within 2 points (85.8–87.6), and the CIs are about ±0.8–1.1. Datalab's audit "Saturating the olmOCR Benchmark" (2025-11-13, https://www.datalab.to/blog/saturating-the-olmocr-benchmark) re-checked Chandra's failed tests with Gemini and found many were formatting false negatives: 85.5% → 93.9% "corrected". It estimates **3–4% of tests have wrong or opinionated ground truth, so the ceiling is about 96–97%**.
- **Metric gaming:** benchmark-specific postprocessing (LightOn's PP3, Infinity's math rules) adds up to about +1.7 overall and +7–8 on Old scans math. Some vendors drop the Headers & footers category (LightOnOCR-2, Datalab 2026 blog), which rewards *omitting* visible content. Markdown-only table output cannot reach the maximum because some tests need rowspan/colspan.
- **Coverage bias:** mostly English, academic and archival. No invoices, forms or field extraction, and only one handwriting-heavy category (Old scans). Test cases were partly generated by GPT-4o, Gemini and Claude.
- **Self-reporting:** every 2026 headline (Chandra 2, LightOnOCR-3, Infinity-Parser2, dots.mocr) is vendor-run. AI2 has not updated its official table since Nov 2025.

---

### 2. OmniDocBench (OpenDataLab / Shanghai AI Lab)

| Item | Detail |
|---|---|
| Runs it | OpenDataLab (Shanghai AI Laboratory), CVPR 2025. **Conflict:** the same organisation builds MinerU, and MinerU2.5-Pro is #4 on the current board. Many rows come from inference scripts or results contributed by model teams. |
| Latest version | **v1.6** (2026-04-10): adds 296 hard pages and a new MGAM matching algorithm. The README says it moved to **v1.7** on 2026-04-30 (Qianfan-OCR added, "skills-based evaluation"), but the main table caption still reads "v1.6_full". Board last updated **2026-09-11** with TeleOCR, OvisOCR2 and Unlimited-OCR. Earlier versions: v1.0 (Dec 2024), v1.5 (2025-09-25, adds 374 pages). |
| Cadence | Frequent: monthly to quarterly board additions. |
| URL | https://github.com/opendatalab/OmniDocBench · HF `opendatalab/OmniDocBench` |
| Size (verified from the HF `OmniDocBench.json`) | **1,651 pages** in v1.6. Earlier: v1.5 had 1,355 and v1.0 had 981 (1,355 − 374 added in v1.5). |
| Page types (v1.6 counts) | book 276, PPT2PDF slides 253, academic literature 215, exam paper 193, colorful textbook 159, newspaper 151, magazine 149, research or financial report 132, handwritten note 118, historical document 5. The README says "10 document types", the 9 classic ones plus historical. |
| Languages | Simplified Chinese 765, English 755, EN/ZH mixed 116, Traditional Chinese 13, other 2, so roughly a 50/50 Chinese–English benchmark. |
| Metrics | End-to-end page to Markdown. Text: normalised edit distance (lower is better). Formula: CDM (character detection matching; rendering-based, higher is better). Table: TEDS and TEDS-S (structure only). Reading order: edit distance. **Overall = ((1 − TextEdit)×100 + Table TEDS + Formula CDM) / 3.** Reading order is **not** in Overall. It also has component-level layout, OCR, table and formula sub-benchmarks (v1.0 subsets). |
| Cost data | None. |

**Family mapping.** *Everyday*: Text edit distance, Reading-order edit distance. *Hard*: Formula CDM, Table TEDS and TEDS-S (and the page mix includes newspapers, notes and exam papers). *Extraction*: not covered.

#### 2a. Official end-to-end leaderboard, OmniDocBench v1.6_full (README, updated 2026-09-11)
Source: https://github.com/opendatalab/OmniDocBench. Rows are in published order. The published header labels the first two columns "Model Type | Methods", but they actually contain name and type.

| Method | Type | Size | Overall↑ | Text Edit↓ | Formula CDM↑ | Table TEDS↑ | Table TEDS-S↑ | Read Order Edit↓ |
|---|---|---|---|---|---|---|---|---|
| TeleOCR | Specialized VLMs | 1.2B | 96.91 | 0.0267 | 96.5895 | 96.8183 | 98.1806 | 0.1184 |
| OvisOCR2 | Specialized VLMs | 0.8B | 96.47 | 0.0265 | 97.4854 | 94.5842 | 96.9768 | 0.1120 |
| PaddleOCR-VL-1.6 | Specialized VLMs | 0.9B | 96.34 | 0.0326 | 97.5304 | 94.7619 | 97.1002 | 0.1278 |
| MinerU2.5-Pro | Specialized VLMs | 1.2B | 95.75 | 0.036 | 97.45 | 93.42 | 95.92 | 0.120 |
| GLM-OCR | Specialized VLMs | 0.9B | 95.22 | 0.044 | 97.18 | 92.83 | 95.39 | 0.133 |
| PaddleOCR-VL-1.5 | Specialized VLMs | 0.9B | 94.93 | 0.038 | 96.89 | 91.67 | 94.37 | 0.130 |
| PaddleOCR-VL | Specialized VLMs | 0.9B | 94.18 | 0.040 | 95.91 | 90.65 | 93.74 | 0.135 |
| Unlimited-OCR | Specialized VLMs | 3B | 94.00 | 0.0394 | 95.7234 | 90.21 | 93.3565 | 0.1281 |
| Youtu-Parsing | Specialized VLMs | 2.5B | 93.74 | 0.044 | 93.63 | 92.02 | 95.00 | 0.116 |
| Qianfan-OCR | Specialized VLMs | 4B | 93.90 | 0.04 | 95.08 | 90.53 | 93.31 | 0.13 |
| Ovis2.6-30B-A3B | General VLMs | 30B | 93.70 | 0.035 | 95.17 | 89.44 | 92.40 | 0.135 |
| Logics-Parsing-v2 | Specialized VLMs | 4B | 93.33 | 0.041 | 95.65 | 88.42 | 91.98 | 0.137 |
| ABot-OCR | Specialized VLMs | 2B | 93.30 | 0.037 | 94.86 | 88.69 | 91.87 | 0.137 |
| FireRed-OCR | Specialized VLMs | 2B | 93.26 | 0.037 | 95.44 | 88.04 | 91.06 | 0.131 |
| MinerU-2.5 | Specialized VLMs | 1.2B | 93.04 | 0.045 | 95.77 | 87.88 | 91.47 | 0.130 |
| Gemini 3 Pro | General VLMs | - | 92.91 | 0.064 | 95.99 | 89.15 | 92.96 | 0.165 |
| Gemini 3 Flash | General VLMs | - | 92.62 | 0.066 | 95.16 | 89.29 | 93.51 | 0.172 |
| dots.ocr | Specialized VLMs | 3B | 90.77 | 0.048 | 89.95 | 87.18 | 90.58 | 0.138 |
| OpenDoc-0.1B | Specialized VLMs | 0.1B | 90.67 | 0.049 | 93.02 | 83.88 | 87.45 | 0.140 |
| DeepSeek-OCR 2 | Specialized VLMs | 3B | 90.25 | 0.050 | 91.84 | 83.89 | 87.75 | 0.144 |
| HunyuanOCR | Specialized VLMs | 1B | 89.95 | 0.088 | 87.68 | 91.01 | 93.23 | 0.171 |
| Qwen3-VL-235B | General VLMs | 235B | 89.78 | 0.063 | 92.55 | 83.07 | 86.75 | 0.166 |
| Dolphin-v2 | Specialized VLMs | 3B | 89.50 | 0.069 | 91.01 | 84.40 | 87.44 | 0.150 |
| OCRVerse | Specialized VLMs | 4B | 88.60 | 0.063 | 89.61 | 82.44 | 86.27 | 0.163 |
| MonkeyOCR-pro-3B | Specialized VLMs | 3B | 88.57 | 0.074 | 88.74 | 84.35 | 88.62 | 0.189 |
| GPT-5.2 | General VLMs | - | 86.59 | 0.114 | 88.21 | 82.95 | 87.93 | 0.193 |
| Dolphin-1.5 | Specialized VLMs | 0.3B | 86.52 | 0.094 | 87.49 | 81.43 | 84.82 | 0.167 |
| MinerU-Pipeline | Pipeline Tools | - | 86.47 | 0.055 | 83.07 | 81.88 | 88.68 | 0.153 |
| olmOCR | Specialized VLMs | 7B | 85.74 | 0.139 | 88.10 | 83.00 | 87.17 | 0.216 |
| Mistral OCR | Specialized VLMs | - | 85.66 | 0.097 | 89.91 | 76.78 | 80.93 | 0.171 |
| Kimi K2.5 | General VLMs | 1T | 84.53 | 0.107 | 83.50 | 80.76 | 84.00 | 0.211 |
| InternVL3.5-241B | General VLMs | 241B | 83.76 | 0.130 | 89.95 | 74.35 | 79.78 | 0.215 |
| Nanonets-OCR-s | Specialized VLMs | 3B | 83.61 | 0.108 | 81.46 | 80.18 | 84.51 | 0.213 |
| POINTS-Reader | Specialized VLMs | 3B | 83.37 | 0.096 | 85.72 | 73.98 | 77.40 | 0.198 |
| Marker | Pipeline Tools | - | 78.44 | 0.157 | 85.24 | 65.77 | 73.24 | 0.243 |

#### 2b. Official v1.5 leaderboard (frozen `v1_5` branch, last commit 2026-04-10)
Source: https://github.com/opendatalab/OmniDocBench/tree/v1_5. This version is still the one most cited in vendor model cards. Its reading-order numbers are on a different scale from v1.6.

| Method | Type | Size | Overall↑ | Text Edit↓ | Formula CDM↑ | Table TEDS↑ | Table TEDS-S↑ | Read Order Edit↓ |
|---|---|---|---|---|---|---|---|---|
| PaddleOCR-VL-1.5 | SpecializedVLMs | 0.9B | 94.50 | 0.035 | 94.21 | 92.76 | 95.79 | 0.042 |
| GLM-OCR | SpecializedVLMs | 0.9B | 94.35 | 0.045 | 93.65 | 93.89 | 96.50 | 0.047 |
| Youtu-Parsing | SpecializedVLMs | 2.5B | 93.37 | 0.042 | 91.22 | 93.10 | 96.47 | 0.026 |
| PaddleOCR-VL | SpecializedVLMs | 0.9B | 92.86 | 0.035 | 91.22 | 90.89 | 94.76 | 0.043 |
| Logics-Parsing-v2 | SpecializedVLMs | 4B | 92.56 | 0.043 | 91.41 | 90.54 | 93.85 | 0.044 |
| FireRed-OCR | SpecializedVLMs | 2B | 92.07 | 0.035 | 90.98 | 88.72 | 92.38 | 0.041 |
| MinerU2.5 | SpecializedVLMs | 1.2B | 90.93 | 0.045 | 88.86 | 88.44 | 92.42 | 0.044 |
| HunyuanOCR | SpecializedVLMs | 1B | 90.57 | 0.085 | 86.01 | 94.19 | 95.96 | 0.082 |
| OpenDoc | SpecializedVLMs | 0.1B | 90.57 | 0.043 | 87.70 | 88.30 | 92.24 | 0.050 |
| FD-RL | SpecializedVLMs | 4B | 90.20 | 0.053 | 88.52 | 87.43 | 92.19 | 0.063 |
| DeepSeek-OCR-2 | SpecializedVLMs | 3B | 89.17 | 0.049 | 86.85 | 85.60 | 90.06 | 0.060 |
| MonkeyOCR-pro-3B | SpecializedVLMs | 3B | 88.85 | 0.075 | 87.25 | 86.78 | 90.63 | 0.128 |
| Dolphin-v2 | SpecializedVLMs | 3B | 88.71 | 0.073 | 87.26 | 86.20 | 89.77 | 0.064 |
| OCRVerse | SpecializedVLMs | 4B | 88.55 | 0.058 | 86.91 | 84.55 | 88.45 | 0.071 |
| dots.ocr | SpecializedVLMs | 3B | 88.41 | 0.048 | 83.22 | 86.78 | 90.62 | 0.053 |
| MonkeyOCR-3B | SpecializedVLMs | 3B | 87.13 | 0.075 | 87.45 | 81.39 | 85.92 | 0.129 |
| Deepseek-OCR | SpecializedVLMs | 3B | 87.01 | 0.073 | 83.37 | 84.97 | 88.80 | 0.086 |
| MonkeyOCR-pro-1.2B | SpecializedVLMs | 1.2B | 86.96 | 0.084 | 85.02 | 84.24 | 89.02 | 0.130 |
| Nanonets-OCR-s | SpecializedVLMs | 3B | 85.59 | 0.093 | 85.90 | 80.14 | 85.57 | 0.108 |
| MinerU2-VLM | SpecializedVLMs | 0.9B | 85.56 | 0.078 | 80.95 | 83.54 | 87.66 | 0.086 |
| Dolphin-1.5 | SpecializedVLMs | 0.3B | 85.07 | 0.095 | 81.10 | 83.63 | 87.27 | 0.082 |
| olmOCR | SpecializedVLMs | 7B | 81.79 | 0.096 | 86.04 | 68.92 | 74.77 | 0.121 |
| POINTS-Reader | SpecializedVLMs | 3B | 80.98 | 0.134 | 79.20 | 77.13 | 81.66 | 0.145 |
| Mistral OCR | SpecializedVLMs | - | 78.83 | 0.164 | 82.84 | 70.03 | 78.04 | 0.144 |
| OCRFlux | SpecializedVLMs | 3B | 74.82 | 0.193 | 68.03 | 75.75 | 80.23 | 0.202 |
| Dolphin | SpecializedVLMs | 0.3B | 74.67 | 0.125 | 67.85 | 68.70 | 77.77 | 0.124 |
| Ovis2.6-30B-A3B | GeneralVLMs | 30B | 92.36 | 0.037 | 90.32 | 90.46 | 94.00 | 0.046 |
| Gemini-3 Flash | GeneralVLMs | - | 90.37 | 0.065 | 89.56 | 88.01 | 93.79 | 0.071 |
| Gemini-3 Pro | GeneralVLMs | - | 90.17 | 0.062 | 88.79 | 87.83 | 93.32 | 0.074 |
| Kimi K2.5 | GeneralVLMs | 1T | 89.33 | 0.065 | 86.92 | 87.57 | 91.82 | 0.084 |
| Qwen3-VL-235B | GeneralVLMs | 235B | 89.15 | 0.069 | 88.14 | 86.21 | 90.55 | 0.068 |
| Gemini-2.5 Pro | GeneralVLMs | - | 88.03 | 0.075 | 85.82 | 85.71 | 90.29 | 0.097 |
| Qwen2.5-VL | GeneralVLMs | 72B | 87.02 | 0.094 | 88.27 | 82.15 | 86.22 | 0.102 |
| GPT5.2 | GeneralVLMs | - | 85.75 | 0.124 | 86.93 | 82.76 | 88.25 | 0.106 |
| InternVL3.5 | GeneralVLMs | 241B | 82.67 | 0.142 | 87.23 | 75.00 | 81.28 | 0.125 |
| InternVL3 | GeneralVLMs | 78B | 80.33 | 0.131 | 83.42 | 70.64 | 77.74 | 0.113 |
| GPT-4o | GeneralVLMs | - | 75.02 | 0.217 | 79.70 | 67.07 | 76.09 | 0.148 |
| PP-StructureV3 | PipelineTools | - | 86.73 | 0.073 | 85.79 | 81.68 | 89.48 | 0.073 |
| Mathpix | PipelineTools | - | 80.11 | 0.168 | 84.75 | 72.43 | 79.25 | 0.165 |
| Mineru2-pipeline | PipelineTools | - | 75.51 | 0.209 | 76.55 | 70.90 | 79.11 | 0.225 |
| Marker-1.8.2 | PipelineTools | - | 71.30 | 0.206 | 76.66 | 57.88 | 71.17 | 0.250 |

#### 2c. Vendor-reported OmniDocBench numbers (SELF-REPORTED)
- **Infinity-Parser2 card (v1.6, 2026-05):** Infinity-Parser2-Pro 93.95, Flash 91.98. Comparators as compiled by INF: PaddleOCR-VL-1.5 94.87, DeepSeek-OCR-2 90.17, MinerU2.5 92.98, Gemini-3-Pro 92.85. Infinity-Parser2 is **not** on the official board.
- **Qwen3.5 / 3.6 cards ("OmniDocBench1.5", 2026-02 and 2026-04):** Qwen3.5-397B-A17B 90.8; Qwen3.6-35B-A3B 89.9; Qwen3.5-122B-A10B 89.8; Qwen3.5-35B-A3B 89.3; Qwen3.5-27B 88.9. Comparators as run by Qwen: K2.5 88.8, Gemini-3 Pro 88.5, Claude 4.5 Opus 87.7, Claude-Sonnet-4.5 85.8, GPT5.2 85.7, Qwen3-VL-235B 84.5, Gemma4-31B 80.1, GPT-5-mini 77.0, Gemma4-26BA4B 74.4. **These do not match the official v1.5 board** (Gemini-3 Pro official 90.17, Qwen3-VL-235B official 89.15, GPT5.2 85.75, Kimi K2.5 89.33), which suggests a different prompt or protocol. Claude models appear only in these vendor-run tables, never on the official board.
- **dots.mocr card (v1.5):** Text Edit 0.031, Reading Order Edit 0.029, the best values in its own table.
- **MinerU2.5-Pro card:** "SOTA overall 95.69" on v1.6 (2604 version). The official board shows 95.75. Same organisation as the benchmark.

#### 2d. Strengths and limitations
- **Strengths:** the broadest page-type mix of the four, including slides, newspapers, exam papers and handwritten notes. Rich block, span and attribute annotations allow slicing by layout, language, watermark or blur. Separate text, table, formula and reading-order metrics. Active maintenance, Docker and EvalScope support.
- **Limitations:** edit-distance and TEDS metrics penalise legitimate formatting variants (LaTeX vs Unicode, HTML vs Markdown tables). v1.5 and v1.6 added hybrid and MGAM matching to soften this. **Saturating fast:** the top three are at 96.3–96.9 overall, and the top 15 are within 4 points on v1.6. Version churn (v1.0 → 1.5 → 1.6 → 1.7 in 13 months) means cross-version numbers are not comparable, and vendors cherry-pick versions. About 50% Chinese content: good for global coverage, but a different mix from an English-only enterprise corpus. Many top models are Chinese specialised VLMs trained on similar data, so contamination risk is non-trivial (the pages are public). The board is maintained by MinerU's developer. Reading order is excluded from Overall. No cost or latency data.

---

### 3. CC-OCR (Alibaba Qwen / DAMO team with SCUT)

| Item | Detail |
|---|---|
| Runs it | Alibaba (Qwen team; authors include Junyang Lin and Shuai Bai) with SCUT. Paper arXiv 2412.02210 (v3, 10 Dec 2024). **Conflict:** Qwen models are evaluated, and the benchmark is now mostly cited inside Qwen model cards. |
| Latest version | v1, released 2024-12-26. The leaderboard was tested around 2024-11-20 and **has never been updated**. The only later change is an updated table-extraction evaluator (2025-04-09). Available in VLMEvalKit. |
| URL | https://github.com/AlibabaResearch/AdvancedLiterateMachinery/tree/main/Benchmarks/CC-OCR · HF `wulipc/CC-OCR` |
| Size | 7,058 images in 39 subsets, 41% from real applications and released for the first time. 10 languages (en, zh plus 8 others for multilingual). |
| Tracks and metrics | (1) **Multi-scene text reading**: 13 subsets, natural scene, document, handwriting and UGC, scored by word or character Eval-Trans. (2) **Multilingual text reading**: 10 languages at 150 images each. (3) **Document parsing**: 800 images (docs scan/photo en/zh 300, tables 300, handwritten math plus molecular formulas 200), scored by 1 − NED for text and formulas and TEDS for tables. (4) **KIE**: 2,008 images (SROIE, CORD, EPHOIE, POIE, SOLD-SIBR, SOLD-HUST-CELL), field-level F1 for JSON output. Total = mean of the 4 tracks. |
| Family | Multi-scene → everyday (but not document-specific). Multilingual → hard. Doc parsing → hard. **KIE → extraction, one of the few public extraction scores on these four benchmarks.** |
| Cost data | None. |

#### 3a. Official leaderboard (README; tests around 2024-11-20)
| Model | Multi-Scene Text Reading | Multilingual Text Reading | Document Parsing | Key Info Extraction (F1) | Total |
|---|---|---|---|---|---|
| Gemini-1.5-pro | 83.25 | 78.97 | 62.37 | 67.28 | 72.97 |
| Qwen-VL-72B (README footnote: Qwen-VL-Max-2024-08-09) | 77.95 | 71.14 | 53.78 | 71.76 | 68.66 |
| GPT-4o (2024-08-06) | 76.4 | 73.44 | 53.3 | 63.45 | 66.65 |
| Claude3.5-sonnet (20241022) | 72.87 | 65.68 | 47.79 | 64.58 | 62.73 |
| InternVL2-76B | 76.92 | 46.57 | 35.33 | 61.6 | 55.11 |
| GOT | 61.0 | 24.95 | 39.18 | 0.0 | 31.28 |
| Florence | 49.24 | 49.7 | 0.0 | 0.0 | 24.74 |
| KOSMOS2.5 | 47.55 | 36.23 | 0.0 | 0.0 | 20.95 |
| TextMonkey | 56.88 | 0.0 | 0.0 | 0.0 | 14.22 |

**Paper sub-tables.** Document parsing: Gemini-1.5-Pro 62.37 (doc scan en 64.69, zh 66.01; table scan en 80.99; handwritten math 27.17; molecular 56.14). KIE by dataset, for Qwen2-VL-72B (paper naming): SROIE 75.50, CORD 69.02, EPHOIE 69.98, POIE 62.47, SOLD-SIBR 72.43, SOLD-HUST-CELL 81.17 (total 71.76). For GPT-4o: SROIE 72.55, CORD 81.26, EPHOIE 44.12. The paper notes that the best KIE F1 is "only 71.76%". Other findings: multi-oriented text drops scores by 19–39 points (Gemini by only 3.8), and the repetition-hallucination rate is up to 5.9% for InternVL2.

#### 3b. 2026 vendor-reported CC-OCR totals (SELF-REPORTED in Qwen model cards; overall only)
| System | CC-OCR total | Source card |
|---|---|---|
| Qwen3.5-397B-A17B | 82.0 | Qwen3.5-397B-A17B (2026-02) |
| Qwen3.6-35B-A3B | 81.9 | Qwen3.6-27B card (2026-04) |
| Qwen3.5-122B-A10B | 81.8 | Qwen3.5-27B card |
| Qwen3-VL-235B-A22B | 81.5 | Qwen3.5 cards |
| Qwen3.6-27B | 81.2 | Qwen3.6-27B card |
| Qwen3.5-27B | 81.0 | Qwen3.5-27B card |
| Qwen3.5-35B-A3B | 80.7 | Qwen3.5-27B card |
| Kimi K2.5 | 79.7 | Qwen3.5-397B card |
| Gemini-3 Pro | 79.0 | Qwen3.5-397B card |
| Claude 4.5 Opus | 76.9 | Qwen3.5-397B card |
| Gemma4-31B | 75.7 | Qwen3.6-27B card |
| Gemma4-26BA4B | 74.5 | Qwen3.6-35B-A3B card |
| GPT-5-mini (2025-08-07) | 70.8 | Qwen3.5-27B card |
| GPT5.2 | 70.3 | Qwen3.5-397B card |
| Claude-Sonnet-4.5 | 68.1 | Qwen3.5-27B card |

#### 3c. Strengths and limitations
- **Strengths:** the only benchmark of the four with a dedicated **KIE / JSON field-extraction** track scored by field F1. It includes photographed docs, handwriting, multilingual text and molecular formulas, and tests grounding and robustness (orientation, repetition).
- **Limitations:** an abandoned official leaderboard (2024 models only). Current numbers are **benchmark-owner self-reports** (Qwen tops every Qwen card). The document-parsing track is small (800 images) and edit-distance based. KIE uses public academic sets (SROIE and CORD are receipts from 2019–2021) that are likely in pretraining data, so contamination risk is high. Only total scores are published for 2026 models, with no per-track breakdown. No cost data. Chinese-heavy subsets.

---

### 4. OCRBench v2 (HUST, Yuliang Liu / Xiang Bai group, with SCUT, Adelaide, ByteDance)

| Item | Detail |
|---|---|
| Runs it | Academic group at Huazhong University of Science and Technology (same lab as OCRBench v1 and MDPBench). Independent of the model vendors it ranks (though ByteDance co-authored the paper). NeurIPS 2025 Datasets & Benchmarks. |
| Latest version | Paper arXiv 2501.00321 (Dec 2024). **Private test set (1,500 manually annotated images) released 2025-06-21**, with quarterly private leaderboards: 2025.06, 2025.09, 2026.03, 2026.06 and the **latest, 2026.09**. Later rounds carry over the best models from previous rounds. |
| URL | https://99franklin.github.io/ocrbench_v2/ (private), https://huggingface.co/spaces/ling99/OCRBench-v2-leaderboard (public split, last updated 2025-06), https://github.com/Yuliang-Liu/MultimodalOCR |
| Size and scope | Public: 10,000 human-verified QA pairs, 31 scenarios (street scenes, receipts, formulas, diagrams, documents...), 23 tasks in 8 capabilities. Private: 1,500 images. English and Chinese boards are separate. |
| Tracks | EN: Recognition, Referring, Spotting, Extraction, Parsing, Calculation, Understanding, Reasoning. ZH: Recognition, Extraction, Parsing, Understanding, Reasoning. |
| Document-relevant tracks | **Recognition** (everyday text reading). **Extraction** (key information or relation extraction from receipts, forms and docs; the *extraction* family). **Parsing** (element parsing of tables, charts, formulas and full documents; the *hard* family, where everyone scores only 9–49). Referring and Spotting (localisation), Calculation, Understanding and Reasoning (VQA) are less relevant to extraction pipelines. |
| Systems covered | General LMMs and some closed OCR APIs. **Specialised doc parsers (MinerU, PaddleOCR-VL, Chandra, olmOCR) are not on it.** |
| Cost data | None. |

#### 4a. OCRBench v2 private leaderboard 2026.09, English
Source: https://99franklin.github.io/ocrbench_v2/

| Rank | Method | Venue | Open-source | LLM Size | Average | Recognition | Referring | Spotting | Extraction | Parsing | Calculation | Understanding | Reasoning |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | SEEU DOC | - | No | - | 76.2 | 77.9 | 67.1 | 80.6 | 93.8 | 42.4 | 89.9 | 83.1 | 74.6 |
| 2 | Yaochi-DTS-A2T-1.9 | - | No | - | 73.4 | 74.7 | 68.0 | 68.1 | 93.5 | 40.9 | 94.2 | 84.7 | 62.8 |
| 3 | U2-OCR | - | No | - | 71.7 | 71.5 | 69.7 | 81.4 | 91.7 | 40.0 | 77.6 | 84.4 | 57.4 |
| 4 | Posicube_DVLM | - | No | - | 69.8 | 74.2 | 63.3 | 70.9 | 92.2 | 26.3 | 93.2 | 81.0 | 57.5 |
| 5 | Qwen3.6-27B | — | Yes | 27B | 68.3 | 71.1 | 58.4 | 74.3 | 92.8 | 26.4 | 81.9 | 83.5 | 57.9 |
| 6 | KDL Frontier | - | No | - | 68.1 | 70.3 | 60.8 | 67.2 | 92.2 | 40.7 | 73.1 | 85.4 | 54.9 |
| 7 | NVIDIA Nemotron 3.5 Super VL | Hugging Face | Yes | 120B A 12B | 67.4 | 74.0 | 61.0 | 63.2 | 92.2 | 26.3 | 87.9 | 80.5 | 54.0 |
| 8 | NVIDIA Nemotron 3 Nano Omni 30B A3B | Hugging Face | Yes | 30B A 3B | 65.8 | 70.5 | 56.2 | 54.2 | 93.3 | 26.3 | 86.9 | 82.0 | 57.1 |
| 9 | Qwen3.6-35B-A3B | - | Yes | 35B A 3B | 65.5 | 74.9 | 62.8 | 58.9 | 91.5 | 23.2 | 78.0 | 80.2 | 54.8 |
| 10 | Qwen3.5-35B-A3B | - | Yes | 35B A 3B | 65.3 | 69.8 | 65.2 | 58.6 | 90.5 | 24.9 | 74.4 | 84.1 | 55.3 |
| 11 | Qwen3.8-27B | — | Yes | 27B | 63.5 | 75.5 | 55.6 | 61.7 | 90.4 | 24.8 | 67.9 | 81.1 | 50.9 |
| 12 | Gemini 3 Pro Preview | - | No | - | 63.4 | 68.5 | 65.9 | 80.8 | 93.9 | 27.1 | 49.7 | 77.8 | 43.5 |
| 13 | Seed1.6-vision | - | No | - | 62.2 | 70.1 | 59.8 | 38.0 | 89.0 | 22.3 | 84 | 76.4 | 58.0 |
| 14 | TeleMM-2.0 | - | No | - | 61.8 | 76.4 | 68.1 | 30.0 | 92.8 | 40.9 | 58.1 | 80.0 | 48.0 |
| 15 | Qwen3-Omni-30B-A3B-Instruct | Arxiv 2025 | Yes | 30B A 3B | 61.3 | 72.3 | 62.0 | 45.6 | 93.5 | 20.8 | 67.0 | 74.1 | 55.3 |
| 16 | Nemotron Nano V2 VL | - | Yes | 12B | 61.2 | 67.6 | 54.5 | 36.2 | 92.0 | 26.6 | 80.4 | 75.5 | 57.0 |
| 17 | SenseNova-U1.5-8B-MoT | — | Yes | 8B | 59.9 | 62.7 | 55.8 | 66.2 | 81.2 | 26.9 | 61.1 | 74.3 | 51.0 |
| 18 | Gemini-2.5-Pro | - | No | - | 59.3 | 70.9 | 45.8 | 13.4 | 93.7 | 26.9 | 84.6 | 75.8 | 63.0 |
| 19 | GLM-4.6V-Flash | - | Yes | 9B | 59.0 | 75.3 | 52.5 | 11.3 | 88.5 | 15.2 | 90.4 | 79.8 | 59.0 |
| 20 | Qwen3.5-9B | - | Yes | 9B | 58.7 | 72.4 | 52.1 | 41.8 | 91.1 | 18.7 | 67.5 | 79.7 | 46.0 |
| 21 | SenseNova-U1 | Arxiv 2026 | Yes | 18B | 58.2 | 57.5 | 54.7 | 65.8 | 80.5 | 30.3 | 56.4 | 72.3 | 48.3 |
| 22 | Muse-Glimmer-30B | — | Yes | 30B | 56.9 | 66.6 | 44.3 | 13.2 | 94.3 | 24.5 | 76.9 | 68.1 | 67.0 |
| 23 | Llama-3.1-Nemotron-Nano-VL-8B-V1 | - | Yes | 8B | 56.4 | 62.9 | 61.3 | 68.6 | 88.2 | 10.0 | 44.1 | 75.3 | 41.0 |
| 24 | GPT5-2025-08-07 | - | No | - | 55.5 | 69.3 | 28.2 | 6.5 | 90.1 | 24.8 | 83.7 | 76.4 | 65.4 |
| 25 | LFM2.5-VL-3B | — | Yes | 3B | 42.6 | 63.8 | 27.4 | 0.0 | 86.3 | 21.3 | 30.5 | 71.9 | 39.6 |

#### 4b. OCRBench v2 private leaderboard 2026.09, Chinese
| Rank | Method | Venue | Open-source | LLM Size | Average | Recognition | Extraction | Parsing | Understanding | Reasoning |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | U2-OCR | - | No | - | 66.7 | 73.3 | 81.3 | 42.9 | 90.0 | 45.9 |
| 2 | TeleMM-2.0 | - | No | - | 66.2 | 69.9 | 81.1 | 37.6 | 96.0 | 46.7 |
| 3 | Qwen3.5-9B | - | Yes | 9B | 64.1 | 66.7 | 81.7 | 32.7 | 92.0 | 47.3 |
| 4 | Yaochi-DTS-A2T-1.9 | - | No | - | 63.8 | 72.3 | 86.5 | 34.8 | 84.0 | 41.5 |
| 4 | Gemini 3 Pro Preview | - | No | - | 63.8 | 69.9 | 79.7 | 34.5 | 94.0 | 40.6 |
| 6 | Gemini-2.5-Pro | - | No | - | 62.2 | 72.0 | 74.0 | 35.2 | 90.0 | 39.7 |
| 7 | Posicube_DVLM | - | No | - | 62.1 | 71.5 | 83.0 | 30.2 | 88.0 | 37.9 |
| 8 | SEEU DOC | - | No | - | 61.9 | 73.1 | 84.1 | 19.3 | 84.0 | 48.9 |
| 9 | Qwen3.5-35B-A3B | - | Yes | 35B A 3B | 61.7 | 72.6 | 81.0 | 26.4 | 88.0 | 40.3 |
| 10 | MiniCPM-o-4.5 | - | Yes | - | 61.5 | 65.0 | 66.1 | 48.8 | 94.0 | 33.4 |
| 11 | KDL Frontier | - | No | - | 61.2 | 68.2 | 79.5 | 26.9 | 88.0 | 43.3 |
| 12 | Qwen3.6-35B-A3B | - | Yes | 35B A 3B | 60.8 | 72.5 | 83.8 | 22.8 | 84.0 | 40.7 |
| 13 | Seed1.6-vision | - | No | - | 60.5 | 68.1 | 74.1 | 34.0 | 80.0 | 46.6 |
| 14 | Qwen3-Omni-30B-A3B-Instruct | Arxiv 2025 | Yes | 30B A 3B | 60.0 | 71.0 | 80.3 | 9.7 | 92.0 | 47.0 |
| 15 | Claude Opus 4.6 | - | No | - | 59.8 | 64.0 | 74.0 | 31.7 | 90.0 | 39.4 |
| 16 | GLM-4.6V-Flash | - | Yes | 9B | 59.5 | 61.1 | 80.0 | 28.7 | 90.0 | 37.8 |
| 17 | NVIDIA Nemotron 3 Nano Omni 30B A3B | Hugging Face | Yes | 30B A 3B | 59.0 | 71.7 | 79.1 | 34.3 | 76.0 | 33.9 |
| 18 | MiniCPM-V-4.5-8B | Arxiv 2025 | Yes | 8B | 58.8 | 70.1 | 70.1 | 32.5 | 92.0 | 29.4 |
| 19 | Qwen3.6-27B | — | Yes | 27B | 58.7 | 70.5 | 82.3 | 8.8 | 88.0 | 43.9 |
| 20 | Qwen3.8-27B | — | Yes | 27B | 56.9 | 70.0 | 83.9 | 10.4 | 82.0 | 38.0 |
| 21 | Muse-Glimmer-30B | — | Yes | 30B | 56.8 | 48.1 | 79.4 | 21.0 | 90.0 | 45.7 |
| 22 | NVIDIA Nemotron 3.5 Super VL | Hugging Face | Yes | 120B A 12B | 56.6 | 73.6 | 75.6 | 20.7 | 74.0 | 39.0 |
| 23 | SenseNova-U1.5-8B-MoT | — | Yes | 8B | 52.0 | 47.3 | 74.6 | 15.6 | 82.0 | 40.5 |
| 24 | LFM2.5-VL-3B | — | Yes | 3B | 37.9 | 56.7 | 45.0 | 12.0 | 58.0 | 17.9 |

**Public split (HF space, last updated 2025-06; stale):** EN top: Llama Nemotron Nano VL 8B 60.2, InternVL-3-14B 52.6, Gemini-Pro 51.9, Qwen2-VL-7B 51.4. CN top: InternVL3-14B 55.7, Qwen2.5-VL-7B 55.6.

Note: Qwen model cards report "OCRBench" scores of 86–93 (e.g. Qwen3.5-397B 93.1). That is **OCRBench v1**, a different and saturated benchmark scored out of 100 (originally /1000). Do not confuse it with v2.

#### 4c. Strengths and limitations
- **Strengths:** independent academic maintainer. The **private held-out set** is the best contamination defence among the four. Quarterly cadence. Bilingual. Covers extraction, parsing and grounding in one place. Far from saturated: the best EN average is 76.2 and Parsing tops out at 42–49.
- **Limitations:** it is a VQA-style LMM benchmark, not a page-to-Markdown parsing benchmark, so parsing and extraction scores are small subsets of a broad average. Several leaders are opaque closed entries (SEEU DOC, Yaochi-DTS, U2-OCR, Posicube_DVLM, KDL Frontier) with no paper or URL. Frontier commercial LLMs are sparsely covered (GPT-5 from Aug 2025 and Gemini 3 Pro Preview; Claude Opus 4.6 appears on the ZH board only). Prompt-format sensitivity is high: the maintainers note that Qwen2.5-VL spotting jumps to 51.6 with a model-specific prompt. No cost data.

---

### 5. Cross-benchmark takeaways (for the deck)
1. **Who leads (Oct 2026).** olmOCR-Bench: Infinity-Parser2-Pro 87.6 and LightOnOCR-3-4B 86.3 (both self-reported with postprocessing). The Datalab API reaches 86.7 and the API-only Chandra 2.5 reaches 87.4 with H&F excluded and PP3. The best AI2-verified score is still Chandra 1 at 83.1 (author-reported) or olmOCR 2 at 82.4. OmniDocBench v1.6: TeleOCR 96.91, OvisOCR2 96.47, PaddleOCR-VL-1.6 96.34, MinerU2.5-Pro 95.75. The best general VLM there is Ovis2.6-30B-A3B at 93.70 (#11), and the best frontier commercial LLM is Gemini 3 Pro at 92.91 (#16). OCRBench v2 (private): SEEU DOC 76.2 EN, U2-OCR 66.7 ZH. The best open model is Qwen3.6-27B at 68.3 EN. CC-OCR: Qwen3.5-397B 82.0 (self-reported). The official board's Gemini-1.5-pro 72.97 dates from 2024.
2. **Small specialised models now beat frontier LLMs on parsing.** 0.8–4B OCR VLMs top olmOCR-Bench and OmniDocBench. GPT-5.2 (86.59) and Kimi K2.5 rank in the bottom half on OmniDocBench v1.6. On olmOCR-Bench, GPT-4o/4.1 scored 69–71 at roughly 35–70× the per-page cost of olmOCR 2 (AI2 figures).
3. **Saturation.** olmOCR-Bench's top models are within about 2 points, close to the estimated 96–97% label-noise ceiling once formatting false negatives are forgiven. OmniDocBench's top models are at about 96–97. OCRBench v2 parsing (under 50) and CC-OCR KIE (about 72 F1 in 2024) are not saturated.
4. **Postprocessing and protocol matter more than model gaps.** +0.7 to +1.7 points on olmOCR overall from benchmark-specific postprocessing. Categories are dropped (H&F). Qwen's "OmniDocBench1.5" Gemini-3 Pro score of 88.5 conflicts with the official 90.17.
5. **Field extraction is the gap.** Only CC-OCR KIE (2024, self-reported since) and OCRBench v2 Extraction (private, LMM-only) measure it. Neither covers invoices or contracts at enterprise scale.
6. **Cost.** Only olmOCR publishes $/page. It ranges from $0.17–0.32 per 1k pages for self-hosted small VLMs, through about $1/1k for Mistral OCR and $4/1k for the Chandra API, to $6–12/1k for GPT-4.1 or GPT-4o.

---

## Appendix B: Part B: vendor-run document-extraction benchmarks and list prices

Researched 2026-10-22. Every number below comes from a primary page fetched that day. Where a table exists only as an image, I downloaded the image, read it, and marked the values "transcribed from image". Downloads are in `research/raw_B/`. Machine-readable rows are in `parts/B.json` (488 rows, validated with `python3 -m json.tool`).

**Read this first.** Every benchmark in this part is run, commissioned or re-run by a vendor, and in every case the publisher's own system comes first. Treat them as claims you can reproduce, not as independent rankings. Three patterns repeat throughout:

1. **The publisher wins its own benchmark.** Reducto wins RD-TableBench and LongExtractionBench. Pulse wins its RD-TableBench re-run. Datalab wins its LongExtractionBench re-run and OmniExtractBench. Extend wins LongArray-Extract and RealDoc-Bench. Mistral wins every Mistral chart. Unstructured wins SCORE-Bench. LandingAI reports 99.16% on DocVQA.
2. **Publishers pick metrics that favour them.** Reducto leads with recall and Datalab with recall plus precision. Unstructured chose "tokens added" and LandingAI chose parse-then-answer QA. Accuracy measured only on completed documents is common, so coverage has to be read alongside it.
3. **Saturation.** Leaders now sit at 97–99.6% on LongExtractionBench, LongArray-Extract and DocVQA-parse, so gaps between leaders are within the noise of a single run. Datalab's own critique says a leader scoring 99%+ is "a red flag".

Family key: **everyday** = clean or typical pages, text and reading order; **hard** = complex tables, scans, handwriting, formulas; **extraction** = structured fields or JSON from business documents; **overall** = an aggregate or preference score.

---

### 1. RD-TableBench (Reducto). Family: hard (complex tables)

| | |
|---|---|
| Run by | Reducto. Vendor-run, and Reducto is the winner |
| Released | 2024-11-04 (blog: https://reducto.ai/blog/rd-tablebench, results: https://reducto.ai/blog/sota-table-parsing) |
| Data | 1,000 table images from public documents, annotated by "PhD-level" labellers. Includes scans, handwriting, merged cells and multiple languages: 461 English, then ru 84, de 83, es 64, fr 58, ja 47, zh 39 and others (counted from the public `scores.csv`). HF `reducto/rd-tablebench` (cc-by-nc-nd-4.0), code at github.com/reductoai/rd-tablebench, viewer at HF Space `reducto/rd_table_bench` |
| Metric | Table similarity from 0 to 1. Rows and cells are aligned hierarchically with Needleman-Wunsch, cells are scored by Levenshtein distance, and end gaps are free. Tables are passed in as cropped, centred PDFs, so the benchmark tests table parsing only, not table detection |
| Cadence | One official run in November 2024. Reducto has published no newer official leaderboard. The dataset was last modified 2024-11-05 |

**Official results (Reducto, mean similarity; transcribed from bar-chart image `rdtb_models.png`)**

| System (as published) | Avg table similarity |
|---|---|
| Reducto | 90.2% |
| Azure (Document Intelligence) | 82.7% |
| Textract (AWS Textract Tables) | 80.9% |
| Sonnet 3.5 | 80.7% |
| GPT-4o | 76.0% |
| Llamaparse (Pro mode) | 74.6% |
| GCloud (Document AI) | 64.6% |
| Unstructured (hi-res) | 60.2% |
| Chunkr (high-res) | 56.8%, **computed by us** (not in Reducto's chart) |

*Check:* I downloaded the 450 MB dataset zip and recomputed every provider from `providers/scores.csv`, counting missing outputs as 0. This reproduces Reducto's published means exactly: Reducto 0.9024, Azure 0.8269, Textract 0.8090, GCloud 0.6461, Unstructured 0.6015, GPT-4o 0.7599. The same calculation gives Chunkr 0.5682, which Reducto benchmarked but left off the chart. Chunkr returned output for only 920 of 1,000 tables, and Unstructured for 958. Sonnet 3.5 and LlamaParse outputs are not in the public file.

**2026 re-run by a competitor (Pulse, 2026-04-07; https://www.runpulse.com/blog/rd-tablebench-updated-results). Median similarity**

| System | Median |
|---|---|
| Pulse Ultra 2 | 0.9684 |
| Reducto Agentic (2026) | 0.9308 |
| Reducto (2024) | 0.9278 |
| Reducto (2026) | 0.8957 |
| Azure DI | 0.8500 |
| AWS Textract | 0.8434 |
| GPT-4o | 0.7859 |
| Google Cloud DI | 0.6840 |
| Unstructured | 0.6270 |
| Chunkr | 0.6246 |

*Notes:* Pulse reports **medians**, while Reducto reported **means**, so the two tables cannot be compared directly. For the 2024 systems, Pulse's medians match the medians of Reducto's published outputs, mostly computed over non-null scores. Pulse ran only Pulse and the two 2026 Reducto configurations itself. Pulse's audit claims that 43 of 1,000 ground-truth files have verifiable errors and that 89 files are byte-identical to Reducto's own output. In 15 of the 43 errors, the ground truth and Reducto share the same mistake. That is a direct challenge to the benchmark's neutrality. Pulse publishes no cost figures.

**Strengths:** the data, labels, scoring code and per-provider outputs are all public, so the results can be reproduced. I reproduced them. The metric gives partial credit sensibly.
**Limitations:** the creator is also the winner. The results are a single run from November 2024, and the official chart has not been refreshed. There is no Gemini, Mistral or modern LlamaParse. Tables are pre-cropped, so detection is not tested. The metric is computed on text, so it ignores numeric semantics. Pulse found ground-truth errors and Reducto-shaped labels. Mean and median versions circulate without being labelled. No cost is reported.

---

### 2. LongExtractionBench (micro1, commissioned by Reducto). Family: extraction (long, dense tables)

| | |
|---|---|
| Run by | micro1, **commissioned by Reducto**. Reducto authored the ground-truth and grading methodology. micro1 sourced the documents, reconciled annotations and published the results |
| Released | June 2026 (Reducto blog 2026-06-30; HF subset last modified 2026-06-30). Page: https://www.micro1.ai/benchmark/long-extraction. Repo: github.com/micro1-research/longextract-bench. Public subset: HF `micro1-inc/longextract-bench-50` |
| Data | 225 public, mostly English documents: statistics releases, census tables, financial and ABS filings, Medicare data, regulatory filings, scientific tables. They average 358 pages, about 88,700 ground-truth values and about 44 schema fields per document. Ground truth was drafted by GPT-5.5 and Claude Opus 4.7, then reconciled by humans. Only **50 documents are public** |
| Metric | A deterministic grader. Rows are matched on an inferred key, not by position, and each document gets row precision, row recall and leaf (cell) accuracy, averaged with equal weight per document. Coverage, failures, incompatibilities and latency are reported separately. **P/R/leaf are computed on completed documents only** |

**Main results (225 documents)**

| System | Completed | Coverage | Precision | Recall | Leaf acc. | Failures | Incompatible |
|---|---|---|---|---|---|---|---|
| Reducto Deep Extract | 225 | 100.0% | 99.6% | 99.6% | 99.3% | 0 | 0 |
| Extend MAX | 210 | 93.3% | 86.4% | 92.7% | 92.8% | 8 | 7 |
| LlamaExtract – Agentic | 203 | 90.2% | 80.0% | 77.5% | 88.9% | 22 | 0 |
| GPT-5.5 | 198 | 88.0% | 95.8% | 52.7% | 96.2% | 27 | 0 |
| Datalab Extract – Balanced | 166 | 73.8% | 92.8% | 33.8% | 90.9% | 59 | 0 |
| Claude Opus 4.8 | 116 | 51.6% | 92.0% | 70.7% | 91.7% | 109* | 0 |
| Gemini 3.1 Pro | 112 | 49.8% | 95.8% | 48.6% | 96.2% | 81* | 32 |

\*micro1's failure table prints Claude as 81 and Gemini as 109. Its failure-mode breakdown (Claude: 67 truncation + 41 context + 1 other = 109; Gemini: 66 + 15 = 81), the completion arithmetic and Reducto's results-table image (`longext_results_table.png`) all give Claude 109 and Gemini 81. The failure table has the labels swapped.

**Common-completed subset (61 documents finished by every system; skews to short documents)**

| System | Precision | Recall | Leaf |
|---|---|---|---|
| Reducto Deep Extract | 99.0 | 99.6 | 98.7 |
| Extend | 85.9 | 98.4 | 97.2 |
| LlamaExtract | 75.8 | 89.2 | 91.0 |
| GPT-5.5 | 95.4 | 77.8 | 98.8 |
| Datalab Extract – Balanced | 96.5 | 64.4 | 95.2 |
| Claude Opus 4.8 | 92.3 | 73.2 | 91.8 |
| Gemini 3.1 Pro | 98.1 | 77.2 | 96.6 |

Mean latency on successful runs: Reducto 540 s (p50 306 s, 367 pages on average), Extend 738 s, LlamaExtract 524 s, GPT-5.5 327 s, Datalab 1,609 s, Claude 420 s, Gemini 187 s. Systems that failed the long documents were timed on shorter ones, so these latencies are not comparable.

**Inconsistencies to know about:**
- The Reducto blog's results image (https://reducto.ai/blog/reducto-leads-benchmark-complex-document-extraction) lists Datalab ("Deeplab – Balanced") as 167/225, P 96.5, R 64.4, leaf 95.2, 58 failures. Those are micro1's *common-subset* precision, recall and leaf numbers, not its full-corpus row.
- Reducto's guide (https://reducto.ai/guides/document-ai-benchmark-ocr-parsing-extraction, 2026-08-13) leaves Extend out of its table and labels the LlamaExtract row "Alternative agentic extractor".
- micro1's prose quotes Reducto's subset recall as 99.8 and leaf as 98.9, while its table says 99.6 and 98.7.

**Competitor re-run (Datalab, 2026-07-14; https://www.datalab.to/blog/trusting-vendor-benchmarks).** Datalab rebuilt its long-table extraction, then re-ran itself and Reducto on the 50 public born-digital documents using the official grader with cache-busting:

| System | Recall | Precision | Leaf |
|---|---|---|---|
| Datalab | 99.1 | 99.8 | 99.1 |
| Reducto | 98.3 | 99.7 | 99.8 |

The "Extend 92.7%, LlamaParse 77.5%, Gemini 3.1 Pro 48.6%" figures in Datalab's post are copied from micro1's 225-document table. Datalab's "LlamaParse" is micro1's "LlamaExtract – Agentic". So the brief's context figures check out, but they compare a 50-document re-run against 225-document results. Datalab calls the task "a single edge case… that happens to be a Reducto strength".

**Strengths:** completion, failure and incompatibility are reported separately and kept beside accuracy. The grader is deterministic. The documents are real and long, which no other benchmark covers.
**Limitations:** the benchmark was sponsored by the winner, who also wrote the methodology. Labels were drafted by models, so they can share blind spots with the LLMs being tested. Only 50 of 225 documents are public. It is a single run with run-date dependence. The task is narrow: thousands of repeated rows. Leaders saturate at about 99%. No cost is reported. The published copies contradict each other in the places listed above.

---

### 3. Mistral OCR published benchmarks. Families: overall, everyday (multilingual), hard (math, scans, tables, handwriting)

Model lineage, from the docs model table and changelog (https://docs.mistral.ai/getting-started/models):
- `mistral-ocr-2503` (OCR 1): launched 2025-03-06, now deprecated.
- `mistral-ocr-2505` (OCR 2): released with Document AI in May 2025. I found no separate benchmark post for it.
- `mistral-ocr-2512` (OCR 3): 2025-12-17, still available for existing integrations.
- `mistral-ocr-4-0`: 2026-06-23. Deprecated 2026-09-29 and retired 2026-09-30 in favour of OCR 4.1.
- `mistral-ocr-4-1` (OCR 4.1): public preview July 2026, now the current `mistral-ocr-latest`. **OCR 4.1 has no separate accuracy benchmark.** Its release notes describe features only: paragraph-level boxes and block-level confidence.

All Mistral numbers are vendor-run on mostly **internal** sets, with competitor scores produced by Mistral.

#### 3a. Mistral OCR 2503 (2025-03-06), https://mistral.ai/news/mistral-ocr
Test set: Mistral's internal "text-only" set of publication papers and web PDFs. The metric is not defined beyond "accuracy". Price stated in the post: **$1 per 1,000 pages, with about twice as many pages per dollar in batch**.

| Model | Overall | Math | Multilingual | Scanned | Tables |
|---|---|---|---|---|---|
| Google Document AI | 83.42 | 80.29 | 86.42 | 92.77 | 78.16 |
| Azure OCR | 89.52 | 85.72 | 87.52 | 94.65 | 89.52 |
| Gemini-1.5-Flash-002 | 90.23 | 89.11 | 86.76 | 94.87 | 90.48 |
| Gemini-1.5-Pro-002 | 89.92 | 88.48 | 86.33 | 96.15 | 89.71 |
| Gemini-2.0-Flash-001 | 88.69 | 84.18 | 85.80 | 95.11 | 91.46 |
| GPT-4o-2024-11-20 | 89.77 | 87.55 | 86.00 | 94.58 | 91.70 |
| **Mistral OCR 2503** | **94.89** | **94.29** | **89.55** | **98.96** | **96.12** |

Multilingual "fuzzy match in generation": Google Document AI 95.88, Gemini-2.0-Flash 96.53, Azure OCR 97.31, Mistral OCR 2503 99.02.

By language (columns are Azure OCR / Google Doc AI / Gemini-2.0-Flash / Mistral OCR 2503): ru 97.35/95.56/96.58/99.09; fr 97.50/96.36/97.06/99.20; hi 96.45/95.65/94.99/97.55; zh 91.40/90.89/91.85/97.11; pt 97.96/96.24/97.25/99.42; de 98.39/97.09/97.19/99.51; es 98.54/97.52/97.75/99.54; tr 95.91/93.85/94.66/97.00; uk 97.81/96.24/96.70/99.29; it 98.31/97.69/97.68/99.42; ro 96.45/95.14/95.88/98.79.

#### 3b. Mistral OCR 3 / `mistral-ocr-2512` (2025-12-17), https://mistral.ai/news/mistral-ocr-3
New internal benchmarks built from customers' business documents, scored by fuzzy match. Price: **$2 per 1,000 pages, $1 in batch**. Annotations cost $3 per 1,000 pages. All values transcribed from chart images (`ocr3_*.png`).

| Dataset | Mistral OCR 3 | Textract | Azure | Google DocAI | DeepSeek OCR |
|---|---|---|---|---|---|
| Forms | 95.9 | 84.5 | 86.2 | 79.6 | 82.6 |
| Handwritten | 88.9 | 72.4 | 78.2 | 73.9 | 57.2 |
| Invoices | 91.8 | 78.4 | 80.2 | 72.4 | 70.5 |
| Complex tables | 96.6 | 84.8 | 85.9 | 75.9 | 84.4 |
| Historical scanned | 96.7 | 81.0 | 83.7 | 87.1 | 81.1 |
| Multilingual (Chinese) | 97.1 | – | 87.0 | 83.3 | 90.5 |
| Multilingual (East Asian) | 97.6 | – | 89.9 | 87.0 | 90.7 |
| Multilingual (Eastern Europe) | 98.6 | 88.9 | 94.5 | 91.4 | 90.3 |
| Multilingual (English) | 98.6 | 93.9 | 93.5 | 91.6 | 94.6 |
| Multilingual (Western Europe) | 98.8 | 94.3 | 94.3 | 92.2 | 94.6 |

Win rate of OCR 3 over OCR 2 (pairwise): overall 74%, EN 79, FR 74, CH 68, ES 74, HUN 79, RU 55.

#### 3c. Mistral OCR 4 (2026-06-23), https://mistral.ai/news/ocr-4
Price: **$4 per 1,000 pages, $2 in batch**. Document AI, which adds JSON schema or annotations, costs $5 per 1,000. The OCR 4.1 model card lists the same $4 and $5. Mistral says that "all competitor scores reflect internal reproductions" and that the OlmOCRBench and OmniDocBench scores are "directional" because of ground-truth errors, LaTeX-equivalence problems and reading-order artefacts.

Blind human preference: 600+ third-party documents in 12+ languages, transcribed from image. Values are OCR 4's win rate against each competitor, averaging 72%.

| Competitor | OCR 4 wins | Competitor wins |
|---|---|---|
| AWS Textract | 82.3% | 17.7% |
| Azure Doc Intel | 74.5% | 25.5% |
| Gemini 3.1 Pro Preview | 70.0% | 30.0% |
| GPT 5.5 Pro | 66.4% | 33.6% |
| Databricks | 65.7% | 34.3% |

OlmOCRBench and the internal Crawl Multilingual set, transcribed from chart (integers; OCR 4's 85.20 is from the text):

| System | OlmOCRBench | Crawl Multilingual (internal, 36+ languages) |
|---|---|---|
| Mistral OCR 4 | 85.20 | 98 |
| Chandra OCR 2 (Datalab) | 83 | 96 |
| MinerU Pro | 82 | 93 |
| PaddleOCR-VL | 80 | 92 |
| GLM OCR | 79 | 82 |
| DeepSeek OCR 2 | 77 | 89 |
| Gemini 3.1 Pro | 72 | – |
| GPT 5.5 | 71 | – |
| Azure | 56 | 88 |
| AWS Textract | 55 | 64 |

OmniDocBench: OCR 4 scores 93.07. No competitor figures are given.

**Strengths:** large comparator sets, a breakdown by language, and an honest list of the scoring artefacts in public benchmarks (OCR 4 post). The human-preference test avoids string-matching artefacts.
**Limitations:** test sets are internal and unpublished, and the metric definitions are vague. Mistral ran the competitors, and the comparator set changes with every release. No cost or latency comparisons are given. In OCR 4 the y-axes are truncated and values are rounded. OCR 4.1, the current model, has no accuracy benchmark. On an outside extraction benchmark, Datalab's OmniExtractBench (section 6), Mistral OCR 4.1 scores 76.78 accuracy against roughly 93 for the leaders. That is a reminder that OCR quality and field-extraction quality are different things.

---

### 4. SCORE-Bench (Unstructured). Families: overall (content, hallucination, structure) and hard (tables)

| | |
|---|---|
| Run by | Unstructured. Vendor-run, and Unstructured is the winner |
| Released | Framework paper arXiv 2509.19345 (Sep 2025). Dataset released 2025-12-02 (https://unstructured.io/blog/introducing-score-bench-an-open-benchmark-for-document-parsing). The live results page (https://unstructured.io/benchmarks) is undated but includes 2026 models such as GPT-5.4 and Claude Opus-4.6 |
| Data | The public HF set `unstructuredio/SCORE-Bench` has 224 expert-annotated real-world documents (54 scanned, 39 degraded) from healthcare, finance, legal and the public sector (annotations CC BY 4.0). The results page says "1,000+ enterprise pages" |
| Metrics | Adjusted CCT (word-weighted fuzzy content fidelity), percent tokens added (hallucination, lower is better), element alignment, table cell content accuracy and table cell spatial (index) accuracy |
| Configs | Many Unstructured configurations and three Reducto/Docling configurations were tested. All other tools were run at **default** settings |

**Per-pipeline results (benchmarks page, 2026)**

| Pipeline | Adj. CCT ↑ | Tokens added ↓ | Element align ↑ | Table content ↑ | Table spatial ↑ |
|---|---|---|---|---|---|
| Unstructured VLM Partitioner GPT-5-mini | 0.883 | 0.036 | 0.575 | 0.690 | 0.734 |
| Unstructured VLM Partitioner GPT-5.4 | 0.880 | 0.051 | 0.574 | 0.820 | 0.813 |
| Unstructured VLM Partitioner Claude Opus-4.5 | 0.878 | 0.056 | 0.574 | 0.812 | 0.782 |
| Unstructured VLM Partitioner Claude Sonnet-4 | 0.871 | 0.049 | 0.572 | 0.778 | 0.775 |
| Unstructured High-Res Refined w/ Claude Sonnet-4 | 0.863 | 0.057 | 0.580 | 0.773 | 0.776 |
| Unstructured High-Res Refined w/ GPT-5-mini | 0.857 | 0.069 | 0.580 | 0.760 | 0.774 |
| LlamaParse VLM | 0.835 | 0.069 | 0.266 | 0.522 | 0.578 |
| Reducto Agentic | 0.812 | 0.124 | 0.595 | 0.708 | 0.706 |
| Databricks AI Parse Document | 0.809 | 0.053 | 0.417 | 0.615 | 0.623 |
| Snowflake Layout Mode | 0.792 | 0.102 | 0.608 | 0.556 | 0.583 |
| Claude Sonnet-4 (off the shelf) | 0.792 | 0.071 | 0.421 | 0.687 | 0.710 |
| LlamaParse High Resolution OCR | 0.776 | 0.055 | 0.277 | 0.361 | 0.409 |
| GPT-5-mini (off the shelf) | 0.764 | 0.161 | 0.452 | 0.716 | 0.750 |
| GPT-5.2 (off the shelf) | 0.763 | 0.167 | 0.440 | 0.705 | 0.710 |
| Claude Opus-4.6 (off the shelf) | 0.742 | 0.044 | 0.449 | 0.678 | 0.686 |
| Docling Default | 0.716 | 0.135 | 0.599 | 0.606 | 0.659 |
| Unstructured OSS | 0.715 | 0.119 | 0.534 | 0.426 | 0.498 |
| Snowflake OCR Mode | 0.705 | 0.048 | 0.000 | 0.000 | 0.000 |
| Gemini 2.5 Pro (off the shelf) | 0.680 | 0.257 | 0.430 | 0.627 | 0.644 |
| NVIDIA Nemotron-Parse-v1.1 | 0.648 | 0.070 | 0.339 | 0.559 | 0.651 |
| Docling Granite VLM | 0.625 | 0.163 | 0.558 | 0.657 | 0.716 |

*Inconsistencies:* the page's "Overall Outcome" summary table does not match its own per-pipeline charts:
- "Unstructured" in the summary is the GPT-5.4 configuration: 0.880 / 0.051 / 0.574 / 0.820 / 0.813.
- The summary's "Docling Default" table scores (0.657 / 0.716) are actually Docling Granite VLM's values.
- The summary's "LlamaParse VLM" element alignment (0.277) is actually LlamaParse High-Res OCR's value.

The December 2025 launch post reported smaller table leaders: Unstructured hi-res + Sonnet-4 at 0.773 content and 0.776 index.

**Strengths:** the dataset is public, the metric code is open (github.com/Unstructured-IO/unstructured-eval-metrics), hallucination is measured explicitly, and representation-agnostic scoring avoids penalising HTML versus markdown output.
**Limitations:** the vendor is the winner, ran many of its own configurations, and ran competitors at defaults. Unstructured defined the metrics. The page and the dataset differ in size (1,000+ pages versus 224 documents). Some comparators are old (Gemini 2.5 Pro, Sonnet-4). The summary table contains errors. No cost or latency is reported.

---

### 5. LandingAI ADE and Extend

#### 5a. LandingAI Agentic Document Extraction: DocVQA parse-then-answer. Family: everyday
https://landing.ai/blog/docvqa-benchmark (2025-11-12). Code: github.com/landing-ai/ade-docvqa-benchmark. Per-error gallery published.

| Configuration | Accuracy (exact match, validation split) |
|---|---|
| ADE DPT-2 markdown + Playground Chat (baseline) | 95.36% |
| ADE DPT-2 JSON/visual grounding + Playground Chat + guided prompting | **99.16%** (5,286/5,331) |
| *Reference only:* Qwen2-VL on the DocVQA **test** split with image access (Oct 2024 leaderboard, as quoted) | 97.25% |

LandingAI reports how its 45 errors break down:

| Error category | Count | Note |
|---|---|---|
| Incorrect parse | 13 | |
| Missed parse | 5 | |
| Prompt/LLM misses | 18 | |
| "Not ADE focus" (spatial questions) | 9 | |
| Dataset issues | 18 | Not among the 45: these questions were excluded from both numerator and denominator (5,349 → 5,331) |

**Caveats:**
- LandingAI tuned its prompts on the same validation set it reports on, and dropped questions it considered mislabelled.
- It compares a validation-split result with a test-split leaderboard entry.
- DocVQA consists of old, single-page UCSF tobacco-archive scans with short answers, so it tests whether the parse preserves information, not field extraction at scale.
- LandingAI ran no competitors through the same protocol.

ADE Gen2 (DPT-3 Pro and DPT-3 Verity, released 2026-09-08; https://landing.ai/blog/introducing-agentic-document-extraction-gen2) published **no new accuracy benchmark**, only pricing and output changes.

#### 5b. Extend benchmarks hub, https://extend.ai/benchmarks
Extend publishes three benchmarks: RealDoc-Bench (parsing), LongArray-Extract (extraction) and PoliTax Split (splitting, 2026-03-30, not covered here). All are vendor-run, and Extend wins each.

**RealDoc-Bench** (2026-05-26, updated 2026-08-27; https://extend.ai/resources/realdocbench; arXiv 2606.07401; HF `Extend-AI/RealDoc-Bench` and `-Layout`). Documents are real-world forms from logistics, healthcare, financial services and real estate: IRS, SEC and FEC forms, mortgage files, medical intake forms and bills of lading, with synthetic PII. Two tasks:

*Layout adjusted F1 (1,500 annotated samples, IoU-matched, labels remapped). Family: hard*

| Parser | Adj. F1 |
|---|---|
| Extend Performance Parse (Parse 2.0) | 0.847 |
| Reducto | 0.759 |
| AWS Textract | 0.709 |
| Azure DI | 0.687 |
| PaddleOCR-VL | 0.684 |
| DotsOCR | 0.320 |

*Document Q&A per-field accuracy. Gemini answers objective questions from each parser's markdown; 1,356 prompts across 581 documents. Family: extraction. Extend publishes cost per page alongside the results, which is unusual.*

| Parser | Overall | Fin. services | Real estate | Logistics | Healthcare | Published cost/page | Latency/page |
|---|---|---|---|---|---|---|---|
| Extend Performance Parse (Parse 2.0) | 95.7% | 92.5 | 96.9 | 97.7 | 89.1 | $0.020 | 19.67 s |
| LlamaParse (Agentic) | 92.1% | 85.5 | 94.9 | 94.8 | 82.6 | $0.0125 | 30.20 s |
| Reducto (Agentic) | 91.1% | 85.7 | 92.0 | 94.4 | 86.0 | $0.060 | 13 s |
| Extend Light Parse | 90.5% | 87.6 | 94.4 | 88.5 | 85.7 | $0.005 | – |
| Gemini 3.5 Flash | 89.04% | 83.4 | 92.1 | 92.2 | 75.2 | $0.0113 | – |
| LlamaParse | 89.0% | 83.0 | 92.7 | 90.3 | 80.1 | $0.00375 | 32.45 s |
| Azure DI | 88.8% | 82.6 | 93.2 | 90.4 | 76.1 | $0.010 | (truncated in capture) |
| Reducto | 88.5% | 83.8 | 92.7 | 88.5 | 79.8 | $0.020 | – |
| AWS Textract | 70.5% | 68.2 | 71.3 | 77.0 | 46.9 | $0.015 | – |

Cost is Extend's "estimated parser price per page on the full benchmark". The prompt count is written as both 1,356 and 1,359 on Extend's pages.

**LongArray-Extract** (2026-06-02; https://extend.ai/resources/long-array-extraction-benchmark; HF `Extend-AI/LongArray-Extract`). 45 PDFs: 25 bank statements of about 150 to 2,200 transactions, 12 clinical adverse-event listings of 31 to 1,283 events, and 8 legal pleadings of 27 to 1,139 facts. Ground truth is generated. The metric is mean per-document field accuracy with failures scored 0. Raw LLMs were run without chunking or retries. Family: extraction.

| System | Aggregate acc. | Completed | Completed-only acc. | Mean latency |
|---|---|---|---|---|
| Extend MAX | 99.2% | 45/45 | 99.2% | 301 s |
| Reducto Deep Extract | 97.4% | 45/45 | 97.4% | 846 s |
| Claude Opus 4.7 | 83.1% | 45/45 | 83.1% | 532 s |
| Reducto Standard | 80.9% | 45/45 | 80.9% | 201 s |
| Pulse Effort | 68.8% | 45/45 | 68.8% | 324 s |
| Pulse Auto | 64.5% | 45/45 | 64.5% | 219 s |
| Gemini 3.1 Pro | 47.3% | 45/45 | 47.3% | 332 s |
| LlamaParse Standard | 47.2% | 26/45 | 81.7% | 88 s |
| LlamaParse Agentic | 34.7% | 35/45 | 44.6% | 149 s |
| GPT-5.5 | 31.6% | 45/45 | 31.6% | 128 s |
| Gemini 3.5 Flash | 31.1% | 45/45 | 31.1% | 186 s |

**Cross-benchmark contrast.** Reducto runs LongExtractionBench and Extend runs LongArray-Extract. Both test long-array extraction, and each publisher comes first on its own benchmark. Reducto Deep Extract places 2nd on Extend's (97.4%), and Extend MAX places 2nd on micro1's (92.7% recall). The two stronger vendors are close; which one "wins" depends on who runs the benchmark.

**Strengths (Extend):** completion and latency are reported beside accuracy, data is on HF, and RealDoc publishes cost per page.
**Limitations:** the vendor is the winner. LongArray-Extract is small (45 PDFs) with generated ground truth. RealDoc's Q&A uses a single Gemini answerer, and the competitor configurations are Extend's choice: defaults plus agentic modes where offered. Each benchmark is a single run.

---

### 6. Adjacent: OmniExtractBench (Datalab, 2026-09-16). Family: extraction

https://www.datalab.to/blog/omni-extract-bench. Datalab pools 620 documents from four sources: LlamaIndex ExtractBench (329), Datalab internal (202), micro1 LongExtractBench (47) and Extend LongArray. One deterministic scorer gives each value a verdict (paired, misread, unfound, fabricated and so on). This is vendor-run with Datalab as the winner. It is included here because it re-scores the systems above with a single grader.

| System (mode) | Accuracy | Precision | Recall | Coverage /620 |
|---|---|---|---|---|
| datalab-accurate | 93.85 | 95.32 | 95.11 | 620 |
| datalab balanced | 93.48 | 95.30 | 94.79 | 620 |
| reducto deep_extract v2 | 93.47 | 94.91 | 95.02 | 620 |
| claude opus 5 | 90.96 | 95.17 | 92.60 | 575 |
| extend extraction_performance | 90.17 | 91.67 | 94.66 | 620 |
| gemini 3.7-flash | 86.79 | 94.48 | 88.81 | 526 |
| llamaextract agentic_plus | 84.93 | 86.57 | 93.13 | 616 |
| gpt 5.6-sol | 83.85 | 95.11 | 84.99 | 615 |
| mistral ocr 4.1 | 76.78 | 85.93 | 79.27 | 574 |
| azure-cu gpt-4.1-mini | 61.08 | 80.32 | 64.07 | 569 |

Means are over the documents each system covered, so coverage has to be read with them.

---

### 7. Other vendor-run number: Reducto r-1 (2026-09-01). Family: overall

https://reducto.ai/blog/parse-r-1-model. The test is a private 10,000-page set covering enterprise domains, handwriting, multilingual pages, charts, complex tables and forms. The metric is the rate of high-severity errors (lower is better). Transcribed from image `r1_error_rate.png`.

| System | Error rate |
|---|---|
| Reducto r-1 | 3.91% |
| Reducto Agentic Parse | 4.94% |
| Reducto Base Parse | 9.35% |
| Azure Layout (high-res) | 11.60% |
| Google DocAI Enterprise OCR | 22.06% |
| AWS Textract | 26.60% |

Reducto states that r-1 costs 1 cent per page all-in, against 3 to 6 cents per page for its legacy agentic pipelines. The set is private, "high-severity" is not defined, and no VLMs or startup competitors are included.

---

### 8. List prices: $ per 1,000 pages (checked 2026-10-22)

All prices are US list or pay-as-you-go rates for the first volume tier unless noted. Credit-based prices are converted at the published credit rate. "≈" marks content-dependent pricing.

| Vendor | Product / tier | $ / 1k pages | Source | Notes |
|---|---|---|---|---|
| Reducto | r-1 Parse | 10 | https://reducto.ai/pricing | Standard plan, after $150 free credit. r-1 blog: "1 cent per page, all in" |
| Reducto | Extract | 20 | same | Extract endpoint rate |
| Reducto | Deep Extract | 40 | same | The system used in LongExtractionBench |
| Reducto | Legacy agentic parse | 30–60 | https://reducto.ai/blog/parse-r-1-model | "3 and 6 cents per page depending on workload" |
| LlamaIndex | LlamaParse Fast (1 cr/page) | 1.25 | https://developers.llamaindex.ai/llamaparse/general/pricing/ | $1.25 per 1,000 credits |
| LlamaIndex | LlamaParse Cost-effective (3 cr) | 3.75 | same | |
| LlamaIndex | LlamaParse Agentic (10 cr) | 12.50 | same | RealDoc-Bench lists $0.0125/page for this tier |
| LlamaIndex | LlamaParse Agentic Plus (45 cr) | 56.25 | same | +3 cr/page for layout extraction |
| LlamaIndex | LlamaExtract Cost-effective / Agentic / Agentic Plus (incl. default parse) | 10 / 31.25 / 75 | same | 8 / 25 / 60 credits per page. Turbo: 35 cr = $43.75 |
| Mistral | OCR 4.1 (`mistral-ocr-4-1`, current) | 4 (batch 2) | https://docs.mistral.ai/models/ocr-4-1 ; https://mistral.ai/news/ocr-4 | 50% Batch API discount |
| Mistral | Document AI on OCR 4/4.1 (annotations / JSON schema) | 5 | same | "Annotated pages" |
| Mistral | OCR 3 (`mistral-ocr-2512`) | 2 (batch 1) | https://mistral.ai/news/mistral-ocr-3 | Annotations $3/1k. Still available |
| Mistral | OCR 2503 (historical) | 1 (batch ≈0.5) | https://mistral.ai/news/mistral-ocr | Deprecated |
| Microsoft | Azure Document Intelligence Read | 1.50 (0.60 >1M) | https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/ (prices via Azure Retail Prices API, eastus) | 500 pages/month free (F0) |
| Microsoft | Azure DI Layout and all prebuilt models (invoice, receipt, ID, etc.) | 10 | same | Batch prebuilt/layout also $10 |
| Microsoft | Azure DI add-ons (high-res, formulas, fonts) / query fields | 6 / 10 | same | Charged on top of the base model |
| Microsoft | Azure DI custom extraction / custom generative | 30 / 30 | same | Classifier $3 |
| AWS | Textract DetectDocumentText (OCR) | 1.50 (0.60 >1M) | https://aws.amazon.com/textract/pricing/ (AWS Price List API, us-east-1, published 2026-10-20) | |
| AWS | Textract AnalyzeDocument Layout | 4 (3 >1M) | same | Layout is free when combined with Forms/Tables/Queries |
| AWS | Textract AnalyzeDocument Tables | 15 (10 >1M) | same | |
| AWS | Textract AnalyzeDocument Forms | 50 (40 >1M) | same | |
| AWS | Textract AnalyzeDocument Queries | 15 (10 >1M) | same | Tables+Queries $20; Forms+Queries $55 |
| AWS | Textract Tables+Forms / Tables+Forms+Queries | 65 / 70 | same | |
| AWS | Textract AnalyzeExpense / AnalyzeID / AnalyzeLending | 10 / 25 / 70 | same | |
| Google | Document AI Enterprise Document OCR | 1.50 (0.60 >5M) | https://cloud.google.com/document-ai/pricing | First 1k pages free. OCR add-ons $6 |
| Google | Document AI Layout Parser (incl. chunking) | 10 | same | |
| Google | Document AI Form Parser | 30 (20 >1M) | same | |
| Google | Document AI Custom Extractor | 30 (20 >1M) | same | Custom splitter/classifier $5 |
| Extend | Parse Light / Performance / Auto | 5 / 20 / 5–20 | https://extend.ai/pricing | $0.01 per credit, 10k credits free |
| Extend | Extract Light / Performance / Operator-1 | 7 / 30 / 50 | same | Parse billed separately. "Extend MAX" (used in the benchmarks) has no separate line on the pricing page |
| LandingAI | ADE DPT-3 Pro, Standard tier | ≈15 | https://landing.ai/pricing | $1 = 100 credits. About 1.5 credits for a typical 4,000-character page; billed on characters returned. Priority tier is 2× (≈30) |
| LandingAI | ADE DPT-3 Verity (preview), Standard tier | ≈5.50 | same | About 0.55 credits per typical page. Priority ≈11 |
| LandingAI | ADE Extract v2, Standard tier | ≈15 (+parse) | same | About 1.5 credits per typical page |
| LandingAI | ADE DPT-2 (Gen1) | 30 | https://landing.ai/blog/introducing-agentic-document-extraction-gen2 | Flat 3 credits per page |
| Unstructured | Platform pay-as-you-go (all strategies) | 15 | https://unstructured.io/pricing | $0.015 per page after 10k free pages |
| Datalab | Convert lite / fast-balanced / accurate | 0.50 / 4 / 10 | https://www.datalab.to/pricing | |
| Datalab | Extraction turbo-fast / balanced / accurate | 6 / 15+fees / 20+fees | same | About 5% of balanced or accurate jobs bill above the fixed rate |

**Pricing caveats for a Pareto chart:**
- The prices are not like for like. OCR-only APIs (Azure Read, Textract DetectText, Google OCR, Mistral OCR) cost $1–4 per 1,000 pages. Layout and table parsers cost $4–20. Agentic parsing and extraction costs $10–75. LLM-based modes are content-dependent (LandingAI, LlamaParse Auto, Datalab fees).
- Volume, batch and enterprise discounts are not included.
- RealDoc-Bench is the only benchmark here that publishes its own cost per page for every system. Mistral posts publish only Mistral's price, and Reducto's r-1 post only Reducto's.

---

### 9. Summary table of benchmarks

| Benchmark | Owner (vendor?) | Latest version / date | Family | Size / public | Headline metric | Leader |
|---|---|---|---|---|---|---|
| RD-TableBench | Reducto (vendor) | Nov 2024 official; Pulse re-run Apr 2026 | hard | 1,000 tables, all public | mean (Reducto) or median (Pulse) table similarity | Reducto 90.2% (2024 run); Pulse Ultra 2 0.968 median (Pulse run) |
| LongExtractionBench | micro1, commissioned by Reducto | Jun 2026 | extraction | 225 docs, 50 public | row recall with coverage | Reducto Deep Extract 99.6% (Datalab re-run on the 50 public docs: Datalab 99.1 vs Reducto 98.3) |
| LongArray-Extract | Extend (vendor) | 2026-06-02 | extraction | 45 PDFs public | mean per-doc accuracy, failures = 0 | Extend MAX 99.2% |
| RealDoc-Bench | Extend (vendor) | 2026-05-26, updated 2026-08-27 | hard (layout), extraction (QA) | 1,500 layout samples; 581 docs / 1,356 prompts | layout adj. F1; QA field accuracy | Extend Parse 2.0 (0.847 F1; 95.7%) |
| Mistral OCR internal | Mistral (vendor) | OCR 4: 2026-06-23 (4.1 not benchmarked) | overall, everyday, hard | internal, not public | fuzzy-match accuracy; win rate; olmOCR-Bench | Mistral (every chart) |
| SCORE-Bench | Unstructured (vendor) | Dataset Dec 2025; page 2026 | overall, hard | 224 docs public | Adjusted CCT, tokens added, table accuracy | Unstructured VLM pipelines |
| DocVQA (parse-then-QA) | LandingAI (vendor) | 2025-11-12 | everyday | DocVQA val 5,331 Qs | exact-match accuracy without image | ADE DPT-2 99.16% (no competitors run) |
| OmniExtractBench | Datalab (vendor) | 2026-09-16 | extraction | 620 docs public | value accuracy, P/R | Datalab accurate 93.85 (Reducto 93.47) |
| Reducto r-1 error set | Reducto (vendor) | 2026-09-01 | overall | 10k pages, private | high-severity error rate | Reducto r-1 3.91% |

---

## Appendix C: Part C: IDP Leaderboard, DocVQA and other 2025–2026 document-extraction benchmarks

Researcher C. Compiled 2026-10-22. Every number below was read from a primary source (site data, CSV/JSON, paper PDF) or is explicitly marked as *transcribed from image*, *approximate* or *researcher-computed*. Raw downloads are in `research/raw_C/`. Machine-readable rows: `parts/C.json` (1,225 rows).

**Family key:** (1) **everyday** = clean/typical pages, text + reading order; (2) **hard** = complex tables, bad scans, handwriting, formulas, charts; (3) **extraction** = structured fields/JSON from business docs.

---

### 0. Headline takeaways (for the deck)

1. **The IDP Leaderboard is no longer the 7-task 2025 board.** v1.5 (launched 11 Mar 2026) is an aggregator of three benchmarks: **OlmOCR-Bench** (AllenAI), **OmniDocBench v1.5** (OpenDataLab), and Nanonets' own **IDP Core** (KIE, OCR, Table, VQA). Overall = mean of the three. Classification, long-doc and confidence calibration from v1 are gone from the scoreboard. Nanonets runs every model itself, and **its own Nanonets OCR-3 is #1 overall (85.9)**. On Nanonets' own business-doc set (IDP Core), though, OCR-3 is only 7th (80.2) and **Gemini 3.1 Pro leads (89.6)**.
2. **It is stale relative to the frontier.** As of 22 Oct 2026 it has no GPT-5.5/6, Claude Opus 4.7/4.8/5.x, or Gemini 3.5+. The newest entries are from Mar–Apr 2026 (GPT-5.4, Gemini 3.1 Pro, Gemma 4). The raw-results dataset was last modified 2026-03-24.
3. **It does publish cost** ($/1K pages, model-level): GPT-5-Nano $0.61, GPT-5-Mini $3.05, Claude Haiku 4.5 $8.15, Nanonets $10, GPT-4.1 $13.60, Gemini-3-Pro $19.00, GPT-5.2 $21.35, Claude Sonnet 4.6 $24.45, Claude Opus 4.6 $40.75. The launch blog gives Gemini 3.1 Pro as $28/1K. Cost is null for GPT-5.4, Gemini 3 Flash and all open models.
4. **Field extraction (KIE) is compressed at the top.** On IDP Core KIE, 16 of the 26 scored models fall between 84.3 and 91.1 (19 of 26 between 83.5 and 91.1), while **handwriting OCR tops out around 74** (researcher-computed from raw results; the blog says 75.5) and **long sparse unstructured tables split models from about 11 to 95**. The hard tail separates models; easy KIE does not.
5. **DocVQA is saturated and has been replaced.** Vendor-reported DocVQA ANLS is 96.5–97.1 (Qwen3-VL-235B) against a human 98.1. Its organisers' successor, **DocVQA 2026 (ICDAR 2026)**, is nowhere near saturated: best system 60.0% accuracy (a multi-agent ensemble), Gemini-3.1-Pro zero-shot 37.5%, GPT-5.2 26.9%, GPT-5.4 25.6%, on only 160 test questions.
6. **Independent benchmarks that publish cost are rare.** OmniAI (vendor, Feb 2025, now defunct as a live board) published JSON accuracy plus $/1K pages. RealDocBench (Extend, vendor, Jun 2026) and ExtractBench (LlamaIndex, vendor) publish $/page. The only *independent* 2026 source with $ per doc that I found is a John Hancock/Manulife arXiv paper on bank checks (Sep 2026). Artificial Analysis (independent) publishes cost per task for **GDP.pdf**, but that is long-PDF reasoning, not extraction.
7. **Every vendor-run board puts its sponsor on top:** Nanonets (IDP), OmniAI (OmniAI bench), Extend (RealDocBench), LlamaIndex (ExtractBench), and Reducto (commissioned micro1's LongExtractionBench). Use them for *relative* frontier-model comparisons, not for the sponsor's own rank.
8. **Long documents break frontier LLMs called directly.** In LongExtractionBench (225 docs averaging 358 pages), Gemini 3.1 Pro failed or truncated on 48% of docs and Claude Opus 4.8 on 36%. Recall on completed docs was 49–71% for frontier models versus 99.6% for Reducto, the commissioning vendor. In ExtractBench "Long" docs, plain VLM calls drop to 5–38 F1 while agentic pipelines hold 79–95.

---

### 1. IDP Leaderboard (Nanonets): idp-leaderboard.org

| Attribute | Value |
|---|---|
| Runner | Nanonets (docext team; authors Mandal et al., Nanonets + IIT Indore). **Vendor**: sells Nanonets OCR models/API and ranks them. The 2026 blog is hosted on nanonets.com under the brand "Trail, Inc." |
| Independence | Vendor-run. All models evaluated by Nanonets' own harness (`NanoNets/idp-leaderboard-benchmarks`, LiteLLM, temperature 0, single run). The code and raw predictions are public, so results are reproducible in principle. |
| Versions | **v1** launched May 2025 (10 models, 6 tasks, 16 datasets, 9,229 docs; models added through June 2025). **v1.5** launched 2026-03-11 (blog "We ran 16 AI Models on 9,000+ Real Documents"). Site footer reads "v1.5". The site currently lists 29 models (26 with all three benchmarks). |
| Cadence | Ad hoc. Rolling model additions on request (GitHub discussions). No additions since about April 2026 (latest model release date in site data: Gemma-4, 2026-04-02). HF raw-results dataset last modified 2026-03-24. |
| URL / data | https://www.idp-leaderboard.org/ · methodology https://idp-leaderboard.org/details/ · harness https://github.com/NanoNets/idp-leaderboard-benchmarks · raw predictions https://huggingface.co/datasets/nanonets/idp-leaderboard-results · v1.5 blog https://nanonets.com/blog/idp-leaderboard-1-5/ |
| Also on site | "OCR Arena" (docarena.ai, the same Nanonets site): pairwise battles judged by human + 3 LLM judges (Claude Opus 4.6, Gemini 3.1 Pro, GPT-5.4). The Elo table rendered empty on fetch, so no data. |

**What it measures (v1.5)**

| Component | Built by | Size | Metric | Family |
|---|---|---|---|---|
| OlmOCR-Bench v1.0 | Allen AI | 1,403 PDF pages, 7,010 pass/fail unit tests | % tests passed, macro avg of 8 categories | Mostly **hard** (old scans, math, tables, tiny text); baseline/multi-column/headers = **everyday** |
| OmniDocBench v1.5 | OpenDataLab (Shanghai AI Lab) | 1,355 pages (papers, books, slides, exams, newspapers, magazines) | ((1−TextEdit)×100 + TableTEDS + FormulaCDM)/3 | Text/reading order = **everyday**; table/formula = **hard** |
| IDP Core v1.0 | **Nanonets** | 6,406 samples ("~2,000 documents" on site) | KIE, OCR, VQA: edit-distance accuracy; Table: GriTS; overall = mean of 4 tasks | KIE = **extraction**; OCR (handwriting, rotated handwriting, Vietnamese diacritics) = **hard**; Table (6 sparse/dense, structured/unstructured, short/long sets) = **hard**; VQA (ChartQA + DocVQA) = mixed |
| Overall | — | — | unweighted mean of the three benchmark overalls (I verified this to ±0.05 for all 26 models) | overall |

IDP Core datasets (from `benchmarks/idp/config.yaml`): KIE = `nanonets/key_information_extraction` (receipts, 987) + handwritten forms `Rasi1610/DeathSe43_44_checkbox` (89); OCR = `DataStudio/OCR_handwritting_HAT2023` (1,000, plus a rotated copy) + `ademax/ocr_scan_vi_01` (Vietnamese printed); VQA = `HuggingFaceM4/ChartQA` (1,000) + `lmms-lab/DocVQA` (1,000); Table = six `nanonets/*_table` sets (50 each). The methodology page also lists DocILE under KIE, but the current config does not include it.

#### 1a. Full v1.5 leaderboard (site data, fetched 2026-10-22)
Source: JSON embedded in the site bundle (`raw_C/idp_models.json`), cross-checked against the rendered homepage. "–" = not published. Rows marked "—" in # are not ranked on the homepage because they lack IDP Core scores. Gemma-3-12B-IT has IDP Core = 0 (failed run), so it is omitted.

| # | Model (as published) | Vendor | $/1K pages | Overall | OlmOCR | OmniDoc | IDP Core | KIE | OCR | Table | VQA |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Nanonets OCR-3 | Nanonets | 10 | 85.9 | 87.4 | 90 | 80.2 | 84.3 | 73.8 | 85.2 | 73 |
| 2 | GPT-5.4 | OpenAI | – | 83.5 | 81 | 85.25 | 84.4 | 85.7 | 69.1 | 94.8 | 78.2 |
| 3 | Gemini-3-Pro | Google | 19 | 82.8 | 77.7 | 88.81 | 81.8 | 85.7 | 81.8 | 95.8 | 64.1 |
| 4 | Gemini-3-Flash | Google | – | 82 | 75.3 | 90.06 | 80.5 | 91.1 | 81.7 | 85.6 | 63.5 |
| 5 | Nanonets OCR2+ | Nanonets | 10 | 81.8 | 82 | 89.48 | 73.8 | 86.4 | 64 | 79.7 | 65.1 |
| 6 | Gemini 3.1 Pro | Google | – | 81.6 | 69.8 | 85.34 | 89.6 | 86.8 | 82.8 | 96.4 | 85 |
| 7 | GPT-5.2 | OpenAI | 21.35 | 81.5 | 79.1 | 87.97 | 77.4 | 87.5 | 72.8 | 86 | 63.5 |
| 8 | Claude Sonnet 4.6 | Anthropic | 24.45 | 80.7 | 73.9 | 86.94 | 81.2 | 89.5 | 73.7 | 96.3 | 65.2 |
| 9 | Claude Opus 4.6 | Anthropic | 40.75 | 80.4 | 74.1 | 85.92 | 81.1 | 89.8 | 74 | 96 | 64.4 |
| 10 | Qwen3-VL-Plus | Alibaba | – | 80.1 | 77.9 | 82.49 | 79.8 | 83.8 | 71.9 | 85 | 74.7 |
| 11 | Qwen3-VL-235B | Alibaba | – | 79.6 | 76.8 | 81.91 | 80 | 83.8 | 71.7 | 85 | 75.5 |
| 12 | Qwen3.5-9B | Alibaba | – | 76.7 | 77.2 | 76.67 | 76.2 | 86.5 | 65.5 | 76.6 | 79.5 |
| 13 | GPT-5-Mini | OpenAI | 3.05 | 75.2 | 69.9 | 82.48 | 73.3 | 85.7 | 73 | 69.5 | 65 |
| 14 | Qwen3.5-4B | Alibaba | – | 72.5 | 75.4 | 67.57 | 74.5 | 86 | 64.7 | 76.7 | 72.4 |
| 15 | Mistral Small 4 | Mistral AI | – | 71.5 | 69.6 | 76.41 | 68.5 | 78.3 | 57.4 | 67.6 | 77.9 |
| 16 | Claude Haiku 4.5 | Anthropic | 8.15 | 71.2 | 61.2 | 79.62 | 72.9 | 85.6 | 65 | 81.7 | 59.2 |
| 17 | Ministral-8B | Mistral AI | – | 69.5 | 58.7 | 78.25 | 71.7 | 85.7 | 67.8 | 75.9 | 57.4 |
| 18 | GPT-4.1 | OpenAI | 13.6 | 68 | 49.4 | 79.86 | 74.7 | 87.1 | 75.6 | 73.1 | 63 |
| 19 | GLM-OCR | Zhipu AI | – | 64.2 | 68.4 | 69.23 | 54.9 | 83.5 | 66.7 | 24.5 | 44.9 |
| 20 | Qwen3.5-2B | Alibaba | – | 62.6 | 71.9 | 48.7 | 67.1 | 78.5 | 56.2 | 72.4 | 59.8 |
| 21 | Qwen3.5-0.8B | Alibaba | – | 57.8 | 64.8 | 47.33 | 61.2 | 75.9 | 62.9 | 59.9 | 52.4 |
| 22 | GPT-5-Nano | OpenAI | 0.61 | 54.8 | 35.2 | 63.43 | 65.8 | 84.7 | 69.6 | 45.3 | 63.5 |
| 23 | Gemma-4-E4B-it | Google | – | 53.9 | 47 | 59.7 | 55 | 11.1 | 74 | 55 | 65.3 |
| 24 | Llama-3.2-Vision-11B | Meta | – | 50.8 | 49.1 | 44.63 | 58.6 | 76.1 | 65.8 | 41.1 | 51.5 |
| 25 | Pixtral-12B | Mistral AI | – | 46.5 | 38.3 | 42.27 | 59 | 76.2 | 54.8 | 47.5 | 57.5 |
| 26 | Gemma-4-E2B-it | Google | – | 41.9 | 38.2 | 43.3 | 44.1 | 4.3 | 72.3 | 39 | 52.5 |
| — | Gemma-3-12B-IT | Google | – | – | 20.6 | 44.64 | – | – | – | – | – |
| — | Datalab Marker | Datalab | – | – | 83.2 | 85.51 | – | – | – | – | – |
| — | Qwen-VL-OCR | Alibaba | – | – | 59 | 34.13 | – | – | – | – | – |

Cost is the site's model-level "$ /1K pages" field (the GPT-5.2 model page shows "$ 21.35 /1K pages"). It is not specific to any benchmark. The v1.5 blog separately quotes Gemini 3.1 Pro at **$28/1K pages** and Nanonets OCR2+ at $10/1K.

#### 1b. Sub-scores: OlmOCR-Bench categories and OmniDocBench components (as run by Nanonets)

| Model | OlmOCR baseline | Multi-col | Hdr/Ftr | Long/tiny | Old scans | Old-scan math | arXiv math | Tables | OmniDoc TextEdit↓ | ReadOrder↓ | TableTEDS | FormulaCDM |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nanonets OCR-3 | 99.4 | 87.6 | 96.6 | 93.4 | 49.6 | 88.9 | 89.2 | 94.2 | 0.068 | 0.1 | 88.88 | 87.65 |
| GPT-5.4 | 100 | 83.7 | 20.1 | 82.6 | 43.9 | 82.3 | 83.1 | 91.1 | 0.0887 | 0.0771 | 81.26 | 83.36 |
| Gemini-3-Pro | 96.9 | 77.3 | 26.7 | 90.5 | 43.7 | 75.1 | 87.1 | 73.6 | 0.078 | 0.084 | 87 | 87.26 |
| Gemini-3-Flash | 97.3 | 75.3 | 27.4 | 90.3 | 45.8 | 73.6 | 80.1 | 64.6 | 0.077 | 0.081 | 87.65 | 90.22 |
| Nanonets OCR2+ | 99.1 | 83.9 | 96.8 | 89.4 | 42.4 | 74.5 | 83.8 | 86.3 | 0.056 | 0.09 | 79.1 | 90.34 |
| Gemini 3.1 Pro | 96.9 | 72.7 | 33.2 | 84.6 | 42.2 | 72.5 | 74.4 | 45.1 | 0.0815 | 0.0731 | 80.85 | 83.32 |
| GPT-5.2 | 98.9 | 81 | 26.2 | 83.3 | 40.9 | 84.5 | 78.4 | 86.8 | 0.111 | 0.098 | 84.94 | 90.07 |
| Claude Sonnet 4.6 | 90 | 78.5 | 37.4 | 71.3 | 19.8 | 84.3 | 87.5 | 86 | 0.165 | 0.149 | 87.09 | 90.24 |
| Claude Opus 4.6 | 90.5 | 79.5 | 35.5 | 73.8 | 20.5 | 83 | 86.6 | 84.5 | 0.151 | 0.136 | 84.38 | 88.46 |
| Qwen3-VL-Plus | 99.9 | 86.7 | 34.6 | 88 | 51 | 88 | 88.3 | 86.6 | 0.157 | 0.099 | 86.61 | 76.56 |
| Qwen3-VL-235B | 99.9 | 85.9 | 33.6 | 88.9 | 49.6 | 81.2 | 88.4 | 86.7 | 0.162 | 0.101 | 86.79 | 75.13 |
| Qwen3.5-9B | 98.8 | 83.4 | 48.8 | 84.8 | 46.8 | 82.5 | 86 | 86.3 | 0.253 | 0.116 | 73.86 | 81.41 |
| GPT-5-Mini | 99.7 | 82.9 | 25.5 | 84.6 | 41.1 | 60.5 | 50.1 | 70.6 | 0.138 | 0.121 | 74.61 | 86.68 |
| Qwen3.5-4B | 98.3 | 79.2 | 47.2 | 83.9 | 41.1 | 81.9 | 86.7 | 85 | 0.292 | 0.106 | 60.37 | 71.53 |
| Mistral Small 4 | 99.7 | 82.4 | 41.3 | 71.3 | 36.5 | 77.5 | 64.2 | 84 | 0.242 | 0.162 | 75.13 | 78.28 |
| Claude Haiku 4.5 | 91.3 | 62.8 | 37.6 | 36.2 | 19.6 | 79.5 | 55.4 | 83.4 | 0.224 | 0.178 | 77.07 | 84.17 |
| Ministral-8B | 0 | 82.4 | 53 | 56.6 | 27.9 | 62.9 | 48.9 | 79.3 | 0.157 | 0.125 | 67.12 | 83.33 |
| GPT-4.1 | 0 | 66.3 | 32.1 | 53.4 | 37.6 | 71.4 | 58.2 | 59.2 | 0.167 | 0.115 | 74.05 | 82.24 |
| GLM-OCR | 98.8 | 80.3 | 89.2 | 35.7 | 41.3 | 75.5 | 67.3 | 59 | 0.144 | 0.141 | 37.4 | 84.65 |
| Qwen3.5-2B | 97.8 | 74.7 | 49.6 | 77.1 | 38 | 75.3 | 82.1 | 80.7 | 0.621 | 0.401 | 45.27 | 62.89 |
| Qwen3.5-0.8B | 95 | 70 | 62.2 | 62 | 31.6 | 60.3 | 73.8 | 63.8 | 0.583 | 0.352 | 37.93 | 62.34 |
| GPT-5-Nano | 99.9 | 52.1 | 41.6 | 5 | 29.7 | 1.7 | 2.5 | 55.2 | 0.319 | 0.243 | 61.21 | 60.97 |
| Gemma-4-E4B-it | 99.4 | 37.1 | 48.4 | 26 | 28.3 | 49.8 | 20.4 | 66.9 | 0.367 | 0.253 | 48.88 | 66.77 |
| Llama-3.2-Vision-11B | 0 | 59.5 | 68.3 | 34.2 | 29.8 | 53.7 | 37.2 | 60.9 | 0.541 | 0.34 | 32.59 | 55.42 |
| Pixtral-12B | 0 | 26.8 | 72.8 | 12.2 | 29.1 | 50.7 | 30 | 46.8 | 0.641 | 0.422 | 32.14 | 58.79 |
| Gemma-4-E2B-it | 99.1 | 13.8 | 55.1 | 10 | 23.4 | 30.8 | 11.2 | 53.4 | 0.553 | 0.374 | 35.04 | 50.05 |
| Gemma-3-12B-IT | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.476 | 0.364 | 31.58 | 49.98 |
| Datalab Marker | 99.9 | 80.9 | 88.6 | 90.3 | 51.9 | 86.7 | 83.8 | 83.4 | 0.109 | 0.106 | 79.13 | 88.28 |
| Qwen-VL-OCR | 99.9 | 75.1 | 24.7 | 74.7 | 37.3 | 50.7 | 66.8 | 43 | 0.823 | 0.81 | 62.08 | 22.64 |

(↓ = lower is better. Datalab Marker, Qwen-VL-OCR and Gemma-3-12B appear only here.)

#### 1c. IDP Core per-dataset breakdown (**researcher-computed**, not a published table)
These are means of per-sample scores (×100) from the public raw-predictions files (`results/<model>/idp.json`, HF snapshot 2026-03-24). They are useful for splitting the "hard" tail, but read the caveats underneath. Qwen3.5 files carry null scores, so they are excluded.

| Raw model id | KIE receipts | KIE handwritten forms | OCR handwriting | OCR printed diacritics | ChartQA | DocVQA | Table small dense | Table small sparse unstr. | Table long dense | Table long sparse unstr. |
|---|---|---|---|---|---|---|---|---|---|---|
| gemini-3.1-pro-preview | 92.2 | 83.2 | 74 | 99.1 | 89.1 | 43.7 | 95.2 | 85 | 97 | 72.3 |
| gpt-5.4 | 88.8 | 82.6 | 57.2 | 98.5 | 76.8 | 91.1 | 99.1 | 87.5 | 97.9 | 86.5 |
| gemini-3-pro | 86 | 82.1 | 72.3 | 99.1 | 84.2 | 43.6 | 99.1 | 86.1 | 98.2 | 92.8 |
| gemini-3-flash | 92 | 80.5 | 74.4 | 98.5 | 82.5 | 44.1 | 96 | 77.1 | 97 | 53.6 |
| claude-opus-4-6 | 90.4 | 83.8 | 64.5 | 99.1 | 83.5 | 45 | 99.8 | 83.6 | 99.4 | 95.2 |
| claude-sonnet-4-6 | 90 | 83.7 | 62.6 | 98.3 | 85.2 | 44.9 | 99.7 | 89 | 98.9 | 91 |
| gpt-5.2-2025-12-11 | 88.1 | 80.6 | 62.5 | 98.6 | 82.9 | 43.5 | 99 | 79.6 | 97.8 | 43.8 |
| nanonets-ocr-3 | 86.7 | 80.6 | 46.6 | 97.1 | 78.3 | 86.9 | 92.7 | 64.9 | 94.2 | 49.4 |
| nanonets | 86.9 | 80.7 | 48.2 | 96.6 | 87 | 45.2 | 99.1 | 51.8 | 93.5 | 48.1 |
| gpt-4.1 | 88.6 | 70.5 | 65.2 | 98.9 | 83.8 | 42.1 | 97.5 | 67.7 | 74 | 43.8 |
| gpt-5-mini-2025-08-07 | 86.2 | 79.2 | 61.4 | 98.7 | 88.1 | 41.8 | 99.1 | 63.1 | 64.9 | 25.1 |
| claude-haiku-4-5 | 87.5 | 63.6 | 52.8 | 96.6 | 74.6 | 43.9 | 97.8 | 67.8 | 91.3 | 47.4 |
| mistral-small-2603 | 86.3 | 70.2 | 41.6 | 94.4 | 67.8 | 88 | 96.4 | 48.6 | 78.7 | 26.2 |
| ministral-8b | 86.6 | 75.7 | 56.7 | 95.2 | 74.8 | 41.7 | 97.5 | 78 | 74.8 | 46.8 |
| gpt-5-nano-2025-08-07 | 86 | 70.6 | 57.8 | 96.9 | 86.7 | 41 | 93.2 | 54.7 | 14.7 | 13.1 |
| glm-ocr | 86.2 | 53.6 | 57.1 | 86.5 | 53.5 | 37.6 | 37.7 | 34.4 | 12.1 | 10.9 |
| llama-3.2-vision-11b | 76.4 | 72.3 | 57 | 86 | 61.7 | 42.9 | 81 | 38.5 | 38.1 | 16.2 |
| pixtral-12b | 77.3 | 64.6 | 43.5 | 79.3 | 75.3 | 41.5 | 89.8 | 55.5 | 30.2 | 15.9 |

Caveats on 1c:
- **The raw file and the live site disagree for three models.** Site task scores for Gemini 3.1 Pro (KIE/OCR/Table/VQA 86.8/82.8/96.4/85.0), GPT-5.4 (85.7/69.1/94.8/78.2) and Nanonets OCR-3 (84.3/73.8/85.2/73.0) differ from the raw-file breakdowns (91.4/82.0/91.1/66.6, 85.7/77.9/94.8/83.9 and 83.6/62.9/81.2/66.2). The site appears to use later re-runs that were not published. For Nanonets' own model, the site number is higher than the public raw file (IDP Core 80.2 vs 74.4 sample-weighted). Other models (Claude, GPT-5.2, Gemini 3 Flash/Pro) match.
- **DocVQA here is not ANLS.** It is edit-distance accuracy on free-text answers, so verbose answers are punished. Most frontier models score about 42–45 here, but GPT-5.4, Mistral Small 4 and Nanonets OCR-3 score 86–91. The blog describes GPT-5.4's DocVQA "from 42.1% to 91.1%" as a capability jump; that is far more likely answer-format/prompt behaviour. **Treat IDP VQA as format-sensitive.**
- The raw file omits the rotated-handwriting OCR samples (task counts say 3,000 OCR calls; the file has 2,000), and 30 VQA calls are missing.
- The blog's own per-dataset claims: handwriting OCR best is Gemini 3.1 Pro at 75.5% ("hasn't crossed 76%"); sparse unstructured tables have most models below 55%, with Gemini 3.1 Pro at 94% and GPT-5.4 at 87%; ChartQA has Nanonets OCR2+ at 87%, Claude Sonnet 85% and GPT-5.4 77%; handwritten-form KIE clusters at 80–84% because models hallucinate values for blank fields; digital printed OCR is 98%+.

#### 1d. v1 (May 2025) for history
The launch post gave per-task results only in chart images. **Approximate overall scores transcribed from the scatter plot** (no data labels, ±0.3): gemini-2.5-flash-preview-04-17 ≈81.0, o4-mini ≈78.6, gpt-4.1 ≈78.0, gemini-2.0-flash ≈77.6, gpt-4o-2024-08-06 ≈75.4, llama-4-maverick ≈70.8, gpt-4o-mini ≈70.0, qwen2.5-vl-72b ≈68.5, mistral-small-3.1-24b ≈61.5, gpt-4o-2024-11-20 ≈60.1. The text states: best long-document score 69.08% (Gemini 2.5 Flash, synthetic docs up to 21 pages); best long sparse unstructured table 47% (GPT-4.1); best small unstructured table 66.64% (o4-mini). Cost was given as average $ per request (gpt-4o-mini highest, about $0.03/request, because of image tokens), not per page. Gemini 2.5 Pro and Claude Sonnet 4 were added in May–June 2025 (README changelog), but I found no machine-readable v1 table.

#### 1e. Strengths and limitations
- **Strengths:** Three complementary benchmarks; public harness and raw predictions (rare); per-model cost; includes the business-document tasks (KIE, handwriting, sparse tables) that academic parsing benchmarks skip; a Results Explorer shows predictions next to ground truth.
- **Limitations:**
  - **Vendor bias.** Nanonets designs IDP Core, runs every model, and ranks its own models #1 and #5 overall.
  - **Unpublished re-runs.** The site and the raw file are inconsistent for the newest and own models (see 1c).
  - **Single run, temperature 0,** with no confidence intervals.
  - **Format-sensitive metrics.** Edit-distance accuracy is used for VQA and KIE.
  - **Contamination risk.** IDP Core reuses public test sets (DocVQA, ChartQA, HAT2023), unchanged since 2025.
  - **Small table sets** (50 docs each).
  - **Not English-only, but narrow:** the "diacritics" OCR set is Vietnamese.
  - **Content moderation:** Claude models hit content filters on some OmniDoc/OlmOCR pages (old newspapers, textbooks), which lowers their scores (blog).
  - **OlmOCR "headers/footers" category** rewards suppressing page furniture, which frontier LLMs often keep (GPT-5.x scores 20–26 there). That category drags their OlmOCR overall down.
  - **Stale:** no GPT-5.5+, Claude 4.7+ or Gemini 3.5+.
  - **Missing costs** for several top models.

---

### 2. DocVQA and successors

#### 2a. DocVQA (Mathew, Karatzas, Jawahar; CVC-UAB / IIIT-H): docvqa.org, rrc.cvc.uab.es
- **What:** Extractive QA on single-page scanned industry documents (UCSF Industry Documents Library). 50K questions on 12K images. Metric ANLS. Human performance **ANLS 0.981 / 94.36% accuracy** (paper Table, arXiv 2007.00398). Family: everyday (reading + locating a span).
- **Runner:** Academic, independent. The RRC portal hosts a permanent leaderboard (more than 20,000 submitted methods across DocVQA challenges, per the 2026 report). **The RRC server refused connections on 2026-10-22** (HTTPS ECONNREFUSED, HTTP 502), so I could not read the live Task-1 table.
- **State of the art: saturated.** Vendor-reported test ANLS, all from the Qwen3-VL Technical Report (Alibaba, Nov 2025, Table 2; competitor numbers apparently re-run by Qwen):

| System | DocVQA test (ANLS) | InfographicVQA test (ANLS) | ChartQA test |
|---|---|---|---|
| Qwen3-VL-235B-A22B instruct | **97.1** | 89.2 | 90.3 |
| Qwen3-VL-235B-A22B thinking | 96.5 | 89.5 | 90.3 |
| Gemini 2.5 Pro (budget-128) | 94.0 | 82.9 | 62.6 |
| Gemini 2.5 Pro (thinking) | 92.6 | 84.2 | 83.3 |
| Claude Opus 4.1 (thinking) | 92.5 | 69.4 | 86.2 |
| GPT-5 (high) | 91.5 | 79.0 | 59.7 |
| GPT-5 (minimal) | 89.6 | 69.9 | 59.1 |
| Claude Opus 4.1 (non-thinking) | 89.2 | 60.9 | 83.9 |
| Human (original paper) | 98.1 | — | — |

- **Relevance:** Low as a differentiator. Top models sit 1–2 points from human, the remaining errors are largely annotation noise, the test set has been public since 2020 (contamination), and labs have stopped reporting it in 2026 frontier launches. Spreads in the table above mostly reflect the reporting lab's prompts (e.g. GPT-5's ChartQA 59.7 in Qwen's run). Use it as "table stakes", not as evidence of frontier progress.
- **Related sets (brief):** **InfographicVQA** (2021, same group; still about 89 for the best models). **MP-DocVQA** (multi-page, 2022) and **DUDE** (ICDAR 2023, multi-domain, multi-page, unanswerable questions) are older academic successors; I found no 2026 updates for either. **ChartQA** is effectively saturated (≈90). **ChartQAPro** (Masry et al., Apr 2025): the best model in the paper was Claude Sonnet 3.5 at 55.81% versus human 85.02%. The same model scores 90.50% on ChartQA. I found no authoritative live 2026 leaderboard; aggregators quote about 71–74% for 2026 system cards, which I could not verify, so they are not included.

#### 2b. DocVQA 2026: ICDAR 2026 Competition on Multimodal Reasoning over Documents in Multiple Domains (the successor)
- **Runner:** CVC/UAB (Karatzas group), independent academic. RRC ch=34. Timeline: site live 2025-11-28; validation set 2026-01-30; test set 2026-03-06; results deadline 2026-04-03; winners announced 2026-06-22; report arXiv **2609.25055** (2026-09-08), ICDAR 2026 proceedings LNCS.
- **What:** 8 domains (business reports, comics, engineering drawings, infographics, maps, science papers, science posters, slides), multi-page. Reasoning questions (spatial, temporal, multi-hop) with strict answer formatting (dates as YYYY-MM-DD, units, "Unknown" for unanswerable). **Test set has only 160 questions** (20 per domain); validation has 80. Metric: accuracy with strict normalisation plus ANLS for text answers. Three parameter bands (≤8B, 8–35B, >35B). Family: hard (charts, drawings, maps, multi-hop).
- **Results (test, Table 1 of the report; 20 valid submissions from 8 teams plus official baselines):**

| Band | System | Type | Accuracy % |
|---|---|---|---|
| >35B | **Luna + IDA + Multi-Agent Ensemble + with FT** (winner) | multi-agent ensemble | **60.00** |
| >35B | Luna + IDA + Multi-Agent Ensemble | multi-agent ensemble | 55.63 |
| >35B | Uni-Parser Tools + Gemini-3.1-Pro | parser/OCR + zero-shot | 46.25 |
| >35B | ARGUS_Gemini_3.1_Pro | agentic RAG | 43.75 |
| >35B | Gemini-3.1-Pro-preview (baseline) | single-model zero-shot | 37.50 |
| >35B | Gemini-3-Flash-preview (baseline) | single-model zero-shot | 35.63 |
| 8–35B | **ARGUS_Qwen3.5_27B** (joint winner) | agentic RAG | 35.63 |
| 8–35B | **Perceive-Reason-Code** (27B; joint winner) | agentic RAG | 35.63 |
| 8–35B | Uni-Parser Tools + Qwen3.5-27B | parser/OCR zero-shot | 31.88 |
| >35B | rocky mode | agentic RAG | 27.50 |
| >35B | GPT-5.2 (baseline) | single-model zero-shot | 26.88 |
| >35B | GPT-5.4 (baseline) | single-model zero-shot | 25.63 |
| 8–35B | qwen35vl_27b_sft | VLM fine-tune | 23.75 |
| 8–35B | HALLEY (9B) | parser/OCR zero-shot | 20.00 |
| ≤8B | **Uni-Parser Tools + Qwen3.5-4B** (top ≤8B) | parser/OCR zero-shot | 18.75 |
| >35B | GPT-5-mini (baseline) | single-model zero-shot | 17.50 |
| 8–35B | qwen3-vl-32b | single-model zero-shot | 15.63 |
| 8–35B | Qwen3-VL-32B-Thinking (baseline) | single-model zero-shot | 14.38 |
| ≤8B | ARGUS_Qwen3-VL-8B-Thinking | agentic RAG | 14.38 |
| ≤8B | qwen3vl-8b-sft | VLM fine-tune | 10.63 |
| ≤8B | Qwen3-VL-8B-Thinking (baseline) | single-model zero-shot | 9.38 |
| ≤8B | Pushing 8B model | agentic RAG | 9.38 |
| >35B | Multi-Agent RAG for Document VQA | agentic RAG | 6.25 |
| ≤8B | Zero-shot approach with tiny models | single-model zero-shot | 5.00 |
| ≤8B | Qwen3-VL-2B-Thinking (baseline) | single-model zero-shot | 1.88 |
| ≤8B | Vision Encoder OCR Model | single-model zero-shot | 1.25 |

Validation-set organiser baselines (HF card, 80 questions, high thinking, temperature 1.0): Gemini 3 Pro Preview 37.5, GPT-5.2 35.0, Gemini 3 Flash Preview 33.75, GPT-5 Mini 22.5. Maps were 0.0–0.2 for every baseline.
- **Strengths:** Independent; hidden test answers; unsaturated; shows that orchestration (parsing + retrieval + verification + ensembles) beats raw model calls by about 20 points.
- **Limitations:** Tiny test set (160 questions, so one question ≈ 0.6 pt); strict formatting rules can penalise correct-but-unformatted answers; API file-size limits counted as failures (OpenAI's 50MB cap failed some comics); a one-off competition, not a living leaderboard; no cost.

---

### 3. Other 2025–2026 benchmarks

#### 3a. OmniAI OCR Benchmark: getomni-ai/benchmark (**field extraction + cost**)
- **Runner:** OmniAI, a document-extraction vendor. **Vendor-run; ranks its own product #1.** The live page `getomni.ai/ocr-benchmark` now redirects to monumint.com and returns **404** (2026-10-22). The GitHub repo was last pushed 2025-10-21 (added gemini-2.5 and gpt-5 configs), but **no results after March 2025 were published**. Treat it as historical.
- **What:** 1,000 pages of real-world business docs (charts, tables, receipts, forms, handwriting, checks). Pipeline: document → OCR → JSON extraction against a schema. For OCR-only providers, GPT-4o does the extraction. **Metric:** JSON accuracy = 1 − (differing fields / total fields); also Levenshtein-based text similarity. Publishes **cost per 1,000 pages** and latency. Family: **extraction**.
- **Results: Feb 2025** (HF `getomni-ai/ocr-leaderboard/leaderboard_overview.csv`, 2025-02-21):

| System | JSON accuracy | Text similarity | Latency (ms/page) | **$ / 1,000 pages** |
|---|---|---|---|---|
| omniai | 0.92 | 0.50 | 9,690.68 | 10 |
| gemini-2.0-flash-001 | 0.86 | 0.48 | 10,729.23 | **0.88** |
| azure-document-intelligence | 0.85 | 0.41 | 4,396.53 | 10 |
| azure-gpt-4o | 0.75 | 0.50 | 25,055.41 | 18.52 |
| aws-textract | 0.74 | 0.29 | 4,858.84 | 4 |
| claude-3-5-sonnet-20241022 | 0.69 | 0.38 | 18,363.63 | 19.89 |
| google-document-ai | 0.68 | 0.42 | 3,186.75 | 1.5 |
| unstructured | 0.51 | 0.42 | 7,980.43 | 20 |

- **Mar 2025 open-source update** (JSON accuracy %, *transcribed from image*, README chart, no cost): Gemini 2.0 Flash 86.1, GPT-4o 75.5, Qwen 2.5 VL 72B 75.2, Qwen 2.5 VL 32B 74.8, Mistral OCR 72.2, Claude Sonnet 3.5 69.3, Llama 3.2 90B 54.2, Llama 3.2 11B 51.0, Gemma-3 27B 42.9.
- **Limitations:** Vendor; frozen at early-2025 models; GPT-4o extraction step confounds OCR quality; single run; English-centric; site gone.

#### 3b. OCR Arena: ocrarena.ai (**Elo, everyday/overall**)
- **Runner:** **Extend** (document-processing vendor), launched with Baseten. Users upload any doc; two anonymous models transcribe it; users vote. Sequential Elo, K=20, everyone starts at 1500. Live API `/api/leaderboard` (snapshot 2026-10-22T18:01Z). Extend's own product does not appear to be listed ("Iris" is unidentified). No cost; latency is shown.

| # | Model | Elo | Win % | Battles | Avg latency (s) |
|---|---|---|---|---|---|
| 1 | Gemini 3 Flash | 1791 | 77.0 | 513 | 29.7 |
| 2 | Opus 4.5 (Low) | 1787 | 69.4 | 1,541 | 17.1 |
| 3 | Opus 4.5 (Medium) | 1718 | 70.5 | 1,526 | 17.6 |
| 4 | Opus 4.6 (Adaptive) | 1704 | 70.0 | 403 | 24.6 |
| 5 | Opus 4.6 (Medium) | 1699 | 68.4 | 364 | 20.5 |
| 6 | Gemini 2.5 Pro | 1699 | 71.1 | 2,218 | 46.1 |
| 7 | Gemini 2.5 Flash | 1683 | 58.8 | 2,336 | 15.9 |
| 8 | Opus 4.6 (Low) | 1683 | 64.5 | 377 | 19.9 |
| 9 | Sonnet 4.5 | 1633 | 46.9 | 1,638 | 20.5 |
| 10 | Qwen3-VL-8B | 1531 | 40.1 | 1,779 | 78.0 |
| 11 | Mistral OCR v3 | 1520 | 39.2 | 554 | 2.4 |
| 12 | dots.ocr | 1515 | 36.4 | 1,804 | 62.0 |
| 13 | Nanonets2-3B | 1470 | 33.5 | 1,386 | 60.9 |
| 14 | GLM-OCR | 1401 | 19.0 | 399 | 14.1 |
| 15 | olmOCR 2 | 1397 | 28.9 | 2,205 | 76.4 |
| 16 | GPT-5.1 (Medium) | 1383 | 58.6 | 2,079 | 21.5 |
| 17 | DeepSeek OCR | 1377 | 20.4 | 2,064 | 44.2 |
| 18 | Gemini 3 Preview | 1376 | 71.8 | 2,148 | 40.4 |
| 19 | GPT-5 (Low) | 1374 | 42.7 | 2,094 | 13.0 |
| 20 | GPT-5.2 (None) | 1359 | 50.3 | 344 | 12.5 |
| 21 | GPT-5.1 (Low) | 1358 | 54.0 | 2,168 | 11.2 |
| 22 | GPT-5 (Medium) | 1354 | 45.1 | 2,109 | 27.2 |
| 23 | Iris | 1327 | 36.4 | 664 | 11.2 |
| 24 | GPT-5.2 (Medium) | 1325 | 49.7 | 374 | 27.5 |

- **Limitations:** Sequential K=20 Elo is order-dependent and visibly inconsistent: Gemini 3 Preview has a 71.8% win rate but Elo 1376, below GPT-5.2 at about 50%. Only 8 Elo points separate #1 and #2. Unknown and unweighted document mix (self-selected uploads); "better transcription" is a preference vote, not accuracy; vendor-run; no GPT-5.4+/Gemini 3.1+ yet. Good as a vibe check for **everyday** transcription quality only.

#### 3c. RealDocBench: Extend AI (arXiv 2606.07401, 5 Jun 2026) (**extraction + cost**)
- **Runner:** Extend AI. **Vendor; its own product ranks #1.** Two tracks. **QA track:** 1,356 field-level questions over 581 real regulated documents (finance 378, mortgage 478, supply chain 319, medical 181). Parser output goes to a single extraction LLM plus a deterministic scorer (exact match for short fields, ≥92 similarity for long). Reports 95% document-clustered bootstrap CIs. **Layout track:** 1,500 pages, 9-class taxonomy. Publishes **list-price $/page and cold-cache latency**. Some medical/tax forms are blank templates filled with synthetic personas. HF dataset released.

| System | Per-field % | Per-question % | $/page (list) | **$/1K pages** | s/page |
|---|---|---|---|---|---|
| Extend Performance v2 | 96.0 ±0.8 | 90.9 ±1.6 | 0.040 | 40 | 13.7 |
| Claude Opus 4.8 (non-thinking) | 93.0 ±1.4 | 87.1 ±2.1 | — | — | — |
| LlamaParse (Agentic) | 92.2 ±1.5 | 84.5 ±2.2 | 0.0125 | 12.5 | 23.7 |
| Reducto (Agentic) | 91.4 ±1.7 | 83.8 ±2.3 | 0.060 | 60 | 23.0 |
| Extend v1 | 90.8 ±1.7 | 82.5 ±2.4 | 0.010 | 10 | 11.7 |
| Gemini 3.5 Flash | 89.3 ±1.8 | 82.2 ±2.3 | 0.0113 | 11.3 | 18.9 |
| LlamaParse | 89.2 ±2.0 | 80.8 ±2.5 | 0.00375 | 3.75 | 24.1 |
| Azure DI | 89.1 ±1.7 | 79.6 ±2.5 | 0.010 | 10 | 6.5 |
| Reducto | 88.7 ±2.0 | 80.5 ±2.5 | 0.030 | 30 | 37.2 |
| AWS Textract | 70.7 ±2.7 | 54.0 ±2.9 | 0.015 | 15 | 4.7 |
| Chandra-2 (open) | 86.2 ±2.4 | 78.1 ±2.7 | — | — | — |
| olmOCR-2 | 79.5 ±2.6 | 67.9 ±3.0 | — | — | — |
| Nanonets-OCR-s | 77.4 ±3.6 | 68.2 ±3.2 | — | — | — |
| Docling | 71.2 ±2.9 | 54.7 ±3.2 | — | — | — |
| dots.ocr (2-stage) | 70.6 ±3.6 | 61.4 ±3.5 | — | — | — |
| dots.ocr (single-shot) | 65.4 ±4.0 | 57.2 ±3.6 | — | — | — |
| Paddle-OCR-VL | 59.6 ±4.0 | 48.5 ±3.6 | — | — | — |
| Paddle v3 | 59.2 ±3.2 | 43.1 ±3.2 | — | — | — |
| Nemotron Nano V2 VL | 41.6 ±3.4 | 29.3 ±3.0 | — | — | — |

Layout adjusted micro-F1: Extend v2 0.835, AWS Textract 0.726, PaddleOCR-VL 1.5 0.680, Azure DI 0.637, dots.ocr 0.317. **Notable:** a general model (Claude Opus 4.8, non-thinking) is #2 per-field, and Gemini 3.5 Flash at $11.3/1K matches dedicated parsers (88.7–89.3). The single-pass commercial cluster is statistically inseparable. The medical domain (handwritten case-report forms, checkbox grids) is hardest.
- **Limitations:** Vendor-authored; the extraction LLM is fixed (confounds parser and extractor); latency measured on one single page; list prices only; US-centric regulated documents.

#### 3d. LongExtractionBench: micro1 (published about June 2026) (**extraction, long docs**)
- **Runner:** micro1 (AI data/evals company) sourced the documents and published. **Commissioned by Reducto**, which authored the methodology and ground-truth harness, and Reducto wins. **Not independent.** 225 public documents averaging **358 pages** and about 88.7K ground-truth fields each (statistical releases, census, ABS/financial filings, Medicare datasets, permits). Ground truth was drafted by GPT-5.5 and Claude Opus 4.7, then human-reconciled. Deterministic key-based row matching. **No cost published.** https://micro1.ai/benchmark/long-extraction

| System | Completed /225 | Precision | Recall | Leaf acc. | Failure rate | Common-61 recall |
|---|---|---|---|---|---|---|
| Reducto Deep Extract | 225 | 99.6 | 99.6 | 99.3 | 0.0% | 99.6 |
| Extend (MAX) | 210 | 86.4 | 92.7 | 92.8 | 3.6% | 98.4 |
| LlamaExtract (Agentic) | 203 | 80.0 | 77.5 | 88.9 | 9.8% | 89.2 |
| GPT-5.5 | 198 | 95.8 | 52.7 | 96.2 | 12.0% (all context overflow) | 77.8 |
| Datalab Extract – Balanced | 166 | 92.8 | 33.8 | 90.9 | 26.2% | 64.4 |
| Claude Opus 4.8 | 116 | 92.0 | 70.7 | 91.7 | 36.0% (mostly output truncation) | 73.2 |
| Gemini 3.1 Pro | 112 | 95.8 | 48.6 | 96.2 | 48.4% (+14.2% schema rejections) | 77.2 |

(Scores on completed documents only, which makes them conditional. The page's prose swaps the Claude and Gemini failure rates relative to its own table; the table is used here.) **Lesson:** frontier models are precise but drop rows (low recall) and fail outright on long documents because of output-token ceilings. That is an engineering limit as much as a capability one, since frontier models were called directly without chunking.

#### 3e. "Beyond Accuracy": templated document extraction (John Hancock/Manulife, arXiv 2609.15706, 19 Sep 2026) (**independent, extraction + cost**)
- 750 synthetic bank-check images; 4 fields (payee, amount, date, bank); entity micro-F1. Cost = per-document list-price inference cost (1 doc = 1 page), ×1000 below. Open-source code and data.

| System | Micro-F1 | Doc accuracy % | Latency (s) | $/1K docs |
|---|---|---|---|---|
| GPT-5 | 0.928 | 41.7 | 26.3 | 25 |
| OCR (Azure DI Read) + GPT-4.1 | 0.917 | 40.7 | 18.1 | 3 |
| GPT-4.1 (vision) | 0.909 | 45.4 | 12.2 | 4 |
| Azure Content Understanding | 0.889 | 33.1 | 12.8 | 10 |
| Claude Sonnet 4.5 | 0.857 | 14.8 | 8.5 | 6 |
| OCR + regex (non-LLM floor) | 0.395 | 0.0 | 8.6 | 1.5 |
| Qwen2.5-VL-7B fine-tuned (3K samples) | **0.985** | 88.9 | 3.53 | ≈0 marginal ($734/mo GPU) |
| Qwen2.5-VL-3B fine-tuned | 0.983 | 88.4 | 4.18 | ≈0 marginal |
| Qwen2.5-VL-7B (no FT) | 0.921 | 50.7 | 2.53 | — |

Key finding: Date is the hardest field for every commercial model (Claude Sonnet 4.5 date F1 0.468, from over-extraction). Small fine-tuned open models beat every zero-shot frontier model on a fixed template. Limitation: synthetic, one narrow document type.

#### 3f. Dr.DocBench (2077AI, CMU et al.; arXiv 2606.01393, NeurIPS 2026) (**hard, independent**)
4,514 pages from multilingual books in 52 subject domains, deliberately selected where leading parsers fail (adversarial; expert content such as chemistry, music, complex tables, cross-page layouts). OmniDocBench-style metrics. No $ cost (output tokens only).

| Model | Overall↑ | Text edit↓ | Table TEDS↑ |
|---|---|---|---|
| GPT-5.5 | **61.94** | 0.19 | 48.90 |
| Kimi-K2.5 | 60.38 | 0.19 | 51.98 |
| Claude Opus 4.6 | 60.19 | 0.22 | 49.21 |
| Gemini 3.1 Pro | 60.13 | 0.22 | 51.26 |
| Qwen3.5-Flash | 57.51 | 0.26 | 46.24 |
| Qwen3.5-Plus | 57.32 | 0.25 | 49.77 |
| Qwen3.5-122B-A10B | 56.32 | 0.23 | 38.31 |
| MinerU 2.5 | 54.37 | 0.33 | 55.85 |
| Doubao-Seed-1.6-Vision | 53.14 | 0.34 | 33.93 |
| GPT-4o | 49.73 | 0.37 | 30.14 |
| PaddleOCR(-VL) | 34.78 | 0.73 | 51.79 |
| Nemotron-Nano-12B | 30.33 | 0.62 | 27.03 |

Message: four frontier models are tied at about 60, and specialised parsers still win on tables. Music-score transcription is unsolved for all models (none beats a null baseline).

#### 3g. MPDocBench-Parse (USTC + Alibaba Tongyi Lab; arXiv 2605.22100, NeurIPS 2026) (**multi-page parsing**)
433 docs / 3,246 pages, 15 document types, EN+ZH. Adds cross-page truncated text/table merging, figure extraction and heading hierarchy. Ground truth was bootstrapped from PaddleOCR-VL-1.5 predictions, then human-corrected (possible bias). Alibaba also makes Qwen. No cost.

| Model | Overall | TextEdit↓ | Cross-page table TEDS |
|---|---|---|---|
| PaddleOCR-VL-1.5 | **80.80** | 0.047 | 83.07 |
| MinerU2.5 | 76.70 | 0.059 | **88.14** |
| DeepSeek-OCR2 | 75.64 | 0.070 | 63.01 |
| ChandraOCR 2 | 74.72 | 0.099 | 64.67 |
| GLM-OCR | 74.70 | 0.060 | 63.10 |
| Logics-Parsing-v2 | 74.57 | 0.048 | 63.86 |
| MonkeyOCR-pro-3B | 74.37 | 0.056 | 61.17 |
| dots.ocr | 74.17 | 0.079 | 60.68 |
| Youtu-Parsing | 74.16 | 0.093 | 63.88 |
| Qwen3-VL-235B | 73.98 | 0.087 | 61.25 |
| Dolphin-v2 | 73.14 | 0.104 | 64.28 |
| dots.mocr | 72.96 | 0.071 | 62.16 |
| Qwen3.6-plus | 72.14 | 0.096 | 60.50 |
| Gemini-3.1-pro-preview | 71.79 | 0.070 | 61.26 |
| Qianfan-OCR | 71.57 | 0.100 | 62.41 |
| FireRed-OCR | 69.32 | 0.041 | 62.62 |
| ChatGPT-5.2-2025-12-11 | 65.66 | 0.111 | 58.71 |
| OCRVerse | 64.49 | 0.103 | 63.96 |
| InternVL-3.5-38B | 57.01 | 0.133 | 51.69 |

General VLMs (Gemini 3.1 Pro, GPT-5.2) lose to specialised parsers here, partly through structural tasks such as figure boxes (GPT-5.2 figure F1 30.97) and heading trees.

#### 3h. French PDF-to-Markdown benchmark (Probayes/OpenValue, La Poste; arXiv 2602.11960, 12 Feb 2026) (**independent, non-English**)
This is probably the "fr-bench-pdf2md" candidate (name unconfirmed). Hard French pages chosen by model-disagreement sampling from 60K documents; olmOCR-style unit tests; open code (`vlmparse`). Selected columns (pass rate 0–1):

| Model | All | Baseline | Forms | Handwritten |
|---|---|---|---|---|
| gemini-3-pro-preview | **0.786** | 0.965 | 0.725 | 0.600 |
| gemini-3-flash-preview | 0.755 | 0.964 | 0.684 | 0.582 |
| datalab-to/chandra | 0.664 | 0.996 | 0.375 | 0.212 |
| gpt-5.2 | 0.602 | 0.998 | 0.481 | 0.206 |
| gpt-5-mini | 0.574 | 1.000 | 0.416 | 0.182 |
| rednote-hilab/dots.ocr | 0.547 | 0.988 | 0.351 | 0.079 |
| lightonai/LightOnOCR-2-1B | 0.542 | 0.990 | 0.357 | 0.127 |
| allenai/olmOCR-2-7B | 0.461 | 0.999 | 0.392 | 0.127 |
| mistral-ocr-latest | 0.459 | 0.993 | 0.388 | 0.170 |
| tencent/HunyuanOCR | 0.419 | 0.978 | 0.251 | 0.036 |
| gemini-2.5-flash-lite | 0.397 | 0.970 | 0.388 | 0.127 |
| PaddleOCR-VL-1.5 | 0.381 | 0.961 | 0.206 | 0.012 |
| deepseek-ai/DeepSeek-OCR | 0.377 | 1.000 | 0.124 | 0.012 |
| MinerU2.5 | 0.222 | 0.795 | 0.100 | 0.000 |
| docling | 0.119 | 0.999 | 0.031 | 0.000 |

(Full 18 rows are in the JSON. The paper's prose says Gemini 3 Pro scored 0.76 while its table says 0.786; the table is used.) This is the cleanest illustration of the everyday/hard split: **baseline pages ≈0.96–1.00 for nearly everyone; handwriting 0.00–0.60.**

#### 3i. ExtractBench (LlamaIndex + Kaggle, 2026) (brief; covered in depth by another researcher)
Vendor-run (LlamaIndex ranks its own LlamaExtract #1). 370 docs / 4,869 pages / 67 types; schema-guided JSON; deterministic value F1; publishes ¢/page. Kaggle board: https://www.kaggle.com/benchmarks/llamaindex-org/extractbench-leaderboard/leaderboard. Selected rows (`leaderboard.csv`, 2026-10-22; overall / long-doc value F1; $/1K pages = ¢/page × 10):
LlamaExtract Agentic Plus 96.17 / 94.65 ($75); Reducto Deep Extract 96.08 / 92.85 ($63.5); Pulse (Effort) 96.07 / 93.24 ($105); LlamaExtract Agentic 95.65 / 94.73 ($31.2); Claude Code (Sonnet 5.5 Evidence) 94.68 / 83.69 ($56.9); Codex (GPT-6 Sol Evidence) 94.57 / 87.25 ($98); Codex (GPT-5.5) 93.57 / 78.88 ($278.3); **OpenAI GPT-6 Astra (plain VLM) 91.91 / 31.70 ($110.9)**; DeepSeek V4.1 Flash 87.11 / 22.23 ($3.2); Kimi K3 83.17 / 4.99 ($67.5); Gemini 3.8 Flash 80.71 / 28.70 ($4.3); Gemini 3.5 Flash 79.84 / 27.90 ($10); GPT-5.4 Nano 74.90 / 35.81 ($2.1). Same message as LongExtractionBench: **plain VLM calls collapse on long documents.** An "ExtractBench Pro" variant (100 long-tail docs) is led by Codex GPT-6 Astra at 58% perfect docs, $952/1K pages.

#### 3j. GDP.pdf: Artificial Analysis implementation of the Surge AI benchmark (independent, reasoning over long PDFs)
Artificial Analysis has **no OCR or parsing leaderboard** (its /evaluations/ocr URLs return 404). It does independently run **GDP.pdf**: 100 professional tasks over 4,592 PDF pages in 10 domains, with 1,275 rubric criteria. Text is pre-parsed with LiteParse and page images are attached. GPT-5.6 Luna is the judge. AA publishes **cost per task**, not per page. This is document *reasoning*, not extraction, so it is useful only as a frontier "can it use long PDFs" signal. All-pass rate (2026-10-22): Muse Wonder Full (max) 32.6%, GPT-6 Astra (xhigh) 32.2%, GPT-6.1 Sol (high) 32.0%, GPT-6.1 Sol (xhigh) 31.8%, Muse Wonder (max) 30.6%, GPT-6 Astra (medium) 30.4%, Claude Opus 5.5 (max) 26.2%, Claude Sonnet 5.5 (max) 25.8%, GPT-6 Luna (max) 22.8%, Qwen3.8 Max 22.8%, Kimi K3 22.0%, Gemini 4 Argon (high) 21.8%, Gemini 3.8 Flash (high) 21.0% … (all 32 rows in JSON; names mapped from page data, top 3 confirmed by page text).

#### 3k. Checked and not found / skipped
- **Chunkr layout bench, READoc, DocGenome, "DocParsingBench", Vellum document benchmark:** not pursued or not found as 2026 living leaderboards. READoc and DocGenome are 2024 academic datasets. "DocParsingBench" was not found.
- **codesota.com:** a crowd-maintained aggregator of published scores (olmOCR-Bench, OmniDocBench, ParseBench), not an evaluator. Its own pages give conflicting OmniDocBench tops (GLM-OCR 94.62 vs MinerU 2.5 97.52), so it is **not used as a source**.
- **benchmarklist.com:** a third-party mirror. Used only to locate the OmniAI CSV, which I then pulled from HF.
- **ParseBench (LlamaIndex, Apr 2026):** covered by another researcher.

---

### 4. Benchmark classification summary

| Benchmark | Runner | Independent? | Cadence / latest | Families | Publishes cost? | Main caveats |
|---|---|---|---|---|---|---|
| IDP Leaderboard v1.5 | Nanonets | **No** (vendor; own model #1) | Ad hoc; v1.5 Mar 2026, last adds about Apr 2026 | overall; OlmOCR (everyday+hard); OmniDoc (everyday+hard); IDP Core KIE=extraction, OCR/Table=hard | **Yes**, $/1K pages model-level (gaps) | Site vs raw-file mismatch; edit-distance VQA; public test sets; stale |
| DocVQA (2020–) | CVC-UAB/IIIT-H | Yes | Permanent RRC board (server down 2026-10-22) | everyday | No | Saturated (97.1 vs human 98.1); contamination |
| DocVQA 2026 (ICDAR) | CVC-UAB | Yes | One-off; report Sep 2026 | hard (reasoning) | No | 160 test questions; strict formats |
| ChartQAPro | Masry et al. | Yes | Paper Apr 2025 | hard | No | No verified live board |
| OmniAI OCR Bench | OmniAI | **No** | Dead since Mar 2025 | extraction | **Yes** $/1K pages | Old models; site gone |
| OCR Arena | Extend | **No** (vendor-hosted) | Live | overall/everyday (preference) | No (latency only) | Elo inconsistencies; self-selected docs |
| RealDocBench | Extend | **No** (own product #1) | Paper Jun 2026 | extraction (+ layout) | **Yes** $/page list | Fixed extractor LLM; US regulated docs |
| LongExtractionBench | micro1 for Reducto | **No** (commissioned) | Jun 2026 | extraction (long docs) | No | LLM-drafted GT; sponsor wins |
| Beyond Accuracy (checks) | John Hancock/Manulife | **Yes** | Paper Sep 2026 | extraction | **Yes** $/doc | Synthetic, 4 fields |
| Dr.DocBench | 2077AI/CMU et al. | Yes | Paper May 2026 | hard | No (tokens) | Adversarial selection; books, not business docs |
| MPDocBench-Parse | USTC + Alibaba Tongyi | Mostly (Alibaba interest) | Paper May 2026 | everyday+hard (multi-page) | No | GT seeded from PaddleOCR-VL |
| French PDF→MD | Probayes/La Poste | Yes | Paper Feb 2026 | everyday+hard+forms | No (s/page) | French only; small |
| ExtractBench | LlamaIndex/Kaggle | **No** | Live leaderboard 2026 | extraction | **Yes** ¢/page | Sponsor #1 |
| GDP.pdf (AA) | Artificial Analysis / Surge | Yes | Live | (reasoning over PDFs) | Yes, per task | LLM judge; not extraction |

### 5. Source URLs
- IDP Leaderboard: https://www.idp-leaderboard.org/ · https://idp-leaderboard.org/details/ · https://www.idp-leaderboard.org/benchmarks · https://nanonets.com/blog/idp-leaderboard-1-5/ · https://github.com/NanoNets/idp-leaderboard-benchmarks · https://huggingface.co/datasets/nanonets/idp-leaderboard-results · https://github.com/NanoNets/docext · v1 blog https://nanonets.com/blog/p/db7d568c-8a7b-4e76-84c7-99c54e90a80b/
- DocVQA: https://www.docvqa.org/ · https://arxiv.org/pdf/2007.00398 · Qwen3-VL report https://arxiv.org/pdf/2511.21631 · DocVQA 2026 https://www.docvqa.org/challenges/2026 · https://huggingface.co/datasets/VLR-CVC/DocVQA-2026 · report https://arxiv.org/pdf/2609.25055 · ChartQAPro https://arxiv.org/pdf/2504.05506
- OmniAI: https://github.com/getomni-ai/benchmark · https://huggingface.co/datasets/getomni-ai/ocr-leaderboard
- OCR Arena: https://www.ocrarena.ai/leaderboard · https://www.ocrarena.ai/api/leaderboard · https://www.ocrarena.ai/about
- RealDocBench: https://arxiv.org/pdf/2606.07401
- LongExtractionBench: https://micro1.ai/benchmark/long-extraction
- Beyond Accuracy: https://arxiv.org/pdf/2609.15706
- Dr.DocBench: https://arxiv.org/pdf/2606.01393 · MPDocBench-Parse: https://arxiv.org/pdf/2605.22100 · French bench: https://arxiv.org/pdf/2602.11960
- ExtractBench: https://github.com/run-llama/ExtractBench · https://www.llamaindex.ai/blog/llamaindex-and-kaggle-launch-a-document-extraction-leaderboard-for-ai-agents
- GDP.pdf: https://artificialanalysis.ai/evaluations/gdp-pdf
