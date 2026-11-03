# C. Speech-to-text benchmarks: who runs them, what they measure, and what they say (as of 2026-11-03)

Research for "At The Frontier, Session 03: Speech to text". Every number was read on 2026-11-03 from a primary source:
- a leaderboard data file or the data embedded in the page: the Hugging Face Space's Gradio config, Artificial Analysis's page JSON, GitHub READMEs;
- a vendor benchmark page or model card;
- an arXiv paper.

Values that are not plain published numbers are marked in the row notes:
- **researcher-computed**: mostly prices converted from $/hour to $/1,000 minutes (×1000/60);
- **digitised from chart**: a handful of rows, about ±3%;
- **reproduced by a third party**: kept out of the rows wherever a primary source existed. AssemblyAI's benchmarks page reprints the Coval, Cekura, Pipecat and AA streaming boards; we took those from their own URLs.

Machine-readable rows are in `C-scores.json`, in the same folder. It has 5,476 rows:
- 590 carry a cost per 1,000 minutes, 954 carry a latency, and 1,914 are independent.
- Four human-baseline rows use `system_type: "human"`, which is outside the enum on purpose. Filter them out if the chart code is strict.

Families used throughout:
- **english-batch**: English WER on pre-recorded audio (read, meeting, accented, conversational).
- **composite**: a weighted index across several sets (AA-WER v2).
- **streaming**: WER measured on a live stream (final or partial transcripts).
- **latency**: latency-only rows (time to final, time to first token, emission latency).
- **multilingual**: per-language or averaged WER/CER on FLEURS, Common Voice, MLS and similar sets.
- **long-form**: full-length files (CORAAL, Rev16, TED-LIUM long-form).
- **noisy-phone**: added noise, codecs, far-field and real phone calls.
- **domain**: finance (Earnings21/22, SPGISpeech), medical (PriMock57 and others), entity accuracy.
- **diarisation**: DER, cpWER, tcpWER, speaker counting.

One rule for reading the JSON: **a frontier is only meaningful inside one board**, meaning one `benchmark` + `run_by` + `date`. The same model gets very different numbers from different boards:
- ElevenLabs Scribe v2 scores 2.18% on AA-WER, 6.02% on the Open ASR average and 40.7% DER on VoiceArena.
- Soniox v5's "time to final" is 260 ms on Pipecat, 54 ms on Coval, 38 ms on Cekura and 54 ms on AA.

---

## 0. Executive summary

1. **English batch accuracy is now a two-to-three-point game.**
   - **Open ASR Leaderboard** (Hugging Face, 63 systems, 9 English sets): Zoom Scribe v2.1 Pro leads at 4.87% mean WER, Whisper large-v3 scores 8.18% and the median is 6.99%.
   - **AA-WER v2** (Artificial Analysis, 62 models): Alibaba Fun-Realtime-ASR-preview leads at 1.73%, Microsoft MAI-Transcribe-2 is 2.04% and Whisper large-v3 is 4.07%.
   - Within two points of the leader sit 27 of 62 models on AA and 23 of 63 on Open ASR. On both boards Whisper large-v3, the 2023 default, is now in the bottom half.
2. **The main independent cost-vs-quality board shows that price buys almost nothing above about $3 per 1,000 minutes.** On Artificial Analysis's batch board (59 priced endpoints), the cost frontier runs:
   - StepAudio 2.5 ASR: 4.67% at $0.37
   - Modulate VFast: 4.23% at $0.42
   - Voxtral Mini on DeepInfra: 3.84% at $1.00
   - Soniox v5 Async: 3.81% at $1.66
   - **MAI-Transcribe-2: 2.04% at $1.67**
   - Fun-Realtime-ASR-preview: 1.73% at $2.82

   Nothing more expensive is more accurate. The median list price is $4.00. Speechmatics Enhanced ($12.50, 4.05%), Gladia Solaria-3 ($10.16, 3.23%), Gemini 3.1 Pro High ($18.15, 2.82%) and Google Chirp 3 ($16.00, 4.32%) are all dominated, several of them by MAI-Transcribe-2 at a tenth of the price.
3. **Real-time is a separate market with its own frontier, and that frontier has moved fast.** On AA's streaming board (47 configurations):
   - **Accuracy vs latency.** The frontier runs from Deepgram Flux (7.39% WER, 21 ms to final) through Soniox v5 (4.50%, 54 ms) and ElevenLabs Scribe v2 Realtime (2.96%, 78 ms) to MAI-Transcribe-2-Streaming (2.51%, 128 ms).
   - **Accuracy vs price.** The frontier runs from Modulate ($0.83, 4.77%) through Inworld ($1.39, 3.79%), Meta Muse ($3.00, 3.06%) and Grok Voice Transcribe 2.0 ($3.33, 2.79%) to MAI-T2 Streaming ($9.00, 2.51%).
   - **The gap to batch is small for the best models.** MAI-T2 is 2.04% batch and 2.51% streaming; Scribe v2 is 2.18% and 2.96%.
4. **Streaming latency numbers cannot be compared across boards.** Four independent or semi-independent streaming boards publish "time to final", and each defines end of speech differently (section 3c). They agree on who is slow: Google Chirp, AWS, Azure, OpenAI's gpt-4o-transcribe family, and xAI on Pipecat. They do not agree on milliseconds or on the accuracy order:
   - Pipecat: Meta Muse is the top WER (0.73% semantic WER).
   - Coval: AssemblyAI U-3.6 Pro is top (1.92%).
   - Cekura: Fish Audio is top (2.21%), and on its 8 real phone calls AssemblyAI U-3.6 Pro ranks 14th of 19.
5. **Clean-set scores overstate real-world accuracy by about 4×.** The Open ASR Leaderboard's private Appen and DataoceanAI sets are maintainer-run, never published and so cannot be trained on. Scripted speech scores 2.1–15% WER, while conversational speech scores 11.6–25.6%. The best conversational score is 11.61% (Zoom Scribe v2.1 Pro). Pooled real-call telephony is still thin:
   - Cekura has 8 recordings and says 15 systems are statistically tied on them.
   - Coval has a FLEURS-based phone-codec condition, where AssemblyAI U-3.6 Pro leads at 2.69%.
   - We found no independent 8 kHz contact-centre leaderboard.
