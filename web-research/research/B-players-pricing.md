# B. Players, prices and where they run: web search and research (checked 2026-10-25)

Machine-readable version: `B-players.json` (87 entries, same ids). Each price was checked on 2026-10-25 against the vendor page or docs cited in the JSON. Entries with `"verified": false` and anything marked **(unverified)** below came from a secondary source or from memory, or the vendor page needs JavaScript and could not be read.

Hosting and billing are kept apart, as in session 1. `hosted` lists the clouds whose own infrastructure runs the search. `billing` lists ways to pay, such as a marketplace listing. Paying through a marketplace does not move processing into your cloud.

## TL;DR for the deck

1. **Plain search has become a commodity at about $5 per 1,000 queries.** Brave, Parallel, Perplexity, You.com and Linkup all charge $5, and Exa Lite charges $4. Fast tiers cost $1 (Parallel Turbo/Fast, Perplexity Fast). Google-results scrapers cost $0.60 to $2 (Serper, DataForSEO), with SerpApi the outlier at $10 to $25.
2. **The frontier labs' built-in tools cost 2 to 3 times more per search**, and tokens come on top:
   - OpenAI and Anthropic: $10 per 1,000 searches.
   - Gemini 3+: $14 per 1,000 queries; the search-result tokens are free on Vertex.
   - Bing grounding: $14. xAI: $5. Amazon Nova grounding: $30.
   - **One grounded answer costs about 2 to 20 cents.** Sonnet 5.5 is ~$0.055, GPT-6.1 Sol ~$0.047, Gemini 3.8 Flash ~$0.031, Haiku 5.5 or GPT-6 Luna ~$0.02, and Fable 5.1 or GPT-6 Astra ~$0.16–0.20.
3. **Deep research costs from a tenth of a cent to about $15 per task**, depending on the tier you pick:
   - Parallel publishes a full ladder from $0.005 (lite) to $2.40 (ultra8x) per task.
   - Gemini Deep Research is ~$1–3 per task, and Max ~$3–7.
   - Perplexity's "high" effort is ~$0.13. A GPT-5.5 or o3-deep-research style run is ~$3–5.
4. **Cheap, agent-native search is no longer the gap. Search that stays inside the client's cloud is.**
   - **AWS** is the only hyperscaler with a whole-web search that it says stays inside its cloud: AgentCore Web Search at $7 per 1,000, for any model.
   - **Google** has Web Grounding for Enterprise on Vertex. It logs no customer data and supports VPC-SC, but it only works with Gemini.
   - **Azure** web search always goes through Bing, which Microsoft says sends data **outside the Azure compliance boundary**.
5. **Dedicated deep-research models are disappearing.** OpenAI shut down o3- and o4-mini-deep-research on its own API on 2026-07-23. Perplexity retired Sonar, including Sonar Deep Research, on 2026-09-27. Both replaced them with effort levels on general models. Azure still sells o3-deep-research.

## Assumptions behind the normalised costs

- **Search APIs, cost per 1,000 queries:** the first paid tier, one query per request, 10 results, and page content where the base price includes it. Cheaper bulk tiers are listed in `tiers`.
- **One grounded answer (model tools):** 2 searches, 10,000 tokens of search-result content plus 1,000 prompt tokens (11,000 in), 500 output tokens, no reasoning tokens, no caching.
  - **Claude 4.7 and later:** the tokens are multiplied by 1.3 for the newer tokenizer (14,300 in / 650 out), as in session 1.
  - **Gemini on Vertex:** Google does not bill the grounding-result tokens, so only the 1,000 prompt tokens count. The Gemini API page does not say either way, so the same is assumed there **(unverified)**.
  - **Reasoning:** reasoning ("thinking") tokens can multiply the output cost by 2 to 5 times.
