"""Build doc-extraction/data.js from the research JSON files.

Usage: python3 scripts/build_data.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "doc-extraction" / "research"
players = {p["id"]: p for p in json.loads((RES / "B-players.json").read_text())}

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from deploy import deploy  # noqa: E402

COLUMNS = [
    ("libs", "PDF libraries and OCR", "var(--ink-3)",
     ["pdfplumber", "pymupdf", "pymupdf4llm", "pdfminer.six", "pypdf", "camelot", "tabula", "tesseract", "abbyy-vantage"]),
    ("cloud", "Cloud document services", "var(--teal)",
     ["azure-di-read", "azure-di-layout", "azure-di-prebuilt", "azure-di-custom", "azure-content-understanding",
      "aws-textract-detect", "aws-textract-layout", "aws-textract-tables", "aws-textract-forms", "aws-bda-standard", "aws-bda-custom",
      "gcp-docai-ocr", "gcp-docai-layout-parser", "gcp-docai-form-parser", "gcp-docai-custom-extractor"]),
    ("saas", "Specialist APIs", "var(--blue)",
     ["datalab-api", "datalab-api-accurate", "mistral-ocr", "mistral-document-ai", "reducto-parse", "reducto-extract",
      "llamaparse-cost-effective", "llamaparse-agentic", "unstructured", "landing-ade", "extend-parse", "upstage-document-parse",
      "databricks-ai-parse-document", "hyperscience", "instabase", "rossum", "nanonets-idp"]),
    ("open", "Open models (self-host)", "var(--green)",
     ["marker", "surya", "chandra", "docling", "granite-docling", "mineru", "paddleocr-vl", "olmocr", "deepseek-ocr",
      "dots-ocr", "glm-ocr", "lightonocr", "qianfan-ocr", "nanonets-ocr2", "hunyuan-ocr", "qwen3-vl"]),
    ("vlm", "General models", "var(--purple)",
     ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash-lite", "gemini-3.1-pro-preview", "gemini-4-argon",
      "gpt-6-luna", "gpt-5.4-nano", "gpt-5.4-mini", "gpt-6-sol", "gpt-5.5", "gpt-6-astra",
      "claude-haiku-5.5", "claude-sonnet-5.5", "claude-opus-5.5", "qwen3-vl-235b"]),
]

SHORT = {  # tidier display names
    "azure-di-read": "Azure DI Read", "azure-di-layout": "Azure DI Layout", "azure-di-prebuilt": "Azure DI prebuilt",
    "azure-di-custom": "Azure DI custom", "azure-content-understanding": "Azure Content Understanding",
    "aws-textract-detect": "Textract OCR", "aws-textract-layout": "Textract Layout", "aws-textract-tables": "Textract Tables",
    "aws-textract-forms": "Textract Forms", "aws-bda-standard": "Bedrock Data Automation", "aws-bda-custom": "BDA custom",
    "gcp-docai-ocr": "Document AI OCR", "gcp-docai-layout-parser": "Document AI Layout Parser",
    "gcp-docai-form-parser": "Document AI Form Parser", "gcp-docai-custom-extractor": "Document AI custom",
    "datalab-api": "Datalab API", "datalab-api-accurate": "Datalab API (accurate)", "mistral-ocr": "Mistral OCR 4.1",
    "mistral-document-ai": "Mistral Document AI", "reducto-parse": "Reducto Parse", "reducto-extract": "Reducto Extract",
    "llamaparse-cost-effective": "LlamaParse (cost-effective)", "llamaparse-agentic": "LlamaParse (agentic)",
    "unstructured": "Unstructured", "landing-ade": "LandingAI ADE", "extend-parse": "Extend", "upstage-document-parse": "Upstage",
    "databricks-ai-parse-document": "Databricks ai_parse", "abbyy-vantage": "ABBYY", "nanonets-idp": "Nanonets",
    "marker": "Marker", "surya": "Surya", "chandra": "Chandra 2", "docling": "Docling", "granite-docling": "Granite-Docling",
    "mineru": "MinerU", "paddleocr-vl": "PaddleOCR-VL", "olmocr": "olmOCR 2", "deepseek-ocr": "DeepSeek-OCR",
    "dots-ocr": "dots.ocr", "glm-ocr": "GLM-OCR", "lightonocr": "LightOnOCR", "qianfan-ocr": "Qianfan-OCR",
    "nanonets-ocr2": "Nanonets-OCR2", "hunyuan-ocr": "HunyuanOCR", "qwen3-vl": "Qwen3-VL",
    "gemini-3.8-flash": "Gemini 3.8 Flash", "gemini-3.1-flash-lite": "Gemini 3.1 Flash-Lite",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash-Lite", "gemini-3.1-pro-preview": "Gemini 3.1 Pro", "gemini-4-argon": "Gemini 4 Argon",
    "gpt-6-luna": "GPT-6 Luna", "gpt-5.4-nano": "GPT-5.4 nano", "gpt-5.4-mini": "GPT-5.4 mini", "gpt-6-sol": "GPT-6 Sol",
    "gpt-5.5": "GPT-5.5", "gpt-6-astra": "GPT-6 Astra", "claude-haiku-5.5": "Claude Haiku 5.5",
    "claude-sonnet-5.5": "Claude Sonnet 5.5", "claude-opus-5.5": "Claude Opus 5.5", "qwen3-vl-235b": "Qwen3-VL 235B",
    "pymupdf4llm": "pymupdf4llm", "pdfminer.six": "pdfminer.six", "tabula": "Tabula", "pymupdf": "PyMuPDF", "tesseract": "Tesseract", "hyperscience": "Hyperscience", "instabase": "Instabase", "rossum": "Rossum",
}


def name(pid):
    return SHORT.get(pid, players[pid]["name"])


def player(pid):
    p = players[pid]
    lic = p["deployment"].get("licence")
    return {
        "id": pid, "name": name(pid), "cost": p.get("cost_per_1k_pages_usd"),
        "deploy": deploy(pid), "licence": lic, "outputs": p.get("outputs", []),
        "notes": p.get("notes", ""), "basis": p.get("cost_basis", ""),
    }


cols = [{"key": k, "label": lab, "color": c, "items": [player(i) for i in ids if i in players]} for k, lab, c, ids in COLUMNS]

calc_models = []
for pid, p in players.items():
    if p.get("token_prices_per_m") and p.get("tokens_per_page"):
        calc_models.append({"id": pid, "name": name(pid), "price": p["token_prices_per_m"], "tok": p["tokens_per_page"]})
calc_models.sort(key=lambda m: m["name"])

LADDER = ["pdfplumber", "tesseract", "lightonocr", "olmocr", "marker", "deepseek-ocr", "paddleocr-vl", "chandra",
          "gemini-2.5-flash-lite", "gpt-6-luna", "claude-haiku-5.5", "llamaparse-fast", "azure-di-read", "aws-textract-detect",
          "gemini-3.1-flash-lite", "mistral-ocr", "datalab-api", "aws-textract-layout", "gemini-3.8-flash", "gpt-5.4-mini",
          "azure-di-layout", "gcp-docai-layout-parser", "reducto-parse", "datalab-api-accurate", "gemini-4-argon", "llamaparse-agentic",
          "unstructured", "landing-ade", "claude-sonnet-5.5", "extend-parse", "azure-di-custom", "claude-opus-5.5",
          "aws-textract-forms", "gpt-6-astra"]
FAMILY = {"code library": "libs", "classic OCR": "libs", "hyperscaler doc AI": "cloud", "specialist SaaS": "saas",
          "open weights": "open", "frontier VLM": "vlm"}
ladder = [{**player(i), "fam": FAMILY[players[i]["category"]]} for i in LADDER]

out = {"columns": cols, "calcModels": calc_models, "ladder": ladder}
pareto_path = RES / "pareto.json"
if pareto_path.exists():
    out["pareto"] = json.loads(pareto_path.read_text())

(ROOT / "doc-extraction" / "data.js").write_text("window.DX = " + json.dumps(out, indent=1) + ";\n")
print("players:", sum(len(c["items"]) for c in cols), "calc models:", len(calc_models), "ladder:", len(ladder),
      "pareto:", "yes" if "pareto" in out else "no")