6. **The two big independent batch boards only partly agree.** Across the 15 systems on both, the Spearman rank correlation of AA-WER with the Open ASR average is 0.51 (researcher-computed).
   - Voxtral Small: 2.77% on AA (top 11) but 7.35% on Open ASR (36th of 63).
   - Reson8 Resonant-1: 3.39% on AA but 6.03% and 7th on Open ASR.

   The datasets differ: AA weights its private voice-agent set at 50%, while Open ASR mixes meetings, finance, noise and Indian-accented conversation. The normalisers differ too.
7. **Multilingual: the frontier is now Microsoft, Google, Mistral and ElevenLabs, and the vendor charts disagree on the order.**
   - **Microsoft's chart** (FLEURS, 60 languages, forced language): MAI-Transcribe-2 5.2%, Gemini 3.1 Pro 5.3%, Scribe v2 6.2%, GPT-Transcribe 10.4%, Whisper large-v3 22.8%.
   - **Mistral's chart** (FLEURS, 45 languages): Voxtral Small Transcribe 3 and MAI-T2 tie at 4.0%, and GPT Transcribe scores 5.6%.
   - **Open ASR's independent 7-language tab**: Scribe v2 leads at 3.56%, Azure Speech scores 4.14% and GPT Transcribe 4.36%.

   **Hindi** is where systems split: 3.7% for MAI-T2 on FLEURS versus 17.4% for Whisper. On conversational Hindi (Open ASR, lattice-scored) the range is 7.2–41.6%. **Swahili** is still 9–20% for frontier APIs and 35% for Whisper.
8. **Diarisation is the least mature board family, and its scoring choices move the numbers about 3×.**
   - **VoiceArena Diarization-Bench v1** (independent, no collar, overlap scored) puts NVIDIA's open Nemotron 3 Diarization first at 14.7% DER, then DiariZen at 19.3% and pyannoteAI Precision-3 at 20.6%.
   - The ASR APIs' built-in speaker labels score 40–67% there: Scribe v2 40.7%, AssemblyAI U-3.5 Pro 44.6%, Deepgram Nova-3 67.1%.
   - On AssemblyAI's own chart (0.25 s collar, overlap not scored), AssemblyAI scores 12.2%.
   - No diarisation board publishes cost.
9. **Every vendor chart puts the vendor first, but the better ones show losses too.**
   - AssemblyAI's 2026 benchmarks page compares 13 batch rivals and 26 real-time configurations, and it loses several of its own tables: Scribe v2 wins verbatim English, accented English, cpWER and multilingual; Meta Muse wins real-time medical, long-form and streaming DER; Gemini 3.5 Live wins real-time FLEURS.
   - Deepgram's Nova-3 launch claims a "54% lower" streaming WER than an unnamed competitor. Independent boards place Nova-3 mid-pack on accuracy (5.18% AA-WER, 11th of 14 on AssemblyAI's page) but near the top on speed and latency.
10. **Medical and finance have usable independent data, but no cost-bearing board.**
    - **PriMock57** (Omi Health, 55 UK mock GP consultations, 42 models): Gemini 3 Pro has the lowest medical-term error at 1.37%. Scribe v2 is 2.54%, AssemblyAI U-3 Pro Medical 2.83%, Deepgram Nova-3 Medical 3.17% and GPT-4o Transcribe 7.87%.
    - **Earnings calls:** AA's Earnings22-Cleaned and Open ASR's Earnings21/22 columns cover finance. The best full-call WER is about 6% on Open ASR long-form (Scribe v2: 6.19% on Earnings21).
11. **Recommendation (section 9).** Three frontiers can be drawn credibly from independent data, and a fourth comes with a health warning:
    - (a) batch WER vs price on **Artificial Analysis non-streaming**;
    - (b) streaming WER vs time-to-final, and WER vs price, on **Artificial Analysis streaming**, cross-checked against Pipecat and Coval but never overlaid on them;
    - (c) open-model WER vs throughput (RTFx) on the **Open ASR Leaderboard**;
    - (d) with care, streaming WER vs price vs latency on **Cekura**, the only non-AA streaming board with prices. Its real-call set is small.

---

## 1. Benchmark index

