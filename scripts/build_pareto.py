"""Blend benchmark scores into per-family Pareto datasets.

Method (shown on the slides):
- Only like-for-like benchmarks are blended, within one family.
- Each benchmark is put on a common scale by linear equating: scores are converted to z-scores
  using the systems that appear on every benchmark in the family (the anchors), then mapped
  onto the anchors' average mean and spread.
- A system's blended score is the weighted mean of its rescaled scores. A vendor's own product
  on its own benchmark gets half weight.
- Cost: list price per 1,000 pages for products, self-host GPU time for open models (both from
  research B), and the token cost the benchmark itself reported for general models (averaged
  across benchmarks), because thinking settings change the cost a lot.

Writes doc-extraction/research/pareto.json. Run build_data.py afterwards.
"""
import json
import statistics as st
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from deploy import deploy, custom  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "doc-extraction" / "research"
rows = json.loads((RES / "C-scores.json").read_text())

OPB, PB, EB = "OmniParseBench (Datalab)", "ParseBench (LlamaIndex)", "ExtractBench (LlamaIndex)"


def score(bench, metric_prefix, sid):
    hits = [r for r in rows if r["benchmark"] == bench and r["metric"].startswith(metric_prefix) and r["system_id"] == sid]
    return (hits[0]["score"], hits[0].get("published_cost_per_1k_pages_usd")) if hits else (None, None)


