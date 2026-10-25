"""Build web-research/data.js from the research JSON files.

Usage: python3 scripts/build_web_data.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "web-research" / "research"
players = {p["id"]: p for p in json.loads((RES / "B-players.json").read_text())}

COLUMNS = [
    ("search", "Search APIs", "per 1,000 searches", "var(--ink-3)", ["search-api"]),
    ("tools", "Model search tools", "per 1,000 searches, plus tokens", "var(--purple)", ["model-search-tool"]),
    ("answer", "Answer APIs", "per 1,000 answers", "var(--teal)", ["answer-api"]),
    ("research", "Deep research APIs", "per task", "var(--blue)", ["deep-research-api"]),
    ("apps", "Research apps", "per seat a month", "var(--blue-2)", ["deep-research-app"]),
    ("browser", "Browser agents and browsers", "per browser-hour", "var(--orange)", ["browser-agent", "browser-infra"]),
    ("crawl", "Crawl and scrape", "per 1,000 pages", "var(--pink)", ["crawl-scrape"]),
    ("open", "Open research models", "self-hosted", "var(--green)", ["open-model"]),
]
SKIP = {"perplexity-sonar", "anthropic-web-fetch", "gemini-url-context"}  # retired, or free add-ons shown elsewhere

SHORT = {
    "google-custom-search-json": "Google Custom Search*", "google-vertex-ai-search": "Vertex AI Search",
    "brave-search-api": "Brave Search API", "exa-search": "Exa Search", "tavily-search": "Tavily", "parallel-search": "Parallel Search",
    "perplexity-search-api": "Perplexity Search API", "youcom-search": "You.com Search", "linkup-search": "Linkup", "valyu-search": "Valyu",
    "jina-search": "Jina Search", "serpapi": "SerpApi", "serper": "Serper", "dataforseo-serp": "DataForSEO", "kagi-search-api": "Kagi",
    "mojeek-api": "Mojeek", "firecrawl-search": "Firecrawl Search", "keenable-search": "Keenable", "aws-agentcore-web-search": "AgentCore Web Search",
    "openai-web-search": "OpenAI web search", "azure-openai-web-search": "Azure OpenAI search", "bing-grounding": "Grounding with Bing",
    "anthropic-web-search": "Claude web search", "gemini-api-grounding-google-search": "Gemini API grounding",
    "vertex-grounding-google-search": "Vertex grounding", "vertex-web-grounding-enterprise": "Web Grounding for Enterprise",
    "vertex-third-party-grounding": "Vertex + Parallel or Exa", "xai-web-search": "xAI web search", "mistral-web-search": "Mistral web search",
    "amazon-nova-web-grounding": "Nova Web Grounding", "brave-answers": "Brave Answers", "exa-answer": "Exa Answer",
    "perplexity-agent-api": "Perplexity Agent API", "parallel-responses-api": "Parallel Responses", "youcom-answer": "You.com Answer",
    "linkup-sourced-answer": "Linkup answer", "openai-deep-research-api": "OpenAI GPT-5.5", "azure-foundry-deep-research": "Azure o3-deep-research",
    "gemini-deep-research-agent": "Gemini Deep Research API", "perplexity-agent-api-deep": "Perplexity, high", "parallel-task-api": "Parallel Task API",
    "exa-agent": "Exa Agent", "youcom-research": "You.com Research", "tavily-research": "Tavily Research", "valyu-deepresearch": "Valyu DeepResearch",
    "linkup-research": "Linkup Research", "chatgpt-deep-research": "ChatGPT deep research", "claude-research": "Claude Research",
    "gemini-app-deep-research": "Gemini app", "perplexity-app": "Perplexity app", "grok-app": "Grok app", "manus": "Manus", "genspark": "Genspark",
    "openai-computer-use": "OpenAI computer use", "claude-computer-use": "Claude computer use", "gemini-computer-use": "Gemini Computer Use",
    "browser-use": "Browser Use", "stagehand": "Stagehand", "azure-foundry-browser-automation": "Foundry browser tool",
    "browserbase": "Browserbase", "steel": "Steel", "hyperbrowser": "Hyperbrowser", "kernel": "Kernel", "anchor-browser": "Anchor",
    "aws-agentcore-browser": "AgentCore Browser", "azure-playwright-workspaces": "Playwright Workspaces", "google-agent-platform-sandbox": "Google agent sandbox",
    "cloudflare-browser-run": "Cloudflare browser", "firecrawl-scrape": "Firecrawl", "jina-reader": "Jina Reader", "crawl4ai": "Crawl4AI",
    "scrapingbee": "ScrapingBee", "zyte-api": "Zyte", "bright-data": "Bright Data", "apify": "Apify", "spider": "Spider", "cloudflare-crawl": "Cloudflare crawl",
    "tongyi-deepresearch-30b": "Tongyi DeepResearch", "kimi-k3": "Kimi K3", "kimi-k2-thinking": "Kimi K2 Thinking", "mirothinker": "MiroThinker",
    "websailor": "WebSailor", "jan-nano": "Jan-nano", "dr-tulu-8b": "DR Tulu 8B",
}


def name(pid):
    return SHORT.get(pid, players[pid]["name"])


def money(v):
    if v is None:
        return None
    if v == 0:
        return "free"
    if v < 0.1:
        return f"${v:.3f}".rstrip("0")
    if v < 10:
        return f"${v:.0f}" if v == int(v) else f"${v:.2f}"
    return f"${v:,.0f}"


def price_label(p):
    """Short price for a tile; the column header gives the unit."""
    cat, pr = p["category"], p.get("price") or {}
    if p.get("cost_per_task_usd") is not None:
        return money(p["cost_per_task_usd"]) + ("" if cat == "deep-research-api" else " / task")
    if cat == "answer-api" and p.get("cost_per_answer_usd") is not None:
        return money(p["cost_per_answer_usd"] * 1000)
    if p.get("cost_per_1k_queries_usd") is not None:
        return money(p["cost_per_1k_queries_usd"])
    unit, usd = pr.get("unit"), pr.get("usd")
    if usd is None:
        if p["deployment"].get("weights"):
            return "open source" if cat != "open-model" else "free"
        return "tokens" if cat == "browser-agent" else "quote"
    if unit in ("per browser-hour", "per seat-month"):
        return money(usd)
    if unit == "per 1M tokens":
        return "tokens"
    return money(usd)


def deploy(p):
    d = p["deployment"]
    return {"hosted": d.get("hosted") or [], "billing": d.get("billing"), "private": bool(d.get("private")),
            "weights": bool(d.get("weights")), "saas": bool(d.get("saas")), "note": d.get("note") or ""}


def sort_key(p):
    for k in ("cost_per_task_usd", "cost_per_answer_usd", "cost_per_1k_queries_usd"):
        if p.get(k) is not None:
            return p[k]
    return (p.get("price") or {}).get("usd") or 9e9


def player(pid):
    p = players[pid]
    return {"id": pid, "name": name(pid), "price": price_label(p), "deploy": deploy(p), "status": p.get("status"),
            "notes": p.get("notes", ""), "basis": p.get("cost_basis", ""), "data": p.get("data_handling", ""),
            "index": p.get("index_source") or "", "verified": p.get("verified", True)}


cols = []
for key, label, unit, color, cats in COLUMNS:
    items = sorted((p for p in players.values() if p["category"] in cats and p["id"] not in SKIP), key=sort_key)
    cols.append({"key": key, "label": label, "unit": unit, "color": color, "items": [player(p["id"]) for p in items]})

# One cost axis across families: dollars per 1,000 searches, answers or research tasks.
LADDER = [
    # id or label, $ per 1,000, family, unit note
    ("Serper (Google results)", 1, "search", "searches"), ("Parallel Search Fast", 1, "search", "searches"),
    ("Exa Search", 4, "search", "searches"), ("Brave Search API", 5, "search", "searches"), ("Perplexity Search API", 5, "search", "searches"),
    ("AgentCore Web Search (AWS)", 7, "search", "searches"), ("Tavily", 8, "search", "searches"), ("SerpApi", 25, "search", "searches"),
    ("Perplexity Agent API, fast", 1.6, "answer", "answers"), ("Exa Answer", 5, "answer", "answers"), ("Brave Answers", 19, "answer", "answers"),
    ("Gemini 3.8 Flash + grounding", 31, "tool", "answers"), ("OpenAI GPT-6.1 Sol + web search", 47, "tool", "answers"),
    ("Claude Sonnet 5.5 + web search", 55, "tool", "answers"), ("Azure OpenAI + Bing", 55, "tool", "answers"),
    ("Claude Fable 5.1 + web search", 196, "tool", "answers"),
    ("Parallel Task, core", 25, "research", "tasks"), ("Parallel Task, pro", 100, "research", "tasks"), ("Perplexity, high effort", 130, "research", "tasks"),
    ("Parallel Task, ultra", 300, "research", "tasks"), ("Exa Agent, high", 500, "research", "tasks"),
    ("Gemini Deep Research", 2000, "research", "tasks"), ("Parallel Task, ultra8x", 2400, "research", "tasks"),
    ("OpenAI GPT-5.5 deep research (estimate)", 3290, "research", "tasks"), ("Gemini Deep Research Max", 5000, "research", "tasks"),
    ("Azure o3-deep-research (estimate)", 5080, "research", "tasks"), ("Valyu DeepResearch, max", 15630, "research", "tasks"),
]
ladder = [{"name": n, "cost": c, "fam": f, "unit": u} for n, c, f, u in LADDER]

# Grounded-answer and research-task calculator: per-search fee plus model tokens.
# tok: multiplier for Claude's newer tokenizer; free: result tokens not billed (Vertex grounding).
CALC = [
    ("gemini-3.8-flash", "Gemini 3.8 Flash (Vertex grounding)", 14, 0.75, 3.75, 1, True, "Prices double on 1 Jan 2027. 5,000 free searches a month."),
    ("gemini-4-argon", "Gemini 4 Argon (Vertex grounding)", 14, 2, 10, 1, True, "Prices double on 1 Dec 2026."),
    ("gpt-6-luna", "GPT-6 Luna + web search", 10, 0.1, 0.5, 1, False, ""),
    ("gpt-6.1-sol", "GPT-6.1 Sol + web search", 10, 2, 10, 1, False, ""),
    ("gpt-5.5", "GPT-5.5 + web search", 10, 5, 30, 1, False, "OpenAI's suggested model for deep research on the API."),
    ("gpt-6-astra", "GPT-6 Astra + web search", 10, 10, 50, 1, False, ""),
    ("azure-sol", "Azure OpenAI + Bing (Sol-class rates)", 14, 2, 10, 1, False, "Search goes to Bing, outside the Azure compliance boundary."),
    ("claude-haiku-5.5", "Claude Haiku 5.5 + web search", 10, 0.1, 0.5, 1.3, False, ""),
    ("claude-sonnet-5.5", "Claude Sonnet 5.5 + web search", 10, 2, 10, 1.3, False, ""),
    ("claude-opus-5.5", "Claude Opus 5.5 + web search", 10, 4, 20, 1.3, False, ""),
    ("claude-fable-5.1", "Claude Fable 5.1 + web search", 10, 10, 50, 1.3, False, ""),
    ("grok-4.7", "Grok 4.7 + web search", 5, 2, 6, 1, False, ""),
]
calc = [{"id": i, "name": n, "fee": f, "input": a, "output": b, "tok": t, "free": fr, "note": note} for i, n, f, a, b, t, fr, note in CALC]

out = {"columns": cols, "ladder": ladder, "calc": calc}

# ---------- Pareto frontiers from research C: one board per view, never blended ----------
scores = json.loads((RES / "C-scores.json").read_text())


def board(bench, run_by=None):
    return [r for r in scores if r["benchmark"] == bench and (run_by is None or r["run_by"].startswith(run_by))
            and r["cost_per_1k_tasks_usd"] is not None and r["score"] is not None]


def dep(pid=None, hosted=(), weights=False, note=""):
    if pid and pid in players:
        d = deploy(players[pid])
        if note:
            d["note"] = note
        return d
    return {"hosted": list(hosted), "billing": None, "private": False, "weights": weights, "saas": not hosted and not weights, "note": note}


SEARCH_PID = {"exa": "exa-search", "parallel": "parallel-search", "perplexity": "perplexity-search-api", "brave": "brave-search-api",
              "firecrawl": "firecrawl-search", "you": "youcom-search", "linkup": "linkup-search", "tavily": "tavily-search",
              "keenable": "keenable-search", "openai-web-search": "openai-web-search"}


def search_point(r, suffix=""):
    sid = r["system_id"]
    pid = next((v for k, v in SEARCH_PID.items() if sid.startswith(k)), None)
    fam = "none" if "no search" in r["system_name"].lower() else "tool" if sid.startswith("openai-web-search") else "api"
    name = r["system_name"].split(" (POST")[0].split(" (GET")[0]
    return {"id": sid + suffix, "name": name + suffix.replace("-fetch", " + fetch"), "family": fam, "deploy": dep(pid), "cost": r["cost_per_1k_tasks_usd"],
            "score": r["score"], "n": 1, "costBasis": "Total search and model cost per 1,000 tasks, as reported by the benchmark."}


aa = [search_point(r) for r in board("Artificial Analysis Search Index")]
ob = []
for r in board("Openbenchmarks Multi-Turn Company Search"):
    if r["system_id"].startswith(("rapidapi", "seltz")):
        continue  # near-zero or specialist scopes off the chart
    ob.append(search_point(r, "-fetch" if r["settings"].startswith("search+fetch") else ""))
ob_code = [search_point(r, "-fetch" if "fetch" in r["settings"].split(";")[0] else "") for r in board("Openbenchmarks Web Search for Coding Agents")]


def model_vendor(sid):
    for k, v in (("claude", "anthropic"), ("gpt", "openai"), ("o3", "openai"), ("gemini", "google")):
        if sid.startswith(k):
            return v
    return "open" if sid.startswith(("glm", "deepseek", "kimi", "minimax", "nemotron")) or (sid.startswith("qwen") and "max" not in sid) else "other"


MODEL_HOST = {"anthropic": (["Azure", "AWS", "GCP"], False, "Claude is hosted on Bedrock, Vertex AI and Foundry. In this test every model used Parallel's search, which runs outside those clouds."),
              "openai": (["Azure"], False, "GPT models are hosted in Azure OpenAI. In this test every model used Parallel's search."),
              "google": (["GCP"], False, "Gemini is hosted on Vertex AI. In this test every model used Parallel's search."),
              "open": ([], True, "Open weights you can host yourself. In this test every model used Parallel's search."),
              "other": ([], False, "In this test every model used Parallel's search.")}


def model_point(r, basis, suffix=""):
    v = model_vendor(r["system_id"])
    hosted, weights, note = MODEL_HOST[v]
    if r["system_id"] == "kimi-k3":
        hosted = ["AWS"]
    if "FutureSearch" in r["benchmark"]:
        note = note.replace("In this test every model used Parallel's search.", "FutureSearch's own harness on a frozen copy of the web.")
    return {"id": r["system_id"] + suffix, "name": r["system_name"], "family": v, "deploy": dep(hosted=hosted, weights=weights, note=note),
            "cost": r["cost_per_1k_tasks_usd"], "score": r["score"], "n": 1, "costBasis": basis}


par = [model_point(r, "Model and search cost per 1,000 tasks, as estimated by Parallel.") for r in board("Parallel Search Capability Leaderboard (composite)")]
drb = [model_point(r, "LLM spend per 1,000 tasks, as reported by FutureSearch.", "-" + str(i)) for i, r in enumerate(board("FutureSearch Deep Research Bench (DRB)"))]

# BrowseComp: each lab's own cost estimates, shown separately because the cost definitions differ.
EFFORT_ORDER = ["none", "low", "medium", "high", "xhigh", "max"]


def bc_name(r):
    st = r["settings"]
    eff = next((e for e in EFFORT_ORDER[::-1] if f"effort {e}" in st), None)
    m = re.search(r"effort setting (\d) of 5", st)
    if m:
        eff = f"effort {m.group(1)} of 5"
    base = re.sub(r" \((\d+) agents, multi-agent beta\)", r", \1 agents", r["system_name"])
    base = re.sub(r" \(single agent[^)]*\)", "", base)
    return f"{base} ({eff})" if eff else base


bc_open, bc_anth = [], []
for i, r in enumerate(board("BrowseComp", "OpenAI")):
    st, sid = r["settings"], r["system_id"]
    if r["system_name"] == "GPT-5.6 Sol" and "OpenAI harness" in st:
        continue  # keep the multi-agent chart's one-agent series for Sol, which shares a cost basis with its 4- and 16-agent series
    fam = "multi" if ("agents" in st and not st.startswith("1 agent")) or "Ultra" in r["system_name"] else "single"
    bc_open.append({"id": f"oa{i}", "name": bc_name(r), "family": fam, "deploy": dep(hosted=["Azure"], note="OpenAI models are hosted in Azure OpenAI."),
                    "cost": r["cost_per_1k_tasks_usd"], "score": r["score"], "n": 1, "costBasis": "OpenAI's estimated API cost per task at list price (GPT-5.6 and GPT-6 Astra pages)."})
for i, r in enumerate(board("BrowseComp", "Anthropic")):
    st, nm = r["settings"], r["system_name"]
    if st.startswith("token budget") or "total-token limit" in st or "limit;" in st or "Preview" in nm or "/ Fable" in nm:
        continue  # keep the effort series and the agent-team results
    fam = "multi" if ("agent" in nm and "single" not in nm) else "single"
    bc_anth.append({"id": f"an{i}", "name": bc_name(r), "family": fam, "deploy": dep(hosted=["Azure", "AWS", "GCP"], note="Claude is hosted on Bedrock, Vertex AI and Foundry."),
                    "cost": r["cost_per_1k_tasks_usd"], "score": r["score"], "n": 1, "costBasis": "Anthropic's average billed cost per task, read from a log-scale chart in the Opus 5 system card (about ±3%)."})

out["pareto"] = {
    "search": {"views": [
        {"label": "Artificial Analysis Search Index", "points": aa, "metric": "Search Index (0–100)", "method": "Independent · fixed GPT-5.6 Luna agent · only the search provider changes"},
        {"label": "Openbenchmarks: company lists", "points": ob, "metric": "F1 on company lists (%)", "method": "Independent · fixed GPT-5.6 Sol agent · 45 list-building tasks"},
        {"label": "Openbenchmarks: coding docs", "points": ob_code, "metric": "Tasks solved with cited sources (%)", "method": "Independent · 100 coding tickets needing documentation"},
    ]},
    "models": {"views": [
        {"label": "Parallel Search Capability Leaderboard", "points": par, "metric": "Search capability score (0–100)", "method": "Vendor-run · every model uses Parallel's search · 300 questions"},
        {"label": "FutureSearch Deep Research Bench", "points": drb, "metric": "DRB score (0–100)", "method": "Independent · frozen copy of the web · 169 tasks · models to June 2026"},
    ]},
    "browsecomp": {"views": [
        {"label": "OpenAI's estimates", "points": bc_open, "metric": "BrowseComp accuracy (%)", "method": "OpenAI's own runs and cost estimates"},
        {"label": "Anthropic's figures", "points": bc_anth, "metric": "BrowseComp accuracy (%)", "method": "Anthropic's own runs and billed cost"},
    ]},
}

(ROOT / "web-research" / "data.js").write_text("window.WX = " + json.dumps(out, indent=1) + ";\n")
print("players:", sum(len(c["items"]) for c in cols), "ladder:", len(ladder), "calc:", len(calc),
      "pareto:", {k: [len(v["points"]) for v in f["views"]] for k, f in out["pareto"].items()})