| Benchmark | Run by | Independent? | Family | Size | Metric | Latest version / date | Saturated? | Cost? | Latency? |
|---|---|---|---|---|---|---|---|---|---|
| **Artificial Analysis STT, non-streaming (AA-WER v2)** | Artificial Analysis | Yes (sells no STT) | composite + english-batch + domain | ~8 h: AA-AgentTalk 469 clips (~250 min, private), VoxPopuli-Cleaned-AA 628 clips (~119 min), Earnings22-Cleaned-AA 6 calls (~115 min) | WER, 50/25/25 weighting, Whisper normaliser plus AA additions (v2.2) | Live, read 2026-11-03; 63 endpoints, 62 models with a score | Near the top (1.7–2.5 for the top 7) | **Yes**: $/1k min, normalised | Speed factor (audio s ÷ API response s, includes network) |
| **Artificial Analysis STT, streaming** | Artificial Analysis | Yes | streaming + latency | Same 3 sets, real-time 20 ms chunks | Final-transcript WER; WER at first partial after end of speech | Live, read 2026-11-03; 47 configs | No (2.5–10.1) | **Yes** | **Yes**: time to final and time to first partial after SileroVAD end of speech |
| **HF Open ASR Leaderboard**: short-form English, multilingual, long-form, private | Hugging Face (hf-audio) with NVIDIA and others (arXiv 2510.06961) | Yes (maintainers run open models on H200; APIs run by maintainers or contributors) | english-batch, noisy-phone, domain, multilingual, long-form | English: 9 sets incl. 2 private (Appen, DataoceanAI) + URGENT24 noise + Voice Arena en-IN. Multilingual: 7 default languages (+ Armenian). Long-form: Earnings21/22, CORAAL (317 h) | Macro-average WER; RTFx | Version 02-11-2026 (LibriSpeech dropped from default average) | LibriSpeech yes (dropped); others no (4.9–17.5) | No | RTFx (throughput, open models only) |
| **Pipecat STT Benchmark** | Daily / Pipecat | Semi (Deepgram says "Daily + Pipecat are joining Deepgram") | streaming + latency | 1,000 voice-agent turns (smart-turn v3.1); Gemini references, human-reviewed | Semantic WER (Claude Sonnet 5.5 judge), pooled and mean | README commit 2026-10-01; 24 services | Yes at top (0.7–1.4 for most) | No (Soniox reprints prices) | **Yes**: TTFS median/P95/P99 = final segment arrival − speech end |
| **Coval STT Benchmarks** | Coval | Yes (sells voice-agent eval, not STT) | streaming, latency, noisy-phone | stt-v3 897 Pipecat clips; WildASR (FLEURS-based) clean / accent 845 / clipping / far-field / noise-gap / phone-codec 284 each | WER (Whisper normaliser, corpus-pooled since 2026-09-09) | Live 24 h window + 30-day per-dataset | No | No | **Yes**: TTFS p50 (end of speech or force-finalize → final); TTFT (audio t0 → first token) |
| **Cekura Converse-STT** | Cekura (with Ocular) | Semi (sells voice-agent testing) | streaming, latency, noisy-phone | 1,000 Pipecat clips + 8 licensed real phone recordings | WER | 2026-09-16 (prices to 2026-10-28); 19 systems | No | **Yes** ($/h, converted) | **Yes**: TTFS and TTFT medians over 206 real-call turns |
| Picovoice speech-to-text-benchmark | Picovoice | Vendor | english-batch, streaming, multilingual, latency | LibriSpeech, TED-LIUM, CV, MLS, VoxPopuli, FLEURS; 8 languages | WER/CER; word emission latency | 2026-10-07 | Read speech yes | No | Word emission latency (100 LibriSpeech files) |
| **Omi Health medical STT (PriMock57)** | Omi Health | Semi (sells a medical scribe; own model not listed) | domain (medical) | 55 UK mock GP consults, ~80.5k words | WER, medical-term WER, drug WER | 2026-04-29; 42 models | No | No | No |
| German medical anamnesis | Academic (arXiv 2601.19945) | Yes | domain | Simulated German consults incl. dialects | WER | 2026-01 | No | No | No |
| **VoiceArena Diarization-Bench v1** | Voice Arena | Yes (early results) | diarisation | 139 sessions, 22 h, 2–8 speakers, human-verified RTTM | DER at 0 and 250 ms collar, overlap scored; cpWER track | Live, read 2026-11-03; 15 + 14 systems | No | No | No |
| ETH Zurich diarisation benchmark | ETH Zurich (arXiv 2509.26177) | Yes | diarisation | CALLHOME, VoxConverse, AMI, AliMeeting; 196.6 h | DER, 0.25 s collar | 2025-09-30 | No | No | RTF |
| pyannote / pyannoteAI benchmarks | pyannoteAI | Vendor | diarisation | 10 DIHARD III domains + AMI, AISHELL-4, AliMeeting, NOTSOFAR, etc. | "Full" DER (no collar, overlap scored); tcpWER | 2026-09-17 / 09-22 | No | No | Streaming board (Live-1) |
| NVIDIA Sortformer / Nemotron 3 Diarization cards | NVIDIA | Vendor | diarisation | DIHARD III, CALLHOME, AMI, AliMeeting, NOTSOFAR | DER (0 or 0.25 s collar) | 2026-09-01 | No | No | **Yes**: DER vs input-buffer latency 0.32–30.4 s; RTFx |
| AssemblyAI benchmarks page | AssemblyAI | Vendor (but loses tables) | everything | Batch: 10 clean + 17 verbatim sets, 13 rivals. Real-time: 26 configs, voice-agent 12,460 clips | WER, entity error, DER (0.25 s collar, no overlap), cpWER | Batch 2026-10-14; real-time v2026.09 | Partly | No | Emission latency, time to complete turn (docs) |
| Other vendor pages: Gladia, Soniox, Deepgram, Mistral, Microsoft MAI, NVIDIA, Qwen, Meta Omnilingual, OpenAI Whisper | each vendor | Vendor | various | various | various | 2022-12 → 2026-10-28 | FLEURS high-resource yes | Soniox (reprint), MAI ($1.67/1k) | Voxtral delay curve, Soniox TTFS |
| Human baselines: Switchboard / CallHome | Microsoft 2016, IBM 2017 | Semi (vendor research) | english-batch (telephone) | Hub5 2000 | WER | 2016–2017 | Machines at parity on SWB | No | No |

---

## 2. Batch English accuracy

### 2a. Artificial Analysis non-streaming (the main independent Pareto source)

- **Source:** https://artificialanalysis.ai/speech-to-text/non-streaming; methodology at https://artificialanalysis.ai/methodology/speech-to-text. Exact values come from the page's embedded JSON, 63 host-model records.
- **Method:**
  - Each provider's batch API is called directly, with network time included.
  - Where prompts are allowed, the prompt is "Transcribe the audio verbatim, outputting only spoken words in sequence."
  - Normalisation is Whisper's normaliser plus AA's v2.2 additions (apostrophes, signed percentages, decimals, hyphens, code and URL tokens).
  - Earnings22 is sent as full calls unless an API forces chunking: first about 9-minute chunks, then about 30-second chunks.
  - Price is AA's normalised $/1,000 minutes. Token-billed and subscription plans are converted. A listed price of $0 (Cohere, NVIDIA's Parakeet v2 endpoint, Qwen3.5 Omni) is stored as null.
