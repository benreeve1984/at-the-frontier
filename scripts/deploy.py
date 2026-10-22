"""Where each product can process documents, kept separate from how it is billed.

hosted:  clouds whose own infrastructure runs the processing (first-party service,
         the cloud's managed model service, or a package deployed into the client's account).
billing: procurement routes that do NOT by themselves move processing into the client's cloud
         (e.g. an AWS Marketplace SaaS listing).
private: the vendor offers a paid private deployment (VPC, on-premises or air-gapped).
weights: downloadable model weights or an open-source library the client can run themselves.
note:    caveats that must stay visible (operator, region, version).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAYERS = {p["id"]: p for p in json.loads((ROOT / "doc-extraction" / "research" / "B-players.json").read_text())}

CLAUDE_NOTE = ("Bedrock (AWS) and Vertex AI (Google) host Claude on those clouds. In Microsoft Foundry, choose the "
               "'hosted on Azure' option, an Anthropic-operated service on Azure infrastructure; the other option runs on Anthropic's infrastructure.")

HOSTING = {
    "gpt-6-astra": (["Azure", "AWS"], "Azure OpenAI in Foundry; Amazon Bedrock. Confirm region availability."),
    "qwen3-vl-235b": (["AWS"], "Amazon Bedrock serverless."),
    "qwen3-vl": (["AWS"], "235B on Amazon Bedrock; 8B through SageMaker JumpStart in your account."),
    "mistral-ocr": (["Azure"], "Microsoft Foundry. Confirm the hosting option and region for your deployment. Google Vertex AI has only the older 25.05 version."),
    "mistral-document-ai": (["Azure"], "Microsoft Foundry. Confirm the hosting option and region for your deployment."),
    "deepseek-ocr": (["GCP", "AWS"], "DeepSeek-OCR (version 1) on Vertex AI Model Garden and SageMaker JumpStart. DeepSeek-OCR 2 is self-host only."),
    "upstage-document-parse": (["AWS"], "SageMaker model package deployed in your AWS account; the Marketplace SaaS listing is vendor-hosted."),
    "databricks-ai-parse-document": (["Azure", "AWS", "GCP"], "Runs on the Databricks platform in whichever cloud the client's workspace uses."),
}
BILLING = {
    "reducto-parse": "AWS Marketplace (vendor-hosted SaaS)",
    "reducto-extract": "AWS Marketplace (vendor-hosted SaaS)",
    "llamaparse-fast": "AWS Marketplace (vendor-hosted SaaS)",
    "llamaparse-cost-effective": "AWS Marketplace (vendor-hosted SaaS)",
    "llamaparse-agentic": "AWS Marketplace (vendor-hosted SaaS)",
    "llamaparse-agentic-plus": "AWS Marketplace (vendor-hosted SaaS)",
    "unstructured": "AWS Marketplace (vendor-hosted SaaS)",
    "hyperscience": "AWS Marketplace",
    "instabase": "AWS Marketplace",
    "landing-ade": "Snowflake Marketplace native app",
}


def deploy(bid):
    """Deployment record for a research-B player id."""
    p = PLAYERS[bid]
    cat, d = p["category"], p["deployment"]
    hosted, note = [], ""
    if bid.startswith("azure-"):
        hosted = ["Azure"]
    elif bid.startswith("aws-"):
        hosted = ["AWS"]
    elif bid.startswith("gcp-"):
        hosted = ["GCP"]
        if bid == "gcp-docai-layout-parser":
            note = "Some Gemini-based processor versions route through a global endpoint and do not meet data-residency rules. Choose the processor version accordingly."
    elif bid.startswith("gemini-"):
        hosted, note = ["GCP"], "Vertex AI."
    elif bid.startswith("gpt-"):
        hosted, note = ["Azure"], "Azure OpenAI in Microsoft Foundry. Confirm region availability."
    elif bid.startswith("claude-"):
        hosted, note = ["Azure", "AWS", "GCP"], CLAUDE_NOTE
    if bid in HOSTING:
        hosted, note = HOSTING[bid]
    open_weights = cat in ("code library", "open weights") or bid in ("tesseract", "qwen3-vl-235b")
    private = bool(d.get("self_host")) and not open_weights and not bid.startswith(("claude-", "gpt-", "gemini-"))
    return {
        "hosted": hosted,
        "billing": BILLING.get(bid),
        "private": private,
        "weights": open_weights,
        "saas": bool(d.get("saas")) and cat in ("specialist SaaS", "classic OCR"),
        "note": note,
        "licence": d.get("licence"),
    }


def custom(hosted=(), weights=False, private=False, saas=False, note="", licence=None, billing=None):
    return {"hosted": list(hosted), "billing": billing, "private": private, "weights": weights,
            "saas": saas, "note": note, "licence": licence}