# id, label, approach, deploy, cost (None = from benchmarks), cost basis, OPB id, PB id, publisher
SYSTEMS = [
    ("datalab-accurate", "Datalab (accurate)", "saas", {"saas": True, "self": False, "cloud": False}, 10, "Datalab list price, accurate mode", "datalab-accurate", "datalab-accurate", "Datalab"),
    ("datalab-balanced", "Datalab (balanced)", "saas", {"saas": True, "self": False, "cloud": False}, 4, "Datalab list price, balanced mode", "datalab-balanced", "datalab-balanced", "Datalab"),
    ("reducto", "Reducto (r-1)", "saas", {"saas": True, "self": False, "cloud": "AWS Marketplace"}, 10, "Reducto list price", "reducto-r-1", "reducto-r-1", None),
    ("llamaparse-ap", "LlamaParse Agentic Plus", "saas", {"saas": True, "self": False, "cloud": "AWS Marketplace"}, 56.25, "LlamaParse list price (45 credits/page)", "llamaparse-agentic-plus", "llamaparse-agentic-plus", "LlamaIndex"),
    ("llamaparse-a", "LlamaParse Agentic", "saas", {"saas": True, "self": False, "cloud": "AWS Marketplace"}, 12.5, "LlamaParse list price (10 credits/page)", None, "llamaparse-agentic", "LlamaIndex"),
    ("llamaparse-ce", "LlamaParse Cost-Effective", "saas", {"saas": True, "self": False, "cloud": "AWS Marketplace"}, 3.75, "LlamaParse list price (3 credits/page)", None, "llamaparse-cost-effective", "LlamaIndex"),
    ("mistral-ocr", "Mistral OCR 4", "saas", {"saas": True, "self": False, "cloud": "Azure Foundry"}, 4, "Mistral list price; OCR 4.1 on OmniParseBench, OCR 4 on ParseBench", "mistral-ocr-4.1", "mistral-ocr-4", None),
    ("azure-layout", "Azure DI Layout", "cloud", {"saas": False, "self": False, "cloud": "Azure"}, 10, "Azure list price, first tier", "azure-di-layout", "azure-di-layout", None),
    ("extend", "Extend Parse", "saas", {"saas": True, "self": False, "cloud": False}, 20, "Extend list price, performance tier", "extend-parse-performance", "extend-2.0", None),
    ("databricks", "Databricks ai_parse", "saas", {"saas": True, "self": False, "cloud": "Databricks on any cloud"}, 3.5, "ParseBench-reported cost", None, "databricks-ai-parse", None),
    ("textract", "AWS Textract", "cloud", {"saas": False, "self": False, "cloud": "AWS"}, 15, "Textract tables list price", None, "aws-textract", None),
    ("docai", "Google Document AI", "cloud", {"saas": False, "self": False, "cloud": "GCP"}, 10, "Document AI layout list price", None, "google-docai", None),
    ("landingai", "LandingAI ADE", "saas", {"saas": True, "self": False, "cloud": False}, 15, "LandingAI typical credits per page", None, "landingai", None),
    ("pulse", "Pulse Ultra 2", "saas", {"saas": True, "self": False, "cloud": False}, 15, "ParseBench-reported cost", None, "pulse-ultra-2", None),
    ("chandra-2", "Chandra 2 (open)", "open", {"saas": False, "self": True, "cloud": False}, 0.48, "GPU time at $2.50/hr; licence needed above $2M revenue", "chandra-ocr-2", "chandra-ocr-2", None),
    ("lighton-08", "LightOnOCR-3 0.8B", "open", {"saas": False, "self": True, "cloud": False}, 0.12, "GPU time at $2.50/hr (throughput of the 1B model)", "lightonocr-3-0.8b", "lightonocr-3-0.8b", None),
    ("mineru", "MinerU2.5-Pro", "open", {"saas": False, "self": True, "cloud": False}, 0.33, "GPU time at $2.50/hr", "mineru2.5-pro", "mineru2.5-pro-2605-1.2b", None),
    ("paddle", "PaddleOCR-VL 1.6", "open", {"saas": False, "self": True, "cloud": False}, 0.43, "GPU time at $2.50/hr", "paddleocr-vl-1.6", "paddleocr-vl-1.6", None),
    ("dots", "dots.mocr", "open", {"saas": False, "self": True, "cloud": False}, 1.97, "GPU time at $2.50/hr (dots.ocr throughput)", "dots.mocr", "dots.mocr", None),
    ("deepseek-2", "DeepSeek-OCR 2", "open", {"saas": False, "self": True, "cloud": False}, 0.30, "GPU time at $2.50/hr", "deepseek-ocr-2", "deepseek-ocr-2", None),
    ("glm-ocr", "GLM-OCR", "open", {"saas": False, "self": True, "cloud": False}, 0.37, "GPU time at $2.50/hr", "glm-ocr", "glm-ocr", None),
    ("surya-2", "Surya 2", "open", {"saas": False, "self": True, "cloud": False}, 0.13, "GPU time at $2.50/hr; licence needed above $5M revenue", "surya-ocr-2", "surya-ocr-2", None),
    ("olmocr-2", "olmOCR 2", "open", {"saas": False, "self": True, "cloud": False}, 0.20, "AI2: under $200 per million pages", "olmocr-2", None, None),
    ("docling", "Docling", "open", {"saas": False, "self": True, "cloud": False}, 0.33, "GPU time at $2.50/hr", None, "docling-models", None),
    ("tesseract", "Tesseract", "libs", {"saas": False, "self": True, "cloud": False}, 0.03, "Free; CPU time only", "tesseract", None, None),
    ("pymupdf4llm", "pymupdf4llm", "libs", {"saas": False, "self": True, "cloud": False}, 0.03, "Free (AGPL); CPU time only", None, "pymupdf4llm", None),
    ("gemini-38-flash", "Gemini 3.8 Flash", "vlm", {"saas": False, "self": False, "cloud": "GCP"}, None, "Token cost as billed in each benchmark (thinking on)", "gemini-3.8-flash", "google-gemini-3.8-flash-thinking-high", None),
    ("gemini-38-flash-low", "Gemini 3.8 Flash (low thinking)", "vlm", {"saas": False, "self": False, "cloud": "GCP"}, None, "Token cost as billed in ParseBench", None, "google-gemini-3.8-flash-thinking-low", None),
    ("claude-sonnet-55", "Claude Sonnet 5.5", "vlm", {"saas": False, "self": False, "cloud": "Azure · AWS · GCP"}, None, "Token cost as billed in each benchmark", "claude-sonnet-5.5", "anthropic-sonnet-5.5", None),
    ("claude-opus-55", "Claude Opus 5.5", "vlm", {"saas": False, "self": False, "cloud": "Azure · AWS · GCP"}, None, "Token cost as billed in ParseBench", None, "anthropic-opus-5.5", None),
    ("claude-haiku-55", "Claude Haiku 5.5", "vlm", {"saas": False, "self": False, "cloud": "Azure · AWS · GCP"}, None, "Token cost as billed in ParseBench", None, "anthropic-haiku-5.5", None),
    ("gpt-56-sol", "GPT-5.6 Sol", "vlm", {"saas": False, "self": False, "cloud": "Azure"}, None, "Token cost as billed in each benchmark (reasoning high)", "gpt-5.6-sol", "openai-gpt-5.6-sol-reasoning-high", None),
    ("gpt-6-luna", "GPT-6 Luna", "vlm", {"saas": False, "self": False, "cloud": "Azure"}, None, "Token cost as billed in ParseBench (no reasoning)", None, "openai-gpt-6-luna-reasoning-none", None),
    ("gemini-31-flash-lite", "Gemini 3.1 Flash-Lite", "vlm", {"saas": False, "self": False, "cloud": "GCP"}, None, "Token cost as billed in ParseBench", None, "google-gemini-3.1-flash-lite", None),
    ("gemini-31-pro", "Gemini 3.1 Pro", "vlm", {"saas": False, "self": False, "cloud": "GCP"}, None, "Token cost as billed in ParseBench", None, "google-gemini-3.1-pro", None),
]