- **Leaders (AA-WER %):**

  | System | AA-WER % | $/1k min | Speed factor |
  |---|---|---|---|
  | Fun-Realtime-ASR-preview (Alibaba) | 1.73 | $2.82 | 21× |
  | MAI-Transcribe-2 | 2.04 | $1.67 | 322× |
  | Voxtral Small Transcribe 3 | 2.09 | $4.00 | |
  | Scribe v2 | 2.18 | $3.67 | |
  | Voxtral Mini Transcribe 3 | 2.22 | $3.50 | |
  | Grok Voice Transcribe 2.0 | 2.29 | $1.67 | |
  | MAI-Transcribe-1.5 | 2.38 | | |
  | StepAudio 3 ASR | 2.50 | | |
  | Gemini 3.5 Transcribe | 2.60 | | |
  | Zoom Scribe V2 Pro | 2.75 | | |
  | Voxtral Small (open) | 2.77 | | |
  | Nemotron 3.5 Transcribe (open, NVIDIA endpoint) | 2.81 | | |
- **Mid-pack:** AssemblyAI U-3.5 Pro 2.99, Gladia Solaria-3 3.23, GPT Transcribe 3.31, GPT-4o Transcribe 3.96, Speechmatics Enhanced 4.05, Whisper large-v3 4.07 (fal.ai), Deepgram Nova-3 5.18, Rev AI 5.92.
- **Tail:** Google Chirp (v1) 31.2, which fails VoxPopuli at 99.5%.
- **Frontier shape (WER vs price):** a sharp knee at $1.67–$2.82 (section 0, point 2). Below $1 you give up about 2 points (StepAudio 2.5 at $0.37 scores 4.67). Above $3 nothing improves.
- **Frontier shape (WER vs speed factor):** Parakeet v3 on Together (634×, 4.55) → Reson8 (344×, 3.39) → MAI-T2 (322×, 2.04) → Fun-Realtime (21×, 1.73). MAI-T2 is unusual: near the top on accuracy, price and speed at once.
- **Same model, different host:**
  - Whisper large-v3 scores 4.07 on fal.ai, 4.53 on Together and 10.06 on Replicate. The Replicate run collapses on Earnings22 (29.2%).
  - Nova-3 scores 5.18 direct and 4.82 via Telnyx.

  Plot hosts as separate points, or use AA's representative (best-WER) host only.

### 2b. Hugging Face Open ASR Leaderboard

- **Source:** https://huggingface.co/spaces/hf-audio/open_asr_leaderboard, version 02-11-2026. Values were read from the Space's Gradio config (embedded dataframes). The underlying HF datasets are private.
- **Paper:** Srivastav et al., arXiv 2510.06961.
- **Method:**
  - Open models run on H200s. RTFx = audio seconds ÷ compute seconds; APIs have no RTFx.
  - The default English average covers AMI-Cleaned, Earnings22-Cleaned-AA-chunked, GigaSpeech-Cleaned, SPGISpeech, URGENT24 (noise + reverb), Voice Arena Monsoon (Indian-accented conversation), VoxPopuli-AA-Cleaned, and the private Appen + DataoceanAI scripted and conversational sets.
  - LibriSpeech clean/other were dropped on 2026-11-02, so the board itself now treats them as saturated.
- **English leaders (mean WER %):** Zoom Scribe v2.1 Pro 4.87, Otter speech-v3.1 5.25 (public sets contributor-reported), p99lab audrey-0.7 5.67, Azure Speech (07-2026) 5.70, Modulate multilingual 5.89, ElevenLabs Scribe v2 6.02.
  - **Best open model:** Nemotron 3.5 Transcribe 30B-A4B at 6.10 (RTFx 473), then Qwen3-ASR-1.7B at 6.14 (RTFx 836).
  - Whisper large-v3 8.18; Gemma 4 E4B 12.96; Niagara 9M 17.47.
- **Throughput frontier (open models):** futo asr4all-s (40,786×, 13.6) → Zipformer XL greedy (24,659×, 9.6) → Granite Speech 5.0 470M Turbo-CTC (21,435×, 7.34; nc variant 21,082×, 6.91) → Parakeet TDT 0.6B v2 with fast-gpu-asr (17,254×, 6.88) → TheWhisper large-v3-turbo (1,184×, 6.71) → Qwen3-ASR-1.7B (836×, 6.14) → Nemotron 3.5 Transcribe (473×, 6.10). A 0.6B model at 17,000× real time is within 0.8 points of a 30B model.
- **Private data (Appen + DataoceanAI, never released):**
  - Scripted range: 2.12 (Azure) to 15.2.
  - Conversational range: 11.61 (Zoom Scribe v2.1 Pro) to 25.6.
  - The private-only ranking puts Qwen3-ASR-1.7B (open) 5th, ahead of Otter, AssemblyAI and ElevenLabs.
- **Noise (URGENT24):** 6.63 (Zoom) to 29.5.
- **Long-form tab** (Earnings21, Earnings22 full calls, CORAAL; 14 systems): Scribe v2 8.44, Reson8 9.74, freetranscribe parakeet-ft-v1 9.81, Nemotron 3.5 10.52, AssemblyAI U-3.5 Pro 10.76, GPT Transcribe 12.10, Whisper large-v3 13.10. CORAAL (African American Language interviews) is the hardest column at 9.45–17.95.

### 2c. Where the two batch boards agree and disagree

- **They agree** that the 2026 frontier is MAI, ElevenLabs, Mistral, Zoom, Google and AssemblyAI. They also agree that Whisper large-v3 and Parakeet v2 are now mid-to-low, and that Deepgram Nova-3 is a speed and price product rather than an accuracy leader.
- **They disagree on the order** (Spearman 0.51 over 15 shared systems). The main causes:
  - AA weights its private AgentTalk set at 50%, while Open ASR has no voice-agent set.
  - The two boards use different normaliser revisions.
  - Some systems appear on only one board: Open ASR has Zoom Scribe v2.1 Pro, while AA has Zoom Scribe V2 Pro.
  - Open ASR's set includes the Indian-accent and noise sets, which hurt Voxtral Small (URGENT24 12.35, AMI 13.19).

---

## 3. Streaming and latency