- **Deep research, cost per task:** the vendor's published per-task price where one exists. Otherwise Google's published profile of a typical task is applied to other models: ~80 searches, 250,000 input tokens (50% cached) and 60,000 output tokens.
- **Browser-hour:** the vendor's per-hour rate. For per-GB or per-vCPU pricing, the size is stated in `cost_basis`.
- **Exchange rate:** USD 1.33 per GBP for Mojeek.

## 1. Price ladder

| Band | $ per 1,000 searches or answers | Who |
|---|---:|---|
| Near zero | 0–0.6 | Self-run crawlers (Crawl4AI), DataForSEO queued, Jina Search (~$0.50, unverified) |
| Commodity fast | 1–2 | Serper $1, Parallel Turbo/Fast $1, Perplexity Fast Search $1, DataForSEO live $2, Perplexity Agent API "fast" ~$1.60 (per 1,000 answers) |
| Standard agent search | 4–8 | Exa Lite $4, Keenable $4, Brave $5, Parallel $5, Perplexity $5, You.com $5, Linkup $5, Valyu $6.25, Firecrawl $6.40 (Hobby), AgentCore Web Search $7, Tavily $8 |
| Lab tools (fee only) | 5–14 | xAI $5, OpenAI $10, Anthropic $10, Kagi $12, Gemini 3+ grounding $14, Bing grounding $14 |
| Premium per call | 25–55 | SerpApi Starter $25, Nova Web Grounding $30, Gemini 2.5 grounding $35 (per prompt), Web Grounding for Enterprise on 2.5 $45, Linkup deep $50 |

Deep research, per task:

| Band | $ per task | Who |
|---|---:|---|
| Quick (seconds) | 0.005–0.05 | Parallel lite/base/core ($0.005/$0.01/$0.025), Exa Agent minimal/low ($0.012/$0.025), You.com Research Lite ($0.012), Valyu instant ($0.05) |
| Standard (1–5 min) | 0.10–0.65 | Parallel pro $0.10, You.com Deep $0.10, Perplexity high ~$0.13, Linkup S/M $0.25/$0.50, Parallel ultra $0.30, You.com Exhaustive $0.45, Exa high $0.50, Valyu standard $0.63 |
| Heavy (5–30 min) | 1–5 | Exa xhigh $1, Tavily pro up to $2, Gemini Deep Research ~$1–3, Linkup XL $2.50, Parallel ultra8x $2.40, GPT-5.5 high + search ~$3.30 (estimate), Valyu heavy $3.13, Gemini DR Max ~$3–7, Azure o3-deep-research ~$5 (estimate) |
| Maximum | 15 | Valyu max $15.63 |

Browser infrastructure, per browser-hour: Browser Use $0.02, Kernel ~$0.06 per GB, Steel $0.08–0.10, Anchor $0.09, Cloudflare $0.09, Hyperbrowser $0.10, Browserbase $0.10–0.12, AgentCore Browser ~$0.11 if 1 vCPU and 2 GB are fully busy (idle I/O is free), Azure Playwright Workspaces $0.60 (Linux) or $1.20 (Windows). Model tokens usually cost far more than the browser.

## 2. Model providers' web tools

