"""Frontier chart views for the speech-to-text session, from research packs C and D.

One board per view, never blended: boards use different audio, normalisers and cost or latency definitions.
Called by build_speech_data.py.
"""
import json
import re

OPEN_HOSTS = ("@ Together", "@ Groq", "@ Replicate", "@ fal", "@ DeepInfra", ", Togetherai", "Together AI")
OPEN_IDS = ("openai-whisper", "nvidia-", "distil-whisper", "mistral-voxtral-mini-4b", "mistral-voxtral-small-24b", "qwen-qwen3-asr", "cohere-transcribe",
            "ibm-granite", "meta-omnilingual", "fal-wizper", "replicate-incredibly")
CLOUD = {"aws": "AWS", "amazon": "AWS", "azure": "Azure", "microsoft": "Azure", "google": "GCP"}
LAB = ("openai", "mistral", "xai", "meta", "alibaba", "stepfun", "cohere", "thinkingmachines", "krafton")
PRIVATE = ("deepgram", "assemblyai", "speechmatics", "gladia", "cartesia", "elevenlabs", "rev-ai")
AZURE_OPENAI = ("openai-gpt-transcribe", "openai-gpt-4o-transcribe", "openai-gpt-4o-mini-transcribe", "openai-gpt-live-transcribe", "openai-gpt-realtime-whisper", "openai-whisper-large-v2")


def family(sid, name, stype):
    if stype == "open-model" or any(h in name for h in OPEN_HOSTS) or sid.startswith(OPEN_IDS):
        return "open"
    if sid.split("-")[0] in CLOUD or sid.startswith("google"):
        return "cloud"
    if sid.startswith(LAB):
        return "lab"
    return "spec"


def deploy(sid, name, fam):
    hosted = []
    head = sid.split("-")[0]
    if head in CLOUD and not any(h in name for h in OPEN_HOSTS):
        hosted.append(CLOUD[head])
    if sid.startswith(AZURE_OPENAI) and "@" not in name:
        hosted.append("Azure")
    weights = fam == "open"
    private = sid.startswith(PRIVATE)
    note = ""
    if any(h in name for h in OPEN_HOSTS):
        note = "Open weights, here priced on a third-party host."
    if "Telnyx" in name:
        note = "Priced through Telnyx's resale of the model."
    return {"hosted": hosted, "billing": None, "private": private, "weights": weights, "saas": not hosted and not weights, "note": note}


VENDOR = {"deepgram": "Deepgram", "assemblyai": "AssemblyAI", "elevenlabs": "ElevenLabs", "gladia": "Gladia", "reson8": "Reson8", "google-chirp": "Google",
          "soniox": "Soniox", "inworld": "Inworld", "modulate": "Modulate", "cartesia": "Cartesia", "microsoft-mai": "Microsoft", "openai-gpt": "OpenAI", "stepfun": "StepFun"}


def clean(name, sid=""):
    v = next((v for k, v in VENDOR.items() if sid.startswith(k)), None)
    if v and v.lower() not in name.lower():
        name = v + " " + name
    for a, b in ((" @ Microsoft AI", ""), (" @ Google", ""), (" @ SpaceXAI", ""), (" @ Meta", ""), (" @ AssemblyAI", ""), (" @ Mistral", ""),
                 (" @ Microsoft Azure", ""), (" @ Alibaba Cloud", ""), (" @ Smallest.ai", ""), (" @ Amazon Bedrock", " (Bedrock)"), (", OpenAI", ""), (", Google", ""),
                 (", Alibaba", ""), (", Gladia", ""), (", StepFun", ""), (", Sarvam", ""), (", Reson8", ""), (", NVIDIA", ""), (", Togetherai", ""), (", Thinking Machines", "")):
        name = name.replace(a, b)
    return name