### 3a. Artificial Analysis streaming

- **Source:** https://artificialanalysis.ai/speech-to-text/streaming (47 configurations).
- **Method:**
  - Audio is streamed in real time in 20 ms chunks.
  - SileroVAD marks end of speech, and AA sends a force-endpoint signal where the API supports one. Otherwise it uses the first natural final within 2 s.
  - **Time to Final** runs from the wall-clock moment the audio up to end of speech has been streamed (and the endpoint sent) to the next Final transcript.
  - **Time to First Partial** runs to the first Partial after that point.
  - Network time is included. Latency is sample-weighted; WER is duration-weighted.
- **Leaders (final-transcript WER, time to final, price):**

  | System | WER % | Time to final | $/1k min |
  |---|---|---|---|
  | MAI-Transcribe-2-Streaming | 2.51 | 128 ms | $9.00 |
  | Grok Voice Transcribe 2.0 | 2.79 | 247 ms | $3.33 |
  | Gemini 3.5 Transcribe Live | 2.89 | 359 ms | $9.00 |
  | ElevenLabs Scribe v2 Realtime | 2.96 | 78 ms | $6.50 |
  | Meta Muse Voice Transcribe | 3.06 | 163 ms | $3.00 |
  | Cartesia Ink-2 / Ink Preview | 3.16–3.25 | 136–427 ms (depends on endpointing mode) | $4.00 |
- **Fastest:** Deepgram Flux 21 ms (7.39%), AssemblyAI Universal Streaming English 34 ms (8.18%), Soniox v5 54 ms (4.50%), Nemotron 3 ASR (80 ms setting) on Together 70 ms (7.03%).
- **Slow:** Gladia Solaria-1 Realtime 1,523 ms, Chirp 3 Streaming 1,186 ms, Voxtral Mini Realtime 3 (960 ms setting) 1,119 ms, GPT Live Transcribe 857 ms ($17).
- **Partial vs final.** For voice agents the first partial after end of speech matters. Some models' partials are much worse than their finals:
  - Sarvam Saaras v4: 12.3% partial vs 3.5% final.
  - Qwen3 ASR Flash Realtime: 17.5% vs 3.8%.
  - Grok 1.0: 18.3% vs 3.9%.
  - AssemblyAI, Soniox, Deepgram, Zoom and Inworld show partial ≈ final, which suggests they finalise quickly or emit only finals.

### 3b. Other streaming boards (summarised from the streaming fork; rows in JSON)

- **Pipecat STT Benchmark** (github.com/pipecat-ai/stt-benchmark, 2026-10-01).
  - **Metric:** semantic WER judged by Claude Sonnet 5.5. TTFS = final segment arrival − (VAD stop − stop_secs).
  - **Best pooled WER:** Meta Muse 0.73% (median TTFS 392 ms, P95 1,292 ms), xAI Grok 2.0 0.79% (1,322 ms), AssemblyAI U-3.6 Pro 0.80%.
  - **Fastest median:** Nemotron 3.0 ASR 221 ms, Deepgram Nova-3 247 ms, Soniox v4 249 ms.
  - The README says gaps under about 0.25 pp at the top are inside the 95% CI. Two NVIDIA rows were still scored by the previous judge.
- **Coval** (benchmarks.coval.ai/stt, live 24 h window).
  - **Best WER:** AssemblyAI U-3.6 Pro 1.92%, U-3.5 Pro 2.03%, Reson8 global 2.06%.
  - **Fastest TTFS p50:** Baseten Qwen3-ASR 21 ms, Reson8 36 ms, Soniox v5 54 ms.
  - **Per condition:** U-3.6 Pro leads phone codec (2.69%), clipping, far-field and accent. Gemini 3.5 Live leads stt-v3.
  - The board changed from averaging per-clip WER to pooling errors on 2026-09-09, so earlier snapshots are not comparable.
- **Cekura Converse-STT** (benchmarks.cekura.ai/stt, 2026-09-16).
  - Overall WER leaders: Fish Audio 2.21% ($6.00/1k), Nemotron 3.5 Transcribe 2.28% (batch), Reson8 2.38% ($2.00).
  - Fastest TTFS: Soniox v5 38 ms, Inworld 41 ms, AssemblyAI U-3.6 91 ms.
  - On the 8 real calls, GPT-4o Transcribe scores 12.45% and Inworld 10.6% (against 2.72% on clean clips).
- **Picovoice** (vendor).
  - Word emission latency: AWS 290 ms, Nemotron 3.5 streaming 450 ms, Azure 520 ms, Cheetah 560 ms, Google 830 ms.
  - English streaming WER on read speech: AWS 5.3%, Azure 5.9%.
  - No Deepgram, AssemblyAI or Soniox, so it is of limited use in 2026.
- **AssemblyAI docs** (vendor).
  - Emission latency P50: 317 ms.
  - "Time to complete turn", which includes turn detection: 568–649 ms.
  - The docs warn that some providers "game" time-to-first-token by emitting before speech.

### 3c. Latency definitions you must not mix

| Board | Name | Start of timer | End of timer | Statistic |
|---|---|---|---|---|
| Artificial Analysis | Time to Final Transcript | Wall clock after audio through SileroVAD end of speech has been streamed and the force-endpoint sent | First Final transcript | Sample-weighted mean |
| Artificial Analysis | Time to First Partial | Same | First Partial | Mean |
| Pipecat | TTFS | VAD stop time − stop_secs (≈ true speech end) | Final TranscriptionFrame | Median, P95, P99 |
| Coval | TTFS | End of streamed speech or force-finalize | Final transcript | p50 (avg on site) |
| Coval | TTFT | Audio t0 | First token (handshake excluded) | p50 |
| Cekura | TTFS / TTFT | End of speech / start | Final / first text, provider's own finalisation | Median over 206 real-call turns |
| Picovoice | Word emission latency | End of each spoken word | Word emitted | Mean |
| AssemblyAI docs | Time to complete turn | End of turn | Final transcript incl. turn detection | P50 |