| id | Tool | Fee | Content tokens | One answer (est.) | Runs inside a hyperscaler? |
|---|---|---|---|---:|---|
| `openai-web-search` | OpenAI `web_search` (Responses) | $10 / 1k calls | billed at model input rate (fixed 8k for 4o-mini/4.1-mini) | Luna $0.021, 6.1 Sol $0.047, 5.5 $0.09, Astra $0.155 | No. OpenAI-hosted. |
| `azure-openai-web-search` | Same tool in Azure OpenAI | $14 / 1k Bing requests | input rate | ~$0.055 | Model yes, **search no** (Bing, outside the boundary) |
| `bing-grounding` | Grounding with Bing Search / Custom Search | $14 / 1k transactions | input rate | — | **No.** Microsoft says data leaves the Azure compliance boundary; the DPA does not apply. |
| `anthropic-web-search` | Claude web search | $10 / 1k searches | input rate | Haiku 5.5 $0.022, Sonnet 5.5 $0.055, Opus 5.5 $0.09, Fable 5.1 $0.20 | **Not on Bedrock.** Basic version only on Vertex (Google-managed) and Foundry hosted-on-Azure. Search provider not named. |
| `anthropic-web-fetch` | Claude web fetch | free | input rate (~2,500 tokens per page) | — | Same as web search |
| `gemini-api-grounding-google-search` | Gemini API grounding | Gemini 3+: 5,000 free/month, then $14 / 1k queries. 2.5: $35 / 1k prompts | not stated | 3.8 Flash ~$0.031 | Google, but not Vertex |
| `vertex-grounding-google-search` | Vertex grounding with Google Search | same | **free on Vertex** | ~$0.031 | GCP infrastructure, but processing is global, VPC-SC is not documented, and logs are kept up to 3 days |
| `vertex-web-grounding-enterprise` | Web Grounding for Enterprise | Gemini 3+: $14 / 1k queries. 2.5: $45 / 1k prompts | free | ~$0.031 | **Yes:** no customer data logged, VPC-SC supported. Residency not documented. |
| `vertex-third-party-grounding` | Vertex grounding with Parallel / Exa | Parallel price + Gemini tokens | — | — | **No.** Queries are sent to Parallel/Exa even when billed through Google Cloud Marketplace. |
| `xai-web-search` | xAI `web_search` / `x_search` | $5 / 1k calls | input rate | grok-4.7 ~$0.035 | No |
| `mistral-web-search` | Mistral `web_search` / premium | per call, amount not shown **(unverified; ~$30 / 1k in 2025)** | — | — | No. Uses Brave results. |
| `amazon-nova-web-grounding` | Nova Web Grounding | $30 / 1k requests | tokens | ~$0.033 | **Yes**, AWS says data never leaves AWS. US Regions only; Nova models only. |
| `aws-agentcore-web-search` | AgentCore Web Search (MCP tool, any model) | $7 / 1k queries | n/a (search API) | — | **Yes.** Amazon's own index; AWS says no third-party search APIs are used. |

## 3. Who owns an index

- **Own whole-web index:** Google, Microsoft (Bing), Brave, Exa, Parallel, Perplexity, You.com, Mojeek (UK), Amazon (internal index behind Nova grounding and AgentCore Web Search), and the 2026 entrant Keenable (claims 100B+ documents, $26M seed from Accel and Conviction).
- **Partial or blended:**
  - Linkup: own index plus licensed publisher content.
  - Valyu: web plus licensed datasets such as SEC filings, PubMed and patents.
  - Kagi: its own small-web index plus other engines.
  - Tavily: aggregates other engines with its own crawl and cache; being acquired by Nebius.
  - Firecrawl: third-party web search plus its own specialist "Alexandria" indexes, launched with its $75M Series B on 2026-09-22.
  - OpenAI: its own crawler plus partners.
- **No index (they resell or scrape):**
  - Serper, SerpApi, DataForSEO and Bright Data SERP scrape Google results pages.
  - Jina Search wraps an undisclosed engine.
  - Mistral uses Brave.
  - Anthropic does not name its provider. Press in 2025 said Brave **(unverified)**.
- **The practical point:** only a handful of indexes exist. Many "search APIs" and agent tools are layers on top of Google, Bing or Brave.

## 4. Notable 2025–2026 price changes and scheduled changes

- **Google**
  - Grounding for Gemini 3 and later moved from per prompt ($35 per 1,000 grounded prompts on 2.5) to **per search query ($14 per 1,000)**, with a 5,000/month free pool. Billing started 2026-01-05.
  - One prompt can trigger several queries, so check how many queries your prompts generate.
  - Web Grounding for Enterprise now costs the same as consumer grounding on Gemini 3+, down from the $45 vs $35 gap on 2.5.
