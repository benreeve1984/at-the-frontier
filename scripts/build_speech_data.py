"""Build speech-to-text/data.js from the research JSON files.

Usage: python3 scripts/build_speech_data.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / "speech-to-text" / "research"
players = {p["id"]: p for p in json.loads((RES / "B-players.json").read_text())}

COLUMNS = [
    ("azure", "Cloud services: Azure", "var(--blue)", ["hyperscaler-api"]),
    ("awsgcp", "Cloud services: AWS and Google", "var(--blue)", ["hyperscaler-api"]),
    ("lab", "AI lab models", "var(--purple)", ["lab-api"]),
    ("spec", "Specialist providers", "var(--orange)", ["specialist-api"]),
    ("open", "Open models", "var(--green)", ["open-model", "on-device"]),
    # speech-to-speech models are compared on their own slide, so they are left off the tile grid
]
HOSTED_OPEN = {"groq-whisper-large-v3-turbo", "together-hosted-asr", "fireworks-whisper"}  # resellers of open models
SKIP = {"openai-gpt-4o-transcribe-diarize", "azure-mai-transcribe-1x", "gcp-stt-chirp-2", "openai-gpt-4o-transcribe", "openai-gpt-4o-mini-transcribe",
        "openai-whisper-1", "azure-openai-whisper", "gcp-stt-medical", "gemini-3-5-flash-lite-audio", "gemini-4-argon-audio", "aws-bedrock-voxtral",
        "mistral-voxtral-2507-weights", "fireworks-whisper", "azure-embedded-speech", "speechmatics-oak-1"}  # retiring, superseded or minor: covered in the notes and research pack B

SHORT = {
    "aws-transcribe-batch": "Amazon Transcribe", "aws-transcribe-streaming": "Transcribe streaming", "aws-transcribe-call-analytics": "Transcribe Call Analytics",
    "aws-transcribe-medical": "Transcribe Medical", "aws-bedrock-data-automation-audio": "Bedrock Data Automation",
    "azure-speech-realtime": "Azure Speech real-time", "azure-speech-batch": "Azure Speech batch", "azure-fast-transcription": "Azure Fast Transcription",
    "azure-llm-speech": "Azure LLM Speech", "azure-mai-transcribe-2": "MAI-Transcribe-2", "azure-mai-transcribe-2-streaming": "MAI-Transcribe-2 Streaming",
    "azure-openai-gpt-transcribe": "Azure OpenAI GPT-Transcribe", "azure-openai-gpt-live-transcribe": "Azure OpenAI GPT-Live-Transcribe",
    "azure-openai-whisper": "Azure OpenAI Whisper", "azure-speech-containers": "Azure Speech containers",
    "gcp-stt-chirp-3": "Google Chirp 3", "gcp-stt-medical": "Google medical models", "vertex-gemini-3-5-transcribe": "Gemini 3.5 Transcribe (Vertex)",
    "vertex-gemini-3-5-transcribe-live": "Gemini 3.5 Transcribe Live (Vertex)",
    "openai-gpt-transcribe": "OpenAI GPT-Transcribe", "openai-gpt-live-transcribe": "OpenAI GPT-Live-Transcribe", "openai-gpt-realtime-whisper": "OpenAI gpt-realtime-whisper",
    "openai-gpt-4o-transcribe": "gpt-4o-transcribe (retiring)", "openai-gpt-4o-mini-transcribe": "gpt-4o-mini-transcribe (retiring)", "openai-whisper-1": "whisper-1 (retiring)",
    "gemini-api-3-5-transcribe": "Gemini 3.5 Transcribe", "gemini-api-3-5-transcribe-live": "Gemini 3.5 Transcribe Live", "gemini-3-8-flash-audio": "Gemini 3.8 Flash (prompted)",
    "gemini-3-5-flash-lite-audio": "Gemini 3.5 Flash-Lite (prompted)", "gemini-4-argon-audio": "Gemini 4 Argon (prompted)",
    "mistral-voxtral-mini-transcribe-3": "Voxtral Mini Transcribe 3", "mistral-voxtral-small-transcribe-3": "Voxtral Small Transcribe 3",
    "mistral-voxtral-mini-transcribe-realtime-3": "Voxtral Realtime 3", "aws-bedrock-voxtral": "Voxtral on Bedrock", "xai-grok-stt": "xAI Grok STT",
    "deepgram-nova-3": "Deepgram Nova-3", "deepgram-flux": "Deepgram Flux", "assemblyai-universal-3-5-pro": "AssemblyAI Universal-3.5 Pro",
    "assemblyai-universal-2": "AssemblyAI Universal-2", "assemblyai-universal-3-6-pro-realtime": "AssemblyAI U-3.6 Pro Realtime",
    "assemblyai-universal-streaming": "AssemblyAI Universal-Streaming", "speechmatics-melia-1": "Speechmatics Melia 1", "speechmatics-enhanced": "Speechmatics Enhanced",
    "speechmatics-linden-1": "Speechmatics Linden 1", "speechmatics-oak-1": "Speechmatics Oak 1", "rev-ai-reverb": "Rev Reverb", "gladia-solaria-3": "Gladia Solaria-3",
    "gladia-solaria-1": "Gladia Solaria-1", "soniox-v5": "Soniox v5", "elevenlabs-scribe-v2": "ElevenLabs Scribe v2", "elevenlabs-scribe-v2-realtime": "Scribe v2 Realtime",
    "cartesia-ink-2": "Cartesia Ink 2", "groq-whisper-large-v3-turbo": "Whisper turbo on Groq", "together-hosted-asr": "Together (hosted open models)",
    "fireworks-whisper": "Whisper on Fireworks",
    "openai-gpt-realtime-2-1": "OpenAI gpt-realtime-2.1", "openai-gpt-live-1": "OpenAI GPT-Live 1", "gemini-3-8-live": "Gemini 3.8 Live",
    "amazon-nova-2-5-sonic": "Amazon Nova 2.5 Sonic", "xai-grok-voice": "xAI Grok Voice", "azure-voice-live": "Azure Voice Live",
    "nvidia-nemotron-3-5-asr-streaming": "Nemotron 3.5 ASR Streaming", "nvidia-nemotron-3-5-transcribe": "Nemotron 3.5 Transcribe 30B",
    "nvidia-parakeet-tdt-0-6b-v3": "Parakeet TDT 0.6B v3", "nvidia-canary-1b-v2": "Canary 1B v2", "openai-whisper-large-v3": "Whisper large-v3 / turbo",
    "mistral-voxtral-mini-4b-realtime-2602": "Voxtral Mini 4B Realtime", "mistral-voxtral-2507-weights": "Voxtral 2025 weights", "qwen3-asr": "Qwen3-ASR",
    "ibm-granite-speech-5": "IBM Granite Speech 5", "meta-omnilingual-asr": "Meta Omnilingual ASR", "kyutai-stt": "Kyutai STT",
    "microsoft-vibevoice-asr": "Microsoft VibeVoice-ASR", "moonshine-streaming": "Moonshine (on device)", "apple-speechanalyzer": "Apple SpeechAnalyzer (on device)",
    "azure-embedded-speech": "Azure embedded speech (on device)",
}


def money(v):
    if v is None:
        return None
    if v == 0:
        return "free"
    return f"${v:.3f}".rstrip("0") if v < 0.1 else f"${v:.2f}"


def price_label(p):
    """Short 'batch / live' price for a tile; the column header gives the unit."""
    pr, cat = p.get("price") or {}, p["category"]
    b, s = pr.get("batch_usd_per_hour"), pr.get("streaming_usd_per_hour")
    if cat == "speech-to-speech":
        return money(s) if s else "tokens"
    if b is None and s is None:
        return "open" if p["deployment"].get("weights") else "quote"
    return f"{money(b) or '–'} / {money(s) or '–'}"


def deploy(p):
    d = p["deployment"]
    return {"hosted": d.get("hosted") or [], "billing": d.get("billing"), "private": bool(d.get("private")),
            "weights": bool(d.get("weights")), "saas": bool(d.get("saas")), "note": d.get("note") or ""}


def yesno(v):
    return "yes" if v else "no" if v is False else "not stated"


def player(pid):
    p = players[pid]
    di, la = p.get("diarisation") or {}, p.get("languages") or {}
    langs = " / ".join(f"{la[k]} {k}" for k in ("batch", "streaming") if la.get(k)) or ""
    langs = (langs + ". " if langs else "") + (la.get("notes") or "")
    dia = f"Batch {yesno(di.get('batch'))}, live {yesno(di.get('streaming'))}" + (f", +${di['extra_usd_per_hour']:.2f}/hr" if di.get("extra_usd_per_hour") else "")
    return {"id": pid, "name": SHORT.get(pid, p["name"]), "price": price_label(p), "deploy": deploy(p), "status": p.get("status"),
            "notes": p.get("notes", ""), "basis": (p.get("price") or {}).get("unit_note", ""), "data": p.get("data_handling", ""),
            "langs": langs, "dia": dia, "verified": p.get("verified", True)}


def sort_key(p):
    pr = p.get("price") or {}
    return pr.get("batch_usd_per_hour") if pr.get("batch_usd_per_hour") is not None else pr.get("streaming_usd_per_hour") if pr.get("streaming_usd_per_hour") is not None else 9e9


cols = []
for key, label, color, cats in COLUMNS:
    if key == "spec":
        items = [p for p in players.values() if p["category"] == "specialist-api" and p["id"] not in HOSTED_OPEN]
    elif key == "open":
        items = [p for p in players.values() if p["category"] in cats or p["id"] in HOSTED_OPEN]
    elif key in ("azure", "awsgcp"):
        items = [p for p in players.values() if p["category"] in cats and (("Azure" in p["deployment"]["hosted"]) == (key == "azure"))]
    else:
        items = [p for p in players.values() if p["category"] in cats]
    items = sorted((p for p in items if p["id"] not in SKIP), key=sort_key)
    cols.append({"key": key, "label": label, "unit": "$ per audio hour: batch / live", "color": color, "items": [player(p["id"]) for p in items]})

# Price ladder: batch and live list price per audio hour on one log scale.
LADDER = [  # name, batch, live, family
    ("Self-hosted NVIDIA Nemotron (H100 at $4/hr, full load)", 0.001, 0.017, "open"),
    ("Whisper turbo on Groq", 0.04, None, "open"),
    ("Together (hosted Parakeet, Whisper)", 0.09, 0.21, "open"),
    ("Soniox v5", 0.10, 0.12, "spec"),
    ("xAI Grok STT", 0.10, 0.20, "lab"),
    ("Speechmatics Melia 1", 0.12, 0.20, "spec"),
    ("AssemblyAI Universal-2 / Universal-Streaming", 0.15, 0.15, "spec"),
    ("Azure Speech", 0.18, 1.00, "cloud"),
    ("AssemblyAI Universal-3.5 Pro / 3.6 Pro Realtime", 0.21, 0.45, "spec"),
    ("Mistral Voxtral Mini Transcribe 3 / Realtime 3", 0.21, 0.48, "lab"),
    ("ElevenLabs Scribe v2 / v2 Realtime", 0.22, 0.39, "spec"),
    ("Deepgram Nova-3", 0.258, 0.462, "spec"),
    ("OpenAI GPT-Transcribe / GPT-Live-Transcribe", 0.27, 1.02, "lab"),
    ("Gemini 3.5 Transcribe / Live (Vertex)", 0.306, 0.536, "cloud"),
    ("Amazon Transcribe", 0.36, 0.60, "cloud"),
    ("Cartesia Ink 2", None, 0.39, "spec"),
    ("Gladia Solaria-1", 0.30, 0.76, "spec"),
    ("Google Chirp 3", 0.96, 0.96, "cloud"),
    ("Amazon Transcribe Call Analytics", 1.80, 1.80, "cloud"),
    ("OpenAI GPT-Live 1 (speech-to-speech)", None, 3.00, "s2s"),
    ("AWS Transcribe Medical", 4.50, 4.50, "cloud"),
]
ladder = [{"name": n, "batch": b, "live": s, "fam": f} for n, b, s, f in LADDER]

# Contact-centre calculator: list price per hour, and speaker-label support and add-on cost for one-channel audio.
# dia: [batch supported, live supported, batch extra $/hr, live extra $/hr]
CALC = [
    ("Amazon Transcribe", 0.36, 0.60, [True, True, 0, 0], "AWS"),
    ("Azure Speech", 0.18, 1.00, [True, True, 0, 0.30], "Azure"),
    ("Google Chirp 3", 0.96, 0.96, [True, False, 0, 0], "Google Cloud"),
    ("Gemini 3.5 Transcribe (Vertex)", 0.306, 0.536, [True, False, 0, 0], "Google Cloud"),
    ("OpenAI GPT-Transcribe / Live (also in Azure)", 0.27, 1.02, [False, False, 0, 0], "Azure"),
    ("Deepgram Nova-3", 0.258, 0.462, [True, True, 0.12, 0.12], ""),
    ("AssemblyAI Universal-3.5 / 3.6 Pro", 0.21, 0.45, [True, True, 0.02, 0.12], ""),
    ("ElevenLabs Scribe v2", 0.22, 0.39, [True, False, 0, 0], ""),
    ("Speechmatics Melia 1", 0.12, 0.20, [True, True, 0, 0], ""),
    ("Soniox v5", 0.10, 0.12, [True, True, 0, 0], ""),
    ("Self-hosted open models, 3× headroom", 0.003, 0.05, [True, False, 0, 0], "any"),
]
calc = [{"name": n, "batch": b, "live": s, "dia": d, "cloud": c} for n, b, s, d, c in CALC]

# FLEURS error rates for 21 business languages (research pack E, section 8.1): best of seven systems in Microsoft's
# MAI-Transcribe-2 chart (Sep 2026, vendor-run), GPT-Transcribe and Whisper large-v3 from the same chart, Whisper large-v2 from the 2022 paper.
LANGS = [  # language, metric, best, best system, GPT-Transcribe, Whisper v3, Whisper v2
    ("English", "WER", 2.6, "Gemini 3.1 Pro, Scribe v2", 3.2, 4.2, 4.2), ("Spanish", "WER", 2.1, "MAI-Transcribe-2", 2.3, 2.8, 3.0),
    ("French", "WER", 2.8, "MAI-Transcribe-2", 3.7, 5.4, 8.3), ("German", "WER", 2.8, "MAI-Transcribe-2, Gemini 3.1 Pro", 3.2, 4.1, 4.5),
    ("Portuguese", "WER", 2.5, "MAI-Transcribe-2", 3.4, 4.0, 4.3), ("Italian", "WER", 1.1, "MAI-Transcribe-2, Gemini 3.5 Transcribe", 1.9, 2.2, 4.0),
    ("Dutch", "WER", 3.4, "Gemini 3.1 Pro", 4.0, 5.7, 6.7), ("Polish", "WER", 2.0, "MAI-Transcribe-2", 3.3, 4.9, 5.4),
    ("Russian", "WER", 3.1, "MAI-Transcribe-2", 4.3, 5.0, 5.6), ("Turkish", "WER", 3.9, "MAI-Transcribe-2", 4.6, 6.4, 8.4),
    ("Arabic", "WER", 8.7, "MAI-Transcribe-2", 10.3, 14.7, 16.0), ("Hindi", "WER", 3.7, "MAI-Transcribe-2", 6.2, 17.4, 21.5),
    ("Bengali", "WER", 4.8, "MAI-Transcribe-2", 8.9, 46.4, 104.1), ("Indonesian", "WER", 2.5, "MAI-Transcribe-2, Gemini 3.5 Transcribe", 4.5, 6.3, 7.1),
    ("Vietnamese", "WER", 2.9, "Gemini 3.1 Pro", 4.4, 8.9, 10.3), ("Thai", "CER", 3.4, "MAI-Transcribe-2", 5.4, 8.7, 11.5),
    ("Mandarin", "CER", 4.5, "MAI-Transcribe-2", 6.2, 7.0, 14.7), ("Cantonese", "CER", 5.6, "Gemini 3.1 Pro", 7.8, 21.9, None),
    ("Japanese", "CER", 1.8, "MAI-Transcribe-2", 3.9, 5.3, 5.3), ("Korean", "WER", 3.3, "Gemini 3.1 Pro, Scribe v2", 4.0, 4.6, 14.3),
    ("Swahili", "WER", 9.2, "Gemini 3.5 Transcribe", 19.8, 35.4, 39.3),
]
langs = [{"lang": l, "metric": m, "best": b, "who": w, "gpt": g, "v3": v3, "v2": v2} for l, m, b, w, g, v3, v2 in LANGS]

out = {"columns": cols, "ladder": ladder, "calc": calc, "langs": langs}

if (ROOT / "scripts" / "build_speech_pareto.py").exists():
    import sys
    sys.path.insert(0, str(ROOT / "scripts"))
    from build_speech_pareto import build  # kept separate so prices can be rebuilt without the benchmark rows
    out["pareto"] = build(RES, players)

(ROOT / "speech-to-text" / "data.js").write_text("window.SX = " + json.dumps(out, indent=1) + ";\n")
print("players:", sum(len(c["items"]) for c in cols), "ladder:", len(ladder), "calc:", len(calc), "pareto:", list(out.get("pareto", {}).keys()))
