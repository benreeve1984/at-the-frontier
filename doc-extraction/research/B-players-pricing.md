# B. Players, pricing and where they can run: document extraction (checked 2026-10-22)

Machine-readable version: `B-players.json` (99 entries, same ids). Every price below was checked on 2026-10-22 against the URL cited. Anything marked **(unverified)** came from a secondary source or a search snippet, or was not on a vendor page.

## TL;DR for the deck

1. **Pricing comes in three bands, each roughly 10x the last.**
   - Under $1 per 1,000 pages: code libraries, Tesseract, self-hosted open-weights OCR VLMs ($0.1–0.7 on a rented GPU), and the cheapest frontier models: Gemini 2.5 Flash-Lite ~$0.50, GPT-6 Luna ~$0.68, Claude Haiku 5.5 ~$0.83.
   - $1.50–$15: hyperscaler OCR and layout, and specialist parse APIs.
     - Hyperscaler OCR: Azure Read, Textract Detect and Google OCR are all **$1.50**. Layout costs $4 (Textract) or $10 (Azure, Google).
     - Specialist parse APIs: Mistral OCR $4, Datalab $4–10, Reducto $10, LlamaParse Agentic $12.50, Unstructured $15.
   - $15–$80: schema extraction and the big frontier models. Textract Forms is $50, Azure/Google custom $30, BDA custom $40, Claude Opus 5.5 ~$33, GPT-6 Astra ~$68.
2. **What enterprises can actually deploy (Azure/GCP/AWS):**
   - Gemini only runs on GCP (Vertex).
   - OpenAI GPT runs on Azure (Foundry), and GPT-6 Astra is now on Bedrock too.
   - Claude runs on all three: Bedrock, Vertex, and Microsoft Foundry.
   - Mistral OCR is on Azure Foundry (OCR 4 at $4/1k). Vertex only has the old 25.05 version.
   - DeepSeek-OCR is on Vertex MaaS and SageMaker JumpStart. Qwen3-VL is on Bedrock (235B serverless) and JumpStart (8B).
   - Reducto, LlamaParse, Unstructured, Upstage, Hyperscience and Instabase have AWS Marketplace listings. LandingAI is a Snowflake Native App.
   - **Datalab has no hyperscaler listing**, but its Enterprise plan runs in the client's VPC.
3. **Open-weights licences are a trap.** "Open" is not the same as "free for enterprise":
   - **Marker and Surya:** weights are free only if revenue AND funding are under $5M.
   - **Chandra:** the threshold is $2M, and the weights can't be used to compete with Datalab's API.
   - **MinerU:** a commercial licence is needed above **$20M monthly revenue**.
   - **HunyuanOCR:** the licence excludes the EU, UK and South Korea.
   - **Nanonets-OCR2-3B:** declares no licence, and its base model uses the Qwen *research* licence.
   - Clean permissive options: Docling and granite-docling, PaddleOCR-VL, olmOCR, DeepSeek-OCR, dots.ocr, GLM-OCR, LightOnOCR, Qwen3-VL/3.8-27B.
4. **Frontier-model price traps to flag:**
   - Gemini 3.8/3.6 Flash prices **double on 2027-01-01** ($0.75/$3.75 → $1.50/$7.50).
   - Gemini 4 Argon doubles on 2026-12-01.
   - GPT-5.6 Sol is on promotional pricing until at least 2026-11-21.
   - Reasoning ("thinking") tokens are billed as output and can multiply these estimates by 2–5x. The tables assume thinking is off or minimal.
   - Batch APIs halve prices: OpenAI, Anthropic, Google, Mistral, Bedrock.

## Assumptions for VLM cost per 1,000 pages

