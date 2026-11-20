# F. Scale, watch list and retirements: web search and research providers (checked 2026-11-20)

Builds on pack B (players and pricing, sections 3–4) and pack A (section 1.8), both compiled 2026-10-25. Tags: **[verified]** = primary source read this session (link inline); **[verified-2nd]** = reputable press only; **[unverified]** = aggregator, single weak source or vendor page not readable. No figures here are my own estimates.

## Executive summary

1. **Four consumer giants dwarf everyone:** Google AI Overviews 2.5B+ monthly users and AI Mode 1B+ (May 2026); ChatGPT ~1.2B weekly users, whose "search-like" volume OpenAI puts at ~1/5 of Google's (Nov 2026); Bing 1B monthly users (Apr 2026).
2. **Perplexity is now small by traffic:** ~0.8% of gen-AI web visits (Similarweb, Oct 2026) and no query figure published since May 2025 (780M/month). Its valuation (~$20B) still makes it large on paper.
3. **Among agent search APIs, five have real scale signals:** You.com (1B+ queries/month, vendor), Tavily (350M+ requests/month, 3M+ developers, vendor; now owned by Nebius), Exa (400k developers, 5,000+ companies, $2.2B valuation), Parallel (100k+ developers, $2B valuation), Firecrawl (1.5M users, $75M Series B).
4. **No like-for-like usage metric exists.** Vendors report queries, requests, developers, users or downloads, each on a different basis. Compare within a column, not across.
5. **Do not recommend:** Bing Search APIs (off since 11 Aug 2025), Google Custom Search JSON API and "Search the entire web" in Programmable Search (end 1 Jan 2027), OpenAI's deep-research and search-preview models (off 23 Jul 2026), Perplexity Sonar Chat Completions (ended 27 Sep 2026), ChatGPT Atlas (off 9 Aug 2026), Exa /research (retired 1 Apr 2026), xAI Live Search (deprecated by 15 Dec 2025).
6. **New since pack B (25 Oct):** Azure retired o3-deep-research on **19 Nov 2026**, so pack B's "Azure still sells it" is now wrong. Microsoft **Web IQ** became generally available on 17 Nov 2026 at $1 per 1,000 calls. The AWS AgentCore **Web Search API** became GA on 10 Nov 2026.
7. **Closing in the next 6 months:** Gemini 2.5 Pro/Flash on the Gemini API (1 Dec 2026, which ends per-prompt grounding billing there); OpenAI o3/o3-pro/gpt-5 family (11 Dec 2026); Google CSE JSON API (1 Jan 2027); GPT-4o/4.1 on OpenAI (14 Jan 2027). Foundry classic agents follow on 31 Mar 2027, just outside the window.
8. **Watch:** Microsoft Web IQ, AWS AgentCore Web Search, Keenable (100B-doc index), DeepSeek Search/Fetch ($0.75 per 1,000), Cloudflare Web Search (a router over Ceramic, Exa and Linkup), Octen, Firecrawl Alexandria.
9. **Consolidation:** Nebius closed its Tavily deal on 19 Feb 2026. Elastic owns Jina (Oct 2025), and Jina's APIs are still running. Meta's Manus deal was unwound on Beijing's order, and Manus has been independent again since Sep 2026.
10. **Anthropic publishes no Claude web-search usage figure.** Its signals are valuation ($965B, May 2026) and Similarweb share (Claude 11.5% of gen-AI visits, Oct 2026).

---

## 1. Scale signals

### 1a. Consumer AI search (users or query volume)