# research-B id used for each plotted system's deployment record
BID = {
    "datalab-accurate": "datalab-api-accurate", "datalab-balanced": "datalab-api", "reducto": "reducto-parse",
    "llamaparse-ap": "llamaparse-agentic-plus", "llamaparse-a": "llamaparse-agentic", "llamaparse-ce": "llamaparse-cost-effective",
    "mistral-ocr": "mistral-ocr", "azure-layout": "azure-di-layout", "extend": "extend-parse", "databricks": "databricks-ai-parse-document",
    "textract": "aws-textract-tables", "docai": "gcp-docai-layout-parser", "landingai": "landing-ade",
    "chandra-2": "chandra", "lighton-08": "lightonocr", "mineru": "mineru", "paddle": "paddleocr-vl", "dots": "dots-ocr",
    "glm-ocr": "glm-ocr", "surya-2": "surya", "olmocr-2": "olmocr", "docling": "docling", "tesseract": "tesseract", "pymupdf4llm": "pymupdf4llm",
    "gemini-38-flash": "gemini-3.8-flash", "gemini-38-flash-low": "gemini-3.8-flash", "claude-sonnet-55": "claude-sonnet-5.5",
    "claude-opus-55": "claude-opus-5.5", "claude-haiku-55": "claude-haiku-5.5", "gpt-56-sol": "gpt-5.6-sol", "gpt-6-luna": "gpt-6-luna",
    "gemini-31-flash-lite": "gemini-3.1-flash-lite", "gemini-31-pro": "gemini-3.1-pro-preview",
}
CUSTOM = {
    "pulse": custom(saas=True, note="Vendor-hosted API."),
    "deepseek-2": custom(weights=True, licence="Apache-2.0", note="DeepSeek-OCR 2 has no managed cloud listing; self-host only."),
}
SYSTEMS = [(sid, name, ap, CUSTOM.get(sid) or deploy(BID[sid]), *rest) for sid, name, ap, _dep, *rest in SYSTEMS]
FAMILIES = {
    "everyday": {
        "title": "Everyday reliability",
        "measures": "Measures whether text is complete and in order on typical pages",
        "benches": [
            ("OmniParseBench: plain pages", OPB, ["plain-content"], 6, "Datalab"),
            ("ParseBench: content faithfulness", PB, ["Content Faithfulness"], 7, "LlamaIndex"),
        ],
    },
    "hard": {
        "title": "Hard pages",
        "measures": "Measures handwriting, degraded, rotated and tiny text, and tables. Not charts",
        "benches": [
            ("OmniParseBench: hard pages + tables", OPB, ["hard-rendering", "tables family"], 6, "Datalab"),
            ("ParseBench: tables", PB, ["Tables (GTRM)"], 7, "LlamaIndex"),
        ],
    },
}


