# At The Frontier: Document Extraction — History & Internals (research pack A)

Compiled 2026-10-22. Sources are linked inline. Conventions:
- **[verified]** means I checked it this session against the primary source linked.
- **[unverified]** means it came from secondary sources, or I couldn't confirm it.
- **[calc]** is my own arithmetic from documented formulas. Treat it as approximate.
- Vendor benchmark numbers are **self-reported** unless stated otherwise. Most are on olmOCR-Bench or OmniDocBench, and both lean toward academic and book pages.

---

## 0. The one-slide mental model

Every approach answers the same three questions differently:

1. **Where do the characters come from?** (a) the PDF's own text layer, (b) a pixel-reading OCR model, or (c) a generative model that "writes out" the page.
2. **Where does structure come from?** That means reading order, paragraphs, headings, tables. The options are (a) geometric heuristics on coordinates, (b) a layout detector plus table-structure model, or (c) learned implicitly inside one end-to-end model.
3. **What can you check afterwards?** Coordinates, per-word confidence and provenance (text layer vs OCR), or just a blob of markdown.

The arc from 1990 to 2026 trades **verifiability and cost** (left) for **robustness and semantic richness** (right). The current frontier tries to get both back with hybrids.

| Family | Characters from | Structure from | Typical output | Order-of-magnitude cost | Speed (order of magnitude) |
|---|---|---|---|---|---|
| Text-layer libraries (pdfminer, pdfplumber, PyMuPDF, pypdf, Camelot/Tabula) | PDF text layer | Heuristics on x/y coordinates | chars/words with exact boxes, font, size. No confidences (none needed). | ~free (CPU) | ms per page. PyMuPDF ~28x faster than pdfminer in its own benchmark ([PyMuPDF](https://pymupdf.readthedocs.io/en/latest/app4.html)). liteparse no-OCR 1,721 pg/s on CPU per Marker's table ([Marker README](https://github.com/datalab-to/marker)). |
| Classic OCR (Tesseract, ABBYY) | Pixels → line recogniser | Rule-based page segmentation | words + boxes + confidence | ~free (CPU) for OSS | seconds per page on CPU. Tesseract 5 ≈ 3.4–5.5 s/page per Datalab's run ([Indra OCR post](https://www.datalab.to/blog/indra-ocr)) |
| Cloud Document AI (Azure DI, Textract, Google DocAI) | Proprietary OCR | Layout + table + KV models, now partly Gemini (Google) | rich JSON: words/lines/paragraphs with polygons + confidences, tables as cells (row/col idx), KV pairs | $0.60–$1.50 / 1K pages for OCR, ~$4–$15 / 1K for layout/tables, $30–$65 / 1K for forms/custom ([verified], see §3) | seconds per page, async batch |
| DL layout era (LayoutLM, Donut, Nougat, TableFormer, TATR) | OCR (LayoutLM) or none (Donut/Nougat) | Learned | labels / JSON / markup | research-grade, GPU | — |
| Modern open pipelines & OCR-VLMs (Marker/Surya/Chandra, Docling, MinerU, PaddleOCR-VL, olmOCR, dots, DeepSeek-OCR, Mistral OCR) | Small VLM (0.6B–9B) and/or text layer | Layout model or the VLM itself | markdown/HTML/JSON with block boxes, sometimes word boxes and confidences | ~$150–$1,000 per **million** pages self-hosted (olmOCR chart). APIs $1–$5 / 1K pages. | ~0.5–7 pages/s per GPU |
| Frontier VLMs (Gemini, GPT, Claude) | Generative decoding from image tokens (+ free text layer for PDFs on Gemini/Claude) | Implicit | whatever you prompt: markdown, JSON schema. Boxes only if asked (Gemini 0–1000 grid). | ~$3–$20 / 1K pages [calc, §6] | seconds per page, output-token bound |

---

## 1. Timeline (verified unless marked)

| Year | Milestone | Source |
|---|---|---|
| 1985–1994 | Tesseract developed at HP Labs (Bristol, Greeley) | [Wikipedia](https://en.wikipedia.org/wiki/Tesseract_(software)) |
| 1993 | Adobe introduces PDF (Acrobat 1.0) **[unverified this session; widely documented]**. ISO 32000-1 followed in 2008 **[unverified]**. | — |
| Jul 1993 | ABBYY FineReader 1.0 (omnifont OCR) | [ABBYY blog](https://pdf.abbyy.com/blog/finereader-25-years/), [Wikipedia](https://en.wikipedia.org/wiki/ABBYY) |
| 2005 / 2006 | Tesseract open-sourced by HP + UNLV (2005). Google sponsorship from 2006. | [Wikipedia](https://en.wikipedia.org/wiki/Tesseract_(software)) |
| 2014 | pdfminer.six fork first on PyPI (Sep 2014). pdfplumber follows in Aug 2015. | PyPI JSON API |
| 2018 | Camelot (Sep 2018 PyPI) | PyPI |
| 29 Oct 2018 | **Tesseract 4.0.0**: LSTM line recogniser | [GitHub tag](https://github.com/tesseract-ocr/tesseract/releases/tag/4.0.0) |
| Nov 2018 / 29 May 2019 | AWS Textract preview at re:Invent / **GA** | [AWS What's New](https://aws.amazon.com/about-aws/whats-new/2019/05/amazon-textract-now-generally-available/), [SiliconANGLE](https://siliconangle.com/2019/05/29/aws-announces-general-availability-document-reading-service-textract/) |
| 2019 | Azure Form Recognizer preview **[unverified exact date; commonly cited as Build, May 2019]** | — |
| Aug 2019 | PubLayNet dataset (360k+ auto-labelled PubMed pages) | [arXiv 1908.07836](https://arxiv.org/abs/1908.07836) |
| 31 Dec 2019 | **LayoutLM** (text + 2-D position + image features) | [arXiv 1912.13318](https://arxiv.org/abs/1912.13318) |
| 2020 | PaddleOCR repo (May 2020) | GitHub |
| 4 Nov 2020 | Google Cloud Document AI platform (preview). GA in 2021 **[exact GA date unverified]**. | [Google blog](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-announces-document-ai-platform), [SiliconANGLE](https://siliconangle.com/2020/11/04/google-cloud-debuts-new-document-ai-platform/) |
| Dec 2020 | LayoutLMv2 | [arXiv 2012.14740](https://arxiv.org/abs/2012.14740) |
| Sep 2021 | PubTables-1M / **Table Transformer (TATR)** | [arXiv 2110.00061](https://arxiv.org/abs/2110.00061) |
| Nov 2021 (code Jul 2022) | **Donut**: OCR-free encoder-decoder | [arXiv 2111.15664](https://arxiv.org/abs/2111.15664) |
| Nov 2021 | Tesseract 5.0.0 | GitHub tag |
| Mar 2022 | **TableFormer** (IBM) | [arXiv 2203.01017](https://arxiv.org/abs/2203.01017) |
| Apr 2022 | LayoutLMv3 | [arXiv 2204.08387](https://arxiv.org/abs/2204.08387) |
| Jun 2022 | **DocLayNet** (80,863 human-annotated pages, 11 classes) | [arXiv 2206.01062](https://arxiv.org/abs/2206.01062) |
| Jul 2023 | Form Recognizer renamed **Azure AI Document Intelligence** | [MS .NET SDK docs](https://learn.microsoft.com/dotnet/api/overview/azure/AI.FormRecognizer-readme) |
| 25 Aug 2023 | **Nougat** (Meta): academic PDF → markup, OCR-free | [arXiv 2308.13418](https://arxiv.org/abs/2308.13418) |
| 25 Sep 2023 | **GPT-4V(ision)** system card: frontier LLMs start reading images | [OpenAI](https://openai.com/index/gpt-4v-system-card/) |
| Dec 2023 / Jan 2024 | **Marker** v0.1.0 on PyPI (19 Dec 2023). **Surya** v0.1.0 (12 Jan 2024). | PyPI |
| Mar 2024 | MinerU / magic-pdf first release (4 Mar 2024) | GitHub releases |
| Jul–Aug 2024 | **Docling** open-sourced (v0.1, 15 Jul 2024). Tech report 19 Aug 2024. | PyPI, [arXiv 2408.09869](https://arxiv.org/abs/2408.09869) |
| Sep 2024 | GOT-OCR2.0 ("OCR-2.0", unified end-to-end) | [arXiv 2409.01704](https://arxiv.org/abs/2409.01704) |
| 25 Feb 2025 | **olmOCR** (AI2): fine-tuned Qwen2-VL-7B, "document anchoring", $176 per million pages | [arXiv 2502.18443](https://arxiv.org/abs/2502.18443) |
| 6 Mar 2025 | **Mistral OCR** API ($1 / 1,000 pages) | [Mistral](https://mistral.ai/news/mistral-ocr) |
| Jun 2025 | Nanonets-OCR-s (Qwen2.5-VL-3B fine-tune) | [HF](https://huggingface.co/nanonets/Nanonets-OCR-s) |
| 30 Jul 2025 | **dots.ocr** (rednote, 1.7B LLM, single-VLM layout+content) | [GitHub](https://github.com/rednote-hilab/dots.ocr), [arXiv 2512.02498](https://arxiv.org/abs/2512.02498) |
| 26 Sep 2025 | **MinerU2.5** (1.2B, decoupled coarse-to-fine) | [arXiv 2509.22186](https://arxiv.org/abs/2509.22186) |
| 16 Oct 2025 | **PaddleOCR-VL** (0.9B: NaViT encoder + ERNIE-4.5-0.3B) | [arXiv 2510.14528](https://arxiv.org/abs/2510.14528) |
| 20–21 Oct 2025 | **DeepSeek-OCR**: "Contexts Optical Compression" | [arXiv 2510.18234](https://arxiv.org/abs/2510.18234) |
| 21–22 Oct 2025 | **olmOCR 2** (RL with unit-test rewards) | [arXiv 2510.19817](https://arxiv.org/abs/2510.19817) |
| Oct 2025 | **Chandra 1** (Datalab, ~9B) | [Datalab blog](https://www.datalab.to/blog/introducing-chandra) |
| 17 Dec 2025 | Mistral OCR 3 (`mistral-ocr-2512`, $2 / 1K, $1 batch) | [Mistral](https://mistral.ai/news/mistral-ocr-3) |
| Jan 2026 | **DeepSeek-OCR 2** (27 Jan, "Visual Causal Flow"). **PaddleOCR-VL-1.5** (29 Jan). LightOnOCR-2-1B (16 Jan). GLM-OCR (0.9B, ~30 Jan). | [arXiv 2601.20552](https://arxiv.org/abs/2601.20552), [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), HF |
| 13–19 Mar 2026 | dots.ocr-1.5 rebranded **dots.mocr** ("Multimodal OCR": charts/diagrams → SVG/code) | [arXiv 2603.13032](https://arxiv.org/abs/2603.13032) |
| 18 Mar 2026 | **Chandra 2** (4B per blog, 85.9 olmOCR-Bench) | [Datalab blog](https://www.datalab.to/blog/chandra-2) |
| 27–28 May 2026 | **Surya 2**: single 650M VLM for layout+OCR+tables. PaddleOCR-VL-1.6 (96.3 OmniDocBench v1.6, self-reported). | [Surya releases](https://github.com/datalab-to/surya/releases), [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) |
| 11 Jun 2026 | PP-OCRv6 (1.5M / 7.7M / 34.5M param tiers) | PaddleOCR README |
| Jun 2026 | Mistral OCR 4 (paragraph boxes, block labels, block confidences). OCR 4.0 deprecated 29 Sep 2026 in favour of OCR 4.1. Launch date "23 Jun 2026" is **[unverified]** (secondary source only). | [Mistral models page](https://docs.mistral.ai/getting-started/models/) |
| 20 Jul 2026 | **Marker 2.0** (runs layout/OCR/tables through the Surya VLM; "fast" vs "balanced" modes) | [Datalab blog](https://www.datalab.to/blog/marker-2), PyPI |
| 22 Jul 2026 | PaddleOCR HPD-Parsing (parallel decoding, multi-token prediction) | PaddleOCR README |
| 16 Sep 2026 | **MinerU 4.0** (flash/basic/standard/advanced tiers, agent "document library") | [GitHub releases](https://github.com/opendatalab/MinerU/releases) |
| 13–14 Oct 2026 | Datalab **Indra OCR** (1M-param CPU OCR, ~49 pg/s on 32 cores). **Chandra 2.5** (structured chart/diagram output, 87.4 olmOCR-Bench with PP3). | [Indra](https://www.datalab.to/blog/indra-ocr), [Chandra 2.5](https://www.datalab.to/blog/chandra-2-5) |

Other 2026 entrants seen in roundups (all **[unverified, self-reported]**): jina-ocr-v1 (83.4 olmOCR-Bench), TeleOCR (96.91 OmniDocBench, Aug 2026), OvisOCR2 (96.47, Jul 2026), LightOnOCR-3-4B (Datalab's reproduction: 85.4 with own post-processing). Sources: [Roboflow](https://roboflow.com/blog/best-open-source-ocr-models), [Chandra 2.5 post](https://www.datalab.to/blog/chandra-2-5).

**Narrative beats for the talk:** heuristics on coordinates (1990s–2010s) → neural line OCR (2018) → cloud layout APIs (2019–2020) → multimodal transformers (2019–2022) → OCR-free generation (2021–2023) → frontier VLMs read pages (2023) → small specialist OCR-VLMs eat the benchmarks (2025) → back to hybrids + verifiability (2026: word confidences, anti-hallucination layers, CPU-fast specialists).

---

## 2. Code-based / text-layer extraction (digital PDFs)

### How a PDF actually stores text
- pdfminer.six's docs put it bluntly: a PDF "does not contain anything that resembles paragraphs, sentences or even words. When it comes to text, a PDF file is only aware of the characters and their placement." ([pdfminer.six docs](https://pdfminersix.readthedocs.io/en/latest/topic/converting_pdf_to_text.html))
- A page's **content stream** is a little drawing program. Below is an illustrative example (mine, simplified):
  ```
  BT                     % begin text object
  /F1 12 Tf              % font F1 at 12pt
  72 712 Td              % move to x=72pt, y=712pt (origin bottom-left)
  (Revenue) Tj           % draw glyphs for these character codes
  [(T) 80 (otal)] TJ     % array form: numbers are kerning adjustments
  ET
  ```
  So what you get is "glyph codes painted at coordinates in font F1". Spaces are often **not** encoded; they're just gaps. pdfminer: "Spaces need to be inserted between characters because the PDF format has no notion of the space character."
- Character codes → Unicode depends on the font's encoding / **ToUnicode CMap**. If it's missing or wrong (common in subset fonts and Type 3 fonts), you get garbage or private-use characters even though the page *looks* perfect. **Ligatures** (ﬁ, ﬂ) may come out as one glyph (U+FB01) or be dropped. Text drawn as vector outlines, or pasted as an image, has no text layer at all. [General PDF knowledge; see Adobe PDF Reference 1.7 §5 Text and §9.10 in ISO 32000. Not re-quoted here.]
- There is **no inherent reading order**. Content-stream order is whatever the producing application emitted, e.g. headers last, columns interleaved, footnotes first. **Tagged PDF** (structure tree for accessibility) *can* carry logical order, but most real-world PDFs have missing or poor tags. [General knowledge]
- **Tables don't exist** in PDF: only glyphs plus line/rectangle drawing operators (which may be absent, purely visual, or misleading).

### How the libraries rebuild structure (pdfminer as the canonical example)
Three-stage geometric heuristic, from [pdfminer docs](https://pdfminersix.readthedocs.io/en/latest/topic/converting_pdf_to_text.html):
1. **Chars → lines.** Characters that are horizontally close (`char_margin`) and vertically overlapping (`line_overlap`) are joined. Spaces are inserted when the gap exceeds `word_margin`.
2. **Lines → text boxes.** Lines that overlap horizontally and are vertically close (`line_margin`) are grouped.
3. **Boxes → hierarchy/order.** "Repeatedly merges the two text boxes that are closest to each other." Output is an `LTPage → LTTextBox → LTTextLine → LTChar` tree (image: `pdfminer-layout-hierarchy.png`).

pdfplumber is built on pdfminer and exposes every char/word/line/rect with coordinates, plus visual debugging (`pdfplumber-visual-debugging.png`). PyMuPDF (MuPDF, C) is the fast one: total 8.0 s vs 101.6 s (PyPDF2) vs 227.3 s (pdfminer) on its 8-file benchmark, i.e. **~28x faster than pdfminer** (vendor-run, [PyMuPDF docs](https://pymupdf.readthedocs.io/en/latest/app4.html)).

### Tables: Camelot / Tabula
From [Camelot "How it works"](https://github.com/camelot-dev/camelot/blob/master/docs/user/how-it-works.rst):
- **Lattice** (ruled tables): render the page to an image → OpenCV morphological erosion/dilation finds horizontal and vertical line segments → AND the masks to get **intersections (joints)** → OR them to get **table boundaries** → map back to PDF coordinates → assign words to cells. Images: `camelot-lattice-1-lines.png` … `camelot-lattice-4-table.png`.
- **Stream** (whitespace tables): group words into rows by y-overlap → compute **text edges** (Nurminen's thesis method) to guess table areas → guess the column count from the mode of words per row → assign words by x/y ranges. Image: `camelot-stream-textedges.png`.
- Newer modes: *Network* and *Hybrid* (Network + Lattice).

### What you get / strengths
- **Exact characters** (no recognition error when the encoding is sane), **exact coordinates**, font name/size/weight, colour, links, and often vector lines. Fully deterministic, auditable, near-zero cost, CPU-only, milliseconds per page.

### Failure modes
- Multi-column reading order; headers/footers interleaved; hyphenation; superscripts/footnote markers merged into words.
- Broken encodings (ToUnicode), ligatures, Type 3 fonts; "text" that is really curves.
- Scanned PDFs (an image per page, maybe with a bad embedded OCR layer).
- Tables without rules; spanning headers; multi-page tables; numbers split or merged across cells.
- Math: Marker's own table shows the pure text-layer path scores **0.0** on arXiv-math and old-scan-math tests, because equations have no LaTeX in the text layer ([Marker README](https://github.com/datalab-to/marker)).

**Benchmark intuition:** on olmOCR-Bench, liteparse with no OCR (a pure text-layer tool) scores 20.4 overall at 1,721 pg/s on CPU. Marker "fast, no OCR" (text layer + a 20M-param layout model) scores 43.6 at 23.7 pg/s. Adding a tiny layout model doubles quality ([Marker README](https://github.com/datalab-to/marker)).

---

## 3. Classic OCR (Tesseract, ABBYY)

### Pipeline (classic, Tesseract-style)
1. **Preprocess:** grayscale → **binarise** (Tesseract uses Otsu-style global/adaptive thresholding internally) → deskew/rotate → denoise. Wikipedia's notes on practical requirements: the x-height should be ≥20 px; correct rotation/skew or "little or no text" is recognised; high-pass filter low-frequency brightness changes, "otherwise the binarization stage can destroy much of the page"; remove dark borders ([Wikipedia](https://en.wikipedia.org/wiki/Tesseract_(software))).
2. **Page segmentation / layout analysis:** connected components → blobs → text lines (baseline fitting) → blocks/columns (rule-based). Tesseract 4's LSTM "plugs into Tesseract's existing layout analysis" ([tessdoc](https://tesseract-ocr.github.io/tessdoc/tess4/NeuralNetsInTesseract4.00.html)).
3. **Recognition:**
   - *Pre-2018 (legacy):* segment words into characters, classify each glyph's shape features (static + adaptive classifier), then a dictionary/language model to repair.
   - *Tesseract 4+ (2018):* **line-level LSTM**, derived from OCRopus and rewritten in C++. Concretely, the English model spec is `[1,36,0,1 Ct3,3,16 Mp3,3 Lfys48 Lfx96 Lrx96 Lfx256 O1c111]`. That decodes as: a **36-px-high greyscale line image** → 3x3 conv (16 filters) → max-pool → LSTM summarising the y-axis → forward LSTM 96 → **reverse** LSTM 96 → forward LSTM 256 → softmax output trained with **CTC** over ~111 classes ([TrainingTesseract-4.00](https://github.com/tesseract-ocr/tessdoc/blob/main/tess4/TrainingTesseract-4.00.md), [VGSL spec](https://github.com/tesseract-ocr/tessdoc/blob/main/tess4/VGSLSpecs.md)). No character segmentation: CTC aligns the output sequence to the pixel columns.
4. **Post:** word confidences, optional dictionary correction, output as hOCR/ALTO/TSV.

### Output
Words/lines with **bounding boxes and confidence (0–100)**. Formats: hOCR, ALTO XML, TSV, searchable PDF. No semantic structure (no "this is a table/heading").

### Strengths
Free, local, CPU, deterministic, 100+ languages, word boxes and confidences, and it doesn't hallucinate whole sentences. Errors are local character substitutions.

### Failure modes
Low resolution, skew, photos, handwriting (basically unsupported), complex layouts (columns merge, tables flattened into lines), math, mixed scripts. Speed: the LSTM uses "the order of ten times the CPU resources of the base Tesseract" ([tessdoc](https://tesseract-ocr.github.io/tessdoc/tess4/NeuralNetsInTesseract4.00.html)). Datalab measured Tesseract 5 at ~5.5 s/page with defaults, or 3.4 s with 1 thread + eng, and a text score of 19.3 on OmniParseBench vs 41.3 for its new 1M-param Indra OCR (vendor-run, [Indra post](https://www.datalab.to/blog/indra-ocr)).

**ABBYY FineReader** (1993–): commercial "omnifont" OCR with strong layout retention and export to Word/Excel. Internals are proprietary; I didn't verify them.

**2026 coda:** small CPU OCR is not dead. PaddleOCR's PP-OCRv6 has 1.5M / 7.7M / 34.5M-param tiers. Datalab's Indra OCR (1M-param recogniser + layout + reading order) reports 49 pg/s on 32 CPU cores. Neither handles handwriting well (Indra about 8% on handwriting tests) ([PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR), [Indra](https://www.datalab.to/blog/indra-ocr)).

---

## 4. Cloud Document AI / layout pipelines

All three hyperscalers sell the same layered stack: **OCR → layout detection → table structure → key-value / field models → optional custom training**. The JSON output is anchored to page geometry.

### Azure AI Document Intelligence ("in Foundry Tools", API v4.0 GA 2024-11-30)
- **Models:** `prebuilt-read` (OCR), `prebuilt-layout` (OCR + structure), prebuilt domain models (invoice, receipt, ID, tax forms…), **custom template** and **custom neural** extraction models, custom classifiers ([layout docs](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/layout)).
- **Layout output:** `pages` (angle, width/height, words, lines, spans) → `paragraphs` with **roles** (title, sectionHeading, pageHeader, pageFooter, pageNumber, footnote) → `tables` (cells with row/col index, spans, header kinds) → `selectionMarks` (checkboxes) → `figures` → `sections` → optional **Markdown output**. Everything carries `boundingRegions` (polygons) and `spans` (offsets into one top-level `content` string). Words carry confidence; handwriting style is flagged.
- The docs distinguish **geometric roles** (text, tables, figures, selection marks) from **logical roles** (titles, headings, footers). That framing works well on a slide.
- **Limits:** up to 2,000 pages per PDF/TIFF; 500 MB (S0); min text height 12 px on a 1024x768 image (~8-pt at 150 dpi). Custom neural training up to 50,000 pages.
- **Pricing (East US, pay-as-you-go, via Azure Retail Prices API) [verified]:** Read $1.50 / 1K pages (a $0.60 tier also exists, presumably high volume). Layout / prebuilt $10 / 1K. Custom extraction $30 / 1K. Classifier $3 / 1K. Add-ons $6 / 1K. Training $3/hour.
- Images: `azure-di-layout-example.png` (annotated page roles), `azure-di-reading-order.png`, `azure-di-layout-sections.png`, `azure-di-layout-figures.png`, `azure-di-handwriting-classification.png`.

### AWS Textract
- **APIs:** `DetectDocumentText` (OCR), `AnalyzeDocument` with feature types TABLES, FORMS, QUERIES, SIGNATURES, LAYOUT; `AnalyzeExpense`, `AnalyzeID`, `AnalyzeLending`; Custom Queries **adapters** (fine-tuning).
- **Output:** a flat list of **Block** objects (PAGE, LINE, WORD, TABLE, CELL, KEY_VALUE_SET, SELECTION_ELEMENT, QUERY, LAYOUT_TITLE / LAYOUT_HEADER / LAYOUT_TEXT / LAYOUT_TABLE …). Each has `Geometry` (normalised BoundingBox + Polygon), `Confidence`, and `Relationships` (CHILD / VALUE ids) forming a graph you must walk ([Textract docs](https://docs.aws.amazon.com/textract/latest/dg/how-it-works-document-layout.html), [layout response](https://docs.aws.amazon.com/textract/latest/dg/layoutresponse.html)).
- **Pricing, us-east-1, first 1M pages/month (AWS Price List API, published 2026-10-20) [verified]:** Text $1.50 / 1K; **Layout $4 / 1K**; Tables $15 / 1K; Queries $15 / 1K; Forms $50 / 1K; Forms+Tables+Queries combos up to $70–$80 / 1K; Custom Queries $25 / 1K; Lending $70 / 1K; Expense/ID $10–$25 / 1K.

### Google Cloud Document AI
- **Processors:** Enterprise Document OCR, Form Parser, **Layout Parser**, Custom Extractor (generative or trained), Custom Classifier/Splitter, plus specialised parsers (invoice, expense, ID…).
- **Layout Parser is now a hybrid:** "combines Google's specialized … OCR models with the generative AI capabilities of Gemini". Gemini "verbalizes" figures, charts and tables into text descriptions, then the parser builds context-aware chunks that carry their ancestor headings. Processor versions include `pretrained-layout-parser-v1.0-2024-06-03` (GA, default), v1.5 (Gemini 2.5 Flash, preview), v1.5-pro (Gemini 2.5 Pro), plus Gemini 3.0 Pro / 3.0 Flash previews that route through a **global endpoint (not data-residency compliant)** ([Layout Parser docs](https://docs.cloud.google.com/document-ai/docs/layout-parse-chunk)).
- Google's own doc pitches OCR grounding as anti-hallucination: "Unlike pure LLM-based parsers that try to read text that isn't there…". The page shows an unnamed competitor misaligning headers and hallucinating values in a 10-K table (`google-docai-competitor-table-misalignment.png`).
- **Pricing [verified, cloud.google.com/document-ai/pricing]:** Enterprise OCR $1.50 / 1K (first 1K free, $0.60 above 5M). OCR add-ons $6 / 1K. **Layout Parser $10 / 1K** (incl. chunking). Form Parser $30 / 1K (→$20 above 1M). Custom extractor $30 / 1K. Classifier/splitter $5 / 1K. Specialised parsers ~$0.10 per document. Custom model hosting $0.05/hour.

### Strengths / failure modes of the cloud family
- ✅ Production SLAs, compliance, word-level geometry + confidences, KV pairs and checkboxes, custom training from a few to thousands of labelled docs, deterministic-ish.
- ❌ Layout/table models trained on "typical business docs": complex financial tables, nested headers, charts and math are weaker. You walk a big JSON graph. Per-page pricing stacks up with features (forms + tables). Vendor lock-in. Charts and figures are typically just boxes (Google now adds Gemini descriptions).
- **Speed:** seconds per page sync. Async batch for big jobs. Exact throughput not verified.

---

## 5. Deep-learning layout era (2019–2023)

### LayoutLM family (Microsoft)
- Takes **OCR output as input** (words + boxes). Each token embedding = text embedding + **2-D position embeddings for (x0, y0, x1, y1)** + (v1) optional image-region features from Faster R-CNN. Pretrained BERT-style (masked visual-language modelling), then fine-tuned for form understanding (FUNSD 70.72 → 79.27 F1), receipts, classification ([arXiv 1912.13318](https://arxiv.org/abs/1912.13318); image `layoutlm-architecture.png`). v2 (Dec 2020) and v3 (Apr 2022) fuse image patches more deeply.
- **Lesson:** where a word sits is as informative as what it says (a number to the right of "Total" is the total). But it **inherits OCR errors** and produces labels, not text.

### Datasets that made layout detection work
- **PubLayNet** (2019): ~360k auto-labelled PubMed pages, 5 classes. Great for papers, brittle elsewhere.
- **DocLayNet** (2022, IBM): **80,863 manually annotated pages, 11 classes** (Caption, Footnote, Formula, List-item, Page-footer, Page-header, Picture, Section-header, Table, Text, Title) from diverse sources (financial, patents, manuals, law…). Models trained on it are "more robust" than on PubLayNet/DocBank ([arXiv 2206.01062](https://arxiv.org/abs/2206.01062)). Still the backbone of Docling's layout models.
- Layout detection is posed as **object detection** (DETR/RT-DETR/YOLO-style): image in, labelled boxes out. Reading order is a separate step (heuristic or learned).

### Table-structure models
- **TableFormer** (IBM, 2022): image of a table → transformer encoder → a **structure decoder** emitting HTML-like structure tokens, plus a **cell bounding-box decoder**. For digital PDFs, cell text is then **taken from the PDF text layer** rather than OCR'd. TEDS 91% → 98.5% on simple and 88.7% → 95% on complex tables ([arXiv 2203.01017](https://arxiv.org/abs/2203.01017); images `tableformer-architecture.png`, `tableformer-complex-table-features.png`).
- **Table Transformer / PubTables-1M** (Microsoft, 2021): DETR object detection of table, rows, columns, column headers and spanning cells; the grid comes from intersecting rows × columns ([arXiv 2110.00061](https://arxiv.org/abs/2110.00061)).

### OCR-free encoder-decoders
- **Donut** (Clova, 2021/22): Swin Transformer image encoder → BART decoder that **generates** a token sequence (e.g. `<item><name>…</name>`) converted to JSON. A task prompt selects classification / VQA / parsing. Motivation: avoid OCR cost, inflexibility and **error propagation** ([arXiv 2111.15664](https://arxiv.org/abs/2111.15664); image `donut-overview.png`).
- **Nougat** (Meta, 2023): Donut-style Swin encoder + mBART decoder, trained on arXiv/PMC to output Mathpix-style markdown with LaTeX math ([arXiv 2308.13418](https://arxiv.org/abs/2308.13418); image `nougat-architecture.png`). Known failure: **repetition loops** and hallucinated text on out-of-domain pages. This is the first big public demonstration of the generative failure mode that still haunts VLM OCR. (Chandra 2.5's release notes still report "38% fewer loops", [Datalab](https://www.datalab.to/blog/chandra-2-5).)

**Key idea to teach:** Donut/Nougat flipped the problem from *detect-then-recognise* (discriminative, local errors) to *read-and-write* (generative, fluent but can invent). Every modern OCR-VLM descends from this line.

---

## 6. Modern open pipelines and specialist OCR models (2023–2026)

Three architectural patterns. Use this taxonomy on a slide:

| Pattern | What it is | Examples |
|---|---|---|
| **A. Pipeline of small specialists** | text layer and/or OCR + layout detector + table model + formula model + reading-order logic, stitched by code | Docling (standard pipeline), MinerU 1.x "pipeline" backend, PP-StructureV3, Marker v1, Indra OCR |
| **B. Two-stage VLM ("layout first, then read crops")** | a layout pass (separate detector or the same VLM at low res) → native-res crops → small VLM recognises each block | MinerU2.5, PaddleOCR-VL, Surya 2 "block mode", Marker 2 |
| **C. Single end-to-end page VLM** | whole page image → one decoder emits markdown/HTML (often with layout boxes inline) | olmOCR, Chandra, dots.ocr / dots.mocr, DeepSeek-OCR, Nanonets-OCR, GLM-OCR, LightOnOCR, Mistral OCR (API, internals unpublished) |
| **Hybrid wrappers** | any of the above + text-layer reuse + verification / regeneration / LLM cleanup | Marker `--use_llm`, Datalab API anti-hallucination stack, Google Layout Parser (OCR + Gemini) |

### Datalab: Surya, Marker, Chandra, Indra
- **Surya** (Jan 2024–): began as a suite of separate models: text-line detection (heatmap segmentation), recognition, layout, reading order, table recognition, LaTeX OCR (see releases v0.6–v0.17). **Surya 2 (27 May 2026)** collapses layout, OCR and table recognition into a **single 650M-param VLM** served by vLLM/llama.cpp. Line detection and OCR-error detection stay as small separate torch models. Claims: 83.3 olmOCR-Bench ("top under 3B params"), 5 pg/s on an RTX 5090. **Output per block:** label, reading-order index, HTML content, polygon + bbox, and **confidence = mean per-token probability** ([Surya README](https://github.com/datalab-to/surya)). Two OCR modes: full-page (one VLM call per page) or block mode (layout first, then per-block OCR). Images: `surya-text-detection-excerpt.png`, `surya-ocr-excerpt.png`, `surya-layout-*.png`, `surya-reading-order-*.png`, `surya-table-recognition-*.png`.
- **Marker** (Dec 2023–; **2.0 on 20 Jul 2026**): PDF/DOCX/PPTX/XLSX/HTML/EPUB → markdown/JSON/HTML/chunks. Internals: Providers (read source) → Builders (initial blocks + text) → Processors (per-block fixers, e.g. tables) → Renderers. Two modes:
  - *fast*: rf-detr layout + **pdftext** text layer + surgical VLM repair of garbled blocks only. "A clean digital document without equations never starts the VLM server."
  - *balanced*: Surya VLM for layout + re-OCR whole page if any text is bad.
  - `--use_llm` hybrid: an LLM (default `gemini-3.5-flash`) merges cross-page tables, fixes inline math, extracts form values.
  - Throughput on one B200: fast-no-OCR 23.7 pg/s (CPU) · fast 7.4 · balanced 2.9 pg/s. olmOCR-Bench: 43.6 / 66.6 / 76.0 ([Marker README](https://github.com/datalab-to/marker)). Image: `marker-olmocr-bench-quality-vs-throughput.png`.
- **Chandra** (Oct 2025; **Chandra 2** Mar 2026; 2.5 Oct 2026 API-only): a single page-level OCR VLM. Chandra 2 is "4B params, down from 9B" per the blog; HF safetensors report ~5.3B total and `qwen3_5` model type, so the counting basis is unclear and the base is evidently Qwen 3.5 ([HF](https://huggingface.co/datalab-to/chandra-ocr-2), [blog](https://www.datalab.to/blog/chandra-2)). Outputs markdown/HTML/JSON with **15+ block types and bounding boxes**, tables with colspan/rowspan, checkboxes, Mermaid for diagrams, chart data. 85.9 olmOCR-Bench (self). 90+ languages. 1.44–2 pg/s on an H100 with 96 concurrent sequences. Licence: code Apache-2.0, weights modified OpenRAIL-M (free under $2M revenue) ([Chandra README](https://github.com/datalab-to/chandra)). Images: `chandra2-layout-blocks.png`, `chandra-handwritten-math.png`, `chandra-handwritten-form.png`, `chandra25-chart-input-teacher-salary.png`.
- **Chandra 2.5** returns every figure in a fixed 6-field schema: `alt`, `text`, `axes`, `data` (an HTML table of chart values, with "~" for values read off an axis), `mermaid`, `description` ([blog](https://www.datalab.to/blog/chandra-2-5)). Use this as the "charts become data" example.
- **Anti-hallucination stack (Datalab API):** (1) model trained to reduce hallucination, incl. **character-level tokenization** (one char per step, avoiding BPE "autocomplete" bias) in Surya 2. (2) Page-level quality checks → regenerate. (3) Block-level re-reads → heal or mark **[illegible]**. (4) **Word boxes + confidences** for human review. On a 121-page adversarial stress set, raw single-pass output hallucinates or degenerates on ~61% of pages, ~41% with one safeguard, ≈0% with the full system (self-reported; [blog](https://www.datalab.to/blog/anti-hallucination)). Images: `datalab-word-confidence-boxes.png`, `datalab-illegible-manuscript-example.jpg`.
- **Indra OCR** (Oct 2026): a classic-style pipeline reborn. 1M-param line recogniser + layout blocks + reading order, CPU-only, ~230 ms/page, 49 pg/s on 32 cores. Reads the text layer when usable (130 ms vs 304 ms for OCR pages). Weak on complex tables and handwriting ([blog](https://www.datalab.to/blog/indra-ocr)). Images: `indra-ocr-layout-lines-reading-order.png`, `indra-ocr-table-crop.png`.

### IBM Docling (Jul 2024–, MIT)
- **Standard PDF pipeline:**
  1. **Parse** pages with its own `docling-parse` backend (built on qpdf) to get text cells + coordinates, with a pypdfium fallback.
  2. **OCR** only where needed (EasyOCR / RapidOCR / Tesseract / SuryaOCR options).
  3. **Layout analysis:** object detector, originally RT-DETR trained on DocLayNet, run on page images at 72 dpi, "sub-second" on CPU. The current default is the `docling-layout-heron` family, with `egret` variants.
  4. **TableFormer** for table structure, with cell text from the PDF.
  5. **Assemble** into a `DoclingDocument` (hierarchical, with provenance boxes) → export Markdown/JSON/DocTags, chunkers.

  Sources: [tech report](https://arxiv.org/abs/2408.09869), [model catalog](https://github.com/docling-project/docling/blob/main/docs/usage/model_catalog.md).
- **VLM pipeline option:** GraniteDocling-258M emits **DocTags** (a compact markup with locations). It can also call DeepSeek-OCR, Granite Vision etc.
- Docling exposes **confidence scores** (layout/parse/table/ocr, graded) and **visual grounding** back to page boxes. Images: `docling-visual-grounding.png` (pipeline figure + grounding), `docling-architecture.png`, `docling-confidence-scores.png`, `docling-document-hierarchy.png`.
- Benchmark context: docling default pipeline 50.3 olmOCR-Bench at 2.1 pg/s in Datalab's run (competitor-run; treat with care) ([Marker README](https://github.com/datalab-to/marker)).

### MinerU (OpenDataLab, Shanghai AI Lab)
- 1.x "pipeline" backend (PDF-Extract-Kit: layout YOLO, formula detection/recognition, table models, OCR) → Magic-PDF assembly. Image: `mineru-flowchart.png` (old), `mineru-layout-example.png` (layout boxes + order numbers on a 2-column paper).
- **MinerU2.5** (Sep 2025, 1.2B = NativeRes-ViT 675M + 0.5B LM decoder): **Stage I** layout analysis on a **downsampled 1036x1036 page** emits boxes + type + rotation + reading order. **Stage II** recognises **native-resolution crops** (text / table / formula) in parallel. Rationale: global context is cheap at low res, while fine detail needs high res only where text is ([arXiv 2509.22186](https://arxiv.org/abs/2509.22186); image `mineru25-two-stage-architecture.png`, one of the best "how it works" diagrams in the set).
- **MinerU 4.0** (16 Sep 2026): four tiers (flash/basic/standard/advanced), ONNX/Torch small models + llama.cpp/vLLM VLM, local "document library" with stable citation locators for agents ([README](https://github.com/opendatalab/MinerU)).

### PaddleOCR / PaddleOCR-VL (Baidu)
- **PP-StructureV3:** classic multi-model pipeline (layout, OCR, tables, formulas, seals) with **fine-grained coordinates incl. table-cell coordinates**. Datalab measured it at ~41 s/page on 4 vCPUs (competitor-run).
- **PaddleOCR-VL** (Oct 2025; 1.5 Jan 2026; 1.6 May 2026): **PP-DocLayoutV2** (layout + reading order) → batched crops → **PaddleOCR-VL-0.9B** (NaViT-style dynamic-resolution encoder + ERNIE-4.5-0.3B decoder) with task prompts (OCR / table / formula / chart) → Markdown + JSON ([arXiv 2510.14528](https://arxiv.org/abs/2510.14528); images `paddleocr-vl-overview.png`, `paddleocr-vl-09b-architecture.png`). 1.5 added PP-DocLayoutV3 for skewed/warped/photographed pages, seals, cross-page table merging. 1.6 claims 96.3 OmniDocBench v1.6 (self).
- **PP-OCRv6** (Jun 2026): 1.5M / 7.7M / 34.5M classic detector + recogniser tiers.

### olmOCR (Allen AI)
- **v1 (Feb 2025):** fine-tuned Qwen2-VL-7B on 260k pages (olmOCR-mix-0225). **Document anchoring:** extract text blocks *and their coordinates* plus image locations from the PDF text layer and put them in the prompt next to the page image, so the VLM is grounded by real text ([arXiv 2502.18443](https://arxiv.org/abs/2502.18443); image `olmocr-document-anchoring.png`). Cost: **$176 per million pages**, vs **>$6,240 per million pages for GPT-4o** (paper's estimate). Introduced **olmOCR-Bench** (1,400 PDFs, ~7–8k binary unit tests).
- **olmOCR 2 (Oct 2025):** Qwen2.5-VL-7B trained with **RL with verifiable rewards**, where rewards are binary unit tests on synthetic documents rendered from known HTML. Score 82.4 ([arXiv 2510.19817](https://arxiv.org/abs/2510.19817)). Newer models no longer use anchor text (the CLI flag says "not used for new models"). Images: `olmocr-cost-pareto.png` (cost per million pages vs score: olmOCR ~$178, PaddleOCR-VL ~$300, Marker ~$1.5k, Mistral ~$1k, Chandra API ~$4k, GPT-4o ~$8k), `olmocr2-timeline.png`.
- Note: olmOCR-Bench is now **saturated** and contested. Scores differ by post-processing (raw vs "PP3"); Datalab has written about it ([saturating post](https://www.datalab.to/blog/saturating-the-olmocr-benchmark), [Chandra 2.5](https://www.datalab.to/blog/chandra-2-5)). Newer benchmarks: OmniDocBench v1.5/v1.6, Datalab's OmniParseBench (16,288 tests, 2,937 pages, 92 languages; vendor-built).

### Nanonets-OCR
- **Nanonets-OCR-s** (Jun 2025) and **OCR2-3B** (Oct 2025): Qwen2.5-VL-3B fine-tunes outputting semantic markdown. LaTeX ($…$ vs $$…$$), `<img>` descriptions, `<signature>`, `<watermark>`, checkbox glyphs ☐☑☒, HTML tables ([HF card](https://huggingface.co/nanonets/Nanonets-OCR-s)). A good example of "OCR model as semantic tagger".

### dots.ocr → dots.mocr (rednote hi lab)
- **dots.ocr** (Jul 2025): 1.7B LLM; **one VLM jointly does layout detection, text recognition and reading order** in a single pass (paper argues multi-stage pipelines suffer error propagation) ([arXiv 2512.02498](https://arxiv.org/abs/2512.02498)). Supports prompted modes incl. region OCR (`dotsocr-grounding.png`) and full layout+order on dense newspapers (`dotsocr-reading-order.png`).
- **dots.mocr** (Mar 2026, 3B): "Multimodal OCR" parses charts/diagrams/icons into **SVG/code**. 83.9 olmOCR-Bench (self), second only to Gemini 3 Pro on their arena ([arXiv 2603.13032](https://arxiv.org/abs/2603.13032)).

### DeepSeek-OCR (Oct 2025) and DeepSeek-OCR 2 (Jan 2026): the "optical compression" idea
- **Question asked:** can a page *image* be a cheaper representation of text than the text tokens themselves? If 1,000 words fit in 100 vision tokens, images become a compression format for LLM context and memory.
- **Architecture:** **DeepEncoder** = SAM-base (80M, windowed/local attention on many 16x16 patches) → **16x convolutional token compressor** → CLIP-large (300M, global attention on the now-few tokens) → decoder **DeepSeek-3B-MoE (~570M active)** ([arXiv 2510.18234](https://arxiv.org/abs/2510.18234); image `deepseek-ocr-architecture-deepencoder.png`). Design goal: low activation memory at high resolution, with few output tokens.
- **Modes:** Tiny 512² → **64** tokens · Small 640² → **100** · Base 1024² → **256** · Large 1280² → **400** · Gundam (tiles n×640² + 1024² global) ([README](https://github.com/deepseek-ai/DeepSeek-OCR)).
- **Results:** ~**97% OCR precision at <10x text-to-vision-token compression**, ~**60% at 20x** (Fox benchmark). On OmniDocBench it beats GOT-OCR2.0 (256 tokens/page) with 100 tokens and MinerU2.0 (6,000+ tokens/page) with <800. Production throughput: **200k+ pages/day on one A100-40G** (≈2.3 pg/s [calc]). Image `deepseek-ocr-compression-fig1.png` is the money chart.
- **DeepSeek-OCR 2 / DeepEncoder V2:** replaces CLIP with a small LM (Qwen2-0.5B) as the vision encoder, with **learnable causal queries** that *reorder* visual tokens by semantics ("visual causal flow") instead of raster scan. The idea is that reading order emerges inside the encoder ([arXiv 2601.20552](https://arxiv.org/abs/2601.20552); image `deepseek-ocr2-fig1.png`). Default: (0–6)×144 + 256 visual tokens.

### Mistral OCR (API)
- Mar 2025 launch at 1,000 pages/$. OCR 3 (Dec 2025, `mistral-ocr-2512`): $2 / 1K, $1 batch; markdown with **HTML tables** (merged cells, multi-row headers). OCR 4 / 4.1 (2026): **paragraph-level bounding boxes with block labels in reading order**, header/footer extraction, hyperlinks, and confidence at page/block/**word** granularity ([docs](https://docs.mistral.ai/capabilities/document_ai/basic_ocr/), [models](https://docs.mistral.ai/getting-started/models/)). OCR 4 pricing of $4 / 1K ($2 batch) is **[unverified, secondary sources]**. The original 2025 model is deprecated. Architecture is unpublished.

### Strengths / failure modes of this family
- ✅ Handle scans, handwriting, math → LaTeX, complex tables → HTML, multilingual, charts → data. Self-hostable. 100–1,000x cheaper than frontier VLMs per page. Pipelines (A/B) give block boxes and reading order; some give word boxes + confidences.
- ❌ Generative failure modes: **repetition loops**, hallucinated or "autocompleted" rare strings, dropped blocks, wrong reading order on exotic layouts, max-token truncation on dense pages. Benchmark overfitting. Licence traps (OpenRAIL-M on Datalab weights). GPU needed for the VLM tier.

---

## 7. General frontier VLMs used directly (Gemini, GPT, Claude)

### What a VLM is actually doing when it reads a page
1. **Rasterise.** The PDF page is rendered to pixels by you or by the provider. Gemini scales PDF pages to max 3072x3072 and min 768x768 ([Gemini docs](https://ai.google.dev/gemini-api/docs/document-processing)). Claude converts each page to an image **and** extracts the page's text and supplies both ([Claude PDF docs](https://platform.claude.com/docs/en/build-with-claude/pdf-support)).
2. **Resize to the model's budget.** Every provider caps pixels or patches, and text smaller than ~1–2 patches gets blurry.
3. **Patchify → vision encoder.** The image is cut into fixed patches (Claude: **28x28 px**; OpenAI patch models: **32x32 px**). A ViT turns each patch (or a merged group) into an embedding: a "visual token".
4. **Project into the LLM's token space** and concatenate with your prompt tokens.
5. **Decode autoregressively.** The LLM writes markdown/JSON one token at a time, attending to the visual tokens. There is no explicit "character recogniser". Reading, layout and "understanding" are all the same next-token prediction. That is why it reads handwriting and charts well (a world model of language + charts helps), and also why it can **write fluent text that isn't on the page**.

### Tokens per page, concrete [verified from docs; letter-page numbers are calc]
| Provider | Rule (docs) | US Letter page @150 dpi (1275x1650 px) |
|---|---|---|
| **Gemini 3/4** | `media_resolution`: images low 280 / medium 560 / **high 1,120 (default)** / ultra_high 2,240. **PDF pages default 560**, or 280/560/1,120 **+ native text**. Docs: OCR "quality typically saturates at `medium`"; "Increasing to `high` rarely improves OCR results for standard documents." Native PDF text tokens are **not charged**. ([media resolution](https://ai.google.dev/gemini-api/docs/media-resolution), [document processing](https://ai.google.dev/gemini-api/docs/document-processing)) Legacy rule: 258 tokens per ≤384px image or per 768x768 tile; "each document page is equivalent to 258 tokens" on older models. | **560** (PDF default) |
| **Claude** | tokens = ⌈w/28⌉ × ⌈h/28⌉. Standard tier: long edge ≤1,568 px and ≤1,568 tokens. **High-res tier (Claude 4.7+): ≤2,576 px, ≤4,784 tokens.** PDF text adds "1,500–3,000 tokens per page" ([vision](https://platform.claude.com/docs/en/build-with-claude/vision), [PDF](https://platform.claude.com/docs/en/build-with-claude/pdf-support)) | std ≈ **1,500** image tokens (downsized to ~950x1,230) [calc]. high-res ≈ **2,714** (unresized). Plus text 1.5–3k. |
| **OpenAI patch models** (GPT-5.2 → GPT-5.6, GPT-6 Astra) | patches = ⌈w/32⌉×⌈h/32⌉, capped at 2,500 patches for `high` (10,000 for `original` on 5.4/5.5), × multiplier 1.2 ([OpenAI vision guide](https://developers.openai.com/api/docs/guides/images-vision)) | ≈ **2,080 patches → ~2,496 tokens** (high) [calc] |
| **OpenAI tile models** (gpt-4o/4.1, gpt-5/5.1, o3) | scale to fit 2048², shortest side → 768, then 512-px tiles: gpt-4o 85 + 170/tile. gpt-5.1 70 + 140/tile. | gpt-4o: 768x994 → 4 tiles → **765** tokens [calc] |

Teaching point: **a page is roughly 500–5,000 input tokens, but the output (the transcription) is often 500–2,000 tokens, and output tokens cost 4–8x more.** So VLM OCR cost is dominated by *writing the page back out*. DeepSeek-OCR flips this to ask how few input tokens a page really needs (64–400).

### Cost order of magnitude [calc, list prices from docs]
- **Gemini 3.8 Flash** ($0.75/M input, $3.75/M output through 2026-12-31; doubling 2027-01-01) ([pricing](https://ai.google.dev/gemini-api/docs/pricing)): 560 input + ~800 output tokens ≈ $0.0004 + $0.003 ≈ **~$3.4 per 1,000 pages**, ~half that with batch. Thinking tokens are billed as output and can multiply this.
- **Claude:** docs example says a 1,000x1,000 image costs ~$1.30 per 1K images on Haiku 4.5 ($1/M) and ~$5.18 per 1K on Opus 5.5 ($4/M, high-res). Add page text tokens and output tokens. Output price wasn't fetched, so I didn't compute an all-in figure.
- For contrast: olmOCR self-hosted ~$176–$178 per **million** pages. GPT-4o ~$6,240+ per million (olmOCR paper). Cloud layout APIs $4–$10 per 1K pages.

### Why VLMs are good at the hard stuff
- **Charts/diagrams:** they can read values off axes and describe trends, which no OCR can. Specialist models now emulate this (Chandra 2.5 chart schema, dots.mocr SVG).
- **Handwriting, stamps, photos of documents, odd scripts:** huge pretraining diversity. A language prior repairs partially legible words.
- **Semantic extraction in one step:** "give me `invoice_total` as JSON matching this schema". Structured output / JSON-schema modes (Gemini `responseSchema`, OpenAI Structured Outputs, Claude structured outputs) guarantee *valid JSON*, **not correct values**. [General; feature names not re-verified this session]

### Why they fail (mechanism → symptom)
- **Language prior > pixels.** The decoder prefers likely text: it "fixes" typos, normalises numbers/dates, completes truncated words, invents plausible table cells. Google's doc shows a competitor hallucinating table values (`google-docai-competitor-table-misalignment.png`). Datalab: ~61% of hard pages degenerate in raw single-pass output ([anti-hallucination](https://www.datalab.to/blog/anti-hallucination)).
- **Silent omission.** Long or dense pages hit max-output limits, or the model summarises ("…and similar rows"), skips headers/footers or repeated rows, or loops (repetition). There's no error, just a shorter answer.
- **Downscaling.** Tiny fonts fall below patch resolution after resize, so the model guesses. Gemini's docs suggest raising resolution for dense docs; Claude's high-res tier exists for "dense documents".
- **Long documents.** Many pages per call → attention dilution, page mix-ups, output cap. The standard practice is **page-at-a-time** (or a few pages) with an overlapping-table merge step.
- **Grounding is approximate.** Gemini can return boxes as `[ymin, xmin, ymax, xmax]` normalised to **0–1000** ([Gemini image docs](https://ai.google.dev/gemini-api/docs/image-understanding)). Claude returns pixel coordinates relative to the *resized* image and warns outputs "are approximate" ([Claude vision](https://platform.claude.com/docs/en/build-with-claude/vision)). Boxes are *generated text*, not measurements: good for highlighting, risky for audit.
- **No calibrated confidence.** You get no per-word confidence unless you use logprobs (where offered) or run it twice and compare. Contrast Surya 2's mean token probability per block, Mistral OCR 4's word confidences, and Textract/Azure confidences.
- **Determinism.** temperature=0 reduces but does not guarantee identical outputs across calls/versions; models get silently updated behind aliases. [General knowledge; mark as such]
- **Data residency / privacy:** e.g. Google's Gemini-3-based Layout Parser versions route through a global endpoint (not data-residency compliant).

### Where frontier VLMs stand on OCR benchmarks (self-reported by others, so treat with care)
- On olmOCR-Bench, Gemini Flash 2 scored 63.8 and GPT-4o 69.9 (both "anchored"), vs ~82–86 for specialist OCR-VLMs ([Chandra README table](https://github.com/datalab-to/chandra)). Marker's table lists Gemini Flash 3.5 at 76.4.
- On Datalab's OmniParseBench, **Gemini 3.8 Flash tops the headline at 92.9**, ahead of Datalab's own API (92.7). Datalab notes Gemini was "used in creating and verifying at least some tests" ([Chandra 2.5 post](https://www.datalab.to/blog/chandra-2-5)).
- dots.mocr ranks "second only to Gemini 3 Pro" on its OCR Arena Elo.
- Takeaway: **frontier generalists are now competitive or best on broad parsing and charts. Specialists win on cost per page, throughput, verifiability, and some text-fidelity benchmarks.**

---

## 8. Hybrids: where the frontier actually is (2026)
Recurring design moves worth a closing slide:
1. **Use the text layer when it's good, pixels when it isn't** (Marker fast, Docling, Indra, olmOCR v1 anchoring, Gemini/Claude feeding native PDF text alongside the image).
2. **Layout first at low res, read crops at high res** (MinerU2.5, PaddleOCR-VL, Surya block mode). Cheap global context + sharp local detail.
3. **Small specialist VLM for transcription; big LLM only for semantics** (Marker `--use_llm`, Google Layout Parser: OCR for text, Gemini for figure verbalisation and chunking).
4. **Verification loops:** confidence scores → regenerate/heal → mark illegible → human review (Datalab). RL with unit-test rewards (olmOCR 2).
5. **Everything returns geometry again:** Mistral OCR 4 paragraph boxes + word confidences; Chandra 15+ block types with boxes; Docling visual grounding. Provenance is back as a first-class requirement.

---

## 9. Images downloaded (`/Users/reeve/Developer/at-the-frontier/assets/doc-extraction/vendor/`)

All 60 files verified with `file` (all real PNG/JPEG/GIF), each ≤3.03 MB. ⭐ marks the best ~18 for "how it works" slides.

Licence note: these are third-party images, used here for an internal educational talk with attribution. Repo licences vary: Apache-2.0 (Surya/Marker/Chandra code; README images assumed same), MIT (Docling, dots.ocr), arXiv figures under the paper's licence, MS Learn docs (CC BY 4.0 per azure-docs repo, **[unverified]**), Google Cloud docs (CC BY 4.0 typical, **[unverified]**). **Caution:** `surya-table-recognition-scanned.png` shows a Nestlé document whose footer reads "do not share without written approval". Use `surya-table-recognition-taxform.png` instead if the deck may circulate.

| File | What it shows | Source page | Credit |
|---|---|---|---|
| ⭐ surya-text-detection-excerpt.png | Line-level text detection boxes on "Attention Is All You Need" p1 | https://github.com/datalab-to/surya | Datalab / Surya (Apache-2.0 code) |
| surya-ocr-excerpt.png | OCR'd text re-rendered at detected positions (same page) | same | Datalab / Surya |
| ⭐ surya-layout-excerpt.png | Layout block labels on the same page | same | Datalab / Surya |
| ⭐ surya-reading-order-excerpt.png | Numbered reading order (#0–#16) of layout blocks | same | Datalab / Surya |
| surya-layout-textbook.png | Layout labels on a textbook page | same | Datalab / Surya |
| surya-reading-order-textbook.png | Reading order on a textbook page | same | Datalab / Surya |
| surya-table-recognition-scanned.png | Row/column detection on a scanned table (Nestlé doc, see caution) | same | Datalab / Surya |
| ⭐ surya-table-recognition-taxform.png | Row/column/cell detection on a tax form | same | Datalab / Surya |
| surya-ocr-handwritten.png | OCR on handwritten notes | same | Datalab / Surya |
| surya2-olmocr-bench-size-chart.png | Surya 2 score vs model size (olmOCR-Bench) | same | Datalab |
| ⭐ chandra2-layout-blocks.png | Chandra 2 block types (Page-Header, Text, Diagram, Caption, Footer) with boxes | https://www.datalab.to/blog/chandra-2 | Datalab |
| chandra-handwritten-math.png | Handwritten math → rendered LaTeX | https://github.com/datalab-to/chandra | Datalab |
| chandra-handwritten-form.png | Filled handwritten form reconstructed incl. checkboxes | same | Datalab |
| chandra25-chart-input-teacher-salary.png | Bar chart input for the "chart → data table" example (output JSON in §6) | https://www.datalab.to/blog/chandra-2-5 | Datalab; chart from NCES *Condition of Education 2023* |
| ⭐ datalab-word-confidence-boxes.png | Word-level boxes coloured by confidence; one low-confidence word flagged (0.04) | https://www.datalab.to/blog/anti-hallucination | Datalab |
| datalab-illegible-manuscript-example.jpg | Unreadable manuscript that the system marks [illegible] rather than guessing | same | Datalab |
| indra-ocr-layout-lines-reading-order.png | CPU OCR output: labelled blocks + every line boxed | https://www.datalab.to/blog/indra-ocr | Datalab |
| indra-ocr-table-crop.png | Table crop input for HTML table output | same | Datalab |
| ⭐ marker-olmocr-bench-quality-vs-throughput.png | Quality vs pages/s: Marker modes vs MinerU, docling, Gemini, Chandra | https://github.com/datalab-to/marker | Datalab |
| ⭐ pdfminer-layout-hierarchy.png | LTPage → LTTextBox → LTTextLine → LTChar tree: what "layout analysis" of a digital PDF means | https://pdfminersix.readthedocs.io/en/latest/topic/converting_pdf_to_text.html | pdfminer.six (MIT) |
| ⭐ pdfplumber-visual-debugging.png | `extract_words()` rectangles drawn over a PDF table | https://github.com/jsvine/pdfplumber | Jeremy Singer-Vine / pdfplumber (MIT) |
| camelot-lattice-1-lines.png | Lattice step 1: detected ruling lines | https://camelot-py.readthedocs.io (how-it-works) | Camelot (MIT) |
| ⭐ camelot-lattice-2-joints.png | Lattice step 2: line intersections (red dots) on a table | same | Camelot |
| camelot-lattice-3-contour.png | Lattice step 3: table boundary | same | Camelot |
| camelot-lattice-4-table.png | Lattice step 4: reconstructed cell grid | same | Camelot |
| camelot-stream-textedges.png | Stream mode: text boxes + text edges (column guesses) on a page | same | Camelot |
| ⭐ azure-di-layout-example.png | Annotated page roles: header, title, section heading, paragraph, table, caption, figure, selection marks, footer, page number | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/layout | Microsoft Learn |
| azure-di-reading-order.png | Line numbering showing reading order across two columns | same | Microsoft Learn |
| azure-di-layout-sections.png | Sections/hierarchy detection | same | Microsoft Learn |
| azure-di-layout-figures.png | Figure detection with captions | same | Microsoft Learn |
| azure-di-handwriting-classification.png | Handwritten vs printed style classification | same | Microsoft Learn |
| ⭐ google-docai-competitor-table-misalignment.png | Unnamed "competitor parser" misaligning headers and hallucinating values in an Alphabet 10-K table | https://docs.cloud.google.com/document-ai/docs/layout-parse-chunk | Google Cloud docs |
| ⭐ docling-visual-grounding.png | Docling pipeline sketch (parse → OCR → layout → table structure → assemble) + a grounded paragraph box | https://github.com/docling-project/docling (docs/assets) | IBM / Docling (MIT) |
| docling-architecture.png | DocumentConverter → pipelines/backends → DoclingDocument → exports/chunkers | same | IBM / Docling |
| docling-processing-overview.png | Cartoon overview (formats in → DoclingDocument → outputs) | same | IBM / Docling |
| docling-confidence-scores.png | ConfidenceReport (layout/parse/table/ocr scores and grades) | same | IBM / Docling |
| docling-document-hierarchy.png | DoclingDocument tree structure | same | IBM / Docling |
| ⭐ layoutlm-architecture.png | LayoutLM: text + 2-D position (x0,y0,x1,y1) + image embeddings into BERT | https://arxiv.org/abs/1912.13318 | Xu et al., Microsoft |
| tableformer-architecture.png | TableFormer encoder + structure decoder + cell-bbox decoder | https://arxiv.org/abs/2203.01017 | Nassar et al., IBM |
| tableformer-complex-table-features.png | Why tables are hard: multi-column headers, multi-row cells, empty cells | same | Nassar et al., IBM |
| ⭐ donut-overview.png | Donut: image + task prompt → encoder-decoder → token sequence → JSON | https://github.com/clovaai/donut | Kim et al., NAVER Clova (MIT) |
| nougat-architecture.png | Nougat: Swin encoder → mBART decoder → markup | https://arxiv.org/abs/2308.13418 | Blecher et al., Meta |
| ⭐ mineru25-two-stage-architecture.png | MinerU2.5: low-res layout (Stage I) → native-res crop recognition (Stage II) | https://arxiv.org/abs/2509.22186 | OpenDataLab |
| mineru-layout-example.png | MinerU layout boxes + reading-order numbers on a two-column paper | https://github.com/opendatalab/MinerU | OpenDataLab |
| mineru-flowchart.png | Early MinerU flow: PDF-Extract-Kit → Magic-PDF → Markdown | same | OpenDataLab |
| mineru-project-panorama.png | MinerU project overview | same | OpenDataLab |
| ⭐ paddleocr-vl-overview.png | PaddleOCR-VL: PP-DocLayoutV2 layout + order → 0.9B VLM per element → Markdown/JSON | https://arxiv.org/abs/2510.14528 | Baidu PaddlePaddle |
| paddleocr-vl-09b-architecture.png | NaViT encoder + ERNIE-4.5-0.3B decoder | same | Baidu |
| paddleocr-architecture.png | PaddleOCR product stack (OCR / doc parsing / understanding series) | https://github.com/PaddlePaddle/PaddleOCR | Baidu |
| paddleocr-ppstructurev3-demo.gif | PP-StructureV3 animated demo (3.03 MB) | same | Baidu |
| ⭐ olmocr-document-anchoring.png | Text-layer snippets + coordinates injected into the VLM prompt | https://arxiv.org/abs/2502.18443 | Poznanski et al., AI2 |
| ⭐ olmocr-cost-pareto.png | Score vs cost per million pages (log): open VLMs vs APIs vs GPT/Gemini | https://github.com/allenai/olmocr | AI2 |
| olmocr2-timeline.png | olmOCR-Bench scores over time 2024–2025 (olmOCR, Marker, MinerU, others) | same | AI2 |
| ⭐ deepseek-ocr-architecture-deepencoder.png | SAM (local) → 16x conv compressor → CLIP (global) → DeepSeek-3B-MoE decoder | https://arxiv.org/abs/2510.18234 | DeepSeek-AI |
| ⭐ deepseek-ocr-compression-fig1.png | (a) precision vs compression ratio; (b) edit distance vs vision tokens per page across models | https://github.com/deepseek-ai/DeepSeek-OCR | DeepSeek-AI |
| deepseek-ocr-typical-vlm-encoders.png | Three common VLM encoder designs and their drawbacks | https://arxiv.org/abs/2510.18234 | DeepSeek-AI |
| deepseek-ocr-show1.jpg | Grounded markdown conversion + "deep parsing" of a geometry figure | https://github.com/deepseek-ai/DeepSeek-OCR | DeepSeek-AI |
| deepseek-ocr2-fig1.png | DeepEncoder vs DeepEncoder V2 (LM as vision encoder with causal reordering queries) | https://github.com/deepseek-ai/DeepSeek-OCR-2 | DeepSeek-AI |
| dotsocr-reading-order.png | Dense Chinese newspaper with numbered layout blocks → markdown | https://github.com/rednote-hilab/dots.ocr | rednote hi lab (MIT) |
| dotsocr-grounding.png | Region-prompted OCR: draw a box → table parsed to markdown | same | rednote hi lab |

Not kept: PaddleOCR-VL demo GIF (5.4 MB, over limit) and a duplicate Azure image were moved to `/private/tmp/claude-501/-Users-reeve-Developer-at-the-frontier/84134c9d-5805-4386-8e7a-b7919c3a24da/scratchpad/oversized/`, along with an unannotated PubLayNet sample.

---

## 10. Open items / caveats
- Mistral OCR 4 launch date and pricing: secondary sources only.
- Azure Form Recognizer 2019 preview date and Google Document AI GA date: not pinned.
- Chandra 2 parameter count: blog says 4B, HF metadata says ~5.3B total.
- Image licences for MS Learn / Google docs not confirmed.
- All benchmark numbers are vendor-reported, mostly on olmOCR-Bench (saturated, post-processing-sensitive) or vendor-built benchmarks (OmniParseBench). Competitor numbers in vendor READMEs (e.g. Marker's docling/MinerU runs) are competitor-run.
- PDF internals section (§2: ToUnicode, ligatures, tagged PDF) is from general knowledge of the PDF spec, except the pdfminer quotes.
