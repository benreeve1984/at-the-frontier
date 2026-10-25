window.WX = {
 "columns": [
  {
   "key": "search",
   "label": "Search APIs",
   "unit": "per 1,000 searches",
   "color": "var(--ink-3)",
   "items": [
    {
     "id": "jina-search",
     "name": "Jina Search",
     "price": "$0.50",
     "deploy": {
      "hosted": [],
      "billing": "Jina token credits",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Jina AI was acquired by Elastic (completed Oct 2025); API continues as a standalone product."
     },
     "status": "available",
     "notes": "",
     "basis": "10,000-token floor x $0.05 per 1M = $0.0005 per search = $0.50 per 1k (unverified).",
     "data": "Not checked.",
     "index": "Not disclosed; wraps a third-party search engine and reads the top pages",
     "verified": false
    },
    {
     "id": "serper",
     "name": "Serper",
     "price": "$1",
     "deploy": {
      "hosted": [],
      "billing": "Serper prepaid credits",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Serper-operated scraper."
     },
     "status": "available",
     "notes": "Cheapest Google-results route; same terms risk as any SERP scraper.",
     "basis": "$50 for 50,000 queries = $1.00 per 1k at the first tier.",
     "data": "Not checked.",
     "index": "Scrapes Google result pages",
     "verified": true
    },
    {
     "id": "dataforseo-serp",
     "name": "DataForSEO",
     "price": "$2",
     "deploy": {
      "hosted": [],
      "billing": "DataForSEO prepaid",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "DataForSEO-operated scraper."
     },
     "status": "available",
     "notes": "Live mode is the relevant one for agents.",
     "basis": "Live mode $0.002 per SERP = $2.00 per 1k (queued $0.60).",
     "data": "Not checked.",
     "index": "Scrapes Google, Bing, YouTube etc.",
     "verified": true
    },
    {
     "id": "mojeek-api",
     "name": "Mojeek",
     "price": "$2.66",
     "deploy": {
      "hosted": [],
      "billing": "Mojeek",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Mojeek-operated, UK."
     },
     "status": "available",
     "notes": "Truly independent index; smaller and less fresh than Google/Bing/Brave.",
     "basis": "GBP 2 per 1k converted at an assumed USD 1.33/GBP = ~$2.66.",
     "data": "Mojeek's no-tracking policy (not re-checked).",
     "index": "Own independent crawler and index (UK)",
     "verified": true
    },
    {
     "id": "google-vertex-ai-search",
     "name": "Vertex AI Search",
     "price": "$4",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party Google Cloud service (now under the Gemini Enterprise Agent Platform brand). Good when the 'web' you need is a known list of sites."
     },
     "status": "available",
     "notes": "Google's named replacement for Custom Search JSON for site-restricted search.",
     "basis": "Website search requires Enterprise edition: $4.00 per 1k queries (Standard $1.50 is for unstructured/structured data, not website search).",
     "data": "Google Cloud data terms; VPC-SC/CMEK per Agent Search docs (not re-checked today).",
     "index": "Google index restricted to your configured sites (up to ~50 domains for public-web use) or your own data",
     "verified": true
    },
    {
     "id": "exa-search",
     "name": "Exa Search",
     "price": "$4",
     "deploy": {
      "hosted": [],
      "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Exa-operated service."
     },
     "status": "available",
     "notes": "Raised $250M Series C at $2.2B (May 2026, secondary sources). Lite tier added in 2026; the 2025 entry price was $5/1k for 1-25 results.",
     "basis": "Lite: $4 per 1k requests with up to 10 results and page text/highlights. Auto $7.",
     "data": "ZDR on Enterprise only.",
     "index": "Own neural web index (Exa claims 500B+ URLs tracked) plus people, company and papers indexes",
     "verified": true
    },
    {
     "id": "keenable-search",
     "name": "Keenable",
     "price": "$4",
     "deploy": {
      "hosted": [],
      "billing": "Keenable",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "On-premises option for the high-volume tier."
     },
     "status": "available",
     "notes": "2026 entrant: out of stealth Aug 2026 with $26M seed (Accel, Conviction).",
     "basis": "$4 per 1k requests PAYG.",
     "data": "Not checked.",
     "index": "Own index (claims 100B+ documents)",
     "verified": true
    },
    {
     "id": "google-custom-search-json",
     "name": "Google Custom Search*",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "Google Cloud billing account (API Console)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Google service, but not a Vertex AI service with Google Cloud data-residency terms. Being discontinued 2027-01-01."
     },
     "status": "closed to new customers; sunset 2027-01-01",
     "notes": "Dead end for new builds. Google points new users to Vertex AI Search (up to 50 domains) or a 'full web search solution' by contact.",
     "basis": "$5 per 1k queries after 100/day free.",
     "data": "Standard Google API logging; no ZDR offer documented.",
     "index": "Google Search index (Programmable Search Engine configuration)",
     "verified": true
    },
    {
     "id": "brave-search-api",
     "name": "Brave Search API",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "Brave (prepaid credits)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Runs on Brave-operated infrastructure. No hyperscaler-hosted option found."
     },
     "status": "available",
     "notes": "One of four or five truly independent Western indexes. Mistral's web_search connector returns 'source: brave' results.",
     "basis": "$5 per 1k requests; LLM Context content included in the request price.",
     "data": "Brave markets 'architectural ZDR': queries stay on Brave-operated infrastructure, not shared or trained on; full-funnel ZDR on Enterprise.",
     "index": "Own crawler plus opt-in Web Discovery Project signals; Brave says it never uses Google or Bing results",
     "verified": true
    },
    {
     "id": "parallel-search",
     "name": "Parallel Search",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
     },
     "status": "available",
     "notes": "Search Fast tier launched 2026.",
     "basis": "Basic/Advanced $5 per 1k (10 results); Turbo/Fast $1 per 1k.",
     "data": "Enterprise: ZDR and DPAs. SOC 2.",
     "index": "Own web index built for AI agents",
     "verified": true
    },
    {
     "id": "perplexity-search-api",
     "name": "Perplexity Search API",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "Perplexity; AWS Marketplace listing (billing route)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Perplexity-operated."
     },
     "status": "available",
     "notes": "Batching 5 queries per request makes the effective price $1 per 1k queries.",
     "basis": "$5 per 1k requests (one query per request). With 5 queries batched, $1 per 1k queries.",
     "data": "Enterprise privacy terms; not re-checked today.",
     "index": "Perplexity's own web index",
     "verified": true
    },
    {
     "id": "youcom-search",
     "name": "You.com Search",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "You.com",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "You.com-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "$5 per 1k calls.",
     "data": "ZDR, SOC 2 and DPA on Enterprise.",
     "index": "You.com's own real-time index",
     "verified": true
    },
    {
     "id": "linkup-search",
     "name": "Linkup",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "Linkup prepaid; x402 (USDC) per request",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "Enterprise offers a 'private environment'."
     },
     "status": "available",
     "notes": "Strong in France/EU; publisher-licensing angle.",
     "basis": "standard depth, searchResults: $0.005 per call.",
     "data": "ZDR on Enterprise. SOC 2 Type II on all plans.",
     "index": "Own index plus licensed publisher content; offers personalised indexes",
     "verified": true
    },
    {
     "id": "valyu-search",
     "name": "Valyu",
     "price": "$6.25",
     "deploy": {
      "hosted": [],
      "billing": "Valyu",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Valyu-operated."
     },
     "status": "available",
     "notes": "Its pitch is licensed specialist data, not the open web.",
     "basis": "10 web results x 0.1 credit = 1 credit; 1,000 queries = 1,000 credits = $6.25 at PAYG ($5.80 on the $29 plan).",
     "data": "ZDR on request (Enterprise). SOC 2 Type II.",
     "index": "Web search plus licensed/proprietary datasets (SEC filings, PubMed, arXiv, patents, market data)",
     "verified": true
    },
    {
     "id": "firecrawl-search",
     "name": "Firecrawl Search",
     "price": "$6.40",
     "deploy": {
      "hosted": [],
      "billing": "Firecrawl; AWS Marketplace and Google Cloud Marketplace (billing routes)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Marketplace listings are billing routes; processing stays on Firecrawl."
     },
     "status": "available",
     "notes": "Raised $75M Series B and launched Alexandria on 2026-09-22.",
     "basis": "Hobby: $16 / 5,000 credits = $0.0032/credit x 2 credits = $6.40 per 1k searches. Standard plan: $1.66.",
     "data": "ZDR on Enterprise.",
     "index": "Web search via third-party engines plus Firecrawl's own Research, Developer and Government indexes ('Alexandria')",
     "verified": true
    },
    {
     "id": "aws-agentcore-web-search",
     "name": "AgentCore Web Search",
     "price": "$7",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party AWS service. AWS says queries and results stay within AWS (no third-party search API)."
     },
     "status": "available",
     "notes": "The cleanest 'search inside AWS' option for agents on any model hosted in Bedrock.",
     "basis": "$7 per 1k queries.",
     "data": "Data stays in AWS per AWS launch material; standard AWS service terms.",
     "index": "Amazon's own web index plus Amazon Knowledge Graph",
     "verified": true
    },
    {
     "id": "tavily-search",
     "name": "Tavily",
     "price": "$8",
     "deploy": {
      "hosted": [],
      "billing": "Tavily; Databricks MCP marketplace",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
     },
     "status": "available",
     "notes": "Popular default in agent frameworks.",
     "basis": "Basic search = 1 credit at PAYG $0.008 = $8 per 1k; advanced = $16 per 1k. Project plan: $7.50 per 1k basic.",
     "data": "Enterprise tier advertises enterprise-grade security and privacy; ZDR terms not on the public pricing page.",
     "index": "Aggregates and re-ranks results from third-party engines plus its own crawl/cache; sources not disclosed",
     "verified": true
    },
    {
     "id": "kagi-search-api",
     "name": "Kagi",
     "price": "$12",
     "deploy": {
      "hosted": [],
      "billing": "Kagi",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Kagi-operated."
     },
     "status": "available",
     "notes": "Premium price. Third-party trackers quote different figures; the vendor page says $12.",
     "basis": "$12 per 1k requests.",
     "data": "Kagi privacy policy; no logging of searches claimed for consumer product (API terms not re-checked).",
     "index": "Own small-web index (Teclis) blended with third-party engines",
     "verified": true
    },
    {
     "id": "serpapi",
     "name": "SerpApi",
     "price": "$25",
     "deploy": {
      "hosted": [],
      "billing": "SerpApi subscription",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "SerpApi-operated scraper."
     },
     "status": "available",
     "notes": "Legal grey zone: depends on scraping Google; the legal shield exists because of that.",
     "basis": "First paid tier: $25 for 1,000 searches = $25 per 1k ($10 per 1k on Production, $9.17 on Big Data).",
     "data": "Not checked.",
     "index": "Scrapes Google (and Bing, Baidu, etc.) result pages",
     "verified": true
    }
   ]
  },
  {
   "key": "tools",
   "label": "Model search tools",
   "unit": "per 1,000 searches, plus tokens",
   "color": "var(--purple)",
   "items": [
    {
     "id": "gemini-api-grounding-google-search",
     "name": "Gemini API grounding",
     "price": "$14",
     "deploy": {
      "hosted": [],
      "billing": "Google AI Studio / Gemini API billing",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Gemini Developer API is a Google service but not Vertex AI; enterprise cloud clients should use the Vertex records."
     },
     "status": "available",
     "notes": "Price traps: Gemini 4 Argon tokens double on 2026-12-01 and Gemini 3.8/3.6 Flash on 2027-01-01 (grounding fee unchanged).",
     "basis": "Assumes grounding-returned tokens are not billed (stated on Vertex; not stated on the Gemini API page). Gemini 3.8 Flash: 2 x $0.014 + 1,000x0.75/1M + 500x3.75/1M = $0.031.",
     "data": "Gemini API terms; paid tier not used for training. Search Suggestions display required.",
     "index": "Google Search index",
     "verified": true
    },
    {
     "id": "vertex-grounding-google-search",
     "name": "Vertex grounding",
     "price": "$14",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Runs on Google infrastructure, but processing location is global (no documented regional processing) and VPC-SC support is not documented. Google keeps reliability logs for up to 3 days."
     },
     "status": "available",
     "notes": "Display rules: show Search Suggestions exactly as provided, visible with the answer, tap goes straight to Google results. The pricing page says customers may choose not to display Search Suggestions at standard pricing under 1M grounding prompts/day; confirm with Google before relying on it. Pages that opt out via Google-Extended are excluded.",
     "basis": "Gemini 3.8 Flash: 2 queries x $0.014 + 1,000 prompt tokens x $0.75/1M + 500 out x $3.75/1M = $0.031; grounding tokens free on Vertex.",
     "data": "Reliability logs up to 3 days; not a ZDR service. Use Web Grounding for Enterprise for no-logging/VPC-SC.",
     "index": "Google Search index",
     "verified": true
    },
    {
     "id": "vertex-web-grounding-enterprise",
     "name": "Web Grounding for Enterprise",
     "price": "$14",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Built for regulated industries: no customer data logged or persisted, VPC Service Controls supported. Data residency not documented."
     },
     "status": "available",
     "notes": "For Gemini 3+, the enterprise variant costs the same as consumer Google Search grounding, which removes the old 2.5-era premium ($45 vs $35).",
     "basis": "Same arithmetic as Google Search grounding: ~$0.031 per answer on Gemini 3.8 Flash.",
     "data": "Does not log customer data; nothing persisted (so CMEK/Access Transparency not applicable). VPC-SC supported.",
     "index": "Curated subset of the Google index (fast-changing content refreshed ~6 h, full index ~24 h)",
     "verified": true
    },
    {
     "id": "amazon-nova-web-grounding",
     "name": "Nova Web Grounding",
     "price": "$30",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "AWS: 'Your data never leaves AWS infrastructure'. US regions only, via cross-region inference profiles. Nova models only."
     },
     "status": "available",
     "notes": "Compare AgentCore Web Search ($7/1k) which works with any model.",
     "basis": "1 request $0.03 + ~$0.003 Nova 2 Lite tokens (token prices not re-checked) = ~$0.033 per answer.",
     "data": "Queries stay within AWS services; runtime prompt-injection filtering.",
     "index": "Amazon's internal web search index and knowledge graphs",
     "verified": true
    },
    {
     "id": "xai-web-search",
     "name": "xAI web search",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "xAI API",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "xAI-operated. Grok models on Azure Foundry exist but tool availability there not checked."
     },
     "status": "available",
     "notes": "Only provider with first-party X/Twitter search.",
     "basis": "grok-4.7: 2 x $0.005 + 11,000 x $2/1M + 500 x $6/1M = $0.035.",
     "data": "Not checked.",
     "index": "Not disclosed for web; X posts from X's own data",
     "verified": true
    },
    {
     "id": "openai-web-search",
     "name": "OpenAI web search",
     "price": "$10",
     "deploy": {
      "hosted": [],
      "billing": "OpenAI API",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "OpenAI-hosted only. In Azure the equivalent tool routes to Grounding with Bing (see azure-openai-web-search). Not available with GPT on Bedrock as far as found."
     },
     "status": "available",
     "notes": "Display rule: inline citations must be clearly visible and clickable. gpt-4o search-preview models were shut down 2026-07-23.",
     "basis": "Answer = 2 calls x $0.01 + 11,000 input tokens (10k search content + 1k prompt) + 500 output, no reasoning tokens. gpt-6.1-sol: 0.02 + 11,000x2/1M + 500x10/1M = $0.047. Other models in tiers. Reasoning tokens can add 2-5x on output.",
     "data": "OpenAI API retention terms; ZDR eligibility for web search not confirmed today.",
     "index": "Not fully disclosed; OpenAI runs its own crawler (OAI-SearchBot) and uses partners",
     "verified": true
    },
    {
     "id": "azure-openai-web-search",
     "name": "Azure OpenAI search",
     "price": "$14",
     "deploy": {
      "hosted": [],
      "billing": "Azure subscription (Grounding with Bing resource)",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "The model runs in Azure, but the search does not: Microsoft says data flows outside your compliance and geo boundary, and the Microsoft DPA does not apply to data sent to Bing."
     },
     "status": "available",
     "notes": "Azure admins can disable web search at tenant level.",
     "basis": "2 Bing requests x $0.014 + 11,000 input + 500 output at GPT-6.1 Sol-equivalent $2/$10 = $0.055 (Azure token prices not re-checked per model).",
     "data": "Queries (and resource key) leave the Azure compliance boundary to the Bing service, governed by Bing terms and the Microsoft Privacy Statement, not the Azure DPA.",
     "index": "Bing (via Grounding with Bing Search / Bing Custom Search)",
     "verified": true
    },
    {
     "id": "anthropic-web-search",
     "name": "Claude web search",
     "price": "$10",
     "deploy": {
      "hosted": [],
      "billing": "Claude API; AWS Marketplace (Claude Platform on AWS); Google Cloud Marketplace (Anthropic-managed); Azure Marketplace (Foundry)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Not on Amazon Bedrock. On Vertex AI (Google-managed) only the basic tool. On Foundry 'hosted on Azure' only the basic tool. Claude Platform on AWS and Anthropic-managed Google Cloud are Anthropic-operated; the search provider is not named, so assume queries leave the cloud."
     },
     "status": "available",
     "notes": "Citations must be shown when outputs are displayed to end users. Price unchanged since launch (May 2025).",
     "basis": "2 searches x $0.01 + 11,000 input x1.3 (Claude 4.7+ tokenizer) = 14,300 + 650 output. Sonnet 5.5: 0.02 + 14,300x2/1M + 650x10/1M = $0.055.",
     "data": "Basic version (web_search_20250305) is ZDR-eligible; dynamic-filtering versions are not ZDR-eligible unless allowed_callers=['direct'].",
     "index": "Not disclosed by Anthropic (press in 2025 reported Brave; unverified)",
     "verified": true
    },
    {
     "id": "bing-grounding",
     "name": "Grounding with Bing",
     "price": "$14",
     "deploy": {
      "hosted": [],
      "billing": "Azure subscription",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Bing Search APIs (v7) were retired in Aug 2025; this is the remaining Microsoft route. It is Microsoft-operated but explicitly outside the Azure compliance boundary."
     },
     "status": "available",
     "notes": "Use-and-display requirements: you must show the website URLs and the Bing search query URL in the exact form provided. Launched in 2025 at $35/1k (from memory; current page says $14).",
     "basis": "$14 per 1k transactions, plus model tokens.",
     "data": "Customer data transferred outside the Azure compliance boundary; not subject to the same data processing terms, location of processing or certifications as Agent Service.",
     "index": "Bing web index (Custom Search: your configured domains)",
     "verified": true
    },
    {
     "id": "vertex-third-party-grounding",
     "name": "Vertex + Parallel or Exa",
     "price": "quote",
     "deploy": {
      "hosted": [],
      "billing": "Google Cloud Marketplace (Parallel) or Parallel direct",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Billing can sit on the Google Cloud bill, but Google states rewritten queries are sent to Parallel for processing: the search leaves Google Cloud."
     },
     "status": "available",
     "notes": "Supports Gemini 4 Argon, 3.x and 2.5 models.",
     "basis": "Parallel Search price ($1-5 per 1k) + Gemini tokens.",
     "data": "Queries go to the third party under its terms.",
     "index": "Parallel's or Exa's index",
     "verified": true
    },
    {
     "id": "mistral-web-search",
     "name": "Mistral web search",
     "price": "quote",
     "deploy": {
      "hosted": [],
      "billing": "Mistral La Plateforme / Studio",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Mistral models are on Azure Foundry, Vertex and Bedrock, but the web_search connector is a Mistral API feature."
     },
     "status": "available",
     "notes": "Not available in Chat Completions; only Conversations/Agents API.",
     "basis": "Not published on pages fetched; no estimate.",
     "data": "EU-hosted Mistral API; not checked today.",
     "index": "Brave Search (results tagged source: brave); premium adds verified news providers (AFP/AP)",
     "verified": false
    }
   ]
  },
  {
   "key": "answer",
   "label": "Answer APIs",
   "unit": "per 1,000 answers",
   "color": "var(--teal)",
   "items": [
    {
     "id": "perplexity-agent-api",
     "name": "Perplexity Agent API",
     "price": "$1.60",
     "deploy": {
      "hosted": [],
      "billing": "Perplexity; AWS Marketplace listing",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Perplexity-operated; routes to third-party model providers."
     },
     "status": "available",
     "notes": "Perplexity's own benchmark: 'low' effort beats the retired Sonar Deep Research at 1-2% of its cost.",
     "basis": "Perplexity-published cost per request at 'fast': $0.0014 (BrowseComp) to $0.0018 (DSQA).",
     "data": "Not checked today.",
     "index": "Perplexity index",
     "verified": true
    },
    {
     "id": "exa-answer",
     "name": "Exa Answer",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "Exa",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Exa-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "$5 per 1k answers; Deep Search $12.",
     "data": "ZDR on Enterprise.",
     "index": "Exa index",
     "verified": true
    },
    {
     "id": "youcom-answer",
     "name": "You.com Answer",
     "price": "$5",
     "deploy": {
      "hosted": [],
      "billing": "You.com",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "You.com-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "$5 per 1k.",
     "data": "ZDR on Enterprise.",
     "index": "You.com index",
     "verified": true
    },
    {
     "id": "linkup-sourced-answer",
     "name": "Linkup answer",
     "price": "$6",
     "deploy": {
      "hosted": [],
      "billing": "Linkup",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "As linkup-search."
     },
     "status": "available",
     "notes": "",
     "basis": "$0.006 per standard sourced answer.",
     "data": "ZDR on Enterprise.",
     "index": "Linkup index",
     "verified": true
    },
    {
     "id": "parallel-responses-api",
     "name": "Parallel Responses",
     "price": "$10",
     "deploy": {
      "hosted": [],
      "billing": "Parallel",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Parallel-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Low: $10 per 1k = $0.01 per answer.",
     "data": "ZDR on Enterprise.",
     "index": "Parallel index",
     "verified": true
    },
    {
     "id": "brave-answers",
     "name": "Brave Answers",
     "price": "$19",
     "deploy": {
      "hosted": [],
      "billing": "Brave prepaid",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Brave-operated."
     },
     "status": "available",
     "notes": "Brave publishes FreshQA: 85.3% at $18 per 1,000 questions all-in (vendor benchmark).",
     "basis": "$0.004 + ~3,000 tokens x $5/1M = $0.019 per answer (token count assumed; Brave's own all-in figure is $0.018).",
     "data": "As Brave Search API.",
     "index": "Brave index",
     "verified": true
    }
   ]
  },
  {
   "key": "research",
   "label": "Deep research APIs",
   "unit": "per task",
   "color": "var(--blue)",
   "items": [
    {
     "id": "perplexity-agent-api-deep",
     "name": "Perplexity, high",
     "price": "$0.13",
     "deploy": {
      "hosted": [],
      "billing": "Perplexity; AWS Marketplace listing",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Perplexity-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Perplexity-published average cost per request at 'high' ($0.121-0.136).",
     "data": "Not checked.",
     "index": "Perplexity index",
     "verified": true
    },
    {
     "id": "parallel-task-api",
     "name": "Parallel Task API",
     "price": "$0.30",
     "deploy": {
      "hosted": [],
      "billing": "Parallel",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Parallel-operated."
     },
     "status": "available",
     "notes": "The clearest published per-task ladder in the market.",
     "basis": "Ultra (deep research) = $300 per 1k = $0.30 per task; pro $0.10; core $0.025.",
     "data": "ZDR on Enterprise.",
     "index": "Parallel index",
     "verified": true
    },
    {
     "id": "youcom-research",
     "name": "You.com Research",
     "price": "$0.45",
     "deploy": {
      "hosted": [],
      "billing": "You.com",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "You.com-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Exhaustive = $450 per 1k = $0.45 per task (Deep $0.10).",
     "data": "ZDR on Enterprise.",
     "index": "You.com index",
     "verified": true
    },
    {
     "id": "exa-agent",
     "name": "Exa Agent",
     "price": "$0.50",
     "deploy": {
      "hosted": [],
      "billing": "Exa",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Exa-operated."
     },
     "status": "available",
     "notes": "Exa's 2025 Research API ($5/1k searches + $5/1k pages + reasoning tokens) is superseded by Agent pricing.",
     "basis": "'high' effort = $0.50 per run.",
     "data": "ZDR on Enterprise.",
     "index": "Exa indexes + Exa Connect data providers",
     "verified": true
    },
    {
     "id": "linkup-research",
     "name": "Linkup Research",
     "price": "$0.50",
     "deploy": {
      "hosted": [],
      "billing": "Linkup",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "As linkup-search."
     },
     "status": "available",
     "notes": "",
     "basis": "M depth = $0.50.",
     "data": "ZDR on Enterprise.",
     "index": "Linkup index",
     "verified": true
    },
    {
     "id": "valyu-deepresearch",
     "name": "Valyu DeepResearch",
     "price": "$0.62",
     "deploy": {
      "hosted": [],
      "billing": "Valyu",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Valyu-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "standard mode 100 credits x $0.00625 = $0.625.",
     "data": "ZDR on request.",
     "index": "Valyu web + licensed datasets",
     "verified": true
    },
    {
     "id": "tavily-research",
     "name": "Tavily Research",
     "price": "$1.06",
     "deploy": {
      "hosted": [],
      "billing": "Tavily",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Tavily-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Midpoint of pro bounds (15-250 credits = 132 credits x $0.008) = ~$1.06; mini midpoint ~$0.46.",
     "data": "As Tavily Search.",
     "index": "Tavily search",
     "verified": true
    },
    {
     "id": "gemini-deep-research-agent",
     "name": "Gemini Deep Research API",
     "price": "$2",
     "deploy": {
      "hosted": [],
      "billing": "Gemini API / AI Studio",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Documented for the Gemini Developer API; Vertex availability not confirmed today."
     },
     "status": "available",
     "notes": "Google publishes a typical-task profile: ~80 searches, ~250k input (50-70% cached), ~60k output; Max up to ~160 searches, ~900k input, ~80k output.",
     "basis": "Midpoint of Google's published $1-3 estimate (Max $3-7).",
     "data": "Gemini API terms.",
     "index": "Google Search",
     "verified": true
    },
    {
     "id": "openai-deep-research-api",
     "name": "OpenAI GPT-5.5",
     "price": "$3.29",
     "deploy": {
      "hosted": [],
      "billing": "OpenAI API",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "o3-deep-research remains on Azure (see azure-foundry-deep-research)."
     },
     "status": "available",
     "notes": "The dedicated deep-research model SKUs are gone on OpenAI's own API; deep research is now a configuration of a frontier model.",
     "basis": "Estimate using Google's published Deep Research profile (80 searches, 250k input of which 50% cached, 60k output incl. reasoning) on gpt-5.5: 80 x $0.01 + 125k x $5/1M + 125k x $0.50/1M + 60k x $30/1M = 0.80 + 0.625 + 0.0625 + 1.80 = ~$3.29.",
     "data": "OpenAI API terms.",
     "index": "OpenAI web search tool",
     "verified": true
    },
    {
     "id": "azure-foundry-deep-research",
     "name": "Azure o3-deep-research",
     "price": "$5.08",
     "deploy": {
      "hosted": [],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Model inference in Azure, but every search goes to Bing outside the Azure compliance boundary."
     },
     "status": "available",
     "notes": "Still listed on Azure after OpenAI retired the model on its own API (July 2026); expect a retirement notice.",
     "basis": "Same profile: 80 Bing calls x $0.014 = 1.12 + 125k x $10/1M + 125k x $2.50/1M + 60k x $40/1M = 1.12 + 1.25 + 0.31 + 2.40 = ~$5.08.",
     "data": "As Grounding with Bing: queries leave the compliance boundary.",
     "index": "Bing via Grounding with Bing Search",
     "verified": true
    }
   ]
  },
  {
   "key": "apps",
   "label": "Research apps",
   "unit": "per seat a month",
   "color": "var(--blue-2)",
   "items": [
    {
     "id": "gemini-app-deep-research",
     "name": "Gemini app",
     "price": "$20",
     "deploy": {
      "hosted": [],
      "billing": "Google One / Workspace",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Google-hosted."
     },
     "status": "available",
     "notes": "",
     "basis": "Seat price only.",
     "data": "Workspace/Enterprise data terms.",
     "index": "Google Search",
     "verified": false
    },
    {
     "id": "chatgpt-deep-research",
     "name": "ChatGPT deep research",
     "price": "$20",
     "deploy": {
      "hosted": [],
      "billing": "OpenAI",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "OpenAI-hosted."
     },
     "status": "available",
     "notes": "",
     "basis": "Seat price only.",
     "data": "Business/Enterprise: no training on data by default.",
     "index": "OpenAI search",
     "verified": false
    },
    {
     "id": "claude-research",
     "name": "Claude Research",
     "price": "$20",
     "deploy": {
      "hosted": [],
      "billing": "Anthropic",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Anthropic-hosted."
     },
     "status": "available",
     "notes": "Enterprise moved to seat + metered usage.",
     "basis": "Seat price only.",
     "data": "No training on Team/Enterprise content by default.",
     "index": "Claude web search",
     "verified": true
    },
    {
     "id": "perplexity-app",
     "name": "Perplexity app",
     "price": "$20",
     "deploy": {
      "hosted": [],
      "billing": "Perplexity",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Perplexity-hosted."
     },
     "status": "available",
     "notes": "",
     "basis": "Seat price only.",
     "data": "Enterprise: no training on data.",
     "index": "Perplexity index",
     "verified": false
    },
    {
     "id": "manus",
     "name": "Manus",
     "price": "$20",
     "deploy": {
      "hosted": [],
      "billing": "Manus",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Reported acquired by Meta (Dec 2025); not confirmed in today's search."
     },
     "status": "available",
     "notes": "",
     "basis": "Seat price only.",
     "data": "Not checked.",
     "index": "Third-party search + own browser agents",
     "verified": false
    },
    {
     "id": "genspark",
     "name": "Genspark",
     "price": "$25",
     "deploy": {
      "hosted": [],
      "billing": "Genspark",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Genspark-hosted."
     },
     "status": "available",
     "notes": "",
     "basis": "Seat price only.",
     "data": "Not checked.",
     "index": "Third-party search",
     "verified": false
    },
    {
     "id": "grok-app",
     "name": "Grok app",
     "price": "$30",
     "deploy": {
      "hosted": [],
      "billing": "xAI / X",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "xAI-hosted."
     },
     "status": "available",
     "notes": "",
     "basis": "Seat price only.",
     "data": "Not checked.",
     "index": "xAI search + X",
     "verified": false
    }
   ]
  },
  {
   "key": "browser",
   "label": "Browser agents and browsers",
   "unit": "per browser-hour",
   "color": "var(--orange)",
   "items": [
    {
     "id": "kernel",
     "name": "Kernel",
     "price": "$0.06",
     "deploy": {
      "hosted": [],
      "billing": "Kernel",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Kernel-operated; enterprise tier with SOC 2 and HIPAA."
     },
     "status": "available",
     "notes": "",
     "basis": "$0.0000166667 x 3,600 s = $0.06 per GB-hour; assumes a 1 GB browser (2 GB = $0.12/hr).",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "anchor-browser",
     "name": "Anchor",
     "price": "$0.09",
     "deploy": {
      "hosted": [],
      "billing": "Anchor",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Anchor-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "$0.09 per browser-hour + $0.01 per session.",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "cloudflare-browser-run",
     "name": "Cloudflare browser",
     "price": "$0.09",
     "deploy": {
      "hosted": [],
      "billing": "Cloudflare Workers",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Cloudflare edge; not a hyperscaler."
     },
     "status": "available",
     "notes": "",
     "basis": "$0.09 per browser-hour beyond included hours.",
     "data": "Cloudflare terms.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "steel",
     "name": "Steel",
     "price": "$0.10",
     "deploy": {
      "hosted": [],
      "billing": "Steel",
      "private": false,
      "weights": true,
      "saas": true,
      "note": "steel-browser is open source (Apache-2.0) and can be self-hosted."
     },
     "status": "available",
     "notes": "",
     "basis": "$0.10 per browser-hour (Launch).",
     "data": "HIPAA BAA on Scale.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "hyperbrowser",
     "name": "Hyperbrowser",
     "price": "$0.10",
     "deploy": {
      "hosted": [],
      "billing": "Hyperbrowser credits (1,000 credits = $1)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Hyperbrowser-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "$0.10 per browser-hour.",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "aws-agentcore-browser",
     "name": "AgentCore Browser",
     "price": "$0.11",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party AWS, in your Region; pair with AgentCore Web Search to keep search in AWS too."
     },
     "status": "available",
     "notes": "",
     "basis": "Illustrative: 1 vCPU + 2 GB fully active for an hour = 0.0895 + 2 x 0.00945 = $0.108; real bills lower because idle I/O time is free.",
     "data": "Runs in AWS.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "browserbase",
     "name": "Browserbase",
     "price": "$0.12",
     "deploy": {
      "hosted": [],
      "billing": "Browserbase",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Browserbase-operated."
     },
     "status": "available",
     "notes": "Bundles third-party search (Parallel, Exa) as resale.",
     "basis": "$0.12 per browser-hour overage on Developer.",
     "data": "SOC 2 (not re-checked).",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "browser-use",
     "name": "Browser Use",
     "price": "$0.15 / task",
     "deploy": {
      "hosted": [],
      "billing": "Browser Use credits",
      "private": true,
      "weights": true,
      "saas": true,
      "note": "Open-source library (MIT) runs anywhere, including inside your own cloud account; on-prem browsers offered."
     },
     "status": "available",
     "notes": "",
     "basis": "Vendor BU_Bench_v2: GPT-6 Luna (high) $0.155 per hard browser task, excluding browser time and proxies.",
     "data": "Cloud: SOC 2 Type II, HIPAA. Self-host keeps everything in your environment (model calls aside).",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "azure-foundry-browser-automation",
     "name": "Foundry browser tool",
     "price": "$0.60",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Browser runs in Azure Playwright Workspaces; model in Foundry."
     },
     "status": "available",
     "notes": "",
     "basis": "Test-minute meter: $0.01 x 60 = $0.60 per browser-hour (East US).",
     "data": "Azure terms.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "azure-playwright-workspaces",
     "name": "Playwright Workspaces",
     "price": "$0.60",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party Azure; backs the Foundry Browser Automation Tool."
     },
     "status": "available",
     "notes": "Priced for testing; expensive per hour versus agent-browser startups.",
     "basis": "$0.01 x 60 = $0.60 per hour (East US, Linux).",
     "data": "Azure terms.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "gemini-computer-use",
     "name": "Gemini Computer Use",
     "price": "tokens",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Gemini API or Vertex AI",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Vertex AI lists the Computer Use tool at token rates."
     },
     "status": "available",
     "notes": "Original gemini-2.5-computer-use-preview was a separate model; now a tool on Gemini 3.x.",
     "basis": "Token cost only.",
     "data": "As host API.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "openai-computer-use",
     "name": "OpenAI computer use",
     "price": "tokens",
     "deploy": {
      "hosted": [],
      "billing": "OpenAI API; Azure OpenAI for computer-use-preview",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "computer-use-preview deployed in Azure runs in Azure; the browser it drives is yours."
     },
     "status": "available",
     "notes": "",
     "basis": "Token cost; a step is roughly one screenshot (~1-3k tokens) plus history.",
     "data": "Screenshots sent to the model.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "claude-computer-use",
     "name": "Claude computer use",
     "price": "tokens",
     "deploy": {
      "hosted": [
       "AWS",
       "GCP",
       "Azure"
      ],
      "billing": "Claude API; Bedrock; Vertex; Foundry",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Model can be called inside each cloud (Bedrock/Vertex; Foundry hosted-on-Azure option), and the browser runs where you put it. Claude Platform on AWS excludes the computer and browser use toolsets. Toolset support per cloud not re-checked for the 20260801 versions."
     },
     "status": "available",
     "notes": "",
     "basis": "Token cost only.",
     "data": "Screenshots go to the model host.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "stagehand",
     "name": "Stagehand",
     "price": "open source",
     "deploy": {
      "hosted": [],
      "billing": "n/a",
      "private": false,
      "weights": true,
      "saas": false,
      "note": "Runs anywhere; defaults to Browserbase cloud browsers."
     },
     "status": "available",
     "notes": "",
     "basis": "Free licence; infra + tokens.",
     "data": "Your environment.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "google-agent-platform-sandbox",
     "name": "Google agent sandbox",
     "price": "quote",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Closest Google equivalent; otherwise run headless Chrome on Cloud Run/GKE yourself."
     },
     "status": "available",
     "notes": "",
     "basis": "No browser-hour figure; 1 vCPU + 2 GiB would be ~$0.103/hr if the sandbox applies.",
     "data": "Runs in GCP.",
     "index": "n/a",
     "verified": false
    }
   ]
  },
  {
   "key": "crawl",
   "label": "Crawl and scrape",
   "unit": "per 1,000 pages",
   "color": "var(--pink)",
   "items": [
    {
     "id": "crawl4ai",
     "name": "Crawl4AI",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "Self-run library; runs inside any cloud account."
     },
     "status": "available",
     "notes": "86k GitHub stars.",
     "basis": "Licence free; compute small.",
     "data": "Stays in your environment.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "cloudflare-crawl",
     "name": "Cloudflare crawl",
     "price": "$0.05",
     "deploy": {
      "hosted": [],
      "billing": "Cloudflare Workers",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Cloudflare edge."
     },
     "status": "available",
     "notes": "",
     "basis": "~2 s browser time per page: 1,000 pages = 0.56 hr x $0.09 = ~$0.05 per 1k (assumption).",
     "data": "Cloudflare terms.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "spider",
     "name": "Spider",
     "price": "$0.10",
     "deploy": {
      "hosted": [],
      "billing": "Spider",
      "private": false,
      "weights": true,
      "saas": true,
      "note": "Core crawler open source (not re-checked)."
     },
     "status": "available",
     "notes": "",
     "basis": "~100 kB per page: 1,000 pages = 0.1 GB = $0.10 + CPU ~$0.01 = ~$0.11 per 1k (assumption).",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "jina-reader",
     "name": "Jina Reader",
     "price": "$0.13",
     "deploy": {
      "hosted": [],
      "billing": "Jina token credits",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Elastic-owned."
     },
     "status": "available",
     "notes": "",
     "basis": "~2,500 tokens per page x $0.05/1M = $0.000125 per page = ~$0.13 per 1k pages (unverified).",
     "data": "Not checked.",
     "index": "n/a",
     "verified": false
    },
    {
     "id": "zyte-api",
     "name": "Zyte",
     "price": "$1.01",
     "deploy": {
      "hosted": [],
      "billing": "Zyte",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Vendor-operated; Scrapy Cloud for hosted spiders."
     },
     "status": "available",
     "notes": "",
     "basis": "Browser-rendered, simplest tier, PAYG: $1.01 per 1k.",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "scrapingbee",
     "name": "ScrapingBee",
     "price": "$1.27",
     "deploy": {
      "hosted": [],
      "billing": "ScrapingBee",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Vendor-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Hobby: $19/75,000 = $0.000253 per credit x 5 (JS) = $1.27 per 1k pages ($0.25 without JS).",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "bright-data",
     "name": "Bright Data",
     "price": "$1.50",
     "deploy": {
      "hosted": [],
      "billing": "Bright Data; AWS Marketplace (not re-checked)",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Vendor-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Unlocker PAYG $1.50 per 1k successful requests.",
     "data": "Not checked.",
     "index": "SERP API scrapes Google/Bing",
     "verified": true
    },
    {
     "id": "firecrawl-scrape",
     "name": "Firecrawl",
     "price": "$3.20",
     "deploy": {
      "hosted": [],
      "billing": "Firecrawl; AWS Marketplace; Google Cloud Marketplace",
      "private": false,
      "weights": true,
      "saas": true,
      "note": "Open-source core (AGPL-3.0) can be self-hosted in your cloud; hosted API is Firecrawl-operated."
     },
     "status": "available",
     "notes": "",
     "basis": "Hobby: $16/5,000 = $3.20 per 1k pages; Standard $0.83 per 1k.",
     "data": "ZDR on Enterprise.",
     "index": "n/a",
     "verified": true
    },
    {
     "id": "apify",
     "name": "Apify",
     "price": "open source",
     "deploy": {
      "hosted": [],
      "billing": "Apify",
      "private": false,
      "weights": true,
      "saas": true,
      "note": "Crawlee (open source) can be self-hosted."
     },
     "status": "available",
     "notes": "Marketplace of scrapers; cost depends on Actor.",
     "basis": "Depends on Actor and compute units; no single figure.",
     "data": "Not checked.",
     "index": "n/a",
     "verified": true
    }
   ]
  },
  {
   "key": "open",
   "label": "Open research models",
   "unit": "self-hosted",
   "color": "var(--green)",
   "items": [
    {
     "id": "kimi-k3",
     "name": "Kimi K3",
     "price": "tokens",
     "deploy": {
      "hosted": [
       "AWS",
       "Azure"
      ],
      "billing": "Bedrock; Foundry (Fireworks-operated)",
      "private": false,
      "weights": true,
      "saas": false,
      "note": "Bedrock GA 2026-09-18 (all Regions via cross-Region inference; global profile recommended). On Foundry it is offered through Fireworks AI (Data Zone deployments): a third-party operator, check where it runs. Not found on Vertex."
     },
     "status": "available",
     "notes": "",
     "basis": "Token prices vary by host.",
     "data": "Self-host or cloud terms.",
     "index": "BYO search tool (strong agentic search/tool use)",
     "verified": true
    },
    {
     "id": "tongyi-deepresearch-30b",
     "name": "Tongyi DeepResearch",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "No managed listing found on Bedrock, Vertex or Foundry; deploy weights yourself (SageMaker, Vertex custom, AKS)."
     },
     "status": "available",
     "notes": "Sept 2025 release; still the reference open deep-research agent.",
     "basis": "GPU time only.",
     "data": "Self-hosted; queries go to whichever search API you wire in.",
     "index": "BYO search tool",
     "verified": true
    },
    {
     "id": "kimi-k2-thinking",
     "name": "Kimi K2 Thinking",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "Hyperscaler listings for K2.x not re-checked today (K3 supersedes)."
     },
     "status": "available",
     "notes": "K2 Thinking (Nov 2025) popularised long tool-call chains (200-300 steps).",
     "basis": "GPU time only.",
     "data": "Self-hosted.",
     "index": "BYO search tool",
     "verified": true
    },
    {
     "id": "mirothinker",
     "name": "MiroThinker",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "No managed listing found."
     },
     "status": "available",
     "notes": "2026 releases (v1.5 Jan, 1.7 Mar).",
     "basis": "GPU time only.",
     "data": "Self-hosted.",
     "index": "BYO search tool",
     "verified": true
    },
    {
     "id": "websailor",
     "name": "WebSailor",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "No managed listing."
     },
     "status": "available",
     "notes": "2025; part of the Tongyi web-agent family.",
     "basis": "GPU time only.",
     "data": "Self-hosted.",
     "index": "BYO search tool",
     "verified": true
    },
    {
     "id": "jan-nano",
     "name": "Jan-nano",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "Local/edge model."
     },
     "status": "available",
     "notes": "Small local research model (June 2025).",
     "basis": "Local compute.",
     "data": "Local.",
     "index": "BYO search via MCP",
     "verified": true
    },
    {
     "id": "dr-tulu-8b",
     "name": "DR Tulu 8B",
     "price": "free",
     "deploy": {
      "hosted": [],
      "billing": null,
      "private": false,
      "weights": true,
      "saas": false,
      "note": "Fully open (data, code, weights)."
     },
     "status": "available",
     "notes": "Nov 2025; open deep-research recipe from Ai2.",
     "basis": "GPU time only.",
     "data": "Self-hosted.",
     "index": "BYO search tool",
     "verified": true
    }
   ]
  }
 ],
 "ladder": [
  {
   "name": "Serper (Google results)",
   "cost": 1,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "Parallel Search Fast",
   "cost": 1,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "Exa Search",
   "cost": 4,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "Brave Search API",
   "cost": 5,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "Perplexity Search API",
   "cost": 5,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "AgentCore Web Search (AWS)",
   "cost": 7,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "Tavily",
   "cost": 8,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "SerpApi",
   "cost": 25,
   "fam": "search",
   "unit": "searches"
  },
  {
   "name": "Perplexity Agent API, fast",
   "cost": 1.6,
   "fam": "answer",
   "unit": "answers"
  },
  {
   "name": "Exa Answer",
   "cost": 5,
   "fam": "answer",
   "unit": "answers"
  },
  {
   "name": "Brave Answers",
   "cost": 19,
   "fam": "answer",
   "unit": "answers"
  },
  {
   "name": "Gemini 3.8 Flash + grounding",
   "cost": 31,
   "fam": "tool",
   "unit": "answers"
  },
  {
   "name": "OpenAI GPT-6.1 Sol + web search",
   "cost": 47,
   "fam": "tool",
   "unit": "answers"
  },
  {
   "name": "Claude Sonnet 5.5 + web search",
   "cost": 55,
   "fam": "tool",
   "unit": "answers"
  },
  {
   "name": "Azure OpenAI + Bing",
   "cost": 55,
   "fam": "tool",
   "unit": "answers"
  },
  {
   "name": "Claude Fable 5.1 + web search",
   "cost": 196,
   "fam": "tool",
   "unit": "answers"
  },
  {
   "name": "Parallel Task, core",
   "cost": 25,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Parallel Task, pro",
   "cost": 100,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Perplexity, high effort",
   "cost": 130,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Parallel Task, ultra",
   "cost": 300,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Exa Agent, high",
   "cost": 500,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Gemini Deep Research",
   "cost": 2000,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Parallel Task, ultra8x",
   "cost": 2400,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "OpenAI GPT-5.5 deep research (estimate)",
   "cost": 3290,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Gemini Deep Research Max",
   "cost": 5000,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Azure o3-deep-research (estimate)",
   "cost": 5080,
   "fam": "research",
   "unit": "tasks"
  },
  {
   "name": "Valyu DeepResearch, max",
   "cost": 15630,
   "fam": "research",
   "unit": "tasks"
  }
 ],
 "calc": [
  {
   "id": "gemini-3.8-flash",
   "name": "Gemini 3.8 Flash (Vertex grounding)",
   "fee": 14,
   "input": 0.75,
   "output": 3.75,
   "tok": 1,
   "free": true,
   "note": "Prices double on 1 Jan 2027. 5,000 free searches a month."
  },
  {
   "id": "gemini-4-argon",
   "name": "Gemini 4 Argon (Vertex grounding)",
   "fee": 14,
   "input": 2,
   "output": 10,
   "tok": 1,
   "free": true,
   "note": "Prices double on 1 Dec 2026."
  },
  {
   "id": "gpt-6-luna",
   "name": "GPT-6 Luna + web search",
   "fee": 10,
   "input": 0.1,
   "output": 0.5,
   "tok": 1,
   "free": false,
   "note": ""
  },
  {
   "id": "gpt-6.1-sol",
   "name": "GPT-6.1 Sol + web search",
   "fee": 10,
   "input": 2,
   "output": 10,
   "tok": 1,
   "free": false,
   "note": ""
  },
  {
   "id": "gpt-5.5",
   "name": "GPT-5.5 + web search",
   "fee": 10,
   "input": 5,
   "output": 30,
   "tok": 1,
   "free": false,
   "note": "OpenAI's suggested model for deep research on the API."
  },
  {
   "id": "gpt-6-astra",
   "name": "GPT-6 Astra + web search",
   "fee": 10,
   "input": 10,
   "output": 50,
   "tok": 1,
   "free": false,
   "note": ""
  },
  {
   "id": "azure-sol",
   "name": "Azure OpenAI + Bing (Sol-class rates)",
   "fee": 14,
   "input": 2,
   "output": 10,
   "tok": 1,
   "free": false,
   "note": "Search goes to Bing, outside the Azure compliance boundary."
  },
  {
   "id": "claude-haiku-5.5",
   "name": "Claude Haiku 5.5 + web search",
   "fee": 10,
   "input": 0.1,
   "output": 0.5,
   "tok": 1.3,
   "free": false,
   "note": ""
  },
  {
   "id": "claude-sonnet-5.5",
   "name": "Claude Sonnet 5.5 + web search",
   "fee": 10,
   "input": 2,
   "output": 10,
   "tok": 1.3,
   "free": false,
   "note": ""
  },
  {
   "id": "claude-opus-5.5",
   "name": "Claude Opus 5.5 + web search",
   "fee": 10,
   "input": 4,
   "output": 20,
   "tok": 1.3,
   "free": false,
   "note": ""
  },
  {
   "id": "claude-fable-5.1",
   "name": "Claude Fable 5.1 + web search",
   "fee": 10,
   "input": 10,
   "output": 50,
   "tok": 1.3,
   "free": false,
   "note": ""
  },
  {
   "id": "grok-4.7",
   "name": "Grok 4.7 + web search",
   "fee": 5,
   "input": 2,
   "output": 6,
   "tok": 1,
   "free": false,
   "note": ""
  }
 ],
 "pareto": {
  "search": {
   "views": [
    {
     "label": "Artificial Analysis Search Index",
     "points": [
      {
       "id": "gpt-5.6-luna",
       "name": "GPT-5.6 Luna (medium), no search",
       "family": "none",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 2.92,
       "score": 33.37,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-advanced",
       "name": "Parallel Search (advanced)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 59.22,
       "score": 74.75,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-auto",
       "name": "Exa Search (auto)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 83.3,
       "score": 73.66,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "firecrawl-search",
       "name": "Firecrawl Search",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Firecrawl; AWS Marketplace and Google Cloud Marketplace (billing routes)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Marketplace listings are billing routes; processing stays on Firecrawl."
       },
       "cost": 42.57,
       "score": 73.49,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-basic",
       "name": "Parallel Search (basic)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 66.79,
       "score": 73.15,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search",
       "name": "You.com Search (snippets)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 84.44,
       "score": 67.63,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-turbo",
       "name": "Parallel Search (turbo)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 26.06,
       "score": 67.07,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "keenable-pro",
       "name": "Keenable Search (pro)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Keenable",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "On-premises option for the high-volume tier."
       },
       "cost": 42.74,
       "score": 66.96,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "keenable-realtime",
       "name": "Keenable Search (realtime)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Keenable",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "On-premises option for the high-volume tier."
       },
       "cost": 42.82,
       "score": 66.53,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-basic",
       "name": "Tavily Search (basic)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 143.19,
       "score": 65.57,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "brave-search-api",
       "name": "Brave Search (web)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Brave (prepaid credits)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Runs on Brave-operated infrastructure. No hyperscaler-hosted option found."
       },
       "cost": 90.72,
       "score": 64.59,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-fast",
       "name": "Parallel Search (fast)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 27.37,
       "score": 73.08,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights",
       "name": "You.com Search (highlights)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 67.12,
       "score": 74.07,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-medium",
       "name": "Perplexity Search API (medium)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 70.34,
       "score": 79.98,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-high",
       "name": "Perplexity Search API (high)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 66.64,
       "score": 78.95,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-low",
       "name": "Perplexity Search API (low)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 85.1,
       "score": 76.91,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "brave-llm-context",
       "name": "Brave Search (LLM Context API)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Brave (prepaid credits)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Runs on Brave-operated infrastructure. No hyperscaler-hosted option found."
       },
       "cost": 79.42,
       "score": 74.6,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tinyfish-search",
       "name": "TinyFish Search (web)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 9.3,
       "score": 71.17,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "octen-search-highlights",
       "name": "Octen Search (highlights)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 23.99,
       "score": 77.06,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-flash",
       "name": "Linkup Search (flash, alpha)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 121.63,
       "score": 47.01,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-standard",
       "name": "Linkup Search (standard)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 81.67,
       "score": 68.25,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-fast",
       "name": "Linkup Search (fast)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 82.61,
       "score": 68.03,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-lite",
       "name": "Nimble Search (lite)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 31.94,
       "score": 65.82,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-standard",
       "name": "Nimble Search (standard)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 65.71,
       "score": 73.87,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "openai-web-search-medium",
       "name": "OpenAI Web Search (search_context_size=medium)",
       "family": "tool",
       "deploy": {
        "hosted": [],
        "billing": "OpenAI API",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "OpenAI-hosted only. In Azure the equivalent tool routes to Grounding with Bing (see azure-openai-web-search). Not available with GPT on Bedrock as far as found."
       },
       "cost": 49.59,
       "score": 74.4,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-auto-dynamic",
       "name": "Exa Search (auto, dynamic highlights)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 65.6,
       "score": 80.31,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-lite-dynamic",
       "name": "Exa Search (lite, dynamic highlights)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 44.38,
       "score": 79.18,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "deepseek-search-summary",
       "name": "DeepSeek Search (summary)",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 31.71,
       "score": 69.12,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      }
     ],
     "metric": "Search Index (0\u2013100)",
     "method": "Independent \u00b7 fixed GPT-5.6 Luna agent \u00b7 only the search provider changes"
    },
    {
     "label": "Openbenchmarks: company lists",
     "points": [
      {
       "id": "exa-deep-fetch",
       "name": "Exa deep + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 683.0,
       "score": 48.2,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-high-fetch",
       "name": "Perplexity + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 504.0,
       "score": 46.6,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-basic",
       "name": "Parallel basic",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 1120.0,
       "score": 46.5,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-deep",
       "name": "Exa deep",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 717.0,
       "score": 45.4,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-instant-fetch",
       "name": "Exa instant + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 653.0,
       "score": 44.9,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-advanced",
       "name": "Parallel advanced",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 625.0,
       "score": 44.2,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-instant",
       "name": "Exa instant",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 652.0,
       "score": 43.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-basic-fetch",
       "name": "Parallel basic + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 1089.0,
       "score": 42.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-advanced-fetch",
       "name": "Parallel advanced + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 599.0,
       "score": 42.2,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-standard-fetch",
       "name": "Linkup standard + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 911.0,
       "score": 42.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-fast",
       "name": "Linkup fast",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 923.0,
       "score": 41.1,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-advanced",
       "name": "Tavily advanced",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 1029.0,
       "score": 41.1,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-advanced-fetch",
       "name": "Tavily advanced + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 898.0,
       "score": 41.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-standard",
       "name": "Linkup standard",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 937.0,
       "score": 40.6,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-fast-fetch",
       "name": "Linkup fast + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 903.0,
       "score": 39.9,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-fast-fetch",
       "name": "Parallel fast + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 441.0,
       "score": 39.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights",
       "name": "You",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 971.0,
       "score": 38.6,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights-fetch",
       "name": "You + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 864.0,
       "score": 38.5,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights-core-fetch",
       "name": "You + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 894.0,
       "score": 38.5,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights-core",
       "name": "You",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 895.0,
       "score": 38.1,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-basic-fetch",
       "name": "Tavily basic + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 610.0,
       "score": 38.1,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-fast",
       "name": "Parallel fast",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 460.0,
       "score": 38.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-low",
       "name": "Perplexity",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 334.0,
       "score": 37.8,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-basic",
       "name": "Tavily basic",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 615.0,
       "score": 36.5,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-turbo-fetch",
       "name": "Parallel turbo + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 414.0,
       "score": 36.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-turbo",
       "name": "Parallel turbo",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 419.0,
       "score": 34.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "firecrawl-search-fetch",
       "name": "Firecrawl + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Firecrawl; AWS Marketplace and Google Cloud Marketplace (billing routes)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Marketplace listings are billing routes; processing stays on Firecrawl."
       },
       "cost": 295.0,
       "score": 33.2,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-standard-fetch",
       "name": "Nimble + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 424.0,
       "score": 31.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-standard",
       "name": "Nimble",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 467.0,
       "score": 30.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "firecrawl-search",
       "name": "Firecrawl",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Firecrawl; AWS Marketplace and Google Cloud Marketplace (billing routes)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Marketplace listings are billing routes; processing stays on Firecrawl."
       },
       "cost": 282.0,
       "score": 30.4,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tinyfish-search-fetch",
       "name": "TinyFish + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 219.0,
       "score": 30.2,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "brave-search-api-fetch",
       "name": "Brave Search + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Brave (prepaid credits)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Runs on Brave-operated infrastructure. No hyperscaler-hosted option found."
       },
       "cost": 285.0,
       "score": 29.4,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "brave-search-api",
       "name": "Brave Search",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Brave (prepaid credits)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Runs on Brave-operated infrastructure. No hyperscaler-hosted option found."
       },
       "cost": 268.0,
       "score": 28.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-lite-fetch",
       "name": "Nimble + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 237.0,
       "score": 27.1,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tinyfish-search",
       "name": "TinyFish",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 212.0,
       "score": 26.6,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-lite",
       "name": "Nimble",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 234.0,
       "score": 25.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      }
     ],
     "metric": "F1 on company lists (%)",
     "method": "Independent \u00b7 fixed GPT-5.6 Sol agent \u00b7 45 list-building tasks"
    },
    {
     "label": "Openbenchmarks: coding docs",
     "points": [
      {
       "id": "exa-deep-fetch",
       "name": "Exa deep + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 127.0,
       "score": 83.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-auto-fetch",
       "name": "Exa auto + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 107.0,
       "score": 81.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tinyfish-search-fetch",
       "name": "TinyFish + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 50.0,
       "score": 79.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-high-fetch",
       "name": "Perplexity + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 83.0,
       "score": 77.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "perplexity-search-api-low",
       "name": "Perplexity",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Perplexity; AWS Marketplace listing (billing route)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Perplexity-operated."
       },
       "cost": 59.0,
       "score": 77.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-advanced-fetch",
       "name": "Parallel advanced + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 96.0,
       "score": 77.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "firecrawl-search-fetch",
       "name": "Firecrawl + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Firecrawl; AWS Marketplace and Google Cloud Marketplace (billing routes)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Marketplace listings are billing routes; processing stays on Firecrawl."
       },
       "cost": 82.0,
       "score": 76.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-basic-fetch",
       "name": "Parallel basic + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 107.0,
       "score": 76.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "firecrawl-search",
       "name": "Firecrawl",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Firecrawl; AWS Marketplace and Google Cloud Marketplace (billing routes)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Marketplace listings are billing routes; processing stays on Firecrawl."
       },
       "cost": 59.0,
       "score": 70.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-fast",
       "name": "Parallel fast",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 54.0,
       "score": 66.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-fast",
       "name": "Exa fast",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 103.0,
       "score": 66.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "parallel-search-turbo",
       "name": "Parallel turbo",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Parallel; Google Cloud Marketplace (Vertex grounding provider)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Parallel-operated. Using it as a Vertex grounding provider still sends queries to Parallel."
       },
       "cost": 59.0,
       "score": 64.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "exa-instant",
       "name": "Exa instant",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Exa (card/bank); Restricted-preview grounding provider on Vertex AI (see vertex-third-party-grounding)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Exa-operated service."
       },
       "cost": 105.0,
       "score": 61.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-lite-fetch",
       "name": "Nimble + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 54.0,
       "score": 60.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-advanced-fetch",
       "name": "Tavily advanced + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 153.0,
       "score": 60.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tinyfish-search",
       "name": "TinyFish",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 35.0,
       "score": 59.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-basic-fetch",
       "name": "Tavily basic + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 113.0,
       "score": 59.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights-fetch",
       "name": "You + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 119.0,
       "score": 55.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights-core-fetch",
       "name": "You + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 117.0,
       "score": 54.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "tavily-basic",
       "name": "Tavily basic",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Tavily; Databricks MCP marketplace",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Being acquired by Nebius (announced Feb 2026, secondary sources)."
       },
       "cost": 97.0,
       "score": 51.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-standard-fetch",
       "name": "Linkup standard + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 147.0,
       "score": 48.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-lite",
       "name": "Nimble",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 43.0,
       "score": 46.7,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-standard-fetch",
       "name": "Nimble + fetch",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 78.0,
       "score": 45.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "linkup-fast",
       "name": "Linkup fast",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Linkup prepaid; x402 (USDC) per request",
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Enterprise offers a 'private environment'."
       },
       "cost": 100.0,
       "score": 43.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "nimble-search-standard",
       "name": "Nimble",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 79.0,
       "score": 42.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights",
       "name": "You",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 97.0,
       "score": 41.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "you-search-highlights-core",
       "name": "You",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "You.com",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "You.com-operated."
       },
       "cost": 96.0,
       "score": 38.3,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      },
      {
       "id": "brave-llm-context",
       "name": "Brave",
       "family": "api",
       "deploy": {
        "hosted": [],
        "billing": "Brave (prepaid credits)",
        "private": false,
        "weights": false,
        "saas": true,
        "note": "Runs on Brave-operated infrastructure. No hyperscaler-hosted option found."
       },
       "cost": 82.0,
       "score": 38.0,
       "n": 1,
       "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."
      }
     ],
     "metric": "Tasks solved with cited sources (%)",
     "method": "Independent \u00b7 100 coding tickets needing documentation"
    }
   ]
  },
  "models": {
   "views": [
    {
     "label": "Parallel Search Capability Leaderboard",
     "points": [
      {
       "id": "gpt-6-astra",
       "name": "GPT-6 Astra",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."
       },
       "cost": 401.0,
       "score": 70.8,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gpt-5.6-sol",
       "name": "GPT-5.6 Sol",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."
       },
       "cost": 269.0,
       "score": 67.7,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gemini-3.7-flash",
       "name": "Gemini 3.7 Flash",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. In this test every model used Parallel's search."
       },
       "cost": 130.0,
       "score": 66.8,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "muse-spark-1.3",
       "name": "Muse Spark 1.3",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 142.0,
       "score": 66.1,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gemini-3.8-flash",
       "name": "Gemini 3.8 Flash",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. In this test every model used Parallel's search."
       },
       "cost": 177.0,
       "score": 65.1,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "kimi-k3",
       "name": "Kimi K3",
       "family": "open",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 266.0,
       "score": 64.2,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "deepseek-v4.1-flash",
       "name": "DeepSeek V4.1 Flash",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 35.8,
       "score": 62.7,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "glm-5.3",
       "name": "GLM 5.3",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 78.5,
       "score": 62.7,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gpt-5.6-luna",
       "name": "GPT-5.6 Luna",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."
       },
       "cost": 36.2,
       "score": 60.7,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gemini-3-flash",
       "name": "Gemini 3 Flash",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. In this test every model used Parallel's search."
       },
       "cost": 114.0,
       "score": 58.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "deepseek-v4-pro",
       "name": "DeepSeek V4 Pro",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 110.0,
       "score": 58.4,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "hunyuan-3",
       "name": "Hunyuan 3",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 28.4,
       "score": 58.2,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "glm-5.2",
       "name": "GLM-5.2",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 66.6,
       "score": 54.3,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "nemotron-3-ultra-550b-a55b",
       "name": "Nemotron 3 Ultra 550B",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 113.0,
       "score": 53.0,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "minimax-m3",
       "name": "MiniMax M3",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 41.1,
       "score": 52.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "laguna-s-2.1",
       "name": "Laguna S 2.1",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 21.4,
       "score": 39.5,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "nemotron-3.5-lightning",
       "name": "Nemotron 3.5 Lightning",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 12.1,
       "score": 37.9,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "pareto-26.9",
       "name": "Pareto 26.9",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 184.0,
       "score": 72.5,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gpt-6-sol",
       "name": "GPT-6 Sol",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."
       },
       "cost": 183.0,
       "score": 66.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gpt-6-luna",
       "name": "GPT-6 Luna",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."
       },
       "cost": 33.1,
       "score": 61.9,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "mimo-v2.5",
       "name": "MiMo v2.5",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 23.5,
       "score": 49.5,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "claude-opus-5.5",
       "name": "Claude Opus 5.5",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 949.0,
       "score": 75.4,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "claude-opus-5",
       "name": "Claude Opus 5",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 1012.0,
       "score": 70.0,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "claude-sonnet-5",
       "name": "Claude Sonnet 5",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 688.0,
       "score": 66.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gpt-6.1-sol",
       "name": "GPT-6.1 Sol",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."
       },
       "cost": 130.0,
       "score": 70.4,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "pareto-26.10",
       "name": "Pareto 26.10",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 116.0,
       "score": 68.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "glm-5.3-flash",
       "name": "GLM 5.3 Flash",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 16.6,
       "score": 60.8,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "mimo-v2.6-pro",
       "name": "MiMo v2.6 Pro",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 76.5,
       "score": 64.4,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "mistral-large-4.0",
       "name": "Mistral Large 4.0",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 136.0,
       "score": 64.4,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "claude-haiku-5.5",
       "name": "Claude Haiku 5.5",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 24.3,
       "score": 62.9,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "grok-4.7",
       "name": "Grok 4.7 Medium",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 252.0,
       "score": 66.0,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "hy4-preview",
       "name": "Hy4 Preview",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 93.2,
       "score": 64.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "step-5-preview",
       "name": "Step 5 Preview",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 118.0,
       "score": 61.1,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "mimo-v2.6-flash",
       "name": "MiMo v2.6 Flash",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 25.2,
       "score": 60.9,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "claude-sonnet-5.5",
       "name": "Claude Sonnet 5.5",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 796.0,
       "score": 74.1,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "muse-wonder-1.0",
       "name": "Muse Wonder 1.0",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 709.0,
       "score": 71.3,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "ember-1",
       "name": "Ember-1",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 335.0,
       "score": 67.9,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "command-a-plus",
       "name": "Command A Plus",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 40.1,
       "score": 34.8,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "claude-fable-5.1",
       "name": "Claude Fable 5.1",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 1762.0,
       "score": 73.4,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "gemini-4-argon",
       "name": "Gemini 4 Argon",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. In this test every model used Parallel's search."
       },
       "cost": 270.0,
       "score": 72.2,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "mercury-3",
       "name": "Mercury 3",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 43.4,
       "score": 63.6,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "muse-spark-open",
       "name": "Muse Spark Open",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 171.0,
       "score": 67.2,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "nemotron-3.5-super-vl",
       "name": "Nemotron 3.5 Super VL",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 93.9,
       "score": 59.1,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "beam",
       "name": "Beam",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 161.0,
       "score": 56.0,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "deepseek-v4.1-flash-1017",
       "name": "DeepSeek V4.1 Flash (1017)",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 125.0,
       "score": 68.9,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "ultramarine-1-flash",
       "name": "Ultramarine 1 Flash",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 87.2,
       "score": 61.1,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "minimax-m3.1-flash",
       "name": "MiniMax M3.1 Flash",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights you can host yourself. In this test every model used Parallel's search."
       },
       "cost": 43.8,
       "score": 68.8,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      },
      {
       "id": "qwen3.8-max",
       "name": "Qwen3.8 Max",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "In this test every model used Parallel's search."
       },
       "cost": 221.0,
       "score": 66.0,
       "n": 1,
       "costBasis": "Model and search cost per 1,000 tasks, as estimated by Parallel."
      }
     ],
     "metric": "Search capability score (0\u2013100)",
     "method": "Vendor-run \u00b7 every model uses Parallel's search \u00b7 300 questions"
    },
    {
     "label": "FutureSearch Deep Research Bench",
     "points": [
      {
       "id": "claude-opus-4.6-0",
       "name": "Opus 4.6 (high)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 530.0,
       "score": 55.3,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-sonnet-4.6-1",
       "name": "Sonnet 4.6 (high)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 460.0,
       "score": 54.9,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.5-2",
       "name": "Opus 4.5 (high)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 460.0,
       "score": 54.8,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.5-3",
       "name": "GPT-5.5 (high)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 360.0,
       "score": 54.0,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.5-4",
       "name": "Opus 4.5 (low)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 430.0,
       "score": 53.7,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.6-5",
       "name": "Opus 4.6 (medium)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 360.0,
       "score": 53.2,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.6-6",
       "name": "Opus 4.6 (low)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 240.0,
       "score": 51.4,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-sonnet-4.6-7",
       "name": "Sonnet 4.6 (low)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 270.0,
       "score": 50.4,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.8-8",
       "name": "Opus 4.8 (high)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 350.0,
       "score": 50.2,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3-flash-9",
       "name": "Gemini 3 Flash (low)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 100.0,
       "score": 49.8,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5-10",
       "name": "GPT-5 (low)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 250.0,
       "score": 49.6,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.5-11",
       "name": "GPT-5.5 (medium)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 310.0,
       "score": 49.6,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.8-12",
       "name": "Opus 4.8 (low)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 240.0,
       "score": 49.3,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3-flash-13",
       "name": "Gemini 3 Flash (minimal)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 100.0,
       "score": 49.0,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5-14",
       "name": "GPT-5 (minimal)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 240.0,
       "score": 48.9,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.5-15",
       "name": "GPT-5.5 (low)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 230.0,
       "score": 48.7,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5-16",
       "name": "GPT-5 (medium)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 350.0,
       "score": 48.6,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.1-17",
       "name": "Opus 4.1 (medium)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 1200.0,
       "score": 48.3,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5-18",
       "name": "GPT-5 (high)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 390.0,
       "score": 48.1,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3-flash-19",
       "name": "Gemini 3 Flash (high)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 140.0,
       "score": 47.9,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3.1-pro-20",
       "name": "Gemini 3.1 Pro (high)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 230.0,
       "score": 47.8,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-sonnet-4.5-21",
       "name": "Sonnet 4.5 (low)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 360.0,
       "score": 47.5,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4.8-22",
       "name": "Opus 4.8 (medium)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 290.0,
       "score": 47.4,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "grok-4-23",
       "name": "Grok 4",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": "FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 490.0,
       "score": 47.3,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-opus-4-24",
       "name": "Opus 4 (medium)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 1640.0,
       "score": 46.8,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-sonnet-4-25",
       "name": "Sonnet 4 (medium)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 450.0,
       "score": 46.6,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "claude-haiku-4.5-26",
       "name": "Haiku 4.5 (low)",
       "family": "anthropic",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."
       },
       "cost": 100.0,
       "score": 45.5,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "o3-27",
       "name": "o3",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 120.0,
       "score": 45.2,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3.1-pro-28",
       "name": "Gemini 3.1 Pro (low)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 90.0,
       "score": 44.5,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.1-29",
       "name": "GPT-5.1 (low)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 40.0,
       "score": 42.8,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-2.5-pro-30",
       "name": "Gemini 2.5 Pro (dynamic)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 110.0,
       "score": 41.5,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.2-31",
       "name": "GPT-5.2 (low)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 260.0,
       "score": 41.1,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3.1-flash-lite-32",
       "name": "Gemini 3.1 Flash Lite (low)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 20.0,
       "score": 37.3,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gemini-3.1-flash-lite-33",
       "name": "Gemini 3.1 Flash Lite (dynamic)",
       "family": "google",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Gemini is hosted on Vertex AI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 30.0,
       "score": 36.4,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.4-mini-34",
       "name": "GPT-5.4 Mini (low)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 40.0,
       "score": 36.3,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      },
      {
       "id": "gpt-5.4-35",
       "name": "GPT-5.4 (low)",
       "family": "openai",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "GPT models are hosted in Azure OpenAI. FutureSearch's own harness on a frozen copy of the web."
       },
       "cost": 140.0,
       "score": 35.1,
       "n": 1,
       "costBasis": "LLM spend per 1,000 tasks, as reported by FutureSearch."
      }
     ],
     "metric": "DRB score (0\u2013100)",
     "method": "Independent \u00b7 frozen copy of the web \u00b7 169 tasks \u00b7 models to June 2026"
    }
   ]
  },
  "browsecomp": {
   "views": [
    {
     "label": "OpenAI's estimates",
     "points": [
      {
       "id": "oa0",
       "name": "GPT-5.6 Sol, 16 agents (xhigh)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 18410.0,
       "score": 93.36,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa1",
       "name": "GPT-5.6 Sol, 16 agents (max)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 30750.0,
       "score": 93.29,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa2",
       "name": "GPT-5.6 Sol Ultra (4 parallel agents) (max)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 12170.0,
       "score": 92.18,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa3",
       "name": "GPT-5.6 Sol, 16 agents (high)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 13420.0,
       "score": 92.18,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa4",
       "name": "GPT-5.6 Sol, 4 agents (xhigh)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 6980.0,
       "score": 91.15,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa5",
       "name": "GPT-5.6 Sol, 16 agents (medium)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 7540.0,
       "score": 91.07,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa6",
       "name": "GPT-5.6 Sol (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 4150.0,
       "score": 90.84,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa7",
       "name": "GPT-5.6 Sol, 4 agents (high)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 5040.0,
       "score": 90.76,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa9",
       "name": "GPT-5.6 Sol (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 2700.0,
       "score": 89.42,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa10",
       "name": "GPT-5.6 Sol, 4 agents (medium)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 2740.0,
       "score": 89.18,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa12",
       "name": "GPT-5.6 Sol (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 2040.0,
       "score": 88.23,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa14",
       "name": "GPT-5.6 Terra (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 3120.0,
       "score": 87.52,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa15",
       "name": "GPT-5.6 Sol, 16 agents (low)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 3250.0,
       "score": 86.41,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa16",
       "name": "GPT-5.6 Sol (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1140.0,
       "score": 84.6,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa17",
       "name": "GPT-5.5 (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 33270.0,
       "score": 84.36,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa18",
       "name": "GPT-5.6 Luna (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1330.0,
       "score": 84.04,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa19",
       "name": "GPT-5.5 (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 30020.0,
       "score": 83.89,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa21",
       "name": "GPT-5.6 Luna (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1420.0,
       "score": 83.25,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa22",
       "name": "GPT-5.6 Sol, 4 agents (low)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1110.0,
       "score": 81.75,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa23",
       "name": "GPT-5.6 Terra (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1850.0,
       "score": 81.52,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa24",
       "name": "GPT-5.6 Luna (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1030.0,
       "score": 80.02,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa25",
       "name": "GPT-5.6 Terra (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1530.0,
       "score": 79.3,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa26",
       "name": "GPT-5.5 (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 18950.0,
       "score": 78.12,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa28",
       "name": "GPT-5.6 Sol (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 270.0,
       "score": 69.04,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa29",
       "name": "GPT-5.6 Terra (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 470.0,
       "score": 67.38,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa31",
       "name": "GPT-5.6 Luna (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 230.0,
       "score": 58.85,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa32",
       "name": "GPT-5.5 (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 2720.0,
       "score": 57.82,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa33",
       "name": "GPT-5.6 Terra (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 200.0,
       "score": 50.47,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa34",
       "name": "GPT-5.6 Luna (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 80.0,
       "score": 45.73,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa35",
       "name": "GPT-5.5 (none)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 1420.0,
       "score": 34.68,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa36",
       "name": "GPT-6 Astra (effort 5 of 5)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 6450.0,
       "score": 91.55,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa37",
       "name": "GPT-6 Astra (effort 4 of 5)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 5450.0,
       "score": 91.07,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa38",
       "name": "GPT-6 Astra (effort 3 of 5)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 4550.0,
       "score": 89.87,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa39",
       "name": "GPT-6 Astra (effort 2 of 5)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 3280.0,
       "score": 87.99,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      },
      {
       "id": "oa40",
       "name": "GPT-6 Astra (effort 1 of 5)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "OpenAI models are hosted in Azure OpenAI."
       },
       "cost": 2080.0,
       "score": 82.92,
       "n": 1,
       "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."
      }
     ],
     "metric": "BrowseComp accuracy (%)",
     "method": "OpenAI's own runs and cost estimates"
    },
    {
     "label": "Anthropic's figures",
     "points": [
      {
       "id": "an8",
       "name": "Claude Opus 5 (10-agent team)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 94800.0,
       "score": 93.6,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an9",
       "name": "Claude Opus 5 (async subagents)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 109000.0,
       "score": 93.4,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an10",
       "name": "Claude Opus 5 (5-agent team)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 59400.0,
       "score": 92.7,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an11",
       "name": "Claude Opus 5 (async low-effort subagents)",
       "family": "multi",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 34800.0,
       "score": 92.0,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an12",
       "name": "Claude Opus 5 (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 30000.0,
       "score": 90.8,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an13",
       "name": "Claude Opus 5 (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 28800.0,
       "score": 90.7,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an15",
       "name": "Claude Opus 5 (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 23900.0,
       "score": 90.2,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an19",
       "name": "Claude Opus 5 (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 12800.0,
       "score": 88.9,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an20",
       "name": "Claude Mythos 5 (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 18400.0,
       "score": 88.0,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an21",
       "name": "Claude Mythos 5 (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 26600.0,
       "score": 88.0,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an22",
       "name": "Claude Mythos 5 (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 17700.0,
       "score": 87.3,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an23",
       "name": "Claude Mythos 5 (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 13400.0,
       "score": 87.1,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an26",
       "name": "Claude Sonnet 5 (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 22000.0,
       "score": 84.7,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an27",
       "name": "Claude Opus 5 (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 4000.0,
       "score": 84.4,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an28",
       "name": "Claude Opus 4.8 (max)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 25200.0,
       "score": 84.3,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an29",
       "name": "Claude Opus 4.8 (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 20300.0,
       "score": 84.0,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an30",
       "name": "Claude Mythos 5 (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 10300.0,
       "score": 83.0,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an32",
       "name": "Claude Sonnet 5 (xhigh)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 16300.0,
       "score": 82.5,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an33",
       "name": "Claude Opus 4.8 (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 14600.0,
       "score": 82.0,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an34",
       "name": "Claude Sonnet 5 (high)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 7200.0,
       "score": 79.4,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an36",
       "name": "Claude Opus 4.8 (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 12400.0,
       "score": 79.1,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an37",
       "name": "Claude Opus 4.8 (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 7000.0,
       "score": 77.4,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an38",
       "name": "Claude Sonnet 5 (medium)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 3700.0,
       "score": 71.4,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      },
      {
       "id": "an39",
       "name": "Claude Sonnet 5 (low)",
       "family": "single",
       "deploy": {
        "hosted": [
         "Azure",
         "AWS",
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": "Claude is hosted on Bedrock, Vertex AI and Foundry."
       },
       "cost": 1590.0,
       "score": 59.9,
       "n": 1,
       "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about \u00b13%)."
      }
     ],
     "metric": "BrowseComp accuracy (%)",
     "method": "Anthropic's own runs and billed cost"
    }
   ]
  }
 }
};