def bench_score(bench, prefixes, sid):
    vals, costs = [], []
    for p in prefixes:
        s, c = score(bench, p, sid)
        if s is None:
            return None, None
        vals.append(s)
        costs.append(c)
    return st.mean(vals), next((c for c in costs if c), None)


def build_family(fam):
    benches = fam["benches"]
    raw = {}  # system -> list of (bench label, score, cost, publisher)
    for sysd in SYSTEMS:
        sid, opb_id, pb_id = sysd[0], sysd[6], sysd[7]
        for label, bench, prefixes, idx, publisher in benches:
            bid = opb_id if bench == OPB else pb_id
            if not bid:
                continue
            s, c = bench_score(bench, prefixes, bid)
            if s is not None:
                raw.setdefault(sid, []).append((label, s, c, publisher))
    labels = [b[0] for b in benches]
    anchors = [k for k, v in raw.items() if len(v) == len(benches)]
    stats = {}
    for lab in labels:
        xs = [s for k in anchors for (l, s, _, _) in raw[k] if l == lab]
        stats[lab] = (st.mean(xs), st.stdev(xs))
    tgt_mean = st.mean(m for m, _ in stats.values())
    tgt_sd = st.mean(s for _, s in stats.values())
    pts = []
    for sysd in SYSTEMS:
        sid, name, approach, deploy, cost, basis, _, _, own = sysd
        if sid not in raw:
            continue
        num = den = 0.0
        out_raw = []
        for lab, s, c, publisher in raw[sid]:
            m, sd = stats[lab]
            w = 0.5 if own and own == publisher else 1.0
            num += w * (tgt_mean + (s - m) / sd * tgt_sd)
            den += w
            out_raw.append({"bench": lab + (" (own product, half weight)" if w < 1 else ""), "score": round(s, 1), "cost": c})
        pcost = cost
        if pcost is None:
            cs = [c for _, _, c, _ in raw[sid] if c]
            pcost = round(st.mean(cs), 2) if cs else None
        pts.append({"id": sid, "name": name, "family": approach, "deploy": deploy, "cost": pcost,
                    "score": round(num / den, 1), "n": len(raw[sid]), "raw": out_raw, "costBasis": basis})
    return {"title": fam["title"], "benches": labels, "anchors": len(anchors),
            "method": f"{fam['measures']} · index rescaled on {len(anchors)} shared systems", "points": pts}


out = {k: build_family(v) for k, v in FAMILIES.items()}