- **Scheduled Gemini token price rises** (the grounding fee does not change):
  - Gemini 4 Argon doubles on **2026-12-01** ($2/$10 to $4/$20).
  - Gemini 3.8 and 3.6 Flash double on **2027-01-01** ($0.75/$3.75 to $1.50/$7.50).
  - The Vertex pricing page also says that from **2026-11-13** token usage is billed even when a request times out.
- **Google Custom Search JSON API** is closed to new customers and **shuts down on 2027-01-01**. Brave and others are marketing migration guides.
- **Microsoft**
  - The Bing Search APIs were retired in Aug 2025. Grounding with Bing is the remaining route.
  - Its current price is $14 per 1,000. It launched at $35 per 1,000 in 2025 (from memory).
- **OpenAI**
  - o3-deep-research, o4-mini-deep-research, computer-use-preview and the gpt-4o search-preview models were shut down on **2026-07-23**. OpenAI names gpt-5.6-sol or gpt-5.6-terra as substitutes.
  - Deep research is now gpt-5.5 with reasoning high/xhigh plus web search.
  - Azure still lists o3-deep-research ($10/$40) and computer-use-preview ($3/$12).
- **Perplexity**
  - Sonar Chat Completions support ended on **2026-09-27**. Synchronous Sonar calls are being converted to Agent API requests.
  - The new web_search tool costs $2.50 per 1,000 ($1 fast). The Search API costs $5 per 1,000 ($1 fast), and up to 5 queries in one request count as a single unit.
- **Exa** added a $4 Lite tier and a $7 Auto tier, and replaced its Research API with Agent effort levels ($0.012–$1 per run).
- **Parallel** added Search Turbo/Fast at $1 and extended the Task API up to ultra8x ($2.40 per task).
- **Linkup** moved to USD pricing in May 2026 and added a Flash depth in Sep 2026.
- **xAI** replaced Live Search with agent tools at $5 per 1,000 calls (Live Search was $25 per 1,000 sources, from memory). The company now brands itself SpaceXSI.
- **Anthropic** has not changed web search ($10 per 1,000) since launch. Code execution is now free when used with web search or fetch.
  - Newer tool versions add dynamic filtering, and those versions are **not ZDR-eligible** unless you set `allowed_callers: ["direct"]`.
- **Consolidation:**
  - Tavily is joining Nebius (announced Feb 2026).
  - Jina AI is now owned by Elastic (completed Oct 2025).
  - Manus was reported acquired by Meta **(not confirmed today)**.

## 5. Terms and licensing gotchas

- **Google grounding display rules.**
  - You must show Search Suggestions in production exactly as provided: same colours and fonts, visible next to the answer, and a tap goes straight to Google results.
  - Sites that opt out through Google-Extended are excluded from grounding.
  - The Vertex pricing page says customers "may decide not to display Search Suggestions" at standard pricing under 1M grounding prompts per day. Get this confirmed in writing before relying on it.
- **Bing display rules.** You must keep and display both the website URLs and the Bing search query URL in the exact form Microsoft provides. Data sent to Bing is governed by the Bing terms and the Microsoft Privacy Statement, not the Azure DPA.
- **Citations.** OpenAI requires inline citations to be "clearly visible and clickable". Anthropic requires citations when outputs are shown to end users.
- **Storage rights.** Brave allows storing results or training on them only on plans that include storage rights. Mojeek includes storage and AI-usage rights in its plans. Assume other vendors forbid caching or redistributing results unless their contract says otherwise.
- **SERP scrapers** (SerpApi, Serper, DataForSEO, Bright Data SERP) depend on scraping Google. SerpApi bundles a "U.S. Legal Shield" (up to $2M) because of that. Treat this as a legal risk for client work.
- **Zero data retention is usually an enterprise add-on.** Exa, Parallel, You.com, Linkup, Valyu and Firecrawl offer ZDR on Enterprise. Brave claims ZDR is built into how it runs ("architectural").
- **Open-weights licences.**
  - Tongyi DeepResearch, WebSailor, MiroThinker, Jan-nano and DR Tulu use Apache-2.0.
  - **Kimi K3** looks like MIT, but it requires a separate agreement if you run a model-as-a-service business with more than $20M revenue. It also requires "Kimi K3" attribution above 100M MAU or $20M monthly revenue. Internal use is exempt.