def build(res, players):
    scores = json.loads((res / "C-scores.json").read_text())
    lat = json.loads((res / "D-latency.json").read_text())

    def rows(bench):
        return [r for r in scores if r["benchmark"] == bench and r["score"] is not None]

    def point(r, x, basis, suffix=""):
        f = family(r["system_id"], r["system_name"], r["system_type"])
        return {"id": r["system_id"] + suffix, "name": clean(r["system_name"], r["system_id"]), "family": f, "deploy": deploy(r["system_id"], r["system_name"], f),
                "cost": x, "score": round(r["score"], 2), "n": 1, "costBasis": basis}

    # Batch: Artificial Analysis AA-WER v2 against list price, converted from $ per 1,000 minutes to $ per audio hour.
    batch = [point(r, round(r["cost_per_1k_minutes_usd"] * 0.06, 4), "List price per audio hour, from Artificial Analysis's normalised price.", f"-b{i}")
             for i, r in enumerate(rows("Artificial Analysis Speech to Text: AA-WER v2 (non-streaming)")) if r["cost_per_1k_minutes_usd"]]

    # Live: the same board's streaming index, against price and against time to final transcript.
    live = rows("Artificial Analysis Speech to Text: AA-WER Streaming Index (final transcript)")
    live_price = [point(r, round(r["cost_per_1k_minutes_usd"] * 0.06, 4), "List price per audio hour, from Artificial Analysis's normalised price.", f"-p{i}")
                  for i, r in enumerate(live) if r["cost_per_1k_minutes_usd"]]
    live_lat = [point(r, r["latency_ms"], "Mean time from the end of speech (after a voice detector) to the final transcript, network included.", f"-l{i}")
                for i, r in enumerate(live) if r["latency_ms"]]

    # Pipecat: semantic WER against median and 95th-percentile time to final segment (pack D rows carry both values).
    pip = [r for r in lat if r["source"].startswith("Pipecat") and r["accuracy"] is not None]

    def pip_point(r, i):
        sid = (r["vendor"] + "-" + r["system_id"]).lower().replace(" ", "-")
        f = family(sid, r["system_name"], "api")
        name = r["vendor"] + " " + r["system_name"] if r["vendor"].lower() not in r["system_name"].lower() else r["system_name"]
        return {"id": f"pc{i}", "name": name, "family": f, "deploy": deploy(sid, name, f), "cost": r["latency_ms"], "score": r["accuracy"], "n": 1,
                "costBasis": f"{r['percentile'].upper()} time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."}
    pip50 = [pip_point(r, i) for i, r in enumerate(pip) if r["percentile"] == "p50"]
    pip95 = [pip_point(r, i) for i, r in enumerate(pip) if r["percentile"] == "p95"]

    # Open models: Open ASR Leaderboard English average against GPU cost at full load, from measured throughput (RTFx).
    # $ per 1,000 audio hours = 1,000 h / RTFx GPU-hours at $4 per GPU-hour.
    opn = [point(r, round(4000 / r["rtfx"], 4), f"Our estimate: GPU time at the measured throughput ({r['rtfx']:,.0f}× real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks.")
           for r in rows("HF Open ASR Leaderboard — short-form English (default average)") if r["rtfx"] and r["system_type"] == "open-model"]
    for p in opn:
        p["name"] = re.sub(r" \(fast-gpu-asr[^)]*\)", " (fast)", p["name"].split("/")[-1]).replace("-hf", "")
        p["deploy"] = {"hosted": [], "billing": None, "private": False, "weights": True, "saas": False, "note": "Open weights, run in the client's own environment."}
        p["family"] = next((v for k, v in (("nvidia", "nvidia"), ("whisper", "whisper"), ("qwen", "qwen"), ("ibm", "ibm"), ("mistral", "mistral")) if k in p["id"]), "other")

    return {
        "batch": {"views": [
            {"label": "Artificial Analysis, batch", "points": batch, "metric": "AA-WER v2, % (lower is better)",
             "method": "Independent · held-out voice-agent, parliament and earnings-call audio · read 3 Nov 2026"},
        ]},
        "live": {"views": [
            {"label": "Price", "points": live_price, "metric": "AA-WER streaming, % (lower is better)", "x": "price",
             "method": "Independent · Artificial Analysis streaming board · final transcripts · 3 Nov 2026"},
            {"label": "Time to final", "points": live_lat, "metric": "AA-WER streaming, % (lower is better)", "x": "ms",
             "method": "Independent · Artificial Analysis · mean time to final after a voice detector marks end of speech"},
            {"label": "Pipecat, median", "points": pip50, "metric": "Semantic WER, % (lower is better)", "x": "ms",
             "method": "Daily / Pipecat (being acquired by Deepgram) · 1,000 voice-agent turns · median · 1 Oct 2026"},
            {"label": "Pipecat, slowest 5%", "points": pip95, "metric": "Semantic WER, % (lower is better)", "x": "ms",
             "method": "Daily / Pipecat · same runs · 95th-percentile time to final"},
        ]},
        "open": {"views": [
            {"label": "Open ASR Leaderboard", "points": opn, "metric": "Mean WER on 9 English sets, % (lower is better)", "yMax": 10.5,
             "method": "Independent · Hugging Face Open ASR Leaderboard · open models with measured throughput · 2 Nov 2026"},
        ]},
    }