# Field extraction: ExtractBench alone (other extraction boards share too few systems to blend).
EB_MAP = {
    "llamaextract-agentic-plus": ("LlamaExtract Agentic Plus", "saas", deploy("llamaparse-agentic-plus")),
    "llamaextract-agentic": ("LlamaExtract Agentic", "saas", deploy("llamaparse-agentic")),
    "llamaextract-cost-effective": ("LlamaExtract Cost-Effective", "saas", deploy("llamaparse-cost-effective")),
    "reducto-deep-extract": ("Reducto Deep Extract", "saas", deploy("reducto-extract")),
    "reducto-extract": ("Reducto Extract", "saas", deploy("reducto-extract")),
    "pulse-effort": ("Pulse (effort)", "saas", custom(saas=True, note="Vendor-hosted API.")),
    "pulse-non-effort": ("Pulse", "saas", custom(saas=True, note="Vendor-hosted API.")),
    "extend-extract": ("Extend Extract", "saas", deploy("extend-parse")),
    "datalab-accurate-balanced": ("Datalab extract", "saas", deploy("datalab-api")),
    "claude-code-sonnet-5.5-evidence": ("Claude Code agent (Sonnet 5.5)", "agent", deploy("claude-sonnet-5.5")),
    "codex-gpt-6-sol-evidence": ("Codex agent (GPT-6 Sol)", "agent", deploy("gpt-6-sol")),
    "codex-gpt-6-luna-evidence": ("Codex agent (GPT-6 Luna)", "agent", deploy("gpt-6-luna")),
    "gpt-6-astra": ("GPT-6 Astra", "vlm", deploy("gpt-6-astra")),
    "deepseek-v4.1-flash": ("DeepSeek V4.1 Flash", "vlm", custom(weights=True, note="Open weights; cost as reported by ExtractBench for a hosted API.")),
    "glm-5.3-flash": ("GLM-5.3 Flash", "vlm", custom(weights=True, note="Open weights; cost as reported by ExtractBench for a hosted API.")),
    "gemini-3.8-flash": ("Gemini 3.8 Flash", "vlm", deploy("gemini-3.8-flash")),
    "gemini-3.5-flash": ("Gemini 3.5 Flash", "vlm", deploy("gemini-3.8-flash")),
    "gpt-5.4-nano": ("GPT-5.4 nano", "vlm", deploy("gpt-5.4-nano")),
    "kimi-k3": ("Kimi K3", "vlm", custom(weights=True, note="Open weights; cost as reported by ExtractBench for a hosted API.")),
}
EB_METRICS = [("unified value F1 (overall)", "All documents"), ("value F1 short", "Short documents"),
              ("value F1 medium", "Medium documents"), ("value F1 long", "Long documents")]


def eb_points(metric):
    pts = []
    for sid, (name, approach, dep) in EB_MAP.items():
        s_, c = score(EB, metric, sid)
        if s_ is None or not c:
            continue
        raw = []
        for m, lab in EB_METRICS:
            v, _ = score(EB, m, sid)
            if v is not None:
                raw.append({"bench": lab, "score": round(v, 1)})
        basis = "Cost as reported by ExtractBench" + (" (LlamaIndex's own product)" if sid.startswith("llamaextract") else "")
        if approach == "agent":
            basis += ". A coding agent writes and runs its own extraction code."
        pts.append({"id": sid, "name": name, "family": approach, "deploy": dep, "cost": c, "score": round(s_, 1), "n": 1,
                    "raw": raw, "costBasis": basis})
    return pts


out["extraction"] = {"title": "Field extraction", "benches": ["ExtractBench (LlamaIndex)"], "anchors": 0,
                     "method": "ExtractBench value F1 only. Other extraction benchmarks share too few systems to blend",
                     "metricLabel": "Value F1, all documents (ExtractBench)",
                     "points": eb_points("unified value F1 (overall)"),
                     "rawViews": [{"label": lab, "metricLabel": f"Value F1, {lab.lower()} (ExtractBench)", "points": eb_points(m)}
                                  for m, lab in EB_METRICS[1:]]}

# Raw single-benchmark views for the toggle
for fam_key, fam in FAMILIES.items():
    for label, bench, prefixes, _, publisher in fam["benches"]:
        pts = []
        for sysd in SYSTEMS:
            sid, name, approach, deploy, cost, basis, opb_id, pb_id, own = sysd
            bid = opb_id if bench == OPB else pb_id
            if not bid:
                continue
            s, c = bench_score(bench, prefixes, bid)
            if s is None:
                continue
            pcost = cost if cost is not None else c
            pts.append({"id": sid, "name": name, "family": approach, "deploy": deploy, "cost": pcost, "score": round(s, 1), "n": 1,
                        "raw": [], "costBasis": basis if cost is not None else f"Token cost as billed in {bench}"})
        out[fam_key].setdefault("rawViews", []).append({"label": label, "points": pts})

(RES / "pareto.json").write_text(json.dumps(out, indent=1))
for k, v in out.items():
    print(k, v["method"], "| points:", len(v["points"]), "| n>1:", sum(p["n"] > 1 for p in v["points"]))