The same Soniox v5 is 260 / 54 / 38 / 54 ms on Pipecat / Coval / Cekura / AA, and Deepgram Nova-3 is 247 / 92 / 103 ms on the first three. Choose one board for a latency chart and say which.

---

## 4. Multilingual

- **Independent: Open ASR multilingual tab** (7-language macro average; language forced for all models).
  - Scribe v2 3.56, Azure Speech 4.14, GPT Transcribe 4.36, AssemblyAI U-3.5 Pro 4.48, Nemotron 3.5 4.69, Soniox v5 async 5.09, Meta Muse 5.45, Speechmatics Enhanced 6.11, Voxtral Small 6.39, Qwen3-ASR-1.7B 6.56, Whisper large-v3 8.18.
  - Hindi dominates the spread: 7.16 (Muse) to 41.55 (Whisper turbo). European languages are all 2–7% for the top 20.
- **Vendor, broad: MAI-Transcribe-2 model card** (FLEURS, 60 languages, 7 systems, forced language). Per-language extract, WER %:

  | Language | MAI-T2 | Gemini 3.1 Pro | Gemini 3.5 Transcribe | Scribe v2 | GPT-Transcribe | Whisper large-v3 |
  |---|---|---|---|---|---|---|
  | English | 2.7 | 2.6 | 2.8 | 2.6 | 3.2 | 4.2 |
  | Spanish | 2.1 | 2.3 | 2.2 | 2.6 | 2.3 | 2.8 |
  | French | 2.8 | 2.9 | 3.7 | 3.6 | 3.7 | 5.4 |
  | German | 2.8 | 2.8 | 2.9 | 3.6 | 3.2 | 4.1 |
  | Portuguese | 2.5 | 2.8 | 2.7 | 3.1 | 3.4 | 4.0 |
  | Italian | 1.1 | 1.4 | 1.1 | 1.3 | 1.9 | 2.2 |
  | Dutch | 3.6 | 3.4 | 3.8 | 3.7 | 4.0 | 5.7 |
  | Polish | 2.0 | 2.8 | 3.3 | 3.8 | 3.3 | 4.9 |
  | Russian | 3.1 | 3.5 | 3.4 | 4.2 | 4.3 | 5.0 |
  | Turkish | 3.9 | 4.1 | 4.3 | 4.0 | 4.6 | 6.4 |
  | Arabic | 8.7 | 9.8 | 8.9 | 9.6 | 10.3 | 14.7 |
  | Hindi | 3.7 | 4.3 | 4.0 | 9.5 | 6.2 | 17.4 |
  | Mandarin | 4.5 | 9.2 | 6.1 | 5.6 | 6.2 | 7.0 |
  | Japanese | 1.8 | 2.5 | 3.1 | 2.3 | 3.9 | 5.3 |
  | Korean | 3.4 | 3.3 | 3.8 | 3.3 | 4.0 | 4.6 |
  | Indonesian | 2.5 | 2.8 | 2.5 | 2.9 | 4.5 | 6.3 |
  | Vietnamese | 3.5 | 2.9 | 3.2 | 3.6 | 4.4 | 8.9 |
  | Swahili | 11.3 | 10.5 | 9.2 | 11.2 | 19.8 | 35.4 |

  These are labelled WER on the card; CJK languages are presumably character-based. Vendor chart: MAI wins most cells, but Gemini wins Dutch, Vietnamese and Swahili, and Scribe ties or wins English and Korean.
- **Vendor, competing: Mistral Voxtral 3 post** (FLEURS-45, CER for ja/ko/th/zh).
  - Voxtral Small Transcribe 3 4.0 = MAI-T2 4.0, Voxtral Mini T3 4.5, Gemini 3.5 Transcribe 4.5, Scribe v2 4.9, GPT Transcribe 5.6, Whisper large-v3 14.9.
  - GPT Transcribe scores 10.4 on Microsoft's chart and 5.6 on Mistral's. Language set and forced vs inferred language explain most of the gap.
- **Long-tail languages: Meta Omnilingual ASR** (arXiv 2511.09690).
  - FLEURS-81 average CER: omniASR LLM 7B 5.6 against Whisper large-v3 22.6. On FLEURS-102 it scores 6.2 against USM 6.9.
  - It beats Whisper on only 24 of 34 of the most-spoken languages; the average gain comes from low-resource languages.
- **Other per-language rows in the JSON:**
  - AssemblyAI real-time FLEURS-18 and Common Voice-18 (14–22 systems; leaders Gemini 3.5 Live 6.4 mean, Soniox 7.9, U-3.6 Pro 8.4).
  - NVIDIA Canary-1B-v2 and Parakeet-TDT-0.6B-v3 cards (25 European languages).
  - Voxtral Mini 4B Realtime card (13 languages at five delay settings, a clean delay-vs-accuracy curve).
  - The Qwen3-ASR card, Whisper large-v2 (paper tables) and Picovoice.

---

## 5. Diarisation

- **Independent: VoiceArena Diarization-Bench v1** (139 sessions, 22 h, far-field plus VoIP, 2–8 speakers; DER with no collar, overlap scored).

  | System | DER % |
  |---|---|
  | NVIDIA Nemotron 3 Diarization (open, Sep 2026) | 14.72 |
  | DiariZen v2 | 19.34 |
  | pyannoteAI Precision-3 | 20.56 |
  | Precision-2 | 23.41 |
  | Smallest Pulse | 24.36 |
  | Streaming Sortformer v2 | 24.61 |
  | pyannote Community-1 | 30.61 |
  | Voxtral Mini Transcribe 3 | 40.4 |
  | Scribe v2 | 40.7 |
  | Muse | 42.1 |
  | AssemblyAI U-3.5 Pro | 44.6 |
  | Soniox v5 | 49.8 |
  | Speechmatics Enhanced | 53.3 |
  | Deepgram Nova-3 | 67.1 |

  - At a 250 ms collar Nemotron scores 4.29.
  - The joint cpWER track reorders the field: Nemotron 3.5 Transcribe 32.4, Multitalker Parakeet + Nemotron Diarization 34.2, MOSS-Transcribe-Diarize 34.7, Scribe v2 35.7, AssemblyAI U-3.6 Pro 47.8, Deepgram 71.9.
  - Speaker-count accuracy: Muse 90.6% exact, Deepgram 35.3%.