- **Open-source crawler licence.** Firecrawl's open-source core is AGPL-3.0. That matters if you modify it and offer it as a service.
- **Web fetch exfiltration.** Claude web fetch only fetches URLs that already appear in the conversation, as a guard against data exfiltration. Do not combine fetch tools with sensitive data and untrusted input.

## 6. By cloud: what a client limited to one cloud can use

**AWS**
- Search stays in AWS:
  - **AgentCore Web Search** ($7 per 1,000, any model, Amazon's own index, AWS says nothing goes to third-party search).
  - **Nova Web Grounding** ($30 per 1,000, Nova models only, US Regions).
- Browsers stay in AWS: **AgentCore Browser** ($0.0895 per vCPU-hour, $0.00945 per GB-hour).
- Claude on Bedrock does **not** have Anthropic's web search or fetch tools. Pair it with AgentCore Web Search instead.
- Claude Platform on AWS has web search, but it is Anthropic-operated and billed through AWS Marketplace. Workspaces created from 2026-09-18 use AWS infrastructure. The search provider is not named, so assume queries leave AWS.
- Kimi K3 is on Bedrock (GA 2026-09-18).
- Perplexity and Firecrawl AWS Marketplace listings are billing routes only.

**Google Cloud**
- **Web Grounding for Enterprise** on Vertex is the regulated-industry option: no customer data logged, VPC-SC, $14 per 1,000 queries on Gemini 3+. Gemini models only.
- Grounding with Google Search also runs on Google infrastructure, but processing is global and logs are kept up to 3 days.
- Grounding with Parallel or Exa through Vertex sends queries to those vendors, even when billed through Google Cloud Marketplace.
- Claude on Vertex (Google-managed) has only the basic web search tool. The Anthropic-managed Google Cloud offering is Anthropic-operated, with some trust and safety processing outside Google Cloud.
- Gemini Deep Research is documented for the Gemini API. Vertex availability was not confirmed.
- No browser-hour product was found. The Agent Platform sandbox compute rates are **unverified**.

**Azure**
- Every Microsoft web-search route goes through Grounding with Bing ($14 per 1,000): the Azure OpenAI `web_search` tool, Foundry Agent Service Bing tools, the Foundry Deep Research tool, and Azure AI Search's Web Knowledge Source.
- Microsoft says all of these send data **outside the Azure compliance boundary and geo**, and the Microsoft DPA does not apply. Azure admins can switch web search off.
- Claude in Foundry "hosted on Azure" supports only the basic web search and fetch tools. Again, the search provider is not named.
- Browsers can stay in Azure: Playwright Workspaces ($0.60 per hour Linux) behind the GA Foundry Browser Automation Tool.
- Kimi K3 is on Foundry through Fireworks AI, a third-party operator; check where it runs.
- **The only way to keep web search inside Azure** is to self-host a crawler (Crawl4AI, Firecrawl open source) and accept that every fetch goes to the open web.

**Any cloud (self-hosted)**
- Open-source agents and crawlers run inside the client's account: Browser Use (MIT), Stagehand (MIT), steel-browser (Apache-2.0), Crawl4AI (Apache-2.0), Firecrawl (AGPL-3.0).
- So do the open research models: Tongyi DeepResearch 30B-A3B, MiroThinker 1.7, DR Tulu 8B.
- They still need a search API, and the search API is what decides where the queries go.

## 7. Search APIs at a glance

| id | $ / 1k (first paid tier) | Own index | Free tier | Note |
|---|---:|---|---|---|
| `serper` | 1.00 | No (Google scrape) | 2,500 queries | $0.30 per 1,000 at volume |
| `dataforseo-serp` | 2.00 live / 0.60 queued | No | $1 trial | |
| `mojeek-api` | ~2.66 (GBP 2) | Yes | credit | storage rights included |
| `exa-search` | 4.00 | Yes | $10/month | Auto $7; contents $1 per 1,000 pages |
| `keenable-search` | 4.00 | Yes | 100k requests | $1 at volume, on-prem option |
| `google-vertex-ai-search` | 4.00 | Yes (your sites) | 10k/month | sites only, up to ~50 domains |
| `brave-search-api` | 5.00 | Yes | $5/month | LLM Context included |
| `parallel-search` | 5.00 | Yes | 5k/month | Turbo/Fast $1 |
| `perplexity-search-api` | 5.00 | Yes | — | 5 queries per request; Fast $1 |
| `youcom-search` | 5.00 | Yes | $10 | |
| `linkup-search` | 5.00 | Partial | $20/month | deep $50 |
| `google-custom-search-json` | 5.00 | Yes | 100/day | closed; ends 2027-01-01 |
| `valyu-search` | 6.25 | Partial | $10–20 | priced per result; SEC filings 19x the web rate |
| `firecrawl-search` | 6.40 | Partial | 500 searches | $1.66 on Standard |
| `aws-agentcore-web-search` | 7.00 | Yes (Amazon) | — | stays in AWS |
| `tavily-search` | 8.00 | Partial | 1,000 credits | advanced $16 |
| `kagi-search-api` | 12.00 | Partial | — | |
| `serpapi` | 25.00 | No (scrape) | 250/month | $9–10 at volume |
| `jina-search` | ~0.50 **(unverified)** | No | 10M tokens | |

Answer APIs (search plus LLM answer in one call), per answer: Perplexity Agent API "fast" ~$0.0016, Exa Answer $0.005, You.com Answer $0.005, Linkup sourcedAnswer $0.006, Parallel Responses Low $0.01, Brave Answers ~$0.019 (Brave's own FreshQA figure is $18 per 1,000 all-in).

## 8. Deep research apps (per seat-month)

Most consumer pricing pages need JavaScript, so these are **unverified** except Claude:
- **Claude** (verified on claude.com): Pro $20 ($17 annual), Max $100 or $200, Team $25/$125 ($20/$100 annual), Enterprise $20/seat plus usage at API rates. Research is included from Pro upwards.
- **ChatGPT:** Plus $20, Pro in three tiers at $100/$200/$500, Business $25 ($20 annual). Deep research is "limited", "expanded" or "maximum", with no published counts.
- **Gemini:** AI Pro $19.99 and Ultra $249.99 in the US. UK prices GBP 7.99 (Plus) and GBP 18.99 (Pro) were verified. Limits are now based on usage, with no fixed report counts. Gemini Enterprise Business costs from $21.
- **Perplexity:** Pro $20, Max $200, Enterprise Pro $40 (50 Research/month), Enterprise Max $325 (500/month).
- **Grok:** SuperGrok $30, SuperGrok Plus $100.
- **Manus:** from $20 (4,000 credits).
- **Genspark:** Plus $24.99, Pro $249.99.

## 9. Gaps and things not confirmed

- **Mistral web search per-call price:** not shown on the pages fetched.
- **Jina pricing:** the page needs JavaScript; third-party figures only.
- **OpenAI web search ZDR eligibility:** not confirmed.
- **Gemini API grounding tokens:** whether grounding-result tokens are billed on the Gemini API (they are free on Vertex).
- **Claude web search on Vertex (Google-managed) and Foundry:** which search provider runs the query, and whether the query leaves the cloud.
- **Gemini Deep Research on Vertex:** availability not confirmed.
- **Google browser sandbox:** the browser-hour equivalent is unverified.
- **Bedrock token prices** for Kimi K3 and Nova 2 Lite were not read; the pricing data is loaded by script.
- **Consumer app seat prices and research limits**, except Claude.
- **Azure token prices:** "one answer" estimates for Azure use OpenAI list prices, not Azure per-model rates.
