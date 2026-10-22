window.DX = {
 "columns": [
  {
   "key": "libs",
   "label": "PDF libraries and OCR",
   "color": "var(--ink-3)",
   "items": [
    {
     "id": "pdfplumber",
     "name": "pdfplumber",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT",
     "outputs": [
      "plain text",
      "chars/words with bounding boxes",
      "tables (heuristic)"
     ],
     "notes": "Born-digital PDFs only (no OCR). Best for precise coordinate-level text and rule-based table extraction; pure Python, slow on big files.",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "pymupdf",
     "name": "PyMuPDF",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "AGPL-3.0 or paid Artifex commercial licence",
     "outputs": [
      "plain text",
      "blocks/words with bounding boxes",
      "tables (find_tables)",
      "page images"
     ],
     "notes": "Fastest general PDF library (C/MuPDF). AGPL: closed-source/commercial distribution needs an Artifex licence (price not public). Can call Tesseract for OCR.",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "pymupdf4llm",
     "name": "pymupdf4llm",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "AGPL-3.0 or paid Artifex commercial licence",
     "outputs": [
      "markdown",
      "tables as markdown",
      "page chunks with metadata"
     ],
     "notes": "Thin PDF->Markdown layer over PyMuPDF for RAG. Very fast on born-digital; no layout model, so complex layouts/scans degrade. Same AGPL caveat.",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "pdfminer.six",
     "name": "pdfminer.six",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT",
     "outputs": [
      "plain text",
      "layout objects with bounding boxes"
     ],
     "notes": "Low-level text-layer parser that pdfplumber builds on. Accurate character positions, slow, no OCR, no tables.",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "pypdf",
     "name": "pypdf",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "BSD-3-Clause (GitHub shows NOASSERTION; project licence file is BSD-3)",
     "outputs": [
      "plain text"
     ],
     "notes": "Pure-Python PDF manipulation (split/merge/encrypt) with basic text extraction. Not a layout or table tool.",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "camelot",
     "name": "Camelot",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT",
     "outputs": [
      "tables -> DataFrame/CSV/JSON/HTML/Excel"
     ],
     "notes": "Table-only extraction from born-digital PDFs (lattice = ruled lines, stream = whitespace). Good on clean ruled tables; needs per-layout tuning.",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "tabula",
     "name": "Tabula",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT",
     "outputs": [
      "tables -> CSV/TSV/JSON/DataFrame"
     ],
     "notes": "Java table extractor with Python wrapper. Similar niche to Camelot; low maintenance activity (tabula-py last push Dec 2024).",
     "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public."
    },
    {
     "id": "tesseract",
     "name": "Tesseract",
     "cost": 0.0,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0",
     "outputs": [
      "plain text",
      "hOCR / ALTO / TSV with word bounding boxes and confidences",
      "searchable PDF"
     ],
     "notes": "Baseline LSTM OCR. Fine on clean printed scans; weak on tables, layout, handwriting and reading order. Often the hidden OCR inside OSS pipelines.",
     "basis": "Free licence; CPU-only. Compute cost not published by maintainers (roughly seconds of CPU per page; not verified)."
    },
    {
     "id": "abbyy-vantage",
     "name": "ABBYY",
     "cost": null,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary; on-prem and cloud editions",
     "outputs": [
      "text",
      "searchable PDF",
      "XML/JSON with bounding boxes and confidences",
      "pre-trained 'skills' for invoices, IDs etc."
     ],
     "notes": "Incumbent enterprise OCR/IDP with strong multilingual print OCR, human-in-the-loop validation and on-prem options. Expensive and implementation-heavy relative to VLM-era APIs.",
     "basis": "No public list price. UK G-Cloud 15 doc (Jan 2026) lists Vantage 'Core Cognitive Skills' at 0.1134 per transaction at 100K pages falling to 0.0616 at 1M (currency per G-Cloud, likely GBP); third-party estimates $0.04-0.10/page. FineReader PDF desktop is a per-seat subscription. Unverified with vendor."
    }
   ]
  },
  {
   "key": "cloud",
   "label": "Cloud document services",
   "color": "var(--teal)",
   "items": [
    {
     "id": "azure-di-read",
     "name": "Azure DI Read",
     "cost": 1.5,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
     "outputs": [
      "plain text",
      "lines/words with bounding polygons",
      "word confidences",
      "language"
     ],
     "notes": "Commodity OCR; cheap and robust incl. handwriting. No tables/structure.",
     "basis": "S0 Read Pages $1.50/1k pages for first 1M/month, $0.60/1k above 1M (Azure retail price API, eastus). Commitment tiers lower."
    },
    {
     "id": "azure-di-layout",
     "name": "Azure DI Layout",
     "cost": 10.0,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
     "outputs": [
      "markdown",
      "tables (cells, spans)",
      "paragraph roles/sections",
      "selection marks",
      "bounding polygons",
      "confidences",
      "figures"
     ],
     "notes": "The usual Azure default for RAG ingestion; markdown output is decent. Struggles on dense nested tables vs newer VLM parsers.",
     "basis": "S0 Layout pages $10/1k (retail API meter 'S0 Batch Layout Pages' $10, effective 2026-01-01; Layout historically billed at the prebuilt rate). Add-ons (high-res, formulas, fonts) +$6/1k; query fields +$10/1k."
    },
    {
     "id": "azure-di-prebuilt",
     "name": "Azure DI prebuilt",
     "cost": 10.0,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
     "outputs": [
      "JSON key-value fields with fixed schema",
      "tables",
      "bounding polygons",
      "field confidences"
     ],
     "notes": "Fixed schemas for common documents; no training. Good for invoices/receipts/IDs at scale.",
     "basis": "S0 Pre-built Pages $10/1k pages (retail API). Commitment tiers from ~$7.50/1k at 1M/month."
    },
    {
     "id": "azure-di-custom",
     "name": "Azure DI custom",
     "cost": 30.0,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
     "outputs": [
      "JSON fields with your schema",
      "bounding polygons",
      "field confidences"
     ],
     "notes": "Trainable on a handful of labelled samples; generative variant uses an LLM under the hood.",
     "basis": "S0 Custom Pages and S0 Custom Generative Pages $30/1k pages; training $3/hour; custom classifier $3/1k pages (retail API)."
    },
    {
     "id": "azure-content-understanding",
     "name": "Azure Content Understanding",
     "cost": 6.54,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "JSON fields with schema (generative)",
      "confidence scores",
      "grounding/source spans",
      "multimodal (audio/video too)"
     ],
     "notes": "Microsoft's LLM-native successor direction for extraction across docs/audio/video. Total cost depends on chosen GPT model and schema size.",
     "basis": "Layered meters: content extraction Basic $1/1k or Standard $5/1k pages (sync $1.5/$7.5), Layout add-on $5/1k, contextualization ~1,000 tokens/page at $1/1M std tokens, plus LLM input/output tokens from your Foundry model deployment for field extraction. $6.54/1k is Microsoft's own illustrative worked example, not a quote."
    },
    {
     "id": "aws-textract-detect",
     "name": "Textract OCR",
     "cost": 1.5,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "plain text",
      "lines/words with bounding boxes",
      "confidences"
     ],
     "notes": "Commodity OCR, incl. handwriting.",
     "basis": "$1.50/1k pages first 1M/month, $0.60/1k above (us-east-1 price list, published 2026-10-20)."
    },
    {
     "id": "aws-textract-layout",
     "name": "Textract Layout",
     "cost": 4.0,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "layout blocks (title, header, paragraph, list, table, figure) with bounding boxes",
      "reading order",
      "confidences"
     ],
     "notes": "Cheap layout/reading-order; you assemble markdown yourself (or via textractor helper).",
     "basis": "$4/1k pages first 1M, $3/1k above."
    },
    {
     "id": "aws-textract-tables",
     "name": "Textract Tables",
     "cost": 15.0,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "tables (cells, merged cells, headers)",
      "bounding boxes",
      "confidences"
     ],
     "notes": "Solid ruled-table extraction.",
     "basis": "$15/1k pages first 1M, $10/1k above."
    },
    {
     "id": "aws-textract-forms",
     "name": "Textract Forms",
     "cost": 50.0,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "key-value pairs",
      "selection marks",
      "bounding boxes",
      "confidences"
     ],
     "notes": "Expensive; key-value detection rather than schema extraction.",
     "basis": "$50/1k pages first 1M, $40/1k above."
    },
    {
     "id": "aws-bda-standard",
     "name": "Bedrock Data Automation",
     "cost": 10.0,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown/HTML/CSV/text per page",
      "element bounding boxes",
      "summaries",
      "JSON"
     ],
     "notes": "GenAI-native AWS parser; one API for docs, images, audio, video.",
     "basis": "$0.01 per page standard output (us-east-1 Bedrock price list)."
    },
    {
     "id": "aws-bda-custom",
     "name": "BDA custom",
     "cost": 40.0,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON fields per blueprint schema",
      "confidence scores",
      "bounding boxes / explainability"
     ],
     "notes": "Schema-driven extraction with blueprints; competes with Azure custom/CU and Google custom extractor.",
     "basis": "$0.04 per page custom output; +$0.0005 per field per page above 30 fields (us-east-1 Bedrock price list)."
    },
    {
     "id": "gcp-docai-ocr",
     "name": "Document AI OCR",
     "cost": 1.5,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "text",
      "blocks/lines/tokens with bounding boxes",
      "confidences",
      "language"
     ],
     "notes": "Commodity OCR, strong multilingual.",
     "basis": "$1.50/1k pages (1k-5M/month; first 1k free), $0.60/1k above 5M. OCR add-ons (math, font style, selection marks etc.) $6/1k. 1-yr/3-yr savings plans 10%/20% off."
    },
    {
     "id": "gcp-docai-layout-parser",
     "name": "Document AI Layout Parser",
     "cost": 10.0,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "structured blocks (headings, paragraphs, lists, tables)",
      "RAG-ready chunks",
      "markdown-like layout"
     ],
     "notes": "Google's RAG ingestion parser; newer versions run on Gemini. Weaker on coordinates than classic OCR processors.",
     "basis": "$10/1k pages flat, includes initial chunking; re-chunking $0.02/1k."
    },
    {
     "id": "gcp-docai-form-parser",
     "name": "Document AI Form Parser",
     "cost": 30.0,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "key-value pairs",
      "tables",
      "checkboxes",
      "bounding boxes",
      "confidences"
     ],
     "notes": "Generic forms/tables.",
     "basis": "$30/1k pages first 1M/month, $20/1k above."
    },
    {
     "id": "gcp-docai-custom-extractor",
     "name": "Document AI custom",
     "cost": 30.0,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON fields with your schema",
      "bounding boxes",
      "confidences"
     ],
     "notes": "Gemini-based few-shot/zero-shot schema extraction.",
     "basis": "$30/1k pages first 1M, $20/1k above; custom processor hosting $0.05/hour."
    }
   ]
  },
  {
   "key": "saas",
   "label": "Specialist APIs",
   "color": "var(--blue)",
   "items": [
    {
     "id": "datalab-api",
     "name": "Datalab API",
     "cost": 4.0,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary API; underlying Marker/Surya/Chandra weights OpenRAIL-M (modified)",
     "outputs": [
      "markdown",
      "HTML",
      "JSON blocks with bounding boxes",
      "chunks",
      "optional word/table-cell bboxes + confidences"
     ],
     "notes": "Hosted Marker/Chandra with improved models. Top-tier olmOCR-bench scores (Chandra 2 85.8 per Datalab). Extraction: fast $6, balanced $15, accurate $20 per 1k pages.",
     "basis": "Convert fast/balanced $4/1k pages; lite (CPU) $0.50; accurate $10. Team plan $400/mo includes $400 usage. EU residency +25%. Word bbox add-on +$3/1k."
    },
    {
     "id": "datalab-api-accurate",
     "name": "Datalab API (accurate)",
     "cost": 10.0,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary API",
     "outputs": [
      "markdown",
      "HTML",
      "JSON with bounding boxes"
     ],
     "notes": "Highest-fidelity Datalab mode (Chandra-class model).",
     "basis": "Convert accurate $10/1k pages (list)."
    },
    {
     "id": "mistral-ocr",
     "name": "Mistral OCR 4.1",
     "cost": 4.0,
     "deploy": {
      "cloud": "Azure \u00b7 GCP (older version)",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary; on-prem/self-deployment via Mistral enterprise licence",
     "outputs": [
      "markdown per page",
      "HTML/markdown tables",
      "image and paragraph bounding boxes",
      "block labels",
      "block/page confidence scores",
      "headers/footers"
     ],
     "notes": "Cheap, fast VLM OCR with 2026 upgrades (bboxes, block labels, confidences). Price doubled vs OCR 3 ($2) and 4x OCR 1 ($1).",
     "basis": "$4/1k pages (Mistral docs model card, OCR 4.1); Batch API 50% off -> ~$2/1k (Mistral pricing FAQ says batch halves API prices; OCR-specific batch rate from secondary sources). Azure Foundry OCR 4 global $4/1k, data-zone $4.40/1k."
    },
    {
     "id": "mistral-document-ai",
     "name": "Mistral Document AI",
     "cost": 5.0,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "JSON with schema (document and bbox annotations)",
      "bounding boxes",
      "confidences"
     ],
     "notes": "Schema-driven extraction on top of Mistral OCR.",
     "basis": "$5 per 1,000 annotated pages (Mistral model card; Azure retail 'OCR 4 annot glbl' $5/1k, DZ $5.50)."
    },
    {
     "id": "reducto-parse",
     "name": "Reducto Parse",
     "cost": 10.0,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "structured blocks JSON with bounding boxes",
      "tables (HTML/markdown)",
      "chart extraction",
      "JSON with schema (Extract)",
      "citations"
     ],
     "notes": "Strong on complex tables/financial docs and agentic extraction; enterprise focus (ZDR, VPC). Launched own r-1 model 2026.",
     "basis": "Parse r-1 $10/1k pages list; batch -20% ($8); Extract $20 (parse included); Deep Extract $40; Classify $7.50; Split $20. $150 free usage."
    },
    {
     "id": "reducto-extract",
     "name": "Reducto Extract",
     "cost": 20.0,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON with schema",
      "per-field citations/bounding boxes"
     ],
     "notes": "Schema extraction on top of Parse.",
     "basis": "$20/1k pages incl. parsing; Deep Extract (agentic) $40/1k."
    },
    {
     "id": "llamaparse-cost-effective",
     "name": "LlamaParse (cost-effective)",
     "cost": 3.75,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "JSON items with bounding boxes (layout extraction)",
      "tables",
      "images",
      "LlamaExtract JSON with schema, citations and confidences"
     ],
     "notes": "LLM-assisted parse. Auto mode routes pages between tiers.",
     "basis": "3 credits/page x $1.25 per 1,000 credits = $3.75/1k pages. Layout extraction +3 credits/page (+$3.75/1k). Plans: Free 10k credits, Starter $50/mo, Pro $500/mo."
    },
    {
     "id": "llamaparse-agentic",
     "name": "LlamaParse (agentic)",
     "cost": 12.5,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "JSON items with bounding boxes (layout extraction)",
      "tables",
      "images",
      "LlamaExtract JSON with schema, citations and confidences"
     ],
     "notes": "VLM/agentic page parsing; the usual default for complex docs. Auto mode routes pages between tiers.",
     "basis": "10 credits/page x $1.25 per 1,000 credits = $12.50/1k pages. Layout extraction +3 credits/page (+$3.75/1k). Plans: Free 10k credits, Starter $50/mo, Pro $500/mo."
    },
    {
     "id": "unstructured",
     "name": "Unstructured",
     "cost": 15.0,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary platform; open-source 'unstructured' library Apache-2.0",
     "outputs": [
      "JSON elements (Title, NarrativeText, Table...) with coordinates",
      "HTML tables",
      "chunks",
      "embeddings via connectors"
     ],
     "notes": "ETL-style ingestion with many connectors and chunking; parsing quality is mid-pack versus VLM-first parsers. OSS library usable free.",
     "basis": "Pay-as-you-go $0.015/page after 10,000 free pages; all features included."
    },
    {
     "id": "landing-ade",
     "name": "LandingAI ADE",
     "cost": 15.0,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "JSON chunks with types",
      "visual grounding bounding boxes",
      "JSON with schema (Extract)",
      "citations"
     ],
     "notes": "Strong visual grounding (every value traceable to page region). Variable per-page cost.",
     "basis": "PAYG $1 = 100 credits. Parse with DPT-3 Pro ~1.5 credits per typical 4,000-char page on Standard tier = ~$15/1k pages; DPT-3 Verity (preview) ~0.55 credits = ~$5.50/1k; Priority tier costs 2x. Extract adds ~1.5 credits/page (~$15/1k). Content-heavy pages cost more."
    },
    {
     "id": "extend-parse",
     "name": "Extend",
     "cost": 20.0,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "markdown",
      "JSON blocks with bounding boxes",
      "tables",
      "checkboxes",
      "JSON with schema (Extract)",
      "citations/confidence"
     ],
     "notes": "Full document-workflow platform (parse/extract/classify/split/edit, evals, review agent). Positioned upmarket on accuracy.",
     "basis": "$0.01/credit PAYG. Parse Performance 2 credits/page ($20/1k), Light 0.5 ($5/1k), Auto $5-20. Extract Performance +3 credits ($30/1k) plus parse => $50/1k for extraction; Light extract total ~$12/1k."
    },
    {
     "id": "upstage-document-parse",
     "name": "Upstage",
     "cost": 10.0,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "HTML/markdown/text",
      "elements with coordinates",
      "tables",
      "JSON with schema (Information Extract)"
     ],
     "notes": "Korean vendor; notable for being deployable inside AWS via SageMaker/Marketplace.",
     "basis": "Standard $0.01/page ($10/1k), Enhanced $0.03/page ($30/1k), ex-VAT (Upstage pricing page). AWS Marketplace listing shows Enhanced at $0.036/page (search snippet). Information Extract $0.04-0.06/page."
    },
    {
     "id": "databricks-ai-parse-document",
     "name": "Databricks ai_parse",
     "cost": null,
     "deploy": {
      "cloud": "Databricks on any cloud",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON elements with bounding boxes",
      "tables",
      "markdown-like text"
     ],
     "notes": "Notable because it runs inside the client's existing data platform on any hyperscaler. Snowflake AI_PARSE_DOCUMENT is the equivalent (per-page AI credits; rate not verified).",
     "basis": "Directional DBU estimates: ~10-15 DBUs per 1k simple pages (~$0.70-1.05) up to ~85-90 DBUs for complex pages (~$6). From search snippet of Databricks AI Functions pricing page; promo ended 2026-06-30. Unverified."
    },
    {
     "id": "hyperscience",
     "name": "Hyperscience",
     "cost": null,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON fields",
      "tables",
      "human-in-the-loop QA",
      "confidence-based routing"
     ],
     "notes": "Strong on handwriting/forms and accuracy SLAs via HITL; government/insurance heavy.",
     "basis": "Annual contracts; AWS Marketplace listing shows a 12-month 'Private Cloud Professional' at $50,000 (seen via search snippet, not opened). Vendr median ~$17k/yr. Unverified."
    },
    {
     "id": "instabase",
     "name": "Instabase",
     "cost": null,
     "deploy": {
      "cloud": "AWS Marketplace",
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON fields",
      "classification",
      "validation workflows",
      "apps/agents"
     ],
     "notes": "Enterprise IDP platform for banks/insurers; heavyweight, workflow + LLM orchestration.",
     "basis": "No public per-page list price. Third-party profile: consumption units, 100 CU = $1; enterprise contracts quote-based. Unverified."
    },
    {
     "id": "rossum",
     "name": "Rossum",
     "cost": null,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON fields",
      "line items",
      "validation UI",
      "ERP export"
     ],
     "notes": "Transactional docs (AP invoices, logistics) with validation UI.",
     "basis": "Starter plan 'starting at $18,000 per year'; volume-based quotes."
    },
    {
     "id": "nanonets-idp",
     "name": "Nanonets",
     "cost": null,
     "deploy": {
      "cloud": false,
      "self": false,
      "saas": true
     },
     "licence": "Proprietary",
     "outputs": [
      "JSON fields",
      "tables/line items",
      "exports to ERP/Sheets"
     ],
     "notes": "No-code AP/IDP workflows aimed at operations teams; per-document cost far above raw parsers. Also publishes open Nanonets-OCR models.",
     "basis": "Priced per workflow block run, not per page: simple $0.02, standard AI $0.10, complex AI (extraction) $0.30 per run. Vendor: typical invoice workflow 4-6 blocks, 'under $2 per invoice'. $50 free credits."
    }
   ]
  },
  {
   "key": "open",
   "label": "Open models (self-host)",
   "color": "var(--green)",
   "items": [
    {
     "id": "marker",
     "name": "Marker",
     "cost": 0.239,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Code Apache-2.0; weights modified OpenRAIL-M: free for research/personal and orgs under $5M revenue AND funding; above that a commercial licence is required; no competitive use with Datalab API",
     "outputs": [
      "markdown",
      "HTML",
      "JSON blocks with bounding boxes",
      "chunks",
      "tables",
      "LaTeX math"
     ],
     "notes": "Pipeline: PDF text layer + layout model + selective VLM OCR (Surya). Self-reported olmOCR-bench 76.0 balanced. Licence threshold makes most enterprise clients paying customers.",
     "basis": "Datalab README: balanced mode 2.9 pages/s sustained on ONE B200 (fast 7.4 pg/s; CPU-only no-OCR 23.7 pg/s). At $2.5/hr GPU proxy: balanced $0.239/1k, fast $0.094/1k. B200 rents above H100, so real cost maybe 1.5-2x. Excludes commercial licence fee."
    },
    {
     "id": "surya",
     "name": "Surya",
     "cost": 0.13,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Code Apache-2.0; weights modified OpenRAIL-M (free under $5M revenue/funding; commercial licence above)",
     "outputs": [
      "text lines with bounding boxes",
      "layout",
      "reading order",
      "tables",
      "HTML"
     ],
     "notes": "OCR/layout VLM used inside Marker; 90+ languages.",
     "basis": "README: 5.35 pages/s on a single RTX 5090 (vLLM, concurrency 128, 96 DPI, ~2,400 output tokens/page). At $2.5/hr proxy = $0.13/1k (an RTX 5090 rents for much less, so this overstates)."
    },
    {
     "id": "chandra",
     "name": "Chandra 2",
     "cost": 0.482,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Code Apache-2.0; weights modified OpenRAIL-M: free for research/personal and startups under $2M funding/revenue; no competitive use with Datalab API; commercial self-hosting requires licence",
     "outputs": [
      "markdown",
      "HTML",
      "JSON with layout blocks and bounding boxes",
      "tables",
      "math",
      "handwriting",
      "forms/checkboxes"
     ],
     "notes": "Released Mar 2026 (v2). Datalab-reported olmOCR-bench 85.8 (hosted, improved version) - top of public charts. Tightest licence of the group ($2M threshold).",
     "basis": "README: 1.44 pages/s on one H100 80GB (vLLM, 96 concurrent, olmOCR-bench mix); Datalab estimates ~2 pg/s real-world. At $2.5/hr: $0.482/1k (bench) or $0.347/1k (real-world est.). Excludes licence fee."
    },
    {
     "id": "docling",
     "name": "Docling",
     "cost": 0.331,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT (code); bundled models have own licences (Heron layout, TableFormer, granite-docling Apache-2.0)",
     "outputs": [
      "markdown",
      "HTML",
      "DoclingDocument JSON with bounding boxes and provenance",
      "tables",
      "chunks"
     ],
     "notes": "Most permissive enterprise-friendly pipeline (MIT), huge adoption (69k GitHub stars). Mid accuracy on hard scans/tables vs VLM-first models (Marker-measured olmOCR-bench 50.3).",
     "basis": "No vendor H100 figure. Competitor-measured (Marker README): 2.1 pages/s on one B200 in default pipeline -> $0.331/1k at $2.5/hr proxy. Runs on CPU too."
    },
    {
     "id": "granite-docling",
     "name": "Granite-Docling",
     "cost": null,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0",
     "outputs": [
      "DocTags -> markdown/HTML/JSON",
      "tables",
      "code",
      "equations",
      "layout with locations"
     ],
     "notes": "Successor to SmolDocling; end-to-end tiny VLM for Docling.",
     "basis": "No published throughput. Tiny (258M) - runs on CPU/Apple MLX; GPU cost would be negligible."
    },
    {
     "id": "mineru",
     "name": "MinerU",
     "cost": 0.328,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MinerU Open Source License = Apache-2.0 + conditions: commercial licence required if org (with affiliates) exceeds 100M MAU or USD 20M monthly revenue; attribution required for online services. MinerU2.5-Pro weights Apache-2.0 (older MinerU2.5-2509 weights AGPL-3.0)",
     "outputs": [
      "markdown",
      "JSON (content list with bounding boxes)",
      "tables (HTML)",
      "LaTeX formulas"
     ],
     "notes": "Top-tier on OmniDocBench; very popular (82k stars). The $20M/month revenue clause matters for large enterprises.",
     "basis": "MinerU2.5-Pro model card: ~2.12 pages/s concurrent on one A100 (vLLM async) -> $0.328/1k at $2.5/hr. Pipeline backend measured 0.54 pg/s on B200 by Datalab (competitor) -> $1.286/1k."
    },
    {
     "id": "paddleocr-vl",
     "name": "PaddleOCR-VL",
     "cost": 0.429,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0",
     "outputs": [
      "markdown",
      "JSON with layout blocks and bounding boxes",
      "tables",
      "formulas",
      "charts",
      "seals"
     ],
     "notes": "v1.6 released 2026-05-28; reports 96.3 on OmniDocBench v1.6 (near top). Small and cheap; Apache licence is enterprise-friendly.",
     "basis": "PaddleOCR-VL tech report (v1, Oct 2025) Table 13: 1.62 pages/s on one A100 (FastDeploy), 1.35 (vLLM); 2.23 pg/s on H800. -> $0.429/1k at $2.5/hr. No separate figure for v1.6."
    },
    {
     "id": "olmocr",
     "name": "olmOCR 2",
     "cost": 0.2,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0 (code and weights; Qwen2.5-VL-7B base, Apache-2.0)",
     "outputs": [
      "markdown",
      "plain text (natural reading order)",
      "tables (HTML/markdown)",
      "LaTeX equations"
     ],
     "notes": "Open training data and benchmark (olmOCR-bench is the de-facto open benchmark). No bounding boxes.",
     "basis": "Ai2 README: 'less than $200 USD per million pages' (= <$0.20/1k) on own GPUs. Hosted: DeepInfra $0.09 in / $0.19 out per M tokens."
    },
    {
     "id": "deepseek-ocr",
     "name": "DeepSeek-OCR",
     "cost": 0.301,
     "deploy": {
      "cloud": "GCP \u00b7 AWS",
      "self": true,
      "saas": false
     },
     "licence": "DeepSeek-OCR MIT; DeepSeek-OCR-2 (Jan 2026) Apache-2.0",
     "outputs": [
      "markdown",
      "text",
      "grounding boxes (prompted)",
      "charts/chemical formulas"
     ],
     "notes": "Optical context compression (<800 vision tokens/page). Accuracy behind PaddleOCR-VL/MinerU on public benchmarks but very cheap tokens.",
     "basis": "Paper: 200k+ pages/day on one A100-40G (~2.3 pg/s) -> $0.301/1k at $2.5/hr. Vertex MaaS at ~800 in + 800 out tokens/page ~= $1.20/1k (estimate)."
    },
    {
     "id": "dots-ocr",
     "name": "dots.ocr",
     "cost": 1.972,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT",
     "outputs": [
      "markdown",
      "JSON layout with bounding boxes and categories",
      "tables (HTML)",
      "LaTeX formulas"
     ],
     "notes": "1.7B single-model layout+OCR; strong multilingual. dots.mocr reported ~83.9 olmOCR-bench (secondary source).",
     "basis": "Only third-party figure: 0.35 pages/s on A100 (vLLM, measured in PaddleOCR-VL report) -> $1.972/1k at $2.5/hr. dots.mocr (Mar 2026) not benchmarked for speed."
    },
    {
     "id": "glm-ocr",
     "name": "GLM-OCR",
     "cost": 0.373,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "MIT",
     "outputs": [
      "markdown",
      "JSON with layout",
      "tables",
      "formulas"
     ],
     "notes": "Jan 2026 release; ~95 on OmniDocBench (secondary). Very popular download.",
     "basis": "Model card: 1.86 pages/s for PDFs at single concurrency (upper-bound cost; batching would be far cheaper) -> $0.373/1k at $2.5/hr."
    },
    {
     "id": "lightonocr",
     "name": "LightOnOCR",
     "cost": 0.122,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0",
     "outputs": [
      "markdown",
      "grounding mode: block labels + bounding boxes",
      "chart -> data tables",
      "image descriptions"
     ],
     "notes": "Brand-new (2026-10-06) LightOnOCR-3 family on Qwen3.5 architecture; French vendor, Apache licence.",
     "basis": "LightOnOCR-2-1B card: 5.71 pages/s on one H100 -> $0.122/1k at $2.5/hr (vendor claims '<$0.01 per 1,000 pages', which implies a far lower GPU rate). LightOnOCR-3 (Oct 2026) claims faster; no figure captured."
    },
    {
     "id": "qianfan-ocr",
     "name": "Qianfan-OCR",
     "cost": 0.678,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0",
     "outputs": [
      "markdown",
      "structured JSON",
      "tables",
      "key information extraction"
     ],
     "notes": "Mar 2026 end-to-end document model.",
     "basis": "Model card: 1.024 pages/s on one A100 with W8A8 -> $0.678/1k at $2.5/hr."
    },
    {
     "id": "nanonets-ocr2",
     "name": "Nanonets-OCR2",
     "cost": null,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "No licence declared on Hugging Face card (unverified; third-party listings say Apache-2.0). Base model Qwen2.5-VL-3B carries the 'qwen-research' licence - check before commercial use",
     "outputs": [
      "markdown",
      "HTML tables",
      "LaTeX",
      "checkboxes",
      "signatures/watermark tags",
      "flowcharts (mermaid)"
     ],
     "notes": "Image-to-markdown with semantic tags; olmOCR-bench ~69.5 per Ai2 table.",
     "basis": "No published throughput."
    },
    {
     "id": "hunyuan-ocr",
     "name": "HunyuanOCR",
     "cost": null,
     "deploy": {
      "cloud": false,
      "self": true,
      "saas": false
     },
     "licence": "Tencent Hunyuan Community licence - does NOT apply in EU, UK or South Korea",
     "outputs": [
      "markdown",
      "text spotting with boxes",
      "parsing",
      "translation"
     ],
     "notes": "Territorial licence exclusion is a blocker for EU/UK clients.",
     "basis": "No throughput captured."
    },
    {
     "id": "qwen3-vl",
     "name": "Qwen3-VL",
     "cost": null,
     "deploy": {
      "cloud": "AWS",
      "self": true,
      "saas": false
     },
     "licence": "Apache-2.0 (Qwen3-VL, Qwen3.5, Qwen3.8-27B); note Qwen3.8-Flash-Next uses 'qwen-community-1.0' licence",
     "outputs": [
      "markdown",
      "HTML/JSON (prompted)",
      "grounding boxes (prompted)",
      "JSON with schema (via guided decoding)"
     ],
     "notes": "Base model for many OCR specialists (olmOCR, Nanonets, LightOnOCR-3, OvisOCR2). Good generalist; Qwen3.8 (Aug 2026) is the newest generation.",
     "basis": "No vendor pages/s. Serverless on Bedrock priced per token (see qwen3-vl-235b in frontier VLM table)."
    }
   ]
  },
  {
   "key": "vlm",
   "label": "General models",
   "color": "var(--purple)",
   "items": [
    {
     "id": "gemini-3.8-flash",
     "name": "Gemini 3.8 Flash",
     "cost": 4.07,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Intro price to 2026-12-31, then $1.50/$7.50 (doubles to ~$8.13/1k).",
     "basis": "List $0.75/M in, $3.75/M out (batch $0.375/$1.875). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $4.07/1k pages, batch $2.03/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gemini-3.1-flash-lite",
     "name": "Gemini 3.1 Flash-Lite",
     "cost": 1.55,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Cheapest Gemini 3-gen tier.",
     "basis": "List $0.25/M in, $1.5/M out (batch $0.125/$0.75). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $1.55/1k pages, batch $0.78/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gemini-2.5-flash-lite",
     "name": "Gemini 2.5 Flash-Lite",
     "cost": 0.5,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Rock-bottom price; native PDF input ~$0.38/1k.",
     "basis": "List $0.1/M in, $0.4/M out (batch $0.05/$0.2). Per page: ~1,548 image tokens/page (estimate: 1275x1650 px tiled into 768px tiles x 258 tokens; native PDF input is 258 tokens/page, much cheaper) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $0.50/1k pages, batch $0.25/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gemini-3.1-pro-preview",
     "name": "Gemini 3.1 Pro",
     "cost": 12.44,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Preview status; >200k-token prompts cost more.",
     "basis": "List $2.0/M in, $12.0/M out (batch $1.0/$6.0). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $12.44/1k pages, batch $6.22/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gemini-4-argon",
     "name": "Gemini 4 Argon",
     "cost": 10.84,
     "deploy": {
      "cloud": "GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Flagship reasoning; intro price to 2026-11-30, then $4/$20 (doubles).",
     "basis": "List $2.0/M in, $10.0/M out (batch $1.0/$5.0). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $10.84/1k pages, batch $5.42/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gpt-6-luna",
     "name": "GPT-6 Luna",
     "cost": 0.68,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Small/cheap GPT-6 tier.",
     "basis": "List $0.1/M in, $0.5/M out (batch $0.05/$0.25). Per page: 2,496 image tokens/page ASSUMED (model not in OpenAI's multiplier table; assumed same 1.2x patch rule as gpt-6-astra) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $0.68/1k pages, batch $0.34/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gpt-5.4-nano",
     "name": "GPT-5.4 nano",
     "cost": 1.56,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "",
     "basis": "List $0.2/M in, $1.25/M out (batch $0.1/$0.625). Per page: 2,496 image tokens/page (1275x1650 px = 2,080 32px patches x 1.2 multiplier, detail=high, within 2,500-patch budget) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $1.56/1k pages, batch $0.78/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gpt-5.4-mini",
     "name": "GPT-5.4 mini",
     "cost": 5.7,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "",
     "basis": "List $0.75/M in, $4.5/M out (batch $0.375/$2.25). Per page: 2,496 image tokens/page (1275x1650 px = 2,080 32px patches x 1.2 multiplier, detail=high, within 2,500-patch budget) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $5.70/1k pages, batch $2.85/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gpt-6-sol",
     "name": "GPT-6 Sol",
     "cost": 13.59,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Mid-tier GPT-6.",
     "basis": "List $2.0/M in, $10.0/M out (batch $1.0/$5.0). Per page: 2,496 image tokens/page ASSUMED (model not in OpenAI's multiplier table; assumed same 1.2x patch rule as gpt-6-astra) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $13.59/1k pages, batch $6.80/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gpt-5.5",
     "name": "GPT-5.5",
     "cost": 37.98,
     "deploy": {
      "cloud": "Azure",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "",
     "basis": "List $5.0/M in, $30.0/M out (batch $2.5/$15.0). Per page: 2,496 image tokens/page (1275x1650 px = 2,080 32px patches x 1.2 multiplier, detail=high, within 2,500-patch budget) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $37.98/1k pages, batch $18.99/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "gpt-6-astra",
     "name": "GPT-6 Astra",
     "cost": 67.96,
     "deploy": {
      "cloud": "Azure \u00b7 AWS",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "OpenAI flagship; also on Amazon Bedrock (same $10/$50).",
     "basis": "List $10.0/M in, $50.0/M out (batch $5.0/$25.0). Per page: 2,496 image tokens/page (1275x1650 px = 2,080 32px patches x 1.2 multiplier, detail=high, within 2,500-patch budget) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $67.96/1k pages, batch $33.98/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "claude-haiku-5.5",
     "name": "Claude Haiku 5.5",
     "cost": 0.83,
     "deploy": {
      "cloud": "Azure \u00b7 AWS \u00b7 GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Very cheap; >100k-token prompts priced 5x higher (irrelevant per page).",
     "basis": "List $0.1/M in, $0.5/M out (batch $0.05/$0.25). Per page: 2,714 image tokens/page (ceil(1275/28) x ceil(1650/28) = 46x59; Claude 4.7+ high-res tier); text tokens x1.3 for the newer tokenizer + 390 prompt tokens in; 1040 output tokens (800 base, no reasoning tokens). => standard $0.83/1k pages, batch $0.42/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "claude-sonnet-5.5",
     "name": "Claude Sonnet 5.5",
     "cost": 16.61,
     "deploy": {
      "cloud": "Azure \u00b7 AWS \u00b7 GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "",
     "basis": "List $2.0/M in, $10.0/M out (batch $1.0/$5.0). Per page: 2,714 image tokens/page (ceil(1275/28) x ceil(1650/28) = 46x59; Claude 4.7+ high-res tier); text tokens x1.3 for the newer tokenizer + 390 prompt tokens in; 1040 output tokens (800 base, no reasoning tokens). => standard $16.61/1k pages, batch $8.30/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "claude-opus-5.5",
     "name": "Claude Opus 5.5",
     "cost": 33.22,
     "deploy": {
      "cloud": "Azure \u00b7 AWS \u00b7 GCP",
      "self": false,
      "saas": false
     },
     "licence": "Proprietary (API only)",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "",
     "basis": "List $4.0/M in, $20.0/M out (batch $2.0/$10.0). Per page: 2,714 image tokens/page (ceil(1275/28) x ceil(1650/28) = 46x59; Claude 4.7+ high-res tier); text tokens x1.3 for the newer tokenizer + 390 prompt tokens in; 1040 output tokens (800 base, no reasoning tokens). => standard $33.22/1k pages, batch $16.61/1k. US Letter rendered at 150 DPI (1275x1650)."
    },
    {
     "id": "qwen3-vl-235b",
     "name": "Qwen3-VL 235B",
     "cost": 3.39,
     "deploy": {
      "cloud": "AWS",
      "self": false,
      "saas": false
     },
     "licence": "Apache-2.0 open weights",
     "outputs": [
      "markdown/HTML (prompted)",
      "JSON with schema (structured outputs)",
      "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
      "no native confidences (logprobs limited)"
     ],
     "notes": "Open weights (Apache-2.0) served on Bedrock; batch = Bedrock batch rate.",
     "basis": "List $0.53/M in, $2.66/M out (batch $0.26/$1.33). Per page: 2,080 image tokens/page (estimate: 32px effective patch after 2x2 merge) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $3.39/1k pages, batch $1.68/1k. US Letter rendered at 150 DPI (1275x1650)."
    }
   ]
  }
 ],
 "calcModels": [
  {
   "id": "claude-fable-5.1",
   "name": "Claude Fable 5.1",
   "price": {
    "input": 10.0,
    "output": 50.0,
    "batch_input": 5.0,
    "batch_output": 25.0
   },
   "tok": {
    "input": 3104,
    "output": 1040
   }
  },
  {
   "id": "claude-haiku-4.5",
   "name": "Claude Haiku 4.5",
   "price": {
    "input": 1.0,
    "output": 5.0,
    "batch_input": 0.5,
    "batch_output": 2.5
   },
   "tok": {
    "input": 1860,
    "output": 800
   }
  },
  {
   "id": "claude-haiku-5.5",
   "name": "Claude Haiku 5.5",
   "price": {
    "input": 0.1,
    "output": 0.5,
    "batch_input": 0.05,
    "batch_output": 0.25
   },
   "tok": {
    "input": 3104,
    "output": 1040
   }
  },
  {
   "id": "claude-opus-5.5",
   "name": "Claude Opus 5.5",
   "price": {
    "input": 4.0,
    "output": 20.0,
    "batch_input": 2.0,
    "batch_output": 10.0
   },
   "tok": {
    "input": 3104,
    "output": 1040
   }
  },
  {
   "id": "claude-sonnet-4.6",
   "name": "Claude Sonnet 4.6",
   "price": {
    "input": 3.0,
    "output": 15.0,
    "batch_input": 1.5,
    "batch_output": 7.5
   },
   "tok": {
    "input": 1860,
    "output": 800
   }
  },
  {
   "id": "claude-sonnet-5.5",
   "name": "Claude Sonnet 5.5",
   "price": {
    "input": 2.0,
    "output": 10.0,
    "batch_input": 1.0,
    "batch_output": 5.0
   },
   "tok": {
    "input": 3104,
    "output": 1040
   }
  },
  {
   "id": "gpt-5-mini",
   "name": "GPT-5 mini (deprecated)",
   "price": {
    "input": 0.25,
    "output": 2.0,
    "batch_input": 0.125,
    "batch_output": 1.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5-nano",
   "name": "GPT-5 nano (deprecated)",
   "price": {
    "input": 0.05,
    "output": 0.4,
    "batch_input": 0.025,
    "batch_output": 0.2
   },
   "tok": {
    "input": 3420,
    "output": 800
   }
  },
  {
   "id": "gpt-5.2",
   "name": "GPT-5.2",
   "price": {
    "input": 1.75,
    "output": 14.0,
    "batch_input": 0.875,
    "batch_output": 7.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.4",
   "name": "GPT-5.4",
   "price": {
    "input": 2.5,
    "output": 15.0,
    "batch_input": 1.25,
    "batch_output": 7.5
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.4-mini",
   "name": "GPT-5.4 mini",
   "price": {
    "input": 0.75,
    "output": 4.5,
    "batch_input": 0.375,
    "batch_output": 2.25
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.4-nano",
   "name": "GPT-5.4 nano",
   "price": {
    "input": 0.2,
    "output": 1.25,
    "batch_input": 0.1,
    "batch_output": 0.625
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.5",
   "name": "GPT-5.5",
   "price": {
    "input": 5.0,
    "output": 30.0,
    "batch_input": 2.5,
    "batch_output": 15.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.6-luna",
   "name": "GPT-5.6 Luna",
   "price": {
    "input": 0.2,
    "output": 1.2,
    "batch_input": 0.1,
    "batch_output": 0.6
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.6-sol",
   "name": "GPT-5.6 Sol",
   "price": {
    "input": 4.0,
    "output": 20.0,
    "batch_input": 2.0,
    "batch_output": 10.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-5.6-terra",
   "name": "GPT-5.6 Terra",
   "price": {
    "input": 2.0,
    "output": 12.0,
    "batch_input": 1.0,
    "batch_output": 6.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-6-astra",
   "name": "GPT-6 Astra",
   "price": {
    "input": 10.0,
    "output": 50.0,
    "batch_input": 5.0,
    "batch_output": 25.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-6-luna",
   "name": "GPT-6 Luna",
   "price": {
    "input": 0.1,
    "output": 0.5,
    "batch_input": 0.05,
    "batch_output": 0.25
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-6-sol",
   "name": "GPT-6 Sol",
   "price": {
    "input": 2.0,
    "output": 10.0,
    "batch_input": 1.0,
    "batch_output": 5.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gpt-6.1-sol",
   "name": "GPT-6.1 Sol",
   "price": {
    "input": 2.0,
    "output": 10.0,
    "batch_input": 1.0,
    "batch_output": 5.0
   },
   "tok": {
    "input": 2796,
    "output": 800
   }
  },
  {
   "id": "gemini-2.5-flash",
   "name": "Gemini 2.5 Flash",
   "price": {
    "input": 0.3,
    "output": 2.5,
    "batch_input": 0.15,
    "batch_output": 1.25
   },
   "tok": {
    "input": 1848,
    "output": 800
   }
  },
  {
   "id": "gemini-2.5-flash-lite",
   "name": "Gemini 2.5 Flash-Lite",
   "price": {
    "input": 0.1,
    "output": 0.4,
    "batch_input": 0.05,
    "batch_output": 0.2
   },
   "tok": {
    "input": 1848,
    "output": 800
   }
  },
  {
   "id": "gemini-2.5-pro",
   "name": "Gemini 2.5 Pro",
   "price": {
    "input": 1.25,
    "output": 10.0,
    "batch_input": 0.625,
    "batch_output": 5.0
   },
   "tok": {
    "input": 1848,
    "output": 800
   }
  },
  {
   "id": "gemini-3-flash-preview",
   "name": "Gemini 3 Flash Preview",
   "price": {
    "input": 0.5,
    "output": 3.0,
    "batch_input": 0.25,
    "batch_output": 1.5
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "gemini-3.1-flash-lite",
   "name": "Gemini 3.1 Flash-Lite",
   "price": {
    "input": 0.25,
    "output": 1.5,
    "batch_input": 0.125,
    "batch_output": 0.75
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "gemini-3.1-pro-preview",
   "name": "Gemini 3.1 Pro",
   "price": {
    "input": 2.0,
    "output": 12.0,
    "batch_input": 1.0,
    "batch_output": 6.0
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "gemini-3.5-flash-lite",
   "name": "Gemini 3.5 Flash-Lite",
   "price": {
    "input": 0.3,
    "output": 2.5,
    "batch_input": 0.15,
    "batch_output": 1.25
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "gemini-3.6-flash",
   "name": "Gemini 3.6 Flash",
   "price": {
    "input": 0.75,
    "output": 3.75,
    "batch_input": 0.375,
    "batch_output": 1.875
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "gemini-3.8-flash",
   "name": "Gemini 3.8 Flash",
   "price": {
    "input": 0.75,
    "output": 3.75,
    "batch_input": 0.375,
    "batch_output": 1.875
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "gemini-4-argon",
   "name": "Gemini 4 Argon",
   "price": {
    "input": 2.0,
    "output": 10.0,
    "batch_input": 1.0,
    "batch_output": 5.0
   },
   "tok": {
    "input": 1420,
    "output": 800
   }
  },
  {
   "id": "qwen3-vl-235b",
   "name": "Qwen3-VL 235B",
   "price": {
    "input": 0.53,
    "output": 2.66,
    "batch_input": 0.26,
    "batch_output": 1.33
   },
   "tok": {
    "input": 2380,
    "output": 800
   }
  }
 ],
 "ladder": [
  {
   "id": "pdfplumber",
   "name": "pdfplumber",
   "cost": 0.0,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "MIT",
   "outputs": [
    "plain text",
    "chars/words with bounding boxes",
    "tables (heuristic)"
   ],
   "notes": "Born-digital PDFs only (no OCR). Best for precise coordinate-level text and rule-based table extraction; pure Python, slow on big files.",
   "basis": "Free licence; CPU-only, compute negligible (well under $0.01 per 1k pages). PyMuPDF AGPL commercial licence cost not public.",
   "fam": "libs"
  },
  {
   "id": "tesseract",
   "name": "Tesseract",
   "cost": 0.0,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "Apache-2.0",
   "outputs": [
    "plain text",
    "hOCR / ALTO / TSV with word bounding boxes and confidences",
    "searchable PDF"
   ],
   "notes": "Baseline LSTM OCR. Fine on clean printed scans; weak on tables, layout, handwriting and reading order. Often the hidden OCR inside OSS pipelines.",
   "basis": "Free licence; CPU-only. Compute cost not published by maintainers (roughly seconds of CPU per page; not verified).",
   "fam": "libs"
  },
  {
   "id": "lightonocr",
   "name": "LightOnOCR",
   "cost": 0.122,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "Apache-2.0",
   "outputs": [
    "markdown",
    "grounding mode: block labels + bounding boxes",
    "chart -> data tables",
    "image descriptions"
   ],
   "notes": "Brand-new (2026-10-06) LightOnOCR-3 family on Qwen3.5 architecture; French vendor, Apache licence.",
   "basis": "LightOnOCR-2-1B card: 5.71 pages/s on one H100 -> $0.122/1k at $2.5/hr (vendor claims '<$0.01 per 1,000 pages', which implies a far lower GPU rate). LightOnOCR-3 (Oct 2026) claims faster; no figure captured.",
   "fam": "open"
  },
  {
   "id": "olmocr",
   "name": "olmOCR 2",
   "cost": 0.2,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "Apache-2.0 (code and weights; Qwen2.5-VL-7B base, Apache-2.0)",
   "outputs": [
    "markdown",
    "plain text (natural reading order)",
    "tables (HTML/markdown)",
    "LaTeX equations"
   ],
   "notes": "Open training data and benchmark (olmOCR-bench is the de-facto open benchmark). No bounding boxes.",
   "basis": "Ai2 README: 'less than $200 USD per million pages' (= <$0.20/1k) on own GPUs. Hosted: DeepInfra $0.09 in / $0.19 out per M tokens.",
   "fam": "open"
  },
  {
   "id": "marker",
   "name": "Marker",
   "cost": 0.239,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "Code Apache-2.0; weights modified OpenRAIL-M: free for research/personal and orgs under $5M revenue AND funding; above that a commercial licence is required; no competitive use with Datalab API",
   "outputs": [
    "markdown",
    "HTML",
    "JSON blocks with bounding boxes",
    "chunks",
    "tables",
    "LaTeX math"
   ],
   "notes": "Pipeline: PDF text layer + layout model + selective VLM OCR (Surya). Self-reported olmOCR-bench 76.0 balanced. Licence threshold makes most enterprise clients paying customers.",
   "basis": "Datalab README: balanced mode 2.9 pages/s sustained on ONE B200 (fast 7.4 pg/s; CPU-only no-OCR 23.7 pg/s). At $2.5/hr GPU proxy: balanced $0.239/1k, fast $0.094/1k. B200 rents above H100, so real cost maybe 1.5-2x. Excludes commercial licence fee.",
   "fam": "open"
  },
  {
   "id": "deepseek-ocr",
   "name": "DeepSeek-OCR",
   "cost": 0.301,
   "deploy": {
    "cloud": "GCP \u00b7 AWS",
    "self": true,
    "saas": false
   },
   "licence": "DeepSeek-OCR MIT; DeepSeek-OCR-2 (Jan 2026) Apache-2.0",
   "outputs": [
    "markdown",
    "text",
    "grounding boxes (prompted)",
    "charts/chemical formulas"
   ],
   "notes": "Optical context compression (<800 vision tokens/page). Accuracy behind PaddleOCR-VL/MinerU on public benchmarks but very cheap tokens.",
   "basis": "Paper: 200k+ pages/day on one A100-40G (~2.3 pg/s) -> $0.301/1k at $2.5/hr. Vertex MaaS at ~800 in + 800 out tokens/page ~= $1.20/1k (estimate).",
   "fam": "open"
  },
  {
   "id": "paddleocr-vl",
   "name": "PaddleOCR-VL",
   "cost": 0.429,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "Apache-2.0",
   "outputs": [
    "markdown",
    "JSON with layout blocks and bounding boxes",
    "tables",
    "formulas",
    "charts",
    "seals"
   ],
   "notes": "v1.6 released 2026-05-28; reports 96.3 on OmniDocBench v1.6 (near top). Small and cheap; Apache licence is enterprise-friendly.",
   "basis": "PaddleOCR-VL tech report (v1, Oct 2025) Table 13: 1.62 pages/s on one A100 (FastDeploy), 1.35 (vLLM); 2.23 pg/s on H800. -> $0.429/1k at $2.5/hr. No separate figure for v1.6.",
   "fam": "open"
  },
  {
   "id": "chandra",
   "name": "Chandra 2",
   "cost": 0.482,
   "deploy": {
    "cloud": false,
    "self": true,
    "saas": false
   },
   "licence": "Code Apache-2.0; weights modified OpenRAIL-M: free for research/personal and startups under $2M funding/revenue; no competitive use with Datalab API; commercial self-hosting requires licence",
   "outputs": [
    "markdown",
    "HTML",
    "JSON with layout blocks and bounding boxes",
    "tables",
    "math",
    "handwriting",
    "forms/checkboxes"
   ],
   "notes": "Released Mar 2026 (v2). Datalab-reported olmOCR-bench 85.8 (hosted, improved version) - top of public charts. Tightest licence of the group ($2M threshold).",
   "basis": "README: 1.44 pages/s on one H100 80GB (vLLM, 96 concurrent, olmOCR-bench mix); Datalab estimates ~2 pg/s real-world. At $2.5/hr: $0.482/1k (bench) or $0.347/1k (real-world est.). Excludes licence fee.",
   "fam": "open"
  },
  {
   "id": "gemini-2.5-flash-lite",
   "name": "Gemini 2.5 Flash-Lite",
   "cost": 0.5,
   "deploy": {
    "cloud": "GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "Rock-bottom price; native PDF input ~$0.38/1k.",
   "basis": "List $0.1/M in, $0.4/M out (batch $0.05/$0.2). Per page: ~1,548 image tokens/page (estimate: 1275x1650 px tiled into 768px tiles x 258 tokens; native PDF input is 258 tokens/page, much cheaper) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $0.50/1k pages, batch $0.25/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "gpt-6-luna",
   "name": "GPT-6 Luna",
   "cost": 0.68,
   "deploy": {
    "cloud": "Azure",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "Small/cheap GPT-6 tier.",
   "basis": "List $0.1/M in, $0.5/M out (batch $0.05/$0.25). Per page: 2,496 image tokens/page ASSUMED (model not in OpenAI's multiplier table; assumed same 1.2x patch rule as gpt-6-astra) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $0.68/1k pages, batch $0.34/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "claude-haiku-5.5",
   "name": "Claude Haiku 5.5",
   "cost": 0.83,
   "deploy": {
    "cloud": "Azure \u00b7 AWS \u00b7 GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "Very cheap; >100k-token prompts priced 5x higher (irrelevant per page).",
   "basis": "List $0.1/M in, $0.5/M out (batch $0.05/$0.25). Per page: 2,714 image tokens/page (ceil(1275/28) x ceil(1650/28) = 46x59; Claude 4.7+ high-res tier); text tokens x1.3 for the newer tokenizer + 390 prompt tokens in; 1040 output tokens (800 base, no reasoning tokens). => standard $0.83/1k pages, batch $0.42/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "llamaparse-fast",
   "name": "LlamaParse - Fast tier",
   "cost": 1.25,
   "deploy": {
    "cloud": "AWS Marketplace",
    "self": false,
    "saas": true
   },
   "licence": "Proprietary",
   "outputs": [
    "markdown",
    "JSON items with bounding boxes (layout extraction)",
    "tables",
    "images",
    "LlamaExtract JSON with schema, citations and confidences"
   ],
   "notes": "No-AI text extraction tier. Auto mode routes pages between tiers.",
   "basis": "1 credits/page x $1.25 per 1,000 credits = $1.25/1k pages. Layout extraction +3 credits/page (+$3.75/1k). Plans: Free 10k credits, Starter $50/mo, Pro $500/mo.",
   "fam": "saas"
  },
  {
   "id": "azure-di-read",
   "name": "Azure DI Read",
   "cost": 1.5,
   "deploy": {
    "cloud": "Azure",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
   "outputs": [
    "plain text",
    "lines/words with bounding polygons",
    "word confidences",
    "language"
   ],
   "notes": "Commodity OCR; cheap and robust incl. handwriting. No tables/structure.",
   "basis": "S0 Read Pages $1.50/1k pages for first 1M/month, $0.60/1k above 1M (Azure retail price API, eastus). Commitment tiers lower.",
   "fam": "cloud"
  },
  {
   "id": "aws-textract-detect",
   "name": "Textract OCR",
   "cost": 1.5,
   "deploy": {
    "cloud": "AWS",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary",
   "outputs": [
    "plain text",
    "lines/words with bounding boxes",
    "confidences"
   ],
   "notes": "Commodity OCR, incl. handwriting.",
   "basis": "$1.50/1k pages first 1M/month, $0.60/1k above (us-east-1 price list, published 2026-10-20).",
   "fam": "cloud"
  },
  {
   "id": "gemini-3.1-flash-lite",
   "name": "Gemini 3.1 Flash-Lite",
   "cost": 1.55,
   "deploy": {
    "cloud": "GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "Cheapest Gemini 3-gen tier.",
   "basis": "List $0.25/M in, $1.5/M out (batch $0.125/$0.75). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $1.55/1k pages, batch $0.78/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "mistral-ocr",
   "name": "Mistral OCR 4.1",
   "cost": 4.0,
   "deploy": {
    "cloud": "Azure \u00b7 GCP (older version)",
    "self": false,
    "saas": true
   },
   "licence": "Proprietary; on-prem/self-deployment via Mistral enterprise licence",
   "outputs": [
    "markdown per page",
    "HTML/markdown tables",
    "image and paragraph bounding boxes",
    "block labels",
    "block/page confidence scores",
    "headers/footers"
   ],
   "notes": "Cheap, fast VLM OCR with 2026 upgrades (bboxes, block labels, confidences). Price doubled vs OCR 3 ($2) and 4x OCR 1 ($1).",
   "basis": "$4/1k pages (Mistral docs model card, OCR 4.1); Batch API 50% off -> ~$2/1k (Mistral pricing FAQ says batch halves API prices; OCR-specific batch rate from secondary sources). Azure Foundry OCR 4 global $4/1k, data-zone $4.40/1k.",
   "fam": "saas"
  },
  {
   "id": "datalab-api",
   "name": "Datalab API",
   "cost": 4.0,
   "deploy": {
    "cloud": false,
    "self": false,
    "saas": true
   },
   "licence": "Proprietary API; underlying Marker/Surya/Chandra weights OpenRAIL-M (modified)",
   "outputs": [
    "markdown",
    "HTML",
    "JSON blocks with bounding boxes",
    "chunks",
    "optional word/table-cell bboxes + confidences"
   ],
   "notes": "Hosted Marker/Chandra with improved models. Top-tier olmOCR-bench scores (Chandra 2 85.8 per Datalab). Extraction: fast $6, balanced $15, accurate $20 per 1k pages.",
   "basis": "Convert fast/balanced $4/1k pages; lite (CPU) $0.50; accurate $10. Team plan $400/mo includes $400 usage. EU residency +25%. Word bbox add-on +$3/1k.",
   "fam": "saas"
  },
  {
   "id": "aws-textract-layout",
   "name": "Textract Layout",
   "cost": 4.0,
   "deploy": {
    "cloud": "AWS",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary",
   "outputs": [
    "layout blocks (title, header, paragraph, list, table, figure) with bounding boxes",
    "reading order",
    "confidences"
   ],
   "notes": "Cheap layout/reading-order; you assemble markdown yourself (or via textractor helper).",
   "basis": "$4/1k pages first 1M, $3/1k above.",
   "fam": "cloud"
  },
  {
   "id": "gemini-3.8-flash",
   "name": "Gemini 3.8 Flash",
   "cost": 4.07,
   "deploy": {
    "cloud": "GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "Intro price to 2026-12-31, then $1.50/$7.50 (doubles to ~$8.13/1k).",
   "basis": "List $0.75/M in, $3.75/M out (batch $0.375/$1.875). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $4.07/1k pages, batch $2.03/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "gpt-5.4-mini",
   "name": "GPT-5.4 mini",
   "cost": 5.7,
   "deploy": {
    "cloud": "Azure",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "",
   "basis": "List $0.75/M in, $4.5/M out (batch $0.375/$2.25). Per page: 2,496 image tokens/page (1275x1650 px = 2,080 32px patches x 1.2 multiplier, detail=high, within 2,500-patch budget) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $5.70/1k pages, batch $2.85/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "azure-di-layout",
   "name": "Azure DI Layout",
   "cost": 10.0,
   "deploy": {
    "cloud": "Azure",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
   "outputs": [
    "markdown",
    "tables (cells, spans)",
    "paragraph roles/sections",
    "selection marks",
    "bounding polygons",
    "confidences",
    "figures"
   ],
   "notes": "The usual Azure default for RAG ingestion; markdown output is decent. Struggles on dense nested tables vs newer VLM parsers.",
   "basis": "S0 Layout pages $10/1k (retail API meter 'S0 Batch Layout Pages' $10, effective 2026-01-01; Layout historically billed at the prebuilt rate). Add-ons (high-res, formulas, fonts) +$6/1k; query fields +$10/1k.",
   "fam": "cloud"
  },
  {
   "id": "gcp-docai-layout-parser",
   "name": "Document AI Layout Parser",
   "cost": 10.0,
   "deploy": {
    "cloud": "GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary",
   "outputs": [
    "structured blocks (headings, paragraphs, lists, tables)",
    "RAG-ready chunks",
    "markdown-like layout"
   ],
   "notes": "Google's RAG ingestion parser; newer versions run on Gemini. Weaker on coordinates than classic OCR processors.",
   "basis": "$10/1k pages flat, includes initial chunking; re-chunking $0.02/1k.",
   "fam": "cloud"
  },
  {
   "id": "reducto-parse",
   "name": "Reducto Parse",
   "cost": 10.0,
   "deploy": {
    "cloud": "AWS Marketplace",
    "self": false,
    "saas": true
   },
   "licence": "Proprietary",
   "outputs": [
    "markdown",
    "structured blocks JSON with bounding boxes",
    "tables (HTML/markdown)",
    "chart extraction",
    "JSON with schema (Extract)",
    "citations"
   ],
   "notes": "Strong on complex tables/financial docs and agentic extraction; enterprise focus (ZDR, VPC). Launched own r-1 model 2026.",
   "basis": "Parse r-1 $10/1k pages list; batch -20% ($8); Extract $20 (parse included); Deep Extract $40; Classify $7.50; Split $20. $150 free usage.",
   "fam": "saas"
  },
  {
   "id": "datalab-api-accurate",
   "name": "Datalab API (accurate)",
   "cost": 10.0,
   "deploy": {
    "cloud": false,
    "self": false,
    "saas": true
   },
   "licence": "Proprietary API",
   "outputs": [
    "markdown",
    "HTML",
    "JSON with bounding boxes"
   ],
   "notes": "Highest-fidelity Datalab mode (Chandra-class model).",
   "basis": "Convert accurate $10/1k pages (list).",
   "fam": "saas"
  },
  {
   "id": "gemini-4-argon",
   "name": "Gemini 4 Argon",
   "cost": 10.84,
   "deploy": {
    "cloud": "GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "Flagship reasoning; intro price to 2026-11-30, then $4/$20 (doubles).",
   "basis": "List $2.0/M in, $10.0/M out (batch $1.0/$5.0). Per page: 1,120 image tokens/page (Gemini 3+/4 default for images = 'high'; PDFs default to 'medium' 560 + native text tokens) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $10.84/1k pages, batch $5.42/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "llamaparse-agentic",
   "name": "LlamaParse (agentic)",
   "cost": 12.5,
   "deploy": {
    "cloud": "AWS Marketplace",
    "self": false,
    "saas": true
   },
   "licence": "Proprietary",
   "outputs": [
    "markdown",
    "JSON items with bounding boxes (layout extraction)",
    "tables",
    "images",
    "LlamaExtract JSON with schema, citations and confidences"
   ],
   "notes": "VLM/agentic page parsing; the usual default for complex docs. Auto mode routes pages between tiers.",
   "basis": "10 credits/page x $1.25 per 1,000 credits = $12.50/1k pages. Layout extraction +3 credits/page (+$3.75/1k). Plans: Free 10k credits, Starter $50/mo, Pro $500/mo.",
   "fam": "saas"
  },
  {
   "id": "unstructured",
   "name": "Unstructured",
   "cost": 15.0,
   "deploy": {
    "cloud": "AWS Marketplace",
    "self": false,
    "saas": true
   },
   "licence": "Proprietary platform; open-source 'unstructured' library Apache-2.0",
   "outputs": [
    "JSON elements (Title, NarrativeText, Table...) with coordinates",
    "HTML tables",
    "chunks",
    "embeddings via connectors"
   ],
   "notes": "ETL-style ingestion with many connectors and chunking; parsing quality is mid-pack versus VLM-first parsers. OSS library usable free.",
   "basis": "Pay-as-you-go $0.015/page after 10,000 free pages; all features included.",
   "fam": "saas"
  },
  {
   "id": "landing-ade",
   "name": "LandingAI ADE",
   "cost": 15.0,
   "deploy": {
    "cloud": false,
    "self": false,
    "saas": true
   },
   "licence": "Proprietary",
   "outputs": [
    "markdown",
    "JSON chunks with types",
    "visual grounding bounding boxes",
    "JSON with schema (Extract)",
    "citations"
   ],
   "notes": "Strong visual grounding (every value traceable to page region). Variable per-page cost.",
   "basis": "PAYG $1 = 100 credits. Parse with DPT-3 Pro ~1.5 credits per typical 4,000-char page on Standard tier = ~$15/1k pages; DPT-3 Verity (preview) ~0.55 credits = ~$5.50/1k; Priority tier costs 2x. Extract adds ~1.5 credits/page (~$15/1k). Content-heavy pages cost more.",
   "fam": "saas"
  },
  {
   "id": "claude-sonnet-5.5",
   "name": "Claude Sonnet 5.5",
   "cost": 16.61,
   "deploy": {
    "cloud": "Azure \u00b7 AWS \u00b7 GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "",
   "basis": "List $2.0/M in, $10.0/M out (batch $1.0/$5.0). Per page: 2,714 image tokens/page (ceil(1275/28) x ceil(1650/28) = 46x59; Claude 4.7+ high-res tier); text tokens x1.3 for the newer tokenizer + 390 prompt tokens in; 1040 output tokens (800 base, no reasoning tokens). => standard $16.61/1k pages, batch $8.30/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "extend-parse",
   "name": "Extend",
   "cost": 20.0,
   "deploy": {
    "cloud": false,
    "self": false,
    "saas": true
   },
   "licence": "Proprietary",
   "outputs": [
    "markdown",
    "JSON blocks with bounding boxes",
    "tables",
    "checkboxes",
    "JSON with schema (Extract)",
    "citations/confidence"
   ],
   "notes": "Full document-workflow platform (parse/extract/classify/split/edit, evals, review agent). Positioned upmarket on accuracy.",
   "basis": "$0.01/credit PAYG. Parse Performance 2 credits/page ($20/1k), Light 0.5 ($5/1k), Auto $5-20. Extract Performance +3 credits ($30/1k) plus parse => $50/1k for extraction; Light extract total ~$12/1k.",
   "fam": "saas"
  },
  {
   "id": "azure-di-custom",
   "name": "Azure DI custom",
   "cost": 30.0,
   "deploy": {
    "cloud": "Azure",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary; disconnected/on-prem containers available on commitment tiers",
   "outputs": [
    "JSON fields with your schema",
    "bounding polygons",
    "field confidences"
   ],
   "notes": "Trainable on a handful of labelled samples; generative variant uses an LLM under the hood.",
   "basis": "S0 Custom Pages and S0 Custom Generative Pages $30/1k pages; training $3/hour; custom classifier $3/1k pages (retail API).",
   "fam": "cloud"
  },
  {
   "id": "claude-opus-5.5",
   "name": "Claude Opus 5.5",
   "cost": 33.22,
   "deploy": {
    "cloud": "Azure \u00b7 AWS \u00b7 GCP",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "",
   "basis": "List $4.0/M in, $20.0/M out (batch $2.0/$10.0). Per page: 2,714 image tokens/page (ceil(1275/28) x ceil(1650/28) = 46x59; Claude 4.7+ high-res tier); text tokens x1.3 for the newer tokenizer + 390 prompt tokens in; 1040 output tokens (800 base, no reasoning tokens). => standard $33.22/1k pages, batch $16.61/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  },
  {
   "id": "aws-textract-forms",
   "name": "Textract Forms",
   "cost": 50.0,
   "deploy": {
    "cloud": "AWS",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary",
   "outputs": [
    "key-value pairs",
    "selection marks",
    "bounding boxes",
    "confidences"
   ],
   "notes": "Expensive; key-value detection rather than schema extraction.",
   "basis": "$50/1k pages first 1M, $40/1k above.",
   "fam": "cloud"
  },
  {
   "id": "gpt-6-astra",
   "name": "GPT-6 Astra",
   "cost": 67.96,
   "deploy": {
    "cloud": "Azure \u00b7 AWS",
    "self": false,
    "saas": false
   },
   "licence": "Proprietary (API only)",
   "outputs": [
    "markdown/HTML (prompted)",
    "JSON with schema (structured outputs)",
    "approximate bounding boxes only if prompted (Gemini/Claude/Qwen support coordinates; not OCR-grade)",
    "no native confidences (logprobs limited)"
   ],
   "notes": "OpenAI flagship; also on Amazon Bedrock (same $10/$50).",
   "basis": "List $10.0/M in, $50.0/M out (batch $5.0/$25.0). Per page: 2,496 image tokens/page (1275x1650 px = 2,080 32px patches x 1.2 multiplier, detail=high, within 2,500-patch budget) + 300 prompt tokens in; 800 output tokens (800 base, no reasoning tokens). => standard $67.96/1k pages, batch $33.98/1k. US Letter rendered at 150 DPI (1275x1650).",
   "fam": "vlm"
  }
 ],
 "pareto": {
  "everyday": {
   "title": "Everyday reliability",
   "benches": [
    "OmniParseBench: plain pages",
    "ParseBench: content faithfulness"
   ],
   "anchors": 18,
   "method": "Linear equating on 18 systems that appear on both benchmarks",
   "points": [
    {
     "id": "datalab-accurate",
     "name": "Datalab (accurate)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 10,
     "score": 86.7,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages (own product, half weight)",
       "score": 93.0,
       "cost": 7.5
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 83.9,
       "cost": 10.0
      }
     ],
     "costBasis": "Datalab list price, accurate mode"
    },
    {
     "id": "datalab-balanced",
     "name": "Datalab (balanced)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 4,
     "score": 86.4,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages (own product, half weight)",
       "score": 92.6,
       "cost": 3.0
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 83.6,
       "cost": 4.0
      }
     ],
     "costBasis": "Datalab list price, balanced mode"
    },
    {
     "id": "reducto",
     "name": "Reducto (r-1)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 10,
     "score": 90.1,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 91.1,
       "cost": 10.0
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 89.2,
       "cost": 10.0
      }
     ],
     "costBasis": "Reducto list price"
    },
    {
     "id": "llamaparse-ap",
     "name": "LlamaParse Agentic Plus",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 56.25,
     "score": 91.0,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 90.4,
       "cost": 56.3
      },
      {
       "bench": "ParseBench: content faithfulness (own product, half weight)",
       "score": 92.2,
       "cost": 56.25
      }
     ],
     "costBasis": "LlamaParse list price (45 credits/page)"
    },
    {
     "id": "llamaparse-a",
     "name": "LlamaParse Agentic",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 12.5,
     "score": 92.2,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness (own product, half weight)",
       "score": 91.8,
       "cost": 12.5
      }
     ],
     "costBasis": "LlamaParse list price (10 credits/page)"
    },
    {
     "id": "llamaparse-ce",
     "name": "LlamaParse Cost-Effective",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 3.75,
     "score": 90.2,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness (own product, half weight)",
       "score": 89.9,
       "cost": 3.75
      }
     ],
     "costBasis": "LlamaParse list price (3 credits/page)"
    },
    {
     "id": "mistral-ocr",
     "name": "Mistral OCR 4",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "Azure Foundry"
     },
     "cost": 4,
     "score": 88.6,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 87.6,
       "cost": 4.0
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 89.5,
       "cost": 4.0
      }
     ],
     "costBasis": "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench"
    },
    {
     "id": "azure-layout",
     "name": "Azure DI Layout",
     "family": "cloud",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 10,
     "score": 85.2,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 85.6,
       "cost": 5.0
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 84.9,
       "cost": 10.0
      }
     ],
     "costBasis": "Azure list price, first tier"
    },
    {
     "id": "extend",
     "name": "Extend Parse",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 20,
     "score": 84.9,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 85.3,
       "cost": 33.7
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 84.6,
       "cost": 25.0
      }
     ],
     "costBasis": "Extend list price, performance tier"
    },
    {
     "id": "databricks",
     "name": "Databricks ai_parse",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "Databricks on any cloud"
     },
     "cost": 3.5,
     "score": 88.5,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 88.2,
       "cost": 3.5
      }
     ],
     "costBasis": "ParseBench-reported cost"
    },
    {
     "id": "textract",
     "name": "AWS Textract",
     "family": "cloud",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "AWS"
     },
     "cost": 15,
     "score": 74.1,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 74.8,
       "cost": 15.0
      }
     ],
     "costBasis": "Textract tables list price"
    },
    {
     "id": "docai",
     "name": "Google Document AI",
     "family": "cloud",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 10,
     "score": 83.6,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 83.7,
       "cost": 10.0
      }
     ],
     "costBasis": "Document AI layout list price"
    },
    {
     "id": "landingai",
     "name": "LandingAI ADE",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 15,
     "score": 88.8,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 88.6,
       "cost": 30.0
      }
     ],
     "costBasis": "LandingAI typical credits per page"
    },
    {
     "id": "pulse",
     "name": "Pulse Ultra 2",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 15,
     "score": 87.8,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 87.6,
       "cost": 15.0
      }
     ],
     "costBasis": "ParseBench-reported cost"
    },
    {
     "id": "chandra-2",
     "name": "Chandra 2 (open)",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.48,
     "score": 87.1,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 90.9,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 83.7,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr; licence needed above $2M revenue"
    },
    {
     "id": "lighton-08",
     "name": "LightOnOCR-3 0.8B",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.12,
     "score": 88.2,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 87.4,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 88.9,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr (throughput of the 1B model)"
    },
    {
     "id": "mineru",
     "name": "MinerU2.5-Pro",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.33,
     "score": 87.2,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 86.4,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 87.9,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "paddle",
     "name": "PaddleOCR-VL 1.6",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.43,
     "score": 81.9,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 81.0,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 82.7,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "dots",
     "name": "dots.mocr",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 1.97,
     "score": 88.9,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 87.5,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 90.0,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr (dots.ocr throughput)"
    },
    {
     "id": "deepseek-2",
     "name": "DeepSeek-OCR 2",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.3,
     "score": 80.1,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 77.9,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 82.0,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "glm-ocr",
     "name": "GLM-OCR",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.37,
     "score": 78.8,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 79.7,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 78.0,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "surya-2",
     "name": "Surya 2",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.13,
     "score": 86.4,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 86.2,
       "cost": null
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 86.6,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr; licence needed above $5M revenue"
    },
    {
     "id": "olmocr-2",
     "name": "olmOCR 2",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.2,
     "score": 71.4,
     "n": 1,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 70.7,
       "cost": null
      }
     ],
     "costBasis": "AI2: under $200 per million pages"
    },
    {
     "id": "docling",
     "name": "Docling",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.33,
     "score": 65.8,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 66.9,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "tesseract",
     "name": "Tesseract",
     "family": "libs",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.03,
     "score": 36.6,
     "n": 1,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 33.8,
       "cost": null
      }
     ],
     "costBasis": "Free; CPU time only"
    },
    {
     "id": "pymupdf4llm",
     "name": "pymupdf4llm",
     "family": "libs",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.03,
     "score": 79.0,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 79.3,
       "cost": null
      }
     ],
     "costBasis": "Free (AGPL); CPU time only"
    },
    {
     "id": "gemini-38-flash",
     "name": "Gemini 3.8 Flash",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 35.6,
     "score": 89.6,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 89.5,
       "cost": 37.1
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 89.7,
       "cost": 34.1
      }
     ],
     "costBasis": "Token cost as billed in each benchmark (thinking on)"
    },
    {
     "id": "gemini-38-flash-low",
     "name": "Gemini 3.8 Flash (low thinking)",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 7.1,
     "score": 88.5,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 88.2,
       "cost": 7.1
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "claude-sonnet-55",
     "name": "Claude Sonnet 5.5",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 30.85,
     "score": 87.8,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 83.4,
       "cost": 34.3
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 91.6,
       "cost": 27.4
      }
     ],
     "costBasis": "Token cost as billed in each benchmark"
    },
    {
     "id": "claude-opus-55",
     "name": "Claude Opus 5.5",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 57.9,
     "score": 92.2,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 91.8,
       "cost": 57.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "claude-haiku-55",
     "name": "Claude Haiku 5.5",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 1.4,
     "score": 90.6,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 90.2,
       "cost": 1.4
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "gpt-56-sol",
     "name": "GPT-5.6 Sol",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 87.65,
     "score": 86.8,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: plain pages",
       "score": 85.2,
       "cost": 94.5
      },
      {
       "bench": "ParseBench: content faithfulness",
       "score": 88.2,
       "cost": 80.8
      }
     ],
     "costBasis": "Token cost as billed in each benchmark (reasoning high)"
    },
    {
     "id": "gpt-6-luna",
     "name": "GPT-6 Luna",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 0.9,
     "score": 85.1,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 85.1,
       "cost": 0.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench (no reasoning)"
    },
    {
     "id": "gemini-31-flash-lite",
     "name": "Gemini 3.1 Flash-Lite",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 2.9,
     "score": 89.7,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 89.5,
       "cost": 2.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "gemini-31-pro",
     "name": "Gemini 3.1 Pro",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 84.9,
     "score": 90.5,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: content faithfulness",
       "score": 90.2,
       "cost": 84.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    }
   ],
   "rawViews": [
    {
     "label": "OmniParseBench: plain pages",
     "points": [
      {
       "id": "datalab-accurate",
       "name": "Datalab (accurate)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 10,
       "score": 93.0,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, accurate mode"
      },
      {
       "id": "datalab-balanced",
       "name": "Datalab (balanced)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 4,
       "score": 92.6,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, balanced mode"
      },
      {
       "id": "reducto",
       "name": "Reducto (r-1)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 10,
       "score": 91.1,
       "n": 1,
       "raw": [],
       "costBasis": "Reducto list price"
      },
      {
       "id": "llamaparse-ap",
       "name": "LlamaParse Agentic Plus",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 56.25,
       "score": 90.4,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (45 credits/page)"
      },
      {
       "id": "mistral-ocr",
       "name": "Mistral OCR 4",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "Azure Foundry"
       },
       "cost": 4,
       "score": 87.6,
       "n": 1,
       "raw": [],
       "costBasis": "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench"
      },
      {
       "id": "azure-layout",
       "name": "Azure DI Layout",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 10,
       "score": 85.6,
       "n": 1,
       "raw": [],
       "costBasis": "Azure list price, first tier"
      },
      {
       "id": "extend",
       "name": "Extend Parse",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 20,
       "score": 85.3,
       "n": 1,
       "raw": [],
       "costBasis": "Extend list price, performance tier"
      },
      {
       "id": "chandra-2",
       "name": "Chandra 2 (open)",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.48,
       "score": 90.9,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $2M revenue"
      },
      {
       "id": "lighton-08",
       "name": "LightOnOCR-3 0.8B",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.12,
       "score": 87.4,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (throughput of the 1B model)"
      },
      {
       "id": "mineru",
       "name": "MinerU2.5-Pro",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.33,
       "score": 86.4,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "paddle",
       "name": "PaddleOCR-VL 1.6",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.43,
       "score": 81.0,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "dots",
       "name": "dots.mocr",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 1.97,
       "score": 87.5,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (dots.ocr throughput)"
      },
      {
       "id": "deepseek-2",
       "name": "DeepSeek-OCR 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.3,
       "score": 77.9,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "glm-ocr",
       "name": "GLM-OCR",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.37,
       "score": 79.7,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "surya-2",
       "name": "Surya 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.13,
       "score": 86.2,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $5M revenue"
      },
      {
       "id": "olmocr-2",
       "name": "olmOCR 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.2,
       "score": 70.7,
       "n": 1,
       "raw": [],
       "costBasis": "AI2: under $200 per million pages"
      },
      {
       "id": "tesseract",
       "name": "Tesseract",
       "family": "libs",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.03,
       "score": 33.8,
       "n": 1,
       "raw": [],
       "costBasis": "Free; CPU time only"
      },
      {
       "id": "gemini-38-flash",
       "name": "Gemini 3.8 Flash",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 37.1,
       "score": 89.5,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in OmniParseBench (Datalab)"
      },
      {
       "id": "claude-sonnet-55",
       "name": "Claude Sonnet 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 34.3,
       "score": 83.4,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in OmniParseBench (Datalab)"
      },
      {
       "id": "gpt-56-sol",
       "name": "GPT-5.6 Sol",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 94.5,
       "score": 85.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in OmniParseBench (Datalab)"
      }
     ]
    },
    {
     "label": "ParseBench: content faithfulness",
     "points": [
      {
       "id": "datalab-accurate",
       "name": "Datalab (accurate)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 10,
       "score": 83.9,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, accurate mode"
      },
      {
       "id": "datalab-balanced",
       "name": "Datalab (balanced)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 4,
       "score": 83.6,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, balanced mode"
      },
      {
       "id": "reducto",
       "name": "Reducto (r-1)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 10,
       "score": 89.2,
       "n": 1,
       "raw": [],
       "costBasis": "Reducto list price"
      },
      {
       "id": "llamaparse-ap",
       "name": "LlamaParse Agentic Plus",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 56.25,
       "score": 92.2,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (45 credits/page)"
      },
      {
       "id": "llamaparse-a",
       "name": "LlamaParse Agentic",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 12.5,
       "score": 91.8,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (10 credits/page)"
      },
      {
       "id": "llamaparse-ce",
       "name": "LlamaParse Cost-Effective",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 3.75,
       "score": 89.9,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (3 credits/page)"
      },
      {
       "id": "mistral-ocr",
       "name": "Mistral OCR 4",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "Azure Foundry"
       },
       "cost": 4,
       "score": 89.5,
       "n": 1,
       "raw": [],
       "costBasis": "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench"
      },
      {
       "id": "azure-layout",
       "name": "Azure DI Layout",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 10,
       "score": 84.9,
       "n": 1,
       "raw": [],
       "costBasis": "Azure list price, first tier"
      },
      {
       "id": "extend",
       "name": "Extend Parse",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 20,
       "score": 84.6,
       "n": 1,
       "raw": [],
       "costBasis": "Extend list price, performance tier"
      },
      {
       "id": "databricks",
       "name": "Databricks ai_parse",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "Databricks on any cloud"
       },
       "cost": 3.5,
       "score": 88.2,
       "n": 1,
       "raw": [],
       "costBasis": "ParseBench-reported cost"
      },
      {
       "id": "textract",
       "name": "AWS Textract",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "AWS"
       },
       "cost": 15,
       "score": 74.8,
       "n": 1,
       "raw": [],
       "costBasis": "Textract tables list price"
      },
      {
       "id": "docai",
       "name": "Google Document AI",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 10,
       "score": 83.7,
       "n": 1,
       "raw": [],
       "costBasis": "Document AI layout list price"
      },
      {
       "id": "landingai",
       "name": "LandingAI ADE",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 15,
       "score": 88.6,
       "n": 1,
       "raw": [],
       "costBasis": "LandingAI typical credits per page"
      },
      {
       "id": "pulse",
       "name": "Pulse Ultra 2",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 15,
       "score": 87.6,
       "n": 1,
       "raw": [],
       "costBasis": "ParseBench-reported cost"
      },
      {
       "id": "chandra-2",
       "name": "Chandra 2 (open)",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.48,
       "score": 83.7,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $2M revenue"
      },
      {
       "id": "lighton-08",
       "name": "LightOnOCR-3 0.8B",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.12,
       "score": 88.9,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (throughput of the 1B model)"
      },
      {
       "id": "mineru",
       "name": "MinerU2.5-Pro",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.33,
       "score": 87.9,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "paddle",
       "name": "PaddleOCR-VL 1.6",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.43,
       "score": 82.7,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "dots",
       "name": "dots.mocr",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 1.97,
       "score": 90.0,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (dots.ocr throughput)"
      },
      {
       "id": "deepseek-2",
       "name": "DeepSeek-OCR 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.3,
       "score": 82.0,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "glm-ocr",
       "name": "GLM-OCR",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.37,
       "score": 78.0,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "surya-2",
       "name": "Surya 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.13,
       "score": 86.6,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $5M revenue"
      },
      {
       "id": "docling",
       "name": "Docling",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.33,
       "score": 66.9,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "pymupdf4llm",
       "name": "pymupdf4llm",
       "family": "libs",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.03,
       "score": 79.3,
       "n": 1,
       "raw": [],
       "costBasis": "Free (AGPL); CPU time only"
      },
      {
       "id": "gemini-38-flash",
       "name": "Gemini 3.8 Flash",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 34.1,
       "score": 89.7,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gemini-38-flash-low",
       "name": "Gemini 3.8 Flash (low thinking)",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 7.1,
       "score": 88.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "claude-sonnet-55",
       "name": "Claude Sonnet 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 27.4,
       "score": 91.6,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "claude-opus-55",
       "name": "Claude Opus 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 57.9,
       "score": 91.8,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "claude-haiku-55",
       "name": "Claude Haiku 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 1.4,
       "score": 90.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gpt-56-sol",
       "name": "GPT-5.6 Sol",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 80.8,
       "score": 88.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gpt-6-luna",
       "name": "GPT-6 Luna",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 0.9,
       "score": 85.1,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gemini-31-flash-lite",
       "name": "Gemini 3.1 Flash-Lite",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 2.9,
       "score": 89.5,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gemini-31-pro",
       "name": "Gemini 3.1 Pro",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 84.9,
       "score": 90.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      }
     ]
    }
   ]
  },
  "hard": {
   "title": "Hard pages",
   "benches": [
    "OmniParseBench: hard pages + tables",
    "ParseBench: tables"
   ],
   "anchors": 18,
   "method": "Linear equating on 18 systems that appear on both benchmarks",
   "points": [
    {
     "id": "datalab-accurate",
     "name": "Datalab (accurate)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 10,
     "score": 89.9,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables (own product, half weight)",
       "score": 89.8,
       "cost": 7.5
      },
      {
       "bench": "ParseBench: tables",
       "score": 90.3,
       "cost": 10.0
      }
     ],
     "costBasis": "Datalab list price, accurate mode"
    },
    {
     "id": "datalab-balanced",
     "name": "Datalab (balanced)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 4,
     "score": 87.6,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables (own product, half weight)",
       "score": 85.2,
       "cost": 3.0
      },
      {
       "bench": "ParseBench: tables",
       "score": 89.1,
       "cost": 4.0
      }
     ],
     "costBasis": "Datalab list price, balanced mode"
    },
    {
     "id": "reducto",
     "name": "Reducto (r-1)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 10,
     "score": 85.9,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 86.8,
       "cost": 10.0
      },
      {
       "bench": "ParseBench: tables",
       "score": 85.2,
       "cost": 10.0
      }
     ],
     "costBasis": "Reducto list price"
    },
    {
     "id": "llamaparse-ap",
     "name": "LlamaParse Agentic Plus",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 56.25,
     "score": 90.8,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 89.1,
       "cost": 56.3
      },
      {
       "bench": "ParseBench: tables (own product, half weight)",
       "score": 93.4,
       "cost": 56.25
      }
     ],
     "costBasis": "LlamaParse list price (45 credits/page)"
    },
    {
     "id": "llamaparse-a",
     "name": "LlamaParse Agentic",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 12.5,
     "score": 88.1,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables (own product, half weight)",
       "score": 88.9,
       "cost": 12.5
      }
     ],
     "costBasis": "LlamaParse list price (10 credits/page)"
    },
    {
     "id": "llamaparse-ce",
     "name": "LlamaParse Cost-Effective",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 3.75,
     "score": 83.2,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables (own product, half weight)",
       "score": 84.2,
       "cost": 3.75
      }
     ],
     "costBasis": "LlamaParse list price (3 credits/page)"
    },
    {
     "id": "mistral-ocr",
     "name": "Mistral OCR 4",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "Azure Foundry"
     },
     "cost": 4,
     "score": 78.9,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 84.1,
       "cost": 4.0
      },
      {
       "bench": "ParseBench: tables",
       "score": 73.9,
       "cost": 4.0
      }
     ],
     "costBasis": "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench"
    },
    {
     "id": "azure-layout",
     "name": "Azure DI Layout",
     "family": "cloud",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 10,
     "score": 80.8,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 75.3,
       "cost": 5.0
      },
      {
       "bench": "ParseBench: tables",
       "score": 86.0,
       "cost": 10.0
      }
     ],
     "costBasis": "Azure list price, first tier"
    },
    {
     "id": "extend",
     "name": "Extend Parse",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 20,
     "score": 86.6,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 88.5,
       "cost": 33.7
      },
      {
       "bench": "ParseBench: tables",
       "score": 84.8,
       "cost": 25.0
      }
     ],
     "costBasis": "Extend list price, performance tier"
    },
    {
     "id": "databricks",
     "name": "Databricks ai_parse",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "Databricks on any cloud"
     },
     "cost": 3.5,
     "score": 82.7,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 83.7,
       "cost": 3.5
      }
     ],
     "costBasis": "ParseBench-reported cost"
    },
    {
     "id": "textract",
     "name": "AWS Textract",
     "family": "cloud",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "AWS"
     },
     "cost": 15,
     "score": 83.6,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 84.6,
       "cost": 15.0
      }
     ],
     "costBasis": "Textract tables list price"
    },
    {
     "id": "docai",
     "name": "Google Document AI",
     "family": "cloud",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 10,
     "score": 53.3,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 55.1,
       "cost": 10.0
      }
     ],
     "costBasis": "Document AI layout list price"
    },
    {
     "id": "landingai",
     "name": "LandingAI ADE",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 15,
     "score": 72.5,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 73.7,
       "cost": 30.0
      }
     ],
     "costBasis": "LandingAI typical credits per page"
    },
    {
     "id": "pulse",
     "name": "Pulse Ultra 2",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 15,
     "score": 89.6,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 90.3,
       "cost": 15.0
      }
     ],
     "costBasis": "ParseBench-reported cost"
    },
    {
     "id": "chandra-2",
     "name": "Chandra 2 (open)",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.48,
     "score": 86.5,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 83.8,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 89.2,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr; licence needed above $2M revenue"
    },
    {
     "id": "lighton-08",
     "name": "LightOnOCR-3 0.8B",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.12,
     "score": 78.4,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 71.9,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 84.5,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr (throughput of the 1B model)"
    },
    {
     "id": "mineru",
     "name": "MinerU2.5-Pro",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.33,
     "score": 79.5,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 81.6,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 77.6,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "paddle",
     "name": "PaddleOCR-VL 1.6",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.43,
     "score": 69.6,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 71.7,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 67.8,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "dots",
     "name": "dots.mocr",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 1.97,
     "score": 82.7,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 80.1,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 85.2,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr (dots.ocr throughput)"
    },
    {
     "id": "deepseek-2",
     "name": "DeepSeek-OCR 2",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.3,
     "score": 58.0,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 54.3,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 61.7,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "glm-ocr",
     "name": "GLM-OCR",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.37,
     "score": 69.5,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 73.1,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 66.1,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "surya-2",
     "name": "Surya 2",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.13,
     "score": 75.3,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 67.6,
       "cost": null
      },
      {
       "bench": "ParseBench: tables",
       "score": 82.7,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr; licence needed above $5M revenue"
    },
    {
     "id": "olmocr-2",
     "name": "olmOCR 2",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.2,
     "score": 61.0,
     "n": 1,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 59.4,
       "cost": null
      }
     ],
     "costBasis": "AI2: under $200 per million pages"
    },
    {
     "id": "docling",
     "name": "Docling",
     "family": "open",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.33,
     "score": 64.9,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 66.4,
       "cost": null
      }
     ],
     "costBasis": "GPU time at $2.50/hr"
    },
    {
     "id": "tesseract",
     "name": "Tesseract",
     "family": "libs",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.03,
     "score": 10.5,
     "n": 1,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 7.4,
       "cost": null
      }
     ],
     "costBasis": "Free; CPU time only"
    },
    {
     "id": "pymupdf4llm",
     "name": "pymupdf4llm",
     "family": "libs",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 0.03,
     "score": 70.7,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 72.0,
       "cost": null
      }
     ],
     "costBasis": "Free (AGPL); CPU time only"
    },
    {
     "id": "gemini-38-flash",
     "name": "Gemini 3.8 Flash",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 35.6,
     "score": 90.6,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 92.2,
       "cost": 37.1
      },
      {
       "bench": "ParseBench: tables",
       "score": 89.1,
       "cost": 34.1
      }
     ],
     "costBasis": "Token cost as billed in each benchmark (thinking on)"
    },
    {
     "id": "gemini-38-flash-low",
     "name": "Gemini 3.8 Flash (low thinking)",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 7.1,
     "score": 87.3,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 88.2,
       "cost": 7.1
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "claude-sonnet-55",
     "name": "Claude Sonnet 5.5",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 30.85,
     "score": 91.4,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 91.9,
       "cost": 34.3
      },
      {
       "bench": "ParseBench: tables",
       "score": 91.0,
       "cost": 27.4
      }
     ],
     "costBasis": "Token cost as billed in each benchmark"
    },
    {
     "id": "claude-opus-55",
     "name": "Claude Opus 5.5",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 57.9,
     "score": 93.2,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 93.9,
       "cost": 57.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "claude-haiku-55",
     "name": "Claude Haiku 5.5",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 1.4,
     "score": 86.0,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 86.8,
       "cost": 1.4
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "gpt-56-sol",
     "name": "GPT-5.6 Sol",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 87.65,
     "score": 88.7,
     "n": 2,
     "raw": [
      {
       "bench": "OmniParseBench: hard pages + tables",
       "score": 86.0,
       "cost": 94.5
      },
      {
       "bench": "ParseBench: tables",
       "score": 91.4,
       "cost": 80.8
      }
     ],
     "costBasis": "Token cost as billed in each benchmark (reasoning high)"
    },
    {
     "id": "gpt-6-luna",
     "name": "GPT-6 Luna",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 0.9,
     "score": 80.4,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 81.4,
       "cost": 0.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench (no reasoning)"
    },
    {
     "id": "gemini-31-flash-lite",
     "name": "Gemini 3.1 Flash-Lite",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 2.9,
     "score": 84.6,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 85.5,
       "cost": 2.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    },
    {
     "id": "gemini-31-pro",
     "name": "Gemini 3.1 Pro",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 84.9,
     "score": 90.2,
     "n": 1,
     "raw": [
      {
       "bench": "ParseBench: tables",
       "score": 91.0,
       "cost": 84.9
      }
     ],
     "costBasis": "Token cost as billed in ParseBench"
    }
   ],
   "rawViews": [
    {
     "label": "OmniParseBench: hard pages + tables",
     "points": [
      {
       "id": "datalab-accurate",
       "name": "Datalab (accurate)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 10,
       "score": 89.8,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, accurate mode"
      },
      {
       "id": "datalab-balanced",
       "name": "Datalab (balanced)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 4,
       "score": 85.2,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, balanced mode"
      },
      {
       "id": "reducto",
       "name": "Reducto (r-1)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 10,
       "score": 86.8,
       "n": 1,
       "raw": [],
       "costBasis": "Reducto list price"
      },
      {
       "id": "llamaparse-ap",
       "name": "LlamaParse Agentic Plus",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 56.25,
       "score": 89.1,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (45 credits/page)"
      },
      {
       "id": "mistral-ocr",
       "name": "Mistral OCR 4",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "Azure Foundry"
       },
       "cost": 4,
       "score": 84.1,
       "n": 1,
       "raw": [],
       "costBasis": "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench"
      },
      {
       "id": "azure-layout",
       "name": "Azure DI Layout",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 10,
       "score": 75.3,
       "n": 1,
       "raw": [],
       "costBasis": "Azure list price, first tier"
      },
      {
       "id": "extend",
       "name": "Extend Parse",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 20,
       "score": 88.5,
       "n": 1,
       "raw": [],
       "costBasis": "Extend list price, performance tier"
      },
      {
       "id": "chandra-2",
       "name": "Chandra 2 (open)",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.48,
       "score": 83.8,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $2M revenue"
      },
      {
       "id": "lighton-08",
       "name": "LightOnOCR-3 0.8B",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.12,
       "score": 71.9,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (throughput of the 1B model)"
      },
      {
       "id": "mineru",
       "name": "MinerU2.5-Pro",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.33,
       "score": 81.6,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "paddle",
       "name": "PaddleOCR-VL 1.6",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.43,
       "score": 71.7,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "dots",
       "name": "dots.mocr",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 1.97,
       "score": 80.1,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (dots.ocr throughput)"
      },
      {
       "id": "deepseek-2",
       "name": "DeepSeek-OCR 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.3,
       "score": 54.3,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "glm-ocr",
       "name": "GLM-OCR",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.37,
       "score": 73.1,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "surya-2",
       "name": "Surya 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.13,
       "score": 67.6,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $5M revenue"
      },
      {
       "id": "olmocr-2",
       "name": "olmOCR 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.2,
       "score": 59.4,
       "n": 1,
       "raw": [],
       "costBasis": "AI2: under $200 per million pages"
      },
      {
       "id": "tesseract",
       "name": "Tesseract",
       "family": "libs",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.03,
       "score": 7.4,
       "n": 1,
       "raw": [],
       "costBasis": "Free; CPU time only"
      },
      {
       "id": "gemini-38-flash",
       "name": "Gemini 3.8 Flash",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 37.1,
       "score": 92.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in OmniParseBench (Datalab)"
      },
      {
       "id": "claude-sonnet-55",
       "name": "Claude Sonnet 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 34.3,
       "score": 91.9,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in OmniParseBench (Datalab)"
      },
      {
       "id": "gpt-56-sol",
       "name": "GPT-5.6 Sol",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 94.5,
       "score": 86.0,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in OmniParseBench (Datalab)"
      }
     ]
    },
    {
     "label": "ParseBench: tables",
     "points": [
      {
       "id": "datalab-accurate",
       "name": "Datalab (accurate)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 10,
       "score": 90.3,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, accurate mode"
      },
      {
       "id": "datalab-balanced",
       "name": "Datalab (balanced)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 4,
       "score": 89.1,
       "n": 1,
       "raw": [],
       "costBasis": "Datalab list price, balanced mode"
      },
      {
       "id": "reducto",
       "name": "Reducto (r-1)",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 10,
       "score": 85.2,
       "n": 1,
       "raw": [],
       "costBasis": "Reducto list price"
      },
      {
       "id": "llamaparse-ap",
       "name": "LlamaParse Agentic Plus",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 56.25,
       "score": 93.4,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (45 credits/page)"
      },
      {
       "id": "llamaparse-a",
       "name": "LlamaParse Agentic",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 12.5,
       "score": 88.9,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (10 credits/page)"
      },
      {
       "id": "llamaparse-ce",
       "name": "LlamaParse Cost-Effective",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "AWS Marketplace"
       },
       "cost": 3.75,
       "score": 84.2,
       "n": 1,
       "raw": [],
       "costBasis": "LlamaParse list price (3 credits/page)"
      },
      {
       "id": "mistral-ocr",
       "name": "Mistral OCR 4",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "Azure Foundry"
       },
       "cost": 4,
       "score": 73.9,
       "n": 1,
       "raw": [],
       "costBasis": "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench"
      },
      {
       "id": "azure-layout",
       "name": "Azure DI Layout",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 10,
       "score": 86.0,
       "n": 1,
       "raw": [],
       "costBasis": "Azure list price, first tier"
      },
      {
       "id": "extend",
       "name": "Extend Parse",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 20,
       "score": 84.8,
       "n": 1,
       "raw": [],
       "costBasis": "Extend list price, performance tier"
      },
      {
       "id": "databricks",
       "name": "Databricks ai_parse",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": "Databricks on any cloud"
       },
       "cost": 3.5,
       "score": 83.7,
       "n": 1,
       "raw": [],
       "costBasis": "ParseBench-reported cost"
      },
      {
       "id": "textract",
       "name": "AWS Textract",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "AWS"
       },
       "cost": 15,
       "score": 84.6,
       "n": 1,
       "raw": [],
       "costBasis": "Textract tables list price"
      },
      {
       "id": "docai",
       "name": "Google Document AI",
       "family": "cloud",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 10,
       "score": 55.1,
       "n": 1,
       "raw": [],
       "costBasis": "Document AI layout list price"
      },
      {
       "id": "landingai",
       "name": "LandingAI ADE",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 15,
       "score": 73.7,
       "n": 1,
       "raw": [],
       "costBasis": "LandingAI typical credits per page"
      },
      {
       "id": "pulse",
       "name": "Pulse Ultra 2",
       "family": "saas",
       "deploy": {
        "saas": true,
        "self": false,
        "cloud": false
       },
       "cost": 15,
       "score": 90.3,
       "n": 1,
       "raw": [],
       "costBasis": "ParseBench-reported cost"
      },
      {
       "id": "chandra-2",
       "name": "Chandra 2 (open)",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.48,
       "score": 89.2,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $2M revenue"
      },
      {
       "id": "lighton-08",
       "name": "LightOnOCR-3 0.8B",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.12,
       "score": 84.5,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (throughput of the 1B model)"
      },
      {
       "id": "mineru",
       "name": "MinerU2.5-Pro",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.33,
       "score": 77.6,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "paddle",
       "name": "PaddleOCR-VL 1.6",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.43,
       "score": 67.8,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "dots",
       "name": "dots.mocr",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 1.97,
       "score": 85.2,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr (dots.ocr throughput)"
      },
      {
       "id": "deepseek-2",
       "name": "DeepSeek-OCR 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.3,
       "score": 61.7,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "glm-ocr",
       "name": "GLM-OCR",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.37,
       "score": 66.1,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "surya-2",
       "name": "Surya 2",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.13,
       "score": 82.7,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr; licence needed above $5M revenue"
      },
      {
       "id": "docling",
       "name": "Docling",
       "family": "open",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.33,
       "score": 66.4,
       "n": 1,
       "raw": [],
       "costBasis": "GPU time at $2.50/hr"
      },
      {
       "id": "pymupdf4llm",
       "name": "pymupdf4llm",
       "family": "libs",
       "deploy": {
        "saas": false,
        "self": true,
        "cloud": false
       },
       "cost": 0.03,
       "score": 72.0,
       "n": 1,
       "raw": [],
       "costBasis": "Free (AGPL); CPU time only"
      },
      {
       "id": "gemini-38-flash",
       "name": "Gemini 3.8 Flash",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 34.1,
       "score": 89.1,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gemini-38-flash-low",
       "name": "Gemini 3.8 Flash (low thinking)",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 7.1,
       "score": 88.2,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "claude-sonnet-55",
       "name": "Claude Sonnet 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 27.4,
       "score": 91.0,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "claude-opus-55",
       "name": "Claude Opus 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 57.9,
       "score": 93.9,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "claude-haiku-55",
       "name": "Claude Haiku 5.5",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure \u00b7 AWS \u00b7 GCP"
       },
       "cost": 1.4,
       "score": 86.8,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gpt-56-sol",
       "name": "GPT-5.6 Sol",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 80.8,
       "score": 91.4,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gpt-6-luna",
       "name": "GPT-6 Luna",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "Azure"
       },
       "cost": 0.9,
       "score": 81.4,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gemini-31-flash-lite",
       "name": "Gemini 3.1 Flash-Lite",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 2.9,
       "score": 85.5,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      },
      {
       "id": "gemini-31-pro",
       "name": "Gemini 3.1 Pro",
       "family": "vlm",
       "deploy": {
        "saas": false,
        "self": false,
        "cloud": "GCP"
       },
       "cost": 84.9,
       "score": 91.0,
       "n": 1,
       "raw": [],
       "costBasis": "Token cost as billed in ParseBench (LlamaIndex)"
      }
     ]
    }
   ]
  },
  "extraction": {
   "title": "Field extraction",
   "benches": [
    "ExtractBench (LlamaIndex): value F1"
   ],
   "anchors": 0,
   "method": "Single benchmark. Other extraction benchmarks share too few systems to blend.",
   "points": [
    {
     "id": "llamaextract-agentic-plus",
     "name": "LlamaExtract Agentic Plus",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 75.0,
     "score": 96.2,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 97.0
      },
      {
       "bench": "Long documents",
       "score": 94.7
      }
     ],
     "costBasis": "Cost as reported by ExtractBench (LlamaIndex's own product)"
    },
    {
     "id": "llamaextract-agentic",
     "name": "LlamaExtract Agentic",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 31.2,
     "score": 95.7,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 96.1
      },
      {
       "bench": "Long documents",
       "score": 94.7
      }
     ],
     "costBasis": "Cost as reported by ExtractBench (LlamaIndex's own product)"
    },
    {
     "id": "llamaextract-cost-effective",
     "name": "LlamaExtract Cost-Effective",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 10.0,
     "score": 94.2,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 95.5
      },
      {
       "bench": "Long documents",
       "score": 90.9
      }
     ],
     "costBasis": "Cost as reported by ExtractBench (LlamaIndex's own product)"
    },
    {
     "id": "reducto-deep-extract",
     "name": "Reducto Deep Extract",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 63.5,
     "score": 96.1,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 96.8
      },
      {
       "bench": "Long documents",
       "score": 92.8
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "reducto-extract",
     "name": "Reducto Extract",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": "AWS Marketplace"
     },
     "cost": 45.7,
     "score": 83.8,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 92.3
      },
      {
       "bench": "Long documents",
       "score": 27.3
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "pulse-effort",
     "name": "Pulse (effort)",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 105.0,
     "score": 96.1,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 96.8
      },
      {
       "bench": "Long documents",
       "score": 93.2
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "pulse-non-effort",
     "name": "Pulse",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 30.0,
     "score": 94.5,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 95.4
      },
      {
       "bench": "Long documents",
       "score": 93.3
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "extend-extract",
     "name": "Extend Extract",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 68.0,
     "score": 85.7,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 89.4
      },
      {
       "bench": "Long documents",
       "score": 47.2
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "datalab-accurate-balanced",
     "name": "Datalab extract",
     "family": "saas",
     "deploy": {
      "saas": true,
      "self": false,
      "cloud": false
     },
     "cost": 35.0,
     "score": 85.7,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 89.4
      },
      {
       "bench": "Long documents",
       "score": 42.0
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "claude-code-sonnet-5.5-evidence",
     "name": "Claude Code agent (Sonnet 5.5)",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS \u00b7 GCP"
     },
     "cost": 56.9,
     "score": 94.7,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 96.2
      },
      {
       "bench": "Long documents",
       "score": 83.7
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "codex-gpt-6-sol-evidence",
     "name": "Codex agent (GPT-6 Sol)",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 98.0,
     "score": 94.6,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 96.0
      },
      {
       "bench": "Long documents",
       "score": 87.2
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "codex-gpt-6-luna-evidence",
     "name": "Codex agent (GPT-6 Luna)",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 9.7,
     "score": 91.0,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 93.1
      },
      {
       "bench": "Long documents",
       "score": 80.9
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "gpt-6-astra",
     "name": "GPT-6 Astra",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure \u00b7 AWS"
     },
     "cost": 110.9,
     "score": 91.9,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 97.2
      },
      {
       "bench": "Long documents",
       "score": 31.7
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "deepseek-v4.1-flash",
     "name": "DeepSeek V4.1 Flash",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 3.2,
     "score": 87.1,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 94.4
      },
      {
       "bench": "Long documents",
       "score": 22.2
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "glm-5.3-flash",
     "name": "GLM-5.3 Flash",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 3.4,
     "score": 80.8,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 96.3
      },
      {
       "bench": "Long documents",
       "score": 27.8
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "gemini-3.8-flash",
     "name": "Gemini 3.8 Flash",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 4.3,
     "score": 80.7,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 88.1
      },
      {
       "bench": "Long documents",
       "score": 28.7
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "gemini-3.5-flash",
     "name": "Gemini 3.5 Flash",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "GCP"
     },
     "cost": 10.0,
     "score": 79.8,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 87.9
      },
      {
       "bench": "Long documents",
       "score": 27.9
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "gpt-5.4-nano",
     "name": "GPT-5.4 nano",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": false,
      "cloud": "Azure"
     },
     "cost": 2.1,
     "score": 74.9,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 77.4
      },
      {
       "bench": "Long documents",
       "score": 35.8
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    },
    {
     "id": "kimi-k3",
     "name": "Kimi K3",
     "family": "vlm",
     "deploy": {
      "saas": false,
      "self": true,
      "cloud": false
     },
     "cost": 67.5,
     "score": 83.2,
     "n": 1,
     "raw": [
      {
       "bench": "Short documents",
       "score": 94.6
      },
      {
       "bench": "Long documents",
       "score": 5.0
      }
     ],
     "costBasis": "Cost as reported by ExtractBench"
    }
   ]
  }
 }
};