- **Independent: ETH Zurich** (0.25 s collar): pyannoteAI API 11.2 overall, DiariZen 13.3, Sortformer v2 9.2–15.3 by language (degrades above 4 speakers), pyannote 3.1 11.5–28.8.
- **Vendor: pyannoteAI** (Precision-3 wins all 10 DIHARD domains on its own charts).
  - On DIHARD conversational telephone speech, Precision-3 scores 7.8% and the ASR APIs 20–33%, mostly missed speech.
  - Streaming DIHARD: pyannote Live-1 19.8, Speechmatics RT 31.3, Deepgram 39.1, AssemblyAI 39.2.
- **Vendor: AssemblyAI** (0.25 s collar, overlap not scored): U-3.5 Pro 12.2 DER mean. Its own blog shows that the same AMI output scores 13–48% DER depending only on how segments are rebuilt from word timestamps.
- **Vendor: NVIDIA.** Nemotron 3 Diarization on DIHARD III full set: 12.73% at a 30.4 s buffer (15,113× RTFx), 13.18% at 1.04 s and 13.55% at 0.32 s (292×). This is the only clean diarisation quality-vs-latency curve.
- **Caveat:** Deepgram's Diarization v2 (May 2026) is opt-in. Third-party default-settings runs most likely measured v1; this is unconfirmed.

---

## 6. Domain, noise and telephony

- **Medical (PriMock57, Omi Health, semi-independent; medical-term WER).**
  - Gemini 3 Pro Preview 1.37, Gemini 2.5 Pro 1.52, VibeVoice-ASR 9B 1.81, Gemini 3 Flash 2.03, Soniox async v4 2.06, Scribe v2 2.54, AssemblyAI U-3 Pro Medical 2.83, Deepgram Nova-3 Medical 3.17, GPT-4o Transcribe 7.87, Google MedASR 26.2.
  - Overall WER on the same audio is 8–15%, because the references are conversational verbatim.
  - The specialist "medical" models do not beat general frontier models on this board.
- **Medical (academic, German).** AssemblyAI Universal 2.99, Voxtral Small 7.11, Deepgram Nova-2 14.33. These are old model versions.
- **Medical (vendor).** AssemblyAI's real-time medical entity table is won by Meta Muse (4.08 vs AssemblyAI 4.24).
- **Finance.**
  - AA Earnings22-Cleaned component: best Fun-Realtime 1.80%, Gemini/others 3–6%, Nova-3 10.5%.
  - Open ASR Earnings22-Cleaned-chunked: Zoom 3.80% best. SPGISpeech: Zoom 1.39%.
  - Open ASR long-form Earnings21: Scribe v2 6.19%.
- **Noise.**
  - Open ASR URGENT24 (noise plus reverb added to English speech): Zoom 6.63, Otter 8.07, Scribe v2 9.20, Whisper large-v3 13.73.
  - Coval WildASR far-field, clipping and noise-gap conditions (FLEURS base): U-3.6 Pro leads.
- **Telephony.**
  - Coval phone-codec condition (FLEURS through a phone codec): U-3.6 Pro 2.69%.
  - Cekura's 8 real phone calls: Fish 2.78% best, GPT-4o Transcribe 12.45% worst; 15 systems are statistically tied.
  - Gladia's Switchboard numbers (Solaria-3 33.9, Scribe v2 55.2) are far above the roughly 5% human and system results from 2017, so the reference or normalisation must differ. Do not show them next to Hub5 numbers.
  - There is still **no independent 8 kHz contact-centre leaderboard with cost**.

---

## 7. How vendor charts disagree with independent boards

| Chart owner | Winner on own chart | Where it loses on its own chart | What independent boards say |
|---|---|---|---|
| AssemblyAI (batch, 2026-10-14) | U-3.5 Pro: clean mean (tie with Cohere 5.0), DER, code-switching | Scribe v2 wins verbatim (7.2 vs 8.0), accented, cpWER (26.4 vs 26.7) and multilingual; Gemini 3.5 wins missed entities | AA-WER: U-3.5 Pro 2.99 (16th of 62), Scribe 2.18 (4th). Open ASR: U-3.5 Pro 11th, Scribe 6th |
| AssemblyAI (real-time v2026.09) | U-3.6 Pro: entity error 14.4, voice-agent WER 5.19, short-form, code-switching | Meta Muse wins medical, long-form and DER; Gemini 3.5 Live wins FLEURS-18; Speechmatics wins CV-18 | Coval: U-3.6 Pro #1. AA streaming: U-3.6 Pro Min Latency 3.62 (14th of 47). Cekura real calls: 14th of 19 |
| Deepgram (Nova-3 launch, 2025-02) | Nova-3 streaming median WER 6.84 vs 14.92 "next best" (unnamed) | none shown | AA batch 5.18 (mid-pack); AA streaming Nova-3 6.50 (38th of 47) but 77 ms; Pipecat 1.37 pooled, 247 ms (on frontier) |
| Microsoft AI (MAI-T2 card) | MAI-T2 5.2 FLEURS-60 | Gemini 3.1 Pro wins about 20 languages | AA batch #2 and AA streaming #1 |
| Mistral (Voxtral 3, 2026-10-20) | Voxtral Small T3 4.0 (ties MAI-T2); best diarisation cpWER 18.4 | Gemini 3.5 Realtime (4.2) beats every Voxtral real-time setting | AA batch #3 |
| Gladia (Solaria-3, 2026-06-10) | 3 of 4 sets | Voxtral wins noisy audio | AA 3.23 (18th of 62); Open ASR 6.84 (22nd of 63) |
| Soniox (reprints Pipecat) | Best price × latency | Azure and Speechmatics have lower WER | AA streaming: fastest accurate-ish (54 ms, 4.50%) |
| NVIDIA (Nemotron 3.5 card) | Beats next-best *open* model only | — | Open ASR #9 (best open); AA 2.81 |
| pyannoteAI | Precision-3 all domains | AssemblyAI beats it on AISHELL tcpWER | VoiceArena: Precision-3 3rd behind two open models |
| Meta (Omnilingual) | 7B average CER | Loses 10 of 34 big languages to Whisper | Open ASR multilingual: omniASR LLM 7B 7.0 (12th) |