- **Page:** US Letter rendered at **150 DPI = 1275x1650 px** and sent as an image.
- **Prompt:** 300 text tokens per page (instructions/schema, not cached).
- **Output:** **800 tokens per page** (the midpoint of 500–1,000; a dense page of markdown). No reasoning tokens.
- **Claude 4.7 and later:** Anthropic says its newer tokenizer produces about 30% more tokens for the same text, so prompt and output are x1.3 (390 in, 1,040 out).
- **Image tokens per page**, from each vendor's own formula:
  - **Gemini 3.x/4:** 1,120 tokens. That is the default ("high") for images. PDFs sent natively default to "medium": 560 tokens plus the PDF's native text tokens. Google says OCR quality "typically saturates at medium".
  - **Gemini 2.5:** about 1,548 tokens when sent as an image (estimate: 768px tiles x 258 tokens each). A native PDF page is only **258 tokens**, which is cheaper: 2.5 Flash about $2.17/1k, Flash-Lite about $0.38/1k.
  - **OpenAI GPT-5.2 and later, GPT-6:** 32px patches, so 40x52 = 2,080 patches, x1.2 multiplier = **2,496 tokens** (detail=high, within the 2,500-patch budget). GPT-6 Sol/Luna and 6.1 Sol are not in OpenAI's multiplier table, so the same rule is **assumed**. At 200 DPI with detail=original, GPT-5.4/5.5 would use about 4,471 tokens.
  - **Claude 4.7 and later** (Opus/Sonnet/Haiku 5.5, Fable 5.1): ceil(w/28) x ceil(h/28) = 46x59 = **2,714 tokens**. The high-res tier caps at 4,784 tokens and a 2,576px long edge, so a 200 DPI page uses about 4,784.
  - **Older Claude** (Sonnet 4.6, Haiku 4.5): capped at about 1,568 visual tokens.
  - **Qwen3-VL:** about 2,080 tokens (estimate, 32px effective patch).
- **Self-hosting:** the cost is the GPU rental rate divided by the pages per second the publisher reports, assuming **$2.50/hr per GPU** (applied to H100, and used as a proxy for A100/B200/RTX 5090). B200s rent for more, and A100s and 5090s for less.

## 1. Frontier general VLMs (direct page-image extraction)