| Provider / product | Best usage figure | Date | Who says | Funding / valuation | Tag |
|---|---|---|---|---|---|
| Google AI Overviews | 2.5B+ monthly active users | 19 May 2026 | Google (Pichai, I/O) | Alphabet (public) | [verified](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/) |
| Google AI Mode | 1B+ monthly active users; queries ~3x longer than classic search; 1 in 5 uses voice, images or docs | May 2026; Q3 call 28 Oct 2026 | Google | — | [verified I/O](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/), [verified Q3](https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/) |
| Google Search overall | YoY query growth "highest in the last five years" (no count) | 28 Oct 2026 | Google | — | [verified](https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/) |
| Gemini app | 1B+ monthly active users | 28 Oct 2026 | Google | — | [verified](https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/) |
| ChatGPT (incl. search) | ~1.2B weekly active users; "search-like" query volume ~1/5 of Google's (OpenAI's definition: a question that triggers a web lookup; no method published) | 3 Nov 2026 | OpenAI (Adam Fry, Big Technology interview) | $852B post-money (Mar 2026) [verified-2nd] | [verified-2nd](https://www.seroundtable.com/chatgpt-20-percent-google-search-volume-42451.html) |
| ChatGPT, third-party view | ~12% of Google's search volume (Ahrefs estimate) | Feb 2026 | Ahrefs | — | [unverified](https://ahrefs.com/blog/chatgpt-has-12-percent-of-googles-search-volume/) |
| Microsoft Bing | 1B monthly active users "for the first time" | 29 Apr 2026 (FY26 Q3 call) | Microsoft (Nadella) | MSFT (public) | [verified-2nd, transcript](https://www.fool.com/earnings/call-transcripts/2026/04/29/microsoft-msft-q3-2026-earnings-transcript/) |
| Microsoft Copilot | Daily users up ~50% QoQ; no absolute figure. Last absolute: 150M MAU across the Copilot family (Oct 2025) | 28 Oct 2026 | Microsoft (Nadella posts) | — | [verified-2nd](https://techcrunch.com/?p=3087908) |
| Perplexity | 780M queries/month (latest company figure); "100M+ MAU across products" (Sacra citing CEO) | May 2025; Apr 2026 | Perplexity CEO | ~$20B (Sep 2025, Reuters); talks at >$30B reported, not confirmed | [verified-2nd](https://techcrunch.com/2025/06/05/perplexity-received-780-million-queries-last-month-ceo-says); MAU and 2026 round [unverified] |
| Anthropic Claude (web search) | **No usage figure for web search.** Only Claude Code weekly users "doubled" since 1 Jan 2026 | Feb 2026 | Anthropic | $965B post-money Series H (28 May 2026) | valuation [verified-2nd](https://www.euronews.com/business/2026/05/29/worlds-most-valuable-ai-start-up-anthropic-nears-1tn-valuation-overtaking-openai) |
| Brave Search | "Tens of millions" of unique queries/day; Ask Brave 22M answers/day | 24 Feb 2026 | Brave | private | [verified](https://brave.com/blog/search-api-growth/) |

**Third-party traffic proxy (Similarweb gen-AI website visits, Oct 2026):** ChatGPT 55.7%, Gemini 24.2%, Claude 11.5%, DeepSeek 3.4%, Grok 2.2%, Copilot 1.1%, Perplexity 0.8%. ChatGPT, Gemini and Claude shares are [verified-2nd](https://officechai.com/ai/claude-takes-website-traffic-share-from-chatgpt-gemini-in-october/); the tail figures come from FourWeekMBA [unverified](https://fourweekmba.com/ai-claude-gains-1-9-points-of-ai-web-share-in-a-month-to-11-5/). This counts website visits only, so app and API use are excluded. StatCounter's pageview metric gives very different shares (Perplexity ~15%) [unverified].

### 1b. Search APIs and agent web infrastructure

| Provider | Product | Best usage figure | Date | Who says | Funding / valuation / owner | Tag |
|---|---|---|---|---|---|---|
| Google | Gemini grounding with Search | **No grounding volume published.** Proxies: 8.5M+ developers/month build on Google models (May 2026); first-party APIs ~32B tokens/min (Q3 2026). Grounding is capped at 1M queries/day per project on Vertex. | May / Oct 2026 | Google | — | [verified](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/); cap [unverified] |
| OpenAI | Responses `web_search` tool | No API search figure | — | — | — | — |
| Microsoft | Grounding with Bing; **Web IQ** (GA 17 Nov 2026, from $1 per 1,000 calls) | No volume. Web IQ grounds Copilot and ChatGPT per press | Nov 2026 | Microsoft | — | GA and price [verified](https://azure.microsoft.com/en-us/blog/introducing-the-new-microsoft-iq-putting-your-organizations-intelligence-to-work-in-every-agent/); ChatGPT link [unverified] |
| Brave | Search API | "Billions" of API calls/week; "thousands" of new API users/day; index of 40B pages | 24 Feb 2026 | Brave | private | [verified](https://brave.com/blog/search-api-growth/) |
| You.com | Search / Research APIs | 1B+ queries/month via API; 100k+ agents built in 12 months | Series C page (round reported Sep 2025) | You.com | $100M Series C at $1.5B | [verified](https://you.com/articles/series-c) |
| Tavily (Nebius) | Search / Extract / Crawl | 350M+ monthly requests; 3M+ developers (homepage). At deal: 1M+ developers, 3M+ monthly SDK downloads | Nov 2026; 10 Feb 2026 | Tavily; Nebius | Acquired by Nebius (closed 19 Feb 2026); ~$275M upfront, up to ~$400M (Bloomberg) | [verified homepage](https://www.tavily.com/), [verified Nebius](https://nebius.com/newsroom/nebius-announces-agreement-to-acquire-tavily-to-add-agentic-search-to-its-ai-cloud-platform); price [verified-2nd](https://siliconangle.com/2026/02/10/ai-infrastructure-giant-nebius-buys-agentic-search-startup-tavily/) |
| Exa | Search / Contents / Agent | 400k+ developers; 5,000+ companies; tracks 500B+ URLs; default fallback engine for OpenRouter web search | 20 May 2026 | Exa | $250M Series C at $2.2B (a16z) | [verified](https://exa.ai/blog/announcing-series-c); ARR estimate of $100M (Sacra) [unverified] |
| Parallel Web Systems | Search / Task / FindAll | 100k+ developers | Apr 2026 | Parallel | $100M Series B at $2B (Sequoia); $230M raised in total | [verified](https://parallel.ai/blog/series-b); date and lead [verified-2nd](https://siliconangle.com/2026/04/28/parag-agrawals-startup-raises-100m-build-parallel-web-ai-agents) |
| Firecrawl | Scrape / Search / Alexandria | 1.5M+ users; 550+ Alexandria data providers (Nov 2026) | 22 Sep 2026 | Firecrawl | $75M Series B (Smash Capital); valuation not disclosed | [verified](https://www.firecrawl.dev/blog/introducing-alexandria-series-b) |
| Linkup | Search API | "Thousands of users"; "hundreds of companies" | 3 Mar 2026 | Linkup | $10M seed (Gradient) | [verified](https://www.linkup.so/blog/announcing-our-3m-fundraising) |
| Valyu | Search API (web + licensed data) | **No usage figure.** Funding found only from 2024 (small pre-seed) | — | — | — | [unverified](https://www.caplight.com/company/valyu) |
| Jina (Elastic) | Reader / Search | **No usage figure.** Acquired by Elastic Oct 2025; APIs still billed on jina.ai | Oct 2025 | Jina legal page | Elastic (public) | [verified-2nd via jina.ai/legal](https://jina.ai/legal) |
| SerpApi | Google SERP scraping | **No usage figure.** Google's DMCA suit partly dismissed 20 Jul 2026; 2nd motion to dismiss pending (pack A) | — | — | private | see pack A §1.8 |
| Serper | Google SERP scraping | **No usage or funding figure found** | — | — | — | — |
| Browserbase | Cloud browsers + Search (via Exa) | 35M+ browser sessions/month; 10,000 customers | Nov 2026 | Browserbase homepage | $40M Series B at $300M (Jun 2025) | [verified homepage](https://www.browserbase.com/); funding [verified-2nd](https://aimmediahouse.com/ai-startups/browserbase-raises-40-million-series-b-as-demand-for-ai-web-automation-accelerates) |
| Browser Use | Open-source browser agent + cloud | 121,547 GitHub stars | 20 Nov 2026 | GitHub API | $17M seed (Mar 2025); no Series A found | [verified](https://github.com/browser-use/browser-use) |
| AWS | AgentCore Web Search (gateway tool GA 16 Jun 2026; Web Search API GA 10 Nov 2026) | **No usage figure.** $7 per 1,000; 6 regions; Amazon-operated index | Nov 2026 | AWS | — | [verified](https://aws.amazon.com/about-aws/whats-new/2026/11/amazon-bedrock-agentcore-web-search-api/) |
| Keenable | Search API, own index | Index of 100B+ docs; contracts with unnamed AI labs | 25 Aug 2026 | Keenable | $26M seed (Accel, Conviction) | [verified-2nd](https://siliconangle.com/2026/08/25/agentic-web-search-infrastructure-startup-keenable-raises-26m/) |
| TinyFish | Enterprise web agents | **No usage figure** | — | — | $47M Series A (ICONIQ, Aug 2025); nothing new in 2026 | [verified-2nd](https://siliconangle.com/2025/08/20/tinyfish-raises-47m-expand-deployment-enterprise-web-agents/) |
| Octen | Search API (invite-only beta) | Median 62 ms latency claim; no volume | 22 Apr 2026 | Octen | $10M seed (Square Peg) | [verified-2nd](https://siliconangle.com/2026/04/22/octen-raises-10m-seed-funding-speed-ai-agent-search-queries/) |
| DeepSeek | Search + Fetch APIs (own engine) | **No usage figure.** $0.75 per 1,000 successful requests; 100 QPS search, 25 QPS fetch | launched 17 Oct 2026 | DeepSeek docs | — | [verified](https://api-docs.deepseek.com/guides/search); launch date [verified-2nd](https://technode.com/2026/10/19/deepseek-launches-web-search-and-page-fetching-apis-for-ai-agents/) |
| Cloudflare | Web Search API (beta, a router over Ceramic, Exa and Linkup) | No usage figure | 2 Oct 2026 | Cloudflare | public | [verified-2nd](https://developers.cloudflare.com/changelog/post/2026-10-02-introducing-web-search-api/) |

### 1c. Other third-party proxies

- **GitHub stars (GitHub API, 20 Nov 2026) [verified]:** firecrawl 204,522; browser-use 121,547; crawl4ai 87,579; playwright-mcp 39,915; searxng 39,723; gpt-researcher 30,790; stagehand 26,096; open_deep_research 12,675; jina reader 12,273; exa-mcp-server 5,246; tavily-mcp 2,498. Stars measure developer interest, not production use.
- **Cloudflare Radar AI crawlers:** third-party readings of Radar data put search-purpose crawling at ~8–11% of AI-bot requests in Q3 2026 (training ~44–48%), with ClaudeBot at ~13% and GPTBot at ~8% of AI-bot traffic. [unverified](https://technologychecker.io/blog/ai-crawler-statistics). I did not find an official Cloudflare 2026 report.
- **OpenRouter:** the web plugin is deprecated in favour of the `openrouter:web_search` server tool. It uses the provider's native search where one exists and falls back to Exa otherwise. **No usage share is published** [verified-2nd](https://openrouter.ai/docs/guides/features/plugins/web-search).
- **Similarweb:** see 1a.

---

## 2. Retired, closing or replaced (do not recommend)

### 2a. Already retired or ended

| Product | Status and exact date | Replacement | Tag |
|---|---|---|---|
| **Bing Search APIs** (Web, News, Image, etc.) and **Bing Custom Search** | Retired **11 Aug 2025** | Grounding with Bing Search (Foundry); now also Microsoft Web IQ | [verified](https://learn.microsoft.com/en-us/lifecycle/announcements/bing-search-api-retirement) |
| **OpenAI API:** o3-deep-research, o4-mini-deep-research | Announced 22 Apr 2026; shut down **23 Jul 2026** | gpt-5.6-sol (or gpt-5.5 + web search at high reasoning effort) | [verified](https://developers.openai.com/api/docs/deprecations) |
| **OpenAI API:** gpt-4o-search-preview, gpt-4o-mini-search-preview, computer-use-preview | Shut down **23 Jul 2026** | gpt-5.6-terra | [verified](https://developers.openai.com/api/docs/deprecations) |
| **Azure / Foundry:** o3-deep-research (2025-06-26) | **Retired 19 Nov 2026** (brought forward from 26 Dec 2026). **Changed since pack B.** computer-use-preview is no longer on the Azure schedule. | gpt-5.6-sol | [verified](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule) (page updated 18 Nov 2026) |
| **OpenAI Assistants API** (incl. its tools) | Shut down **26 Aug 2026** | Responses + Conversations APIs | [verified](https://developers.openai.com/api/docs/deprecations) |
| **ChatGPT Atlas** browser | Announced 9 Jul 2026; stopped working **9 Aug 2026** | Browser built into the ChatGPT desktop app, a cloud browser for agents, and a Chrome extension | [verified-2nd](https://techradar.com/pro/openai-shuts-down-its-atlas-browser-after-not-even-a-year) (OpenAI help article exists but blocked fetch) |
| **Perplexity Sonar Chat Completions** (Sonar, Sonar Pro, Sonar Reasoning Pro, Sonar Deep Research) | Support ended **27 Sep 2026**. Sync calls are auto-converted to Agent API requests; async calls no longer supported. | Agent API effort levels: fast (Sonar, Sonar Pro), low (Reasoning Pro), high/xhigh (Deep Research) | [verified](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar) |
| Perplexity `sonar-reasoning` | Removed **15 Dec 2025** | sonar-reasoning-pro (itself now ended) | [verified](https://docs.perplexity.ai/changelog) |
| **Exa Research API** (`/research`) | Retired **1 Apr 2026** | `/search` type `deep`, or **Exa Agent** (launched 16 Jun 2026) for long tasks | [verified](https://exa.ai/docs/changelog/may-2026-api-deprecations.md) |
| Exa search types `instant`, `fast`, `deep-reasoning` | Legacy from **19 Oct 2026** | `lite`, `auto`, `deep` | [verified](https://exa.ai/docs/changelog/may-2026-api-deprecations.md) |
| **xAI Live Search** (`search_parameters` on Chat Completions) | Deprecated by **15 Dec 2025**; xAI docs now document only the `web_search` tool on the Responses API | Agent tools `web_search` / `x_search` (GA Oct 2025, ≤$5 per 1,000 calls) | date [verified-2nd](https://cdn.jsdelivr.net/npm/@langchain/xai@1.3.16/dist/tools/live_search.d.ts); tools [verified](https://docs.x.ai/docs/release-notes) |
| **Gemini 2.5 Pro / Flash on Vertex AI** (the last models billed per grounded prompt, $35 per 1,000) | Retired **20 Oct 2026** | gemini-3.8-flash / 3.5-flash(-lite); grounding billed per query ($14 per 1,000) | [verified](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/model-versions) |
| Gemini `deep-research-pro-preview-12-2025` | Shut down **23 Oct 2026** | deep-research-preview-04-2026 (and -max-) | [verified](https://aistudio.google.com/docs/deprecations) |
| gemini-2.0-flash (Gemini API) | Shut down **1 Jun 2026** | gemini-3.6-flash | [verified](https://aistudio.google.com/docs/deprecations) |
| Perplexity Agent API: OpenAI gpt-5 / 5.1 / 5.2 / 5.4 models | Retired **24 Oct 2026** | current OpenAI models | [verified](https://docs.perplexity.ai/changelog) |
| OpenRouter web **plugin** and `:online` variants | Deprecated (date not stated) | `openrouter:web_search` server tool (beta) | [verified-2nd](https://openrouter.ai/docs/guides/features/plugins/web-search) |
| **Manus under Meta** | Beijing ordered the deal unwound (Apr 2026); Meta cut Manus off from its systems (Jun 2026); Manus data created after 29 Dec 2025 for some users deleted 23–24 Aug 2026; independent again from ~1 Sep 2026; reported to be raising $500M at $4B | Manus still operates but has unsettled ownership and data history. Treat with caution, not as a Meta product. | [verified-2nd](https://techcrunch.com/2026/09/18/manus-seeks-4b-valuation-in-new-500m-fundraise-as-it-resumes-independent-ops/), [data deletion](https://www.trendingtopics.eu/manus-becomes-independent-again-following-2b-meta-deal-and-deletes-user-data/) |

### 2b. Closed to new customers or closing (next 6 months marked ⏰)

| Product | Date | Replacement | Tag |
|---|---|---|---|
| ⏰ **Gemini 2.5 Pro / Flash on the Gemini API** (ends per-prompt grounding billing there) | **1 Dec 2026** (earliest possible; requests route to gemini-3.8-flash / 3.5-flash-lite) | Gemini 3.x with per-query grounding | [verified](https://aistudio.google.com/docs/deprecations) |
| ⏰ OpenAI Agent Builder; `/v1/prompts` | **30 Nov 2026** | — | [verified](https://developers.openai.com/api/docs/deprecations) |
| ⏰ OpenAI o3, o3-pro, gpt-5, gpt-5-mini/nano/pro (often used for research with web search) | **11 Dec 2026** | newer GPT-5.x / 6 models | [verified](https://developers.openai.com/api/docs/deprecations) |
| ⏰ **Google Custom Search JSON API** | Closed to new customers; ends **1 Jan 2027** | Vertex AI Search (≤50 domains) or Google's partner-only full-web search ("contact us") | [verified](https://developers.google.com/custom-search/v1/overview) |
| ⏰ **Programmable Search Engine "Search the entire web"** | Gone for new engines (announced 22 Jan 2026); existing engines keep it until **1 Jan 2027** | same as above | [verified-2nd, Google email forwarded](https://groups.google.com/g/lispcore/c/kmzN4d2Khgc) |
| ⏰ OpenAI GPT-4o (2024-08-06, 2024-11-20), GPT-4o mini, GPT-4.1, GPT-4.1 mini | **14 Jan 2027** | gpt-6-luna | [verified](https://developers.openai.com/api/docs/deprecations) |
| ⏰ Azure GPT-4o 2024-05-13 | **14 Jan 2027** (other GPT-4o/4.1-mini versions **14 Apr 2027**) | gpt-5.1 | [verified](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements) |
| **Foundry "classic" agents**, incl. classic Grounding with Bing Search / Bing Custom Search tools | Deprecated; retire **31 Mar 2027** (just outside 6 months) | New Foundry Agent Service + Web Search tool, or Bing tools in new agents; Web IQ | [verified](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/how-to/tools-classic/bing-grounding) |

**Checked and not retiring (as of 20 Nov 2026):** Grounding with Bing Search itself (no retirement notice found; Web IQ sits alongside it); Anthropic `web_search_20250305` (still available, no deprecation); Jina Reader/Search (still sold on jina.ai, not yet in Elastic SKUs); Tavily API (continues "under its current brand" inside Nebius); Gemini 2.5 Flash-Lite on the Gemini API (no shutdown date).

---

## 3. Watch list (fast-growing or newly launched)

1. **Microsoft Web IQ.** Bing-index grounding APIs built for agents. Announced 2 Jun 2026, GA to every Azure customer on 17 Nov 2026 from $1 per 1,000 calls. This is the cheapest hyperscaler web search and Microsoft's answer to the retired Bing APIs. [verified](https://azure.microsoft.com/en-us/blog/introducing-the-new-microsoft-iq-putting-your-organizations-intelligence-to-work-in-every-agent/)
2. **AWS AgentCore Web Search.** GA as a gateway tool on 16 Jun 2026, Europe and APAC added 19 Aug 2026, standalone Web Search API GA on 10 Nov 2026 in 6 regions. Amazon runs its own index and says the search stays inside AWS. [verified](https://aws.amazon.com/about-aws/whats-new/2026/11/amazon-bedrock-agentcore-web-search-api/)
3. **Keenable.** New independent index (100B+ docs) from an ex-Yandex search lead. $26M seed on 25 Aug 2026. Its AI-lab contracts are unnamed. [verified-2nd](https://siliconangle.com/2026/08/25/agentic-web-search-infrastructure-startup-keenable-raises-26m/)
4. **DeepSeek Search + Fetch.** Own engine at $0.75 per 1,000, the cheapest first-party API seen, launched 17 Oct 2026. China-hosted, so check data residency before any client use. [verified](https://api-docs.deepseek.com/guides/search)
5. **Exa.** Valuation roughly tripled to $2.2B in about 6 months. It powers the search behind OpenRouter, Browserbase and Cloudflare (one of three providers). [verified](https://exa.ai/blog/announcing-series-c)
6. **Parallel.** $740M to $2B valuation in 5 months; now a grounding option inside Google's Gemini Enterprise Agent Platform. [verified](https://parallel.ai/blog/series-b), [Google docs](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/grounding-with-parallel)
7. **Firecrawl Alexandria.** Specialist indexes plus paid data providers (550+). The most-starred open-source web-data tool (204k stars). [verified](https://www.firecrawl.dev/blog/introducing-alexandria-series-b)
8. **Cloudflare Web Search (beta, 2 Oct 2026).** A router, not an index (Ceramic.ai is the default, plus Exa and Linkup), at list price with no markup. It matters because Cloudflare also controls bot access for much of the web. [verified-2nd](https://developers.cloudflare.com/changelog/post/2026-10-02-introducing-web-search-api/)

Also noted: Octen ($10M, invite-only, latency claims), Manus (independent again, reported $4B raise talks).

---

## 4. Changes since packs A and B (25 Oct 2026)

- **Pack B section 4 / TL;DR item 5:** "Azure still lists o3-deep-research" is **now out of date**. It was retired on 19 Nov 2026. Azure no longer lists computer-use-preview.
- **New:** Microsoft Web IQ GA (17 Nov 2026, $1 per 1,000). Add it to pack B's price ladder and the "By cloud" section: Azure now has a cheaper Bing-based option than Grounding with Bing ($14). Whether Web IQ keeps data inside the Azure compliance boundary was not checked.
- **New:** AWS AgentCore Web Search API GA (10 Nov 2026), now in 6 regions (pack B listed only the gateway tool).
- **New usage figures:** ChatGPT 1.2B WAU and the "1/5 of Google" claim (3 Nov 2026); Alphabet Q3 call (28 Oct: Gemini app 1B+ MAU, ~32B tokens/min); Similarweb October shares (10 Nov).
- **Pack A section 1.8:** DeepSeek Search/Fetch is now **verified** from DeepSeek docs: $0.75 per 1,000 requests, 100/25 QPS. The free-until-1-Nov-2026 window is [unverified].
- **Pack A section 1.8:** Google's partner-only full-web API is still not publicly documented. Google's CSE page still says "contact us" for full web search.
- **Confirmed unchanged:** Google CSE end date (1 Jan 2027), Foundry classic retirement (31 Mar 2027), Perplexity Sonar end (27 Sep 2026), OpenAI 23 Jul 2026 shutdowns.

## 5. Could not verify

- **Perplexity 2026 usage:** no company query or user figure since May 2025. The 2026 numbers (1.2–1.5B queries/month, Comet ~18M MAU) are aggregator estimates. The >$30B round is unconfirmed.
- **Google grounding volume, OpenAI web_search API volume and Claude web-search volume:** none published.
- **Microsoft Copilot absolute MAU** after Oct 2025; Bing MAU after Apr 2026.
- **ChatGPT 1.2B WAU:** reported via interview and press; no OpenAI post found. OpenAI's search-volume ratio has no published method.
- **Serper, SerpApi, Valyu, TinyFish, Octen, Keenable, DeepSeek, Cloudflare, AWS:** no usage volumes found. Valyu has no confirmed 2026 funding.
- **Tavily figures:** the homepage (350M+ requests, 3M+ developers) differs from the Feb 2026 Nebius release (1M+ developers). Both are vendor claims.
- **ChatGPT Atlas:** OpenAI help page returned 403. The date comes from multiple outlets.
- **xAI Live Search** exact switch-off date: xAI's own changelog doesn't mention it; the 15 Dec 2025 date comes from LangChain's SDK.
- **Official Cloudflare Radar 2026 AI-crawler figures:** only third-party readings found.
- **Sacra revenue estimates** (Exa ~$100M ARR, etc.): excluded from the tables as estimates.