The pattern: vendors pick their datasets (often private), their normaliser, their DER convention and which rivals and versions to include. The most credible vendor pages publish losses: AssemblyAI's, and Mistral's realtime chart.

---

## 8. Saturation and limits

- **Read speech is saturated.**
  - LibriSpeech is out of the Open ASR default average (2026-11-02).
  - FLEURS high-resource languages are at 1–4% for six or more systems.
  - Pipecat's top dozen are within 0.25 pp CIs.
  - Differences at this level are mostly reference style (verbatim vs clean) and normalisation.
- **Contamination.** Public test sets (LibriSpeech, Common Voice, FLEURS, VoxPopuli, Earnings22, AMI) are on the web, and the training data of most models is undisclosed. Held-out data now carries the weight:
  - AA-AgentTalk;
  - Open ASR's private Appen and DataoceanAI sets;
  - VoiceArena's sets;
  - AssemblyAI's private voice-agent corpus (vendor-held).
- **Normalisation.** AA's v2.2 normaliser counts "UserController.java" and "User Controller dot Java" as equal. Coval changed its normaliser in July 2026 and its pooling in September 2026. Pipecat switched from WER to an LLM-judged semantic WER, then changed judge model in September 2026. None of these is comparable to the others or to older snapshots.
- **Cleaned references.** AA released cleaned VoxPopuli and Earnings22 references, and Open ASR adopted them in July–August 2026. Scores on "Earnings22" from before and after differ by several points.
- **Read vs conversational.** On Open ASR's private sets, the same system's conversational WER is about 4× its scripted WER (e.g. Azure 2.12 vs 12.71).
- **Small samples.**
  - Earnings22-Cleaned is 6 calls on AA.
  - Cekura's real calls are 8 recordings.
  - Coval's Together-hosted rows have n ≤ 7 in the 24 h window.
  - Earnings and phone results should carry CIs; most boards do not publish them.
- **Endpoints, not models.** AA and Open ASR test API endpoints, which change without notice (Whisper large-v3 differs 2.5× by host on AA). Real-time latency includes network distance from the harness.
- **Judge drift.** Pipecat's semantic WER uses Claude Sonnet 5.5, and two rows were still scored by the previous judge, which reads about 15% higher. Judge-based WER and edit-distance WER must not be mixed.

---

## 9. Human baselines

- **Switchboard / CallHome** (Hub5 2000, telephone conversation):
  - Microsoft 2016 (arXiv 1610.05256): professional transcribers 5.9% SWB and 11.3% CH; its system 5.8 and 11.0 ("human parity").
  - IBM 2017 (arXiv 1703.02136): best of three Appen transcribers after quality checks 5.1% SWB and 6.8% CH; IBM system 5.5 and 10.3.
  - Microsoft's 2017 system reached 5.1% SWB.
  - IBM noted that 36 of 40 SWB test speakers appear in training data.
- **Whisper paper** (Kincaid46, 25 recordings): a computer-assisted human service beat Whisper by 1.15 WER points in aggregate; pure-human services were "only a fraction of a percentage point" better. Absolute values are in a figure only, so we captured no rows.
- **For the deck:** today's frontier scores on clean English (2–3% AA-WER, about 1% semantic WER on Pipecat) are at or below these human ranges. On conversational speech (Open ASR private conversational, 11.6% at best) machines are roughly where careful humans were on CallHome in 2017. Scores on clean sets alone cannot show whether machines have passed humans there.

---

## 10. Which boards can carry which chart

**Pareto: quality vs cost.** Both values must come from the same board.

| Board | Quality | Cost | Points | Verdict |
|---|---|---|---|---|
| **Artificial Analysis non-streaming** | AA-WER v2 | $/1k min (AA-normalised) | 59 priced endpoints | **Primary.** Independent, held-out set, fresh (models to 2026-10-28) |
| **Artificial Analysis streaming** | AA-WER Streaming (final) | $/1k min | 42 priced configs | **Primary for real-time.** Also has latency for a third axis |
| Cekura Converse-STT | WER (overall / real calls) | $/hour → $/1k min (computed) | 17 priced | Secondary. Semi-independent, small real-call set |
| Pipecat via Soniox page | Semantic WER | $/hour (Soniox reprint) | ~20 | Avoid. Second-hand prices on a vendor page |
| Open ASR, AssemblyAI, VoiceArena, PriMock57, multilingual cards | — | none | — | No cost; use quality-only bars or quality-vs-speed |

**Latency: quality vs latency.**

| Board | Latency metric | Use |
|---|---|---|
| **Artificial Analysis streaming** | Time to final / first partial after VAD end of speech | Primary (47 configs, also priced) |
| Pipecat | TTFS median + P95 | Cross-check. Shows tail latency (Muse P95 1.3 s), but is semi-independent |
| Coval | TTFS p50, TTFT p50 | Cross-check. Live and noisy conditions |
| Cekura | TTFS / TTFT on real calls | Telephony-flavoured cross-check |
| NVIDIA Nemotron diarisation, Voxtral Realtime card | DER or WER vs buffer/delay setting | Single-vendor curves showing the latency/accuracy dial within one model |

**Throughput (open models):** Open ASR's WER vs RTFx gives a clean frontier for self-hosting. A useful pair is Parakeet-TDT-0.6B-v2 with fast-gpu-asr (6.88 at 17,254×) against Nemotron 3.5 Transcribe (6.10 at 473×).

**Rule:** draw one frontier per board, label the board, date and metric, and never put AA points and Pipecat points on the same axes.