| id | Model | $/M in | $/M out | In tok/page | Out tok/page | $/1k pages (std) | $/1k (batch) | Where enterprises can get it |
|---|---|---:|---:|---:|---:|---:|---:|---|
| `gemini-4-argon` | Gemini 4 Argon | 2.0 | 10.0 | 1,420 | 800 | **10.84** | 5.42 | Google Vertex AI |
| `gemini-3.8-flash` | Gemini 3.8 Flash | 0.75 | 3.75 | 1,420 | 800 | **4.07** | 2.03 | Google Vertex AI |
| `gemini-3.6-flash` | Gemini 3.6 Flash | 0.75 | 3.75 | 1,420 | 800 | **4.07** | 2.03 | Google Vertex AI |
| `gemini-3.1-pro-preview` | Gemini 3.1 Pro Preview | 2.0 | 12.0 | 1,420 | 800 | **12.44** | 6.22 | Google Vertex AI |
| `gemini-3.5-flash-lite` | Gemini 3.5 Flash-Lite | 0.3 | 2.5 | 1,420 | 800 | **2.43** | 1.21 | Google Vertex AI |
| `gemini-3.1-flash-lite` | Gemini 3.1 Flash-Lite | 0.25 | 1.5 | 1,420 | 800 | **1.55** | 0.78 | Google Vertex AI |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview | 0.5 | 3.0 | 1,420 | 800 | **3.11** | 1.55 | Google Vertex AI |
| `gemini-2.5-pro` | Gemini 2.5 Pro | 1.25 | 10.0 | 1,848 | 800 | **10.31** | 5.16 | Google Vertex AI |
| `gemini-2.5-flash` | Gemini 2.5 Flash | 0.3 | 2.5 | 1,848 | 800 | **2.55** | 1.28 | Google Vertex AI |
| `gemini-2.5-flash-lite` | Gemini 2.5 Flash-Lite | 0.1 | 0.4 | 1,848 | 800 | **0.50** | 0.25 | Google Vertex AI |
| `gpt-6-astra` | GPT-6 Astra | 10.0 | 50.0 | 2,796 | 800 | **67.96** | 33.98 | Azure OpenAI in Microsoft Foundry; Amazon Bedrock |
| `gpt-6.1-sol` | GPT-6.1 Sol | 2.0 | 10.0 | 2,796 | 800 | **13.59** | 6.80 | Azure OpenAI in Microsoft Foundry |
| `gpt-6-sol` | GPT-6 Sol | 2.0 | 10.0 | 2,796 | 800 | **13.59** | 6.80 | Azure OpenAI in Microsoft Foundry |
| `gpt-6-luna` | GPT-6 Luna | 0.1 | 0.5 | 2,796 | 800 | **0.68** | 0.34 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.6-sol` | GPT-5.6 Sol | 4.0 | 20.0 | 2,796 | 800 | **27.18** | 13.59 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.6-terra` | GPT-5.6 Terra | 2.0 | 12.0 | 2,796 | 800 | **15.19** | 7.60 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.6-luna` | GPT-5.6 Luna | 0.2 | 1.2 | 2,796 | 800 | **1.52** | 0.76 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.5` | GPT-5.5 | 5.0 | 30.0 | 2,796 | 800 | **37.98** | 18.99 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.4` | GPT-5.4 | 2.5 | 15.0 | 2,796 | 800 | **18.99** | 9.49 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.4-mini` | GPT-5.4 mini | 0.75 | 4.5 | 2,796 | 800 | **5.70** | 2.85 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.4-nano` | GPT-5.4 nano | 0.2 | 1.25 | 2,796 | 800 | **1.56** | 0.78 | Azure OpenAI in Microsoft Foundry |
| `gpt-5.2` | GPT-5.2 | 1.75 | 14.0 | 2,796 | 800 | **16.09** | 8.05 | Azure OpenAI in Microsoft Foundry |
| `gpt-5-mini` | GPT-5 mini (deprecated) | 0.25 | 2.0 | 2,796 | 800 | **2.30** | 1.15 | Azure OpenAI in Microsoft Foundry |
| `gpt-5-nano` | GPT-5 nano (deprecated) | 0.05 | 0.4 | 3,420 | 800 | **0.49** | 0.25 | Azure OpenAI in Microsoft Foundry |
| `claude-fable-5.1` | Claude Fable 5.1 | 10.0 | 50.0 | 3,104 | 1,040 | **83.04** | 41.52 | Amazon Bedrock; Google Vertex AI; Microsoft Foundry |
| `claude-opus-5.5` | Claude Opus 5.5 | 4.0 | 20.0 | 3,104 | 1,040 | **33.22** | 16.61 | Amazon Bedrock; Google Vertex AI; Microsoft Foundry |
| `claude-sonnet-5.5` | Claude Sonnet 5.5 | 2.0 | 10.0 | 3,104 | 1,040 | **16.61** | 8.30 | Amazon Bedrock; Google Vertex AI; Microsoft Foundry |
| `claude-haiku-5.5` | Claude Haiku 5.5 | 0.1 | 0.5 | 3,104 | 1,040 | **0.83** | 0.42 | Amazon Bedrock; Google Vertex AI; Microsoft Foundry |
| `claude-sonnet-4.6` | Claude Sonnet 4.6 | 3.0 | 15.0 | 1,860 | 800 | **17.58** | 8.79 | Amazon Bedrock; Google Vertex AI; Microsoft Foundry |
| `claude-haiku-4.5` | Claude Haiku 4.5 | 1.0 | 5.0 | 1,860 | 800 | **5.86** | 2.93 | Amazon Bedrock; Google Vertex AI; Microsoft Foundry |
| `qwen3-vl-235b` | Qwen3-VL-235B-A22B (Bedrock) | 0.53 | 2.66 | 2,380 | 800 | **3.39** | 1.68 | Amazon Bedrock; SageMaker JumpStart |

The Claude, Gemini and Qwen-on-Bedrock prices are the same on Bedrock and Vertex as first-party, at global endpoints. Regional or multi-region endpoints carry a 10% premium.

**Token-priced, no per-page estimate:**
- **Mistral Large 4:** $1.36 in / $4.18 out per million tokens. Image-token count isn't documented. For OCR, Mistral steers users to Mistral OCR. Large 3 is on Azure and Bedrock at $0.50/$1.50.
- **Amazon Nova 2 Lite:** $0.30 / $2.50 per million tokens, on Bedrock only. Nova 2 Pro is $1.25 / $10.

**What these models return:** markdown or HTML when prompted, and schema-constrained JSON through structured outputs. They can give coordinates when asked (Gemini, Claude and Qwen are good at it), but these aren't OCR-grade bounding boxes. There are no native per-field confidences.

**Notes per family:**
- **Gemini** is the price/performance leader for page-image work. Its image-token count is low (1,120, or 560 for a native PDF page), and Flash-Lite is cheap. It is GCP-only.
- **Claude Haiku 5.5** at $0.10 / $0.50 per million tokens is the cheapest model you can get on all three clouds. Opus and Fable are expensive for bulk OCR, so save them for hard extraction and reasoning.
- **OpenAI** has the highest image-token counts per page. GPT-6 Luna, GPT-5.4 nano and GPT-5.6 Luna are the economical tiers. Astra and GPT-5.5 cost $38–68/1k at list price.

## 2. Hyperscaler document AI (first-party, so enterprise-deployable by definition)

| id | Service | $/1k pages (list, first tier) | Volume tier | Outputs | Positioning |
|---|---|---:|---|---|---|
| `azure-di-read` | Azure DI Read | 1.50 | $0.60 above 1M/mo | text, words+polygons, confidences | Commodity OCR incl. handwriting |
| `azure-di-layout` | Azure DI Layout | 10.00 | commitment tiers | **markdown**, tables, sections, polygons, confidences | Default Azure RAG parser. Add-ons +$6, query fields +$10 |
| `azure-di-prebuilt` | Azure DI prebuilt (invoice/receipt/ID/tax...) | 10.00 | ~$7.50 at 1M commit | fixed-schema JSON, confidences | No training |
| `azure-di-custom` | Azure DI custom (template/neural/generative) | 30.00 | ~$18–24 commit | your-schema JSON, confidences | Training $3/hr, classifier $3/1k |
| `azure-content-understanding` | Azure Content Understanding | ~6.54 (MS illustrative) | – | markdown, schema JSON, grounding, confidences | Layered meters: extraction $1 (basic) / $5 (standard), layout add-on $5, contextualization ~$1, **plus your GPT tokens** |
| `aws-textract-detect` | Textract DetectDocumentText | 1.50 | $0.60 above 1M | text, boxes, confidences | Commodity OCR |
| `aws-textract-layout` | Textract Layout | 4.00 | $3.00 | layout blocks, reading order | Cheapest hyperscaler layout |
| `aws-textract-tables` | Textract Tables | 15.00 | $10.00 | tables | |
| `aws-textract-forms` | Textract Forms | 50.00 | $40.00 | key-values, checkboxes | Pricey. F+T+Q = $70 |
| `aws-textract-queries` | Textract Queries | 15.00 | $10.00 | Q&A answers with boxes | Custom-query adapters $25 |
| `aws-textract-expense` | Textract AnalyzeExpense | 10.00 | $8.00 | invoice fields, line items | ID $25/1k, Lending $70/1k |
| `aws-bda-standard` | Bedrock Data Automation (standard) | 10.00 | – | markdown/HTML/CSV per page, boxes | GenAI-native AWS parser |
| `aws-bda-custom` | Bedrock Data Automation (custom blueprints) | 40.00 | – | schema JSON, confidences, boxes | +$0.0005/field/page above 30 fields |
| `gcp-docai-ocr` | Document AI Enterprise OCR | 1.50 | $0.60 above 5M | text, boxes, confidences | Add-ons $6/1k. Savings plans 10–20% off |
| `gcp-docai-layout-parser` | Document AI Layout Parser (Gemini-powered) | 10.00 | flat | structured blocks + chunks | RAG ingestion |
| `gcp-docai-form-parser` | Document AI Form Parser | 30.00 | $20 above 1M | KV, tables, checkboxes | |
| `gcp-docai-custom-extractor` | Document AI Custom Extractor (generative) | 30.00 | $20 above 1M | schema JSON, confidences | Hosting $0.05/hr |
| `gcp-docai-invoice` | Document AI Invoice/Expense parser | ~10.00 | – | invoice fields | **$0.10 per started 10 pages**, so a 1-page invoice costs $0.10 = $100/1k docs |

Sources:
- Azure: Retail Prices API (`prices.azure.com`, eastus, meters "S0 Read/Layout/Pre-built/Custom Pages", "Azure Content Understanding") and the Content Understanding pricing explainer.
- AWS: the AWS bulk price list JSON for AmazonTextract and AmazonBedrock (us-east-1, published 2026-10-20).
- Google: cloud.google.com/document-ai/pricing.

## 3. Specialist SaaS / APIs

| id | Vendor/product | $/1k pages (list) | Basis | Azure/GCP/AWS route | Outputs | Positioning |
|---|---|---:|---|---|---|---|
| `mistral-ocr` | Mistral OCR 4.1 | **4.00** (batch ~2.00) | Official model card. Batch 50% per pricing FAQ; OCR-specific batch rate from secondary sources | **Azure AI Foundry** (OCR 4 $4, OCR 2512 $2, OCR v1 $1). **Vertex**: only OCR 25.05, listed at $0.0005/page in and $0.0005/page out | markdown, HTML tables, paragraph bboxes, block labels, block confidences | Cheapest hyperscaler-hosted VLM OCR. Price doubled vs OCR 3 |
| `mistral-document-ai` | Mistral Document AI (annotations) | 5.00 | Model card + Azure meter "OCR 4 annot" | Azure AI Foundry | schema JSON + bboxes | Schema extraction |
| `datalab-api` | Datalab Convert fast/balanced | 4.00 | Lite (CPU) $0.50, accurate $10. Extraction $6 / $15 / $20 | No marketplace. Enterprise: **your VPC or air-gapped** | markdown, HTML, JSON+bboxes, optional word/cell bboxes (+$3–9) | Hosted Marker/Chandra. Top olmOCR-bench claims. EU +25% |
| `datalab-api-accurate` | Datalab Convert accurate | 10.00 | | same | same | Chandra-class |
| `reducto-parse` | Reducto Parse r-1 | 10.00 (batch 8.00) | Extract $20, Deep Extract $40, Classify $7.50 | **AWS Marketplace** (Feb 2026, counts against AWS commit). VPC/on-prem on Enterprise | markdown, blocks+bboxes, tables, charts, citations | Complex tables/finance. Enterprise-grade |
| `llamaparse-fast` / `-cost-effective` / `-agentic` / `-agentic-plus` | LlamaParse v2 tiers | 1.25 / 3.75 / **12.50** / 56.25 | 1, 3, 10 or 45 credits/page x $1.25 per 1k credits. Layout +3 credits | AWS Marketplace (vendor page). VPC on Enterprise | markdown, JSON+bboxes, tables. LlamaExtract: schema JSON + citations + confidences | Auto-mode routes pages between tiers |
| `unstructured` | Unstructured Platform | 15.00 | $0.015/page after 10k free | AWS Marketplace (private offer). VPC | typed JSON elements + coordinates, HTML tables, chunks | ETL and connectors first. OSS lib Apache-2.0 |
| `landing-ade` | LandingAI ADE (DPT-3 Pro) | ~15.00 (Verity ~5.50) | $1 = 100 credits. Median ~1.5 credits/page (Pro) or 0.55 (Verity) on Standard tier. Priority tier 2x. Extract +~$15 | **Snowflake Native App**. VPC/on-prem. AWS Marketplace **(unverified)** | markdown, chunks, visual-grounding bboxes, schema JSON | Best-in-class grounding/citations. Variable per page |
| `extend-parse` | Extend Parse (Performance) | 20.00 (Light 5.00) | $0.01/credit. Extract +$30 (Performance), so ~$50/1k all-in | Vendor SaaS. BYOC/hybrid on Enterprise | markdown, blocks+bboxes, schema JSON | Workflow platform with evals and review |
| `upstage-document-parse` | Upstage Document Parse | 10.00 (Enhanced 30.00) | $0.01 / $0.03 per page ex-VAT | **AWS Marketplace** (SaaS + SageMaker) | HTML/markdown, elements+coords, tables | Deployable inside AWS |
| `nanonets-idp` | Nanonets workflows | n/a | $0.02–0.30 per block run. Vendor: "under $2 per invoice" | Vendor SaaS | JSON fields, line items | No-code AP/IDP |
| `rossum` | Rossum Aurora | n/a | From $18,000/yr | Vendor SaaS | JSON, validation UI | AP/logistics transactional docs |
| `docsumo` | Docsumo | n/a | Quote only | Vendor SaaS | JSON, tables, review UI | Mid-market lending/insurance |
| `hyperscience` | Hyperscience | n/a | AWS Marketplace 12-month contract $50k (snippet, **unverified**) | **AWS Marketplace**, on-prem | JSON + HITL | Forms/handwriting with accuracy SLAs |
| `instabase` | Instabase AI Hub | n/a | Consumption units, 100 CU = $1 (third party, **unverified**) | **AWS Marketplace** | JSON, apps/agents | Heavy enterprise IDP (banks, insurers) |
| `abbyy-vantage` | ABBYY Vantage / FineReader | n/a | Quote. G-Cloud: ~0.11 per transaction at 100k pages, 0.06 at 1M (**unverified** currency/unit) | Vendor cloud (hosted on Azure). No marketplace listing found | XML/JSON with boxes and confidences | Incumbent classic OCR/IDP |
| `databricks-ai-parse-document` | Databricks ai_parse_document | ~0.70–6 (**unverified**) | ~10–90 DBUs per 1k pages depending on complexity | Runs inside Databricks on Azure/AWS/GCP | JSON elements + bboxes | Already in many clients' platforms. Snowflake AI_PARSE_DOCUMENT is the equivalent (rate not verified) |

## 4. Open-weights models and pipelines (self-host; your own cloud tenancy counts as "on Azure/GCP/AWS")

| id | Model | Licence (commercial reality) | Marketplace / managed route | Publisher throughput | Self-host $/1k pages @ $2.50/GPU-hr | Outputs |
|---|---|---|---|---|---:|---|
| `chandra` | Chandra OCR 2 (Mar 2026) | Apache-2.0 code. **Weights modified OpenRAIL-M: free only under $2M revenue/funding; no competing with the Datalab API** | none (Datalab API / on-prem licence) | 1.44 pg/s H100 on a hard bench; ~2 pg/s real-world (vendor) | 0.48 (0.35) + licence | markdown, HTML, JSON+bboxes |
| `marker` | Marker | Apache-2.0 code. **Weights OpenRAIL-M: free under $5M revenue AND funding** | none | 2.9 pg/s balanced / 7.4 fast on **B200**. 23.7 pg/s CPU no-OCR | 0.24 (fast 0.09) + licence. B200 costs more | markdown, HTML, JSON+bboxes |
| `surya` | Surya OCR 2 | as Marker ($5M) | none | 5.35 pg/s RTX 5090 | 0.13 (overstated) | lines+bboxes, layout, tables |
| `docling` | Docling (IBM) | **MIT** (models: own permissive licences) | none needed (CPU-capable) | 2.1 pg/s B200 (measured by Datalab, a competitor) | 0.33 | markdown, HTML, DoclingDocument JSON+bboxes |
| `granite-docling` | granite-docling-258M | **Apache-2.0** | via Docling. IBM watsonx | n/a (tiny, CPU/MLX) | ~0 | DocTags to markdown/HTML/JSON |
| `smoldocling` | SmolDocling-256M (preview) | CDLA-Permissive-2.0 | – | n/a | ~0 | DocTags |
| `mineru` | MinerU / MinerU2.5-Pro 1.2B | Apache-2.0 **+ licence needed above $20M monthly revenue or 100M MAU; attribution for online services**. Old 2509 weights AGPL | none | 2.12 pg/s A100 (VLM). Pipeline 0.54 pg/s B200 (competitor-measured) | 0.33 | markdown, JSON+bboxes, HTML tables, LaTeX |
| `paddleocr-vl` | PaddleOCR-VL 1.6 (0.9B, May 2026) | **Apache-2.0** | none found | 1.62 pg/s A100 (v1 report). 2.23 pg/s H800 | 0.43 | markdown, JSON+bboxes, tables, formulas, charts |
| `olmocr` | olmOCR 2 7B (Ai2) | **Apache-2.0** | Hosted on DeepInfra/Parasail/Cirrascale | "< $200 per million pages" (Ai2) | **0.20** | markdown/plain text, tables, LaTeX (no bboxes) |
| `deepseek-ocr` | DeepSeek-OCR (MIT) / OCR-2 (Apache-2.0, Jan 2026) | **MIT / Apache-2.0** | **Vertex MaaS** ($0.30/$1.20 per M tokens, about $1.20/1k pages est.). **SageMaker JumpStart** | 200k+ pages/day on A100-40G (~2.3 pg/s) | 0.30 | markdown, grounding boxes |
| `dots-ocr` | dots.ocr / dots.mocr (rednote) | **MIT** | none | 0.35 pg/s A100 (measured by Paddle) | 1.97 | markdown, layout JSON+bboxes |
| `glm-ocr` | GLM-OCR (Z.ai, Jan 2026) | **MIT** | none | 1.86 pg/s (single concurrency) | ≤0.37 | markdown, JSON |
| `lightonocr` | LightOnOCR-3 (Oct 2026) / -2-1B | **Apache-2.0** | none | 5.71 pg/s H100 (2-1B) | 0.12 (vendor claims <$0.01) | markdown, grounding bboxes, chart data |
| `qianfan-ocr` | Qianfan-OCR (Baidu, Mar 2026) | Apache-2.0 | none | 1.02 pg/s A100 W8A8 | 0.68 | markdown, JSON, KIE |
| `nanonets-ocr2` | Nanonets-OCR2-3B | **No licence on HF card. Base model Qwen2.5-VL-3B = qwen-research licence** (check before use) | none | n/a | – | markdown, HTML tables, tags |
| `hunyuan-ocr` | HunyuanOCR (Tencent) | **Tencent community licence; excludes EU, UK, South Korea** | none | n/a | – | markdown, spotting boxes |
| `teleocr` / `ovisocr2` | TeleOCR 1.2B (Aug 2026), OvisOCR2 (Jul 2026) | Apache-2.0 | none | n/a | – | markdown. Both claim ~96–97 OmniDocBench v1.6 (**unverified** secondary) |
| `qwen3-vl` | Qwen3-VL / Qwen3.5 / Qwen3.8-27B | Apache-2.0 (Qwen3.8-Flash-Next: qwen-community licence) | **Bedrock** (235B serverless), **JumpStart** (8B) | n/a | – | prompted markdown/JSON/boxes |

Licence sources: the GitHub READMEs and Hugging Face model cards cited in the JSON, plus the Datalab pricing FAQ, which says weights are "free for commercial use if your company is under the threshold on both revenue and funding: $2M for Chandra and $5M for Marker and Surya".

## 5. Code libraries and classic OCR

| id | Tool | Licence | Cost | Outputs | One-liner |
|---|---|---|---|---|---|
| `pdfplumber` | pdfplumber | MIT | free (CPU) | text, chars/words+bboxes, heuristic tables | Precise born-digital extraction. No OCR |
| `pymupdf` | PyMuPDF | **AGPL-3.0 or paid Artifex licence** | free / commercial licence (price not public) | text, blocks+bboxes, tables, renders | Fastest. Licence matters for closed-source products |
| `pymupdf4llm` | pymupdf4llm | AGPL-3.0 / Artifex | as above | markdown | Quick PDF→markdown for RAG |
| `pypdf` | pypdf | BSD-3 | free | plain text | Manipulation, not extraction |
| `pdfminer.six` | pdfminer.six | MIT | free | text + layout bboxes | Low-level engine under pdfplumber |
| `camelot` | Camelot | MIT | free | tables → DataFrame/CSV/JSON/HTML | Ruled/whitespace tables in born-digital PDFs |
| `tabula` | Tabula (java/py) | MIT | free | tables → CSV/JSON | Similar to Camelot. Little maintenance |
| `tesseract` | Tesseract | Apache-2.0 | free (CPU) | text, hOCR/ALTO/TSV with boxes + confidences | OCR baseline. Weak on layout/tables |

## 6. Things to say out loud in the session

- **Read/Detect/OCR at $1.50/1k is identical across all three clouds** (with $0.60 volume tiers). The real price jumps come with layout ($4–10), forms ($30–50) and custom extraction ($30–40).
- **A $0.83/1k Claude Haiku 5.5 or $0.50/1k Gemini 2.5 Flash-Lite page read** now costs less than most specialist parse APIs. Hyperscaler or specialist products still win on bounding boxes, confidences, SLAs and table fidelity.
- **Self-hosting VLM OCR costs about $0.1–0.5 per 1k pages in GPU time.** Engineering, ops and licences dominate the true cost. Check the licence before benchmarking anything for a large client.
- **Cloud-route shortcuts:**
  - Azure shops: DI Layout, Content Understanding, Mistral OCR/Document AI on Foundry, GPT on Foundry, Claude on Foundry.
  - AWS shops: Textract, BDA, Claude/Qwen/GPT-6 Astra/Nova on Bedrock, Reducto/LlamaParse/Upstage via Marketplace.
  - GCP shops: Document AI, Gemini, Claude, DeepSeek-OCR and Mistral OCR 25.05 on Vertex.

## Verification log / caveats

- **Verified directly:**
  - From machine-readable price files: AWS bulk price list JSON (Textract, Bedrock, Bedrock FMs) and the Azure Retail Prices API.
  - From official pages: Google pricing pages (Gemini API, Vertex, Document AI), OpenAI pricing `.md`, Anthropic pricing and vision docs, the Mistral OCR 4.1 and Large 4 model cards, and the Datalab, Reducto, LlamaParse docs, Unstructured, LandingAI, Extend, Nanonets, Rossum and Upstage pricing pages.
  - From Hugging Face model cards and GitHub READMEs.
- **Unverified / secondary:**
  - The Mistral OCR batch rate ($2).
  - ABBYY, Hyperscience and Instabase prices.
  - Databricks DBU rates.
  - LandingAI on AWS Marketplace.
  - TeleOCR/OvisOCR2 benchmark claims.
  - The Nanonets-OCR2 licence.
  - Image-token counts for GPT-6 Sol/Luna (assumed) and for Qwen and Gemini 2.5 images (estimated).
- **Throughput figures are publisher-reported.** Hardware and benchmark mixes differ (H100 vs A100 vs B200 vs RTX 5090), so the self-host column is only a rough guide.
- The Azure pricing web page renders "$-" placeholders. The Azure numbers come from the official Retail Prices API instead.
