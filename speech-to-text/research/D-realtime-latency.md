# Research pack D: Real-time transcription and latency

Session 3, "Speech to text". Compiled 3 November 2026.

Tags: **[verified]** = checked against a primary source this session (link inline). **[verified-2nd]** = checked, but only against reputable secondary coverage or a search summary of the primary page. **[unverified]** = found but not confirmed. **[calc]** = my arithmetic on verified numbers. **[chart]** = value read off a published chart, so rounded.

Companion files: `D-latency.json` (100 machine-readable latency rows) and `images-D.md` (14 recommended visuals in `assets/speech-to-text/vendor/d-*`).

---

## Executive summary

1. **People reply in about 200 ms, so machines start behind.** Across 10 languages, the mean gap between a question and its answer is +208 ms, and most replies start 0 to 200 ms after the other person stops ([Stivers et al. 2009, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC2705608/)) [verified]. Producing even one word takes over 600 ms, so humans must predict the end of a turn and plan the reply early ([Levinson & Torreira 2015](https://doi.org/10.3389/fpsyg.2015.00731)) [verified]. A pipeline that waits for silence before it starts work cannot match that. It has to predict, too.
2. **Realistic voice-agent targets are about 1 second, not 200 ms.** Twilio's launch target for a cascaded agent is a 1,115 ms median from the caller stopping to the reply reaching their ear, with a 1,400 ms upper limit ([Twilio, Nov 2025](https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents)) [verified]. Pipecat's primer gives about 1,300 ms as typical and 1,500 ms as the target. Its authors have shown 500 ms with every model on one GPU cluster ([primer](https://voiceaiandvoiceagents.com/)) [verified].
3. **Production is slower than the targets, and the tail is the problem.** Hamming reports median turn latency of 1.4 to 1.7 s on production calls, with P90 at 3.3 to 3.8 s ([Hamming](https://hamming.ai/blog/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it)) [verified-2nd; vendor data, method unpublished]. One slow turn in ten is what callers remember.
4. **The biggest lever is when the system decides you have finished.** A fixed silence timeout is set by hand: 500 ms is common, and 800 ms "adds nearly a full second to every single response" ([LiveKit](https://livekit.com/blog/turn-detection-voice-agents-vad-endpointing-model-based-detection)) [verified]. Set it too short and the agent cuts in while the caller reads out an order number. Model-based turn detection now decides within about 200 to 300 ms of a pause. Examples are Deepgram Flux, AssemblyAI's Universal-3.x, Pipecat Smart Turn, the LiveKit turn detector and OpenAI's semantic_vad [verified, vendor figures].
5. **The speech-to-text step itself is now fast: 250 to 400 ms to a final transcript.** On Pipecat's open benchmark of 24 streaming models, the best median time from end of speech to a final transcript is 221 to 307 ms. The leaders are NVIDIA Nemotron 3.0, Deepgram Nova-3, Soniox, AssemblyAI and Cartesia ([pipecat-ai/stt-benchmark](https://github.com/pipecat-ai/stt-benchmark), results as of 1 Oct 2026) [verified]. The hyperscalers lag: AWS takes about 1,140 ms, Azure about 1,020 ms and Google latest-long about 880 ms.
6. **Streaming costs you accuracy.** On the same audio, every vendor's streaming model has a higher error rate than its batch model. Deepgram Nova-3 at launch: 6.84% streaming vs 5.26% batch median WER [verified]. On Artificial Analysis's shared datasets, the streaming WER penalty is 16% to 64% relative for the same vendor [calc]. One NVIDIA model moves from 8.43% WER at an 80 ms chunk to 6.93% at a 1.12 s chunk [verified]. Speechmatics says a 2 s final-transcript delay costs about 1% relative to batch, and 0.7 to 1.5 s costs under 5% [verified].
7. **Streaming also costs more money.** Deepgram Nova-3 is $0.0077/min streaming vs $0.0043/min batch (1.8x) [verified, calc]. AssemblyAI's top real-time model is $0.45/hr vs $0.21/hr for its top batch model (2.1x) [verified, calc]. Streaming is often billed for how long the connection stays open, not for the audio sent.
8. **Vendor latency numbers disagree because they measure different things.** "Latency" can mean the first partial, the final transcript, the end-of-turn event, or model time without the network. It can be timed from when audio was sent or from when speech ended. For the same model, Artificial Analysis reports 60 ms and Pipecat reports 247 ms (Deepgram Nova-3). That gap is mostly Pipecat's 200 ms voice-activity wait [calc]. Accuracy rankings flip too: Soniox is near the top on Pipecat (1.1% semantic WER) and last on Artificial Analysis (11.9% WER) [verified, unresolved].
9. **Speech-to-speech models are not yet clearly faster than a well-built cascade.** The best speech-to-speech models take 0.6 to 1.3 s to produce their first audio on Artificial Analysis's leaderboard: GPT-Realtime-1.5 0.81 s, Grok Voice 3.0 0.81 s, Gemini 3.8 Live 1.18 s, Nova 2.0 Sonic 1.14 s ([AA](https://artificialanalysis.ai/speech-to-speech)) [verified]. That figure excludes turn detection and the caller's network. Enterprises still cascade for the auditable transcript, choice of LLM, tool-calling reliability, language coverage and cost.
10. **Not every "real-time" use case needs voice-agent speed.** Voice agents need about 1 s. Agent assist and real-time compliance can live with 1 to 5 s; Genesys quotes about 3 to 5 s for its transcription [verified]. Ofcom's guidance for live TV captions is a mean of 4.5 s [verified]. Clinical scribing is effectively batch: Yale reports Abridge notes ready within 30 s of the visit ending [verified-2nd]. Pick the latency tier before picking the vendor.
11. **Deployment matters as much as the model.** UK to US-West adds about 125 ms of round-trip time compared with a London region [calc from primer]. Self-hosted streaming GPUs show the same triangle: an NVIDIA streaming model serves 240 streams per H100 at a 160 ms chunk and 900 at 560 ms [verified, chart]. Phone audio arrives as 8 kHz μ-law and adds carrier buffering you cannot tune away [verified].
12. **Slide line: "The model is fast now. The wait is in deciding when the caller has finished."**

---

## 1. Why latency matters

### 1.1 The human baseline

| Finding | Number | Source |
|---|---|---|
| Mean response offset across 10 languages (question to answer) | **+208 ms** | Stivers et al. 2009, PNAS 106(26) ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2705608/)) [verified] |
| Distribution shape | Unimodal; mode per language 0 to +200 ms; overall mode 0 ms | same [verified] |
| Spread across languages | Language means within ≈250 ms of the cross-language mean; Japanese +7 ms, Danish +469 ms (slowest) | same [verified] |
| Medians | 0 ms (English, Japanese, Tzeltal, Yélî-Dnye) to +300 ms (Danish, ‡Ākhoe Haiǁom, Lao); overall +100 ms | same [verified] |
| Confirmations vs disconfirmations | "Yes" answers come 100 to 500 ms faster than "no" answers, in every language | same [verified] |
| Sensitivity | Speakers notice timing changes "measured in 100 ms or less" | same [verified] |
| Production time | Gaps are "of the order of 200 ms" but producing a word takes "over 600 ms", so listeners must predict the end of the turn | Levinson & Torreira 2015, Front. Psychol. 6:731 ([Europe PMC](https://europepmc.org/article/MED/26124727)) [verified] |

**Why this matters for the deck.**
- A late reply carries meaning. Stivers found that a delayed answer reads as a coming "no". A voice agent that pauses 1.5 s sounds hesitant or broken, not thoughtful. Deepgram makes the same point in its "pauses read as hesitation" post ([Deepgram](https://deepgram.com/blog/voice-ai-latency-why-pauses-read-as-hesitation.md)) [unverified, title only].
- Humans hit 200 ms by overlapping listening and planning. Machines can do the same: speculative ("eager") end-of-turn events, streaming LLM tokens into TTS, and filler phrases. A pipeline that only starts work after silence has a floor well above 200 ms.

### 1.2 What users tolerate in voice agents

There is no good peer-reviewed study linking specific delays to hang-up rates. The figures in circulation are mostly vendor-made.

| Claim | Number | Source and quality |
|---|---|---|
| Twilio MVP launch target (cascaded agent), mouth-to-ear | 1,115 ms median target, 1,400 ms upper limit | [Twilio, 17 Nov 2025](https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents) [verified]. Twilio says these are starting benchmarks, not best possible. |
| Pipecat target | "1,500 ms voice-to-voice latency is an important target"; "a response time of 500ms is typical" in human talk | [Voice AI primer](https://voiceaiandvoiceagents.com/) [verified] |
| Daily on STT finalisation | If STT "takes over a second to finalize a transcript, you've burned most of the latency budget" | [Daily, Feb 2026](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/) [verified] |
| Hamming production data | P50 1.4 to 1.7 s, P90 3.3 to 3.8 s, P99 4.3 to 5.4 s. Above ~1.5 s users "talk over the agent, repeat themselves, or abandon" | [Hamming](https://hamming.ai/blog/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it) [verified-2nd]. The dataset is described as 2M+ calls in one place and 4M+ in another; method not published. |
| Hamming quality thresholds | P50 <1.6 s excellent, <1.8 good, <2.0 acceptable; P90 <2.2 / 2.5 / 3.0 s | [Hamming methodology](https://hamming.ai/methodology) [verified-2nd] |
| Retell claim | ~600 ms end to end | [Retell blog](https://www.retellai.com/blog/how-real-time-voice-ai-works-stt-llm-tts) [verified-2nd; vendor] |
| "40% higher abandonment above 1 s" | Circulates on vendor blogs | No primary source found. **Do not use.** [unverified] |

**Reading.** The commonly quoted "500 to 800 ms voice-to-voice" target is achievable in a demo and rare in production over the phone. A defensible slide range: **under 1 s median feels responsive; 1 to 1.5 s is acceptable; P90 above 2.5 to 3 s is where calls break down.** Present this as industry practice, not research.

### 1.3 Live captions: broadcast norms

| Regime | Latency rule | Source |
|---|---|---|
| UK (Ofcom) | Old guidance: no more than 3 s between speech and subtitle. Broadcasters said 3 s "is not possible to achieve with the technologies available". The 2023 consultation proposed "an average of 4.5 seconds across live programming"; the April 2024 best-practice guidelines say providers "should aim for a mean latency... of no more than 4.5 seconds". | [Ofcom consultation summary](https://www.ofcom.org.uk/__data/assets/pdf_file/0024/264336/accessibility-best-practice-summary.pdf) [verified]; final wording via [secondary coverage](https://liamodell.com/2024/04/16/ofcom-access-code-guidelines-disability-subtitles-audio-description-signing-channel-four/) [verified-2nd] |
| UK measured | 2014 Ofcom sampling of BBC, ITV, C4, C5 and Sky: 5.6 s median latency, some gaps up to 24 s | [Limping Chicken summary of Ofcom report](https://limpingchicken.com/2014/04/30/deaf-news-ofcom-study-reveals-average-5-6-second-delay-in-live-subtitles-nearly-double-recommended-delay/) [verified-2nd] |
| US (FCC 14-12, 2014) | Four quality standards (accuracy, synchronicity, completeness, placement). No fixed maximum delay for live programming; the FCC accepts "a slight delay" is inevitable. Commenters suggested 4 to 5 s preferred, 6 to 7 s acceptable. | [FCC 14-12 order](https://docs.fcc.gov/public/attachments/fcc-14-12a1.pdf) [verified-2nd via law-firm summaries] |
| Meeting captions (Teams, Zoom, Meet) | No vendor-published latency. One unnamed benchmark claims Teams AI captions ~1.4 s median vs human CART ~3 s+ | [disabilityworld.org](https://www.disabilityworld.org/articles/live-caption-accuracy-benchmark/) [unverified; weak source] |

**Reading.** Broadcast captioning has settled on **seconds, not milliseconds**. A good streaming STT engine is not the bottleneck: its final transcript arrives in under 1 s. The rest is human-in-the-loop correction, broadcast chain delay and readability rules. For captions, partial-transcript stability ("flicker") matters more than shaving 100 ms.

### 1.4 Agent assist and real-time compliance

- No standard exists. Genesys says its transcription is "near real time, within seconds", and "approximately 3–5 seconds" with its low-latency toggle, vs 35 to 40 s without ([Genesys FAQ](https://help.genesys.cloud/faqs/what-is-the-expected-level-of-accuracy-when-working-voice-transcription/)) [verified].
- AssemblyAI: "a suggestion that arrives after the moment has passed is worse than useless" ([AssemblyAI, Sep 2026](https://assemblyai.com/blog/build-real-time-agent-assist)) [verified]. No number given.
- Amazon Connect Contact Lens added real-time streaming of "utterance" partial segments in March 2022 for "low latency" agent assist, with no published figure ([AWS](https://aws.amazon.com/about-aws/whats-new/2022/03/amazon-connect-contact-lens-real-time-streaming/)) [verified-2nd].
- **Judgement, not evidence:** for a human agent reading a prompt, the deadline is the next turn, usually 1 to 3 s after the customer stops. A compliance alert ("read the disclosure") must land before the call ends or the relevant moment passes: seconds, not milliseconds. This is the "near-real-time" tier.

---

## 2. Anatomy of latency in a streaming pipeline

### 2.1 The stages, with typical numbers

| Stage | What happens | Typical ms | Evidence |
|---|---|---|---|
| Audio capture | Mic, OS buffers | ~40 (macOS mic input) | [Primer](https://voiceaiandvoiceagents.com/) [verified] |
| Frame / chunk size | Audio is sent in small chunks; bigger chunks add buffering delay, smaller ones add network overhead | 20 ms chunks in Pipecat and AA benchmarks; AWS asks for 50 to 200 ms; Deepgram's blog suggests ~100 ms | [Daily](https://www.daily.co/blog/benchmarking-stt-for-voice-agents/), [AA](https://artificialanalysis.ai/speech-to-text/methodology), [AWS Transcribe](https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html) [verified]; [Deepgram blog](https://deepgram.com/learn/streaming-speech-recognition-api) [verified-2nd] |
| Encode / decode | Opus (WebRTC) ~21 ms encode; μ-law on phone | 21 + 1 | Primer [verified] |
| Network transit + jitter buffer | Packets reordered; buffer grows with jitter | 10 transit + 40 jitter buffer each way (same region) | Primer [verified] |
| Long-haul network | UK user to AWS us-west-1 RTT ~140 ms vs ≤15 ms to eu-west-2. Europe to US ~250 ms RTT, India ~350 ms | 100 to 350 | Primer [verified] |
| Telephony (PSTN/SIP) | Carrier buffering, 8 kHz narrowband | "a few hundred milliseconds" | Primer [verified, qualitative]; AssemblyAI: carrier buffering "can't be tuned away" [verified] |
| Model look-ahead (right context) | The model waits for future audio before committing a word | 80 to 1,120 ms (NVIDIA Nemotron chunk options); 500 ms (Kyutai 1B); 2,500 ms (Kyutai 2.6B) | [NVIDIA model card](https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b), [Kyutai](https://kyutai.org/stt) [verified] |
| Compute | GPU inference per chunk | Small for good streaming models; "300 milliseconds or less" transcription latency (Deepgram) | [Deepgram docs](https://developers.deepgram.com/docs/measuring-streaming-latency.mdx) [verified-2nd] |
| Partial (interim) transcript | Early, revisable words | 20 to 470 ms after end of speech (AA first-partial) | [AA](https://artificialanalysis.ai/articles/new-streaming-speech-to-text-benchmark-aa-wer-streaming) [verified, chart] |
| Final transcript | Committed text for the segment | 221 to 1,322 ms median from end of speech (Pipecat TTFS) | [Pipecat](https://github.com/pipecat-ai/stt-benchmark) [verified] |
| Endpointing / end-of-turn | Decide the user has finished | Fixed silence 300 to 1,000 ms; model-based ~200 to 300 ms | see 2.3 |
| LLM time to first token | First token of the reply | 375 ms target (Twilio), 650 ms "typical" (primer) | Twilio, primer [verified] |
| Sentence aggregation | Buffer the first phrase for TTS | ~20 | Primer [verified] |
| TTS time to first byte | First audio of the reply | 100 ms target (Twilio), 120 ms (primer). Cartesia claims sub-90 ms model time; measured with network ~160 to 190 ms | Twilio, primer [verified]; Cartesia figures [verified-2nd] |
| Playback | Speaker output | ~15 | Primer [verified] |

### 2.2 Transport choices

- **WebRTC for client devices, WebSockets for server to server.** The Pipecat primer: "WebSockets shouldn't be used in production for client-server, realtime media connections." TCP causes head-of-line blocking. WebRTC's Opus codec has forward error correction and congestion control, and media is timestamped, which makes interruptions easy ([primer §5.7](https://voiceaiandvoiceagents.com/)) [verified].
- **HTTP is slow to start.** Realistic time to send the first byte "is closer to 100ms even for heavily optimized servers" [verified]. Keep a warm, persistent connection to the STT and LLM.
- **Telephony.** Twilio Media Streams always deliver `audio/x-mulaw` at 8,000 Hz, mono, with separate `inbound` and `outbound` tracks ([Twilio docs](https://www.twilio.com/docs/voice/media-streams/websocket-messages)) [verified]. Most STT models expect 16 kHz, so the audio is resampled ([Twilio guide](https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents)) [verified]. Narrowband audio also hurts accuracy. The 20 ms packet size (160 bytes of μ-law) is common practice, but Twilio does not state it [unverified].
- **Edge routing.** Connect the user to a nearby edge, then use a private backbone: UK to us-west-1 becomes ~115 ms vs ~140 ms over the public internet, with lower jitter ([primer](https://voiceaiandvoiceagents.com/)) [verified]. Twilio's guide contrasts public and edge routes in the same way [verified].

### 2.3 Endpointing: silence timeouts

| System | Default or typical silence rule | Source |
|---|---|---|
| Pipecat (VAD alone, not recommended) | `VAD_STOP_SECS = 0.8` | primer [verified] |
| Pipecat with Smart Turn | VAD set to a short (~200 ms) trigger, then the turn model | primer [verified] |
| LiveKit | `min_endpointing_delay` 0.5 s, `max_endpointing_delay` 3.0 s (0.3 / 2.5 s with the audio turn detector). Optional dynamic mode adapts to the session's pauses. | [LiveKit docs](https://docs.livekit.io/agents/build/turns/turn-detector/) [verified] |
| OpenAI Realtime `server_vad` | `silence_duration_ms` example 500 (no default stated) | [OpenAI](https://developers.openai.com/api/docs/guides/realtime-vad) [verified] |
| Deepgram Nova-3 | `endpointing` default 10 ms of silence, examples 300 to 500 ms; `utterance_end_ms` example 1,000 | [Deepgram](https://developers.deepgram.com/docs/endpointing) [verified] |
| AssemblyAI Universal-3.6 Pro | `min_turn_silence` 128 ms before an end-of-turn check; `max_turn_silence` 640 / 1,280 / 2,560 ms for min_latency / balanced / max_accuracy | [AssemblyAI](https://www.assemblyai.com/docs/streaming/turn-detection) [verified] |
| Twilio's description of fixed defaults | "set around 500ms" | Twilio [verified] |

### 2.4 Semantic or model-based turn detection

| Detector | How it works | Latency claim | Source |
|---|---|---|---|
| **Deepgram Flux** (Oct 2025) | STT model with turn detection built in. `EndOfTurn` and a medium-confidence `EagerEndOfTurn` for speculative LLM calls | ~260 ms median end-of-turn; p90 ~1 s, p95 ~1.5 s. Eager fires 150 to 250 ms earlier at the cost of 50 to 70% more LLM calls. English only at launch. | [Deepgram Flux](https://deepgram.com/flux) [verified; vendor] |
| **AssemblyAI Universal-3.x Pro Realtime** | "Does not endpoint on silence alone"; at a pause it checks the transcript; holds turns ending in phone numbers or emails | Time to complete turn P50 568 ms, P90 829 ms (U3.5 Pro, May 2026) | [AssemblyAI docs](https://www.assemblyai.com/docs/streaming/benchmarks) [verified; vendor] |
| **Pipecat Smart Turn v3** (Sep 2025) | 8M-parameter audio model, 23 languages, runs beside STT, gated by VAD | 12.6 ms on a c7a.2xlarge CPU, 59.8 ms on c8g.medium; turn decision "~250ms from the time a user pauses" | [Daily](https://www.daily.co/blog/announcing-smart-turn-v3-with-cpu-inference-in-just-12ms/), primer [verified; vendor] |
| **LiveKit turn detector v1 / v1-mini** | Audio model (v1, hosted) or CPU model (v1-mini); the older text model is deprecated | Text model 50 to 160 ms per turn; audio model commits anyway after ~1 s | [LiveKit docs](https://docs.livekit.io/agents/build/turns/turn-detector/) [verified; vendor] |
| **OpenAI `semantic_vad`** | Classifier on the words spoken; `eagerness` low / medium / high / auto | No ms published | [OpenAI](https://developers.openai.com/api/docs/guides/realtime-vad) [verified] |
| **Pipecat LLM single-token tagging** | The conversation LLM starts every reply with ✓ (complete), ○ (wait ~5 s) or ◐ (wait ~10 s) | Adds no separate call; uses the LLM's full context | primer [verified] |
| **Kyutai STT 1B** | Semantic VAD built into the STT | n/a | [Kyutai](https://kyutai.org/stt) [verified] |

**State of the art (Pipecat's view, 2026):** combine (1) VAD with a short ~200 ms trigger, (2) a small audio turn model on CPU, and (3) a single-token turn tag from the LLM. Its authors say this feels like turn detection is "solved" ([primer §5.8.5](https://voiceaiandvoiceagents.com/)) [verified]. Image: `d-primer-turn-detection-pipeline.png`.

### 2.5 Worked latency budgets for a cascaded voice agent

**Budget A: Twilio MVP targets (median, Nov 2025)** [verified]. Image: `d-twilio-latency-waterfall-targets.webp`.

| Step | ms |
|---|---|
| Device to media edge | 40 |
| Media decoding | 25 |
| Edge to orchestration | 20 |
| Inbound buffer | 30 |
| Orchestration to STT | 10 |
| **STT (includes end-of-turn)** | **350** (limit 500) |
| STT to orchestration, session fetch, to LLM | 20 |
| **LLM time to first byte** | **375** (limit 750) |
| LLM to orchestration, to TTS | 20 |
| **TTS time to first byte** | **100** (limit 250) |
| TTS to orchestration | 10 |
| Outbound buffer, edge, encoding, edge to device | 30 + 20 + 25 + 40 |
| **Platform turn gap** | **885** (limit 1,100) |
| **Mouth-to-ear turn gap** | **1,115** (limit 1,400) |

The 230 ms difference between the two totals is network and media handling outside the platform [calc].

**Budget B: Pipecat primer, "fairly typical" WebRTC round trip** [verified].

| Stage | ms |
|---|---|
| macOS mic input | 40 |
| Opus encoding | 21 |
| Network stacks and transit | 10 |
| Packet handling | 2 |
| Jitter buffer | 40 |
| Opus decoding | 1 |
| **Transcription and endpointing** | **300** |
| **LLM TTFB** | **650** |
| Sentence aggregation | 20 |
| **TTS TTFB** | **120** |
| Opus encoding, packet handling, transit, jitter buffer, decoding | 21 + 2 + 10 + 40 + 1 |
| macOS speaker output | 15 |
| **Total** | **1,293** |

The AI stages total 1,090 ms; audio and transport total 203 ms [calc].

**Budget C: a frontier cascade, built from best-in-class parts** [calc; my synthesis, not a single published measurement].

| Stage | ms | Basis |
|---|---|---|
| Audio in (mic, Opus, same-region network, jitter buffer) | ~115 | Primer inbound legs |
| End of turn + final transcript | ~250 | Smart Turn "~250 ms from pause"; Pipecat best TTFS medians 221 to 307 ms; Flux ~260 ms |
| LLM time to first token | ~350 | Twilio target 375 ms; fast hosted models |
| Sentence aggregation | ~20 | Primer |
| TTS time to first byte | ~120 | Twilio 100 / primer 120 |
| Audio out | ~90 | Primer outbound legs |
| **Total, WebRTC** | **~945** | |
| Over PSTN | add a few hundred ms | primer, AssemblyAI (qualitative) |
| With speculative end-of-turn | save ~150 to 250 | Deepgram EagerEndOfTurn |
| All models co-located on one GPU cluster | ~500 demonstrated | Primer |

**Slide version:** humans ~200 ms; best demos ~500 ms; good production ~1 s; typical production 1.4 to 1.7 s; P90 in production 3+ s.

Other published budgets:
- **AssemblyAI + Vapi (Jul 2025):** ~90 ms STT + 200 ms LLM (Groq) + 75 ms TTS = 365 ms, plus ~100 ms web network = ~465 ms; telephony overhead 600 ms+ pushes it to ~965 ms [verified-2nd; search summary of the earlier version. The post was rewritten in Oct 2026 and no longer carries the breakdown]. The new version warns that old hand-tuned Vapi timers "added well over a second of dead air" ([AssemblyAI](https://assemblyai.com/blog/how-to-build-lowest-latency-voice-agent-vapi)) [verified].
- **Smallest.ai:** 50 VAD + 150 STT + 400 LLM + 150 TTS + 50 network = 800 ms ([smallest.ai](https://smallest.ai/blog/designing-voice-assistants-stt-llm-tts-tools-and-latency-budget)) [verified-2nd; vendor, illustrative].

---

## 3. The accuracy–latency trade-off

### 3.1 Streaming is less accurate than batch, even from the same vendor

| Evidence | Streaming | Batch | Gap | Source |
|---|---|---|---|---|
| Deepgram Nova-3 launch (median WER, own test set) | 6.84% | 5.26% | +30% relative [calc] | [Deepgram changelog, 12 Feb 2025](https://developers.deepgram.com/changelog/2025/2/12) [verified-2nd; vendor] |
| Speechmatics, by `max_delay` | 0.7 to 1.5 s: <5% relative degradation; 2.0 s: ~1%; 4.0 s: equal to batch | — | — | [Speechmatics docs](https://docs.speechmatics.com/features/realtime-latency) [verified; vendor] |
| NVIDIA Nemotron streaming 0.6B, same weights | 80 ms chunk: 8.43% avg WER (AMI 18.29%) | 1.12 s chunk: 6.93% (AMI 11.73%) | +22% relative overall; +56% on meeting audio [calc] | [Model card](https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b) [verified]. Image: `d-nvidia-nemotron-streaming-wer-vs-chunk.png` |
| AA, same ~8 h audio: ElevenLabs | Scribe v2 Realtime 3.6% | Scribe v2 2.2% | +64% relative [calc] | [AA streaming](https://artificialanalysis.ai/articles/new-streaming-speech-to-text-benchmark-aa-wer-streaming) (Jun 2026) vs [AA batch](https://artificialanalysis.ai/speech-to-text) (Nov 2026) [verified, chart] |
| AA: AssemblyAI | U3 Realtime Pro 4.1% | Universal-3.5 Pro 3.0% (U3 Pro 3.1%) | +32 to 37% [calc] | same |
| AA: Deepgram | Nova-3 Realtime 6.7% | Nova-3 5.2% | +29% [calc] | same |
| AA: Google | Chirp 3 Streaming 5.0% | Chirp 3 4.3% | +16% [calc] | same |
| AA: OpenAI | GPT Realtime (whisper) 5.1% | GPT-4o Transcribe 4.0% | +28% [calc] (different models) | same |
| AssemblyAI's own set (English) | Universal-Streaming 8.6% vs Universal-3.5 Pro Realtime 6.3% | — | Newer real-time models narrow the gap | [AssemblyAI docs](https://www.assemblyai.com/docs/streaming/benchmarks) [verified; vendor] |

**Caveats for the AA comparison.** The streaming and batch snapshots are five months apart. AA cuts Earnings22 into ~30 s segments for streaming. Batch models also see the whole file at once. Treat the gaps as "15 to 65% more errors", not exact numbers.

**Why streaming loses accuracy:** limited right context (look-ahead), no second pass over the whole file, shorter context for names and numbers, and turn-by-turn segmentation. The primer: "A large percentage of transcription errors result from the very small amount of context that the transcription model has available in a realtime stream" [verified]. One mitigation is to tell the LLM its input is a transcript and let it correct obvious errors [verified].

### 3.2 Partial transcripts and flicker

- **What flicker is.** Interim words are revised as more audio arrives: "I want to fly to Austin" becomes "I want to fly to Boston". This matters for captions (text jumps on screen) and for agent assist (a suggestion fires on a word that later changes).
- **How vendors handle it.**
  - *AWS Transcribe:* partial-results stabilisation with `low` / `medium` / `high` stability. Each word gets a `Stable` flag. High stability is faster but "slightly lower accuracy"; low is most accurate but partials change more ([AWS docs](https://docs.aws.amazon.com/transcribe/latest/dg/streaming-partial-results.html)) [verified-2nd]. AWS launched it in 2021 for live subtitling [verified-2nd].
  - *AssemblyAI Universal-Streaming:* "immutable" transcripts: once emitted, words do not change ([AssemblyAI](https://assemblyai.com/blog/introducing-universal-streaming)) [verified-2nd; vendor].
  - *Speechmatics:* partials "typically" under 500 ms and "10-25% lower" accuracy than finals [verified].
  - *Apple SpeechAnalyzer (iOS 26):* opt-in "volatile results" that the model revises; finalised results never replace earlier ones ([WWDC25 coverage](https://dev.to/arshtechpro/wwdc-2025-the-next-evolution-of-speech-to-text-using-speechanalyzer-6lo)) [verified-2nd].
  - *Google Cloud STT:* a `stability` score on interim results [unverified this session].
- **How it is measured.** No industry standard exists. Academic metrics count revisions between consecutive partials, normalised by final length (e.g. Shangguan et al., Interspeech 2020, "Analyzing the Quality and Stability of a Streaming End-to-End On-Device Speech Recognizer", [Google Research](https://research.google/pubs/analyzing-the-quality-and-stability-of-a-streaming-end-to-end-on-device-speech-recognizer/)) [verified-2nd]. Speech-translation work uses "normalised erasure" [verified-2nd]. Artificial Analysis reports WER on the first partial after speech ends as well as on the final: final is ~0.7 percentage points more accurate on average, but some models gain a lot by waiting (Voxtral Mini Realtime 9.6% to 5.3%; OpenAI GPT Realtime 7.5% to 5.1%) [verified].
- **Gaming risk.** AssemblyAI: time to first token is "not recommended" for real-time STT "because some providers emit tokens before speech is spoken" ([AssemblyAI docs](https://www.assemblyai.com/docs/streaming/benchmarks)) [verified; competitor claim].

### 3.3 The end-of-utterance decision is the biggest lever

- **Too early:** the agent interrupts the caller. Twilio's example: "My order number is .. ummm .. nine zero two one zero" is cut off by a 500 ms fixed timeout (`d-twilio-fixed-vs-smart-eot.webp`) [verified]. The primer calls agents that "interrupt too often" "the single most common complaint" about home-built voice agents [verified].
- **Too late:** dead air. LiveKit: an 800 ms timeout "adds nearly a full second to every single response" [verified].
- **The trade-off curve.** Deepgram's chart of end-of-turn precision against median detection latency (`d-deepgram-flux-eot-precision-vs-latency.png`) [chart; vendor-run]:
  - Silero VAD timeouts need ~900 ms to reach ~0.8 precision, and drop to ~0.4 at ~270 ms.
  - Pipecat Smart Turn v3 reaches ~0.6 to 0.7 at 250 to 400 ms.
  - AssemblyAI Universal-Streaming reaches ~0.6 to 0.75 at 460 to 580 ms.
  - LiveKit EoU reaches ~0.8 to 0.9 at 560 to 600 ms.
  - Flux reaches ~0.76 at ~220 ms and ~0.9 at ~640 ms.

  This is Deepgram's own benchmark, so treat the ordering as a claim. The *shape* is the point: a model-based detector moves the whole curve, which a better timeout cannot do.
- **Size of the lever** [calc]. Moving from a 800 ms fixed timeout to a ~250 ms model decision saves ~550 ms. That is more than the whole STT finalisation time of a frontier model (~250 ms), and more than the TTS stage.
- **Speculation hides the rest.** Start the LLM on an "eager" end-of-turn and discard it if the user keeps talking: Flux saves 150 to 250 ms for 50 to 70% more LLM calls [verified; vendor].
- **Services without finalisation are slower.** Daily: "Services with the lowest latency all support finalization signals". For services without them, "every turn takes as long as the P95" [verified].

---

## 4. How latency is measured, and why numbers disagree

### 4.1 Competing definitions

| Metric | Start of clock | End of clock | Who uses it |
|---|---|---|---|
| Time to first token / first byte | First audio sent, or request | First transcript event | Many vendor pages. Gameable. |
| Emission latency | A word is spoken | That word is returned | AssemblyAI (P50 317 ms, P90 597 ms for Universal-Streaming) [verified] |
| Time to first partial after end of speech | VAD detects end of speech and force-endpoint is sent | First transcript event | Artificial Analysis [verified] |
| Time to final transcript | Same as above | First "final" transcript | Artificial Analysis [verified] |
| TTFS (time to final segment) | *Actual* end of speech (VAD stop minus `stop_secs`) | Last final segment | Pipecat / Daily [verified] |
| Time to complete turn | End of speaker turn | Finalised transcript (includes turn detection) | AssemblyAI (U3.5 Pro P50 568 ms) [verified] |
| End-of-turn detection latency | User stops speaking | EndOfTurn event | Deepgram Flux (~260 ms median) [verified] |
| Platform turn gap | Audio arrives at platform | Reply leaves platform | Twilio (885 ms target) [verified] |
| Mouth-to-ear / voice-to-voice | User stops speaking | Reply reaches the ear | Twilio (1,115 ms), primer (1,293 ms) [verified] |
| TTS / S2S time to first audio | Text or audio fully received | First audio byte | Cartesia, AA S2S index [verified] |

**Why the same model gets different numbers** [calc]:
- *Clock start.* AA starts the clock after Silero has already detected the end of speech. Pipecat starts it at the actual end of speech, so its numbers include the 200 ms VAD hang-over. For providers that accept a "finalise now" signal, Pipecat ≈ AA + 150 to 210 ms: Deepgram Nova-3 247 vs 60 ms; Cartesia Ink-2 299 vs 90 ms; ElevenLabs Scribe v2 Realtime 281 vs 140 ms.
- *What counts as done.* First partial vs final vs end of turn can differ by hundreds of ms. AssemblyAI's own emission P50 is 317 ms; its time to complete turn is 649 ms for the same model.
- *Percentile.* Medians hide tails. Meta muse-voice-transcribe has a 392 ms median and a 1,292 ms P95 on Pipecat. Cartesia ink-2 has a 328 ms P95 and a 1,584 ms P99 [verified].
- *Network location.* Pipecat tests from one US network location on weekday business hours [verified]. AA includes network but does not publish its test location [verified]. Primer: provider quotes are often "inference time", excluding endpointing, network and OS [verified].
- *Audio and task.* Pipecat uses 1,000 short single-speaker English turns. AA uses agent talk, parliament speeches and earnings calls. Rankings shift with the audio.

### 4.2 Independent benchmarks (2026)

| Benchmark | Who runs it | What it measures | Key results | Caveats |
|---|---|---|---|---|
| **Pipecat STT benchmark** | Pipecat / Daily, open source; vendors contribute rows | TTFS median / P95 / P99; semantic WER judged by Claude Sonnet 5.5; 1,000 utterances | Frontier (Oct 2026): NVIDIA Nemotron 3.0 221 ms / 1.95%; Deepgram Nova-3 247 / 1.37%; Soniox v4 249 / 1.13%; Soniox v5 260 / 1.09%; AssemblyAI U3.5 Pro 282 / 0.95%; U3.6 Pro 307 / 0.80%; Speechmatics linden-1 369 / 0.96%; Meta muse 392 / 0.73%. Slow: OpenAI gpt-realtime-whisper 740 ms; Google latest-long 878; Azure 1,016; AWS 1,136; xAI 1,322 | Daily sells a framework, not STT. English only. Semantic WER under 0.25 pp apart is within the 95% CI. No phone audio. ([repo](https://github.com/pipecat-ai/stt-benchmark)) [verified] |
| **Artificial Analysis AA-WER Streaming** | Artificial Analysis | WER at first partial and final, latency after VAD end-of-speech, price | June 2026: Cartesia Ink-2 3.6% / 0.21 s (semantic endpoints) or 3.7% / 0.09 s (external); ElevenLabs Scribe v2 RT 3.6% / 0.14 s; AssemblyAI U3 RT Pro 4.1% / 0.48 s; Deepgram Nova-3 6.7% / 0.06 s; Flux 7.4% / 0.02 s; Soniox 11.9% / 0.06 s; Chirp 3 5.0% / 1.26 s | Forced endpointing hides turn detection. Mean, not P95. ([AA](https://artificialanalysis.ai/articles/new-streaming-speech-to-text-benchmark-aa-wer-streaming)) [verified, chart] |
| **Coval** | Coval (eval vendor) | STT TTFS and WER; trailing 7-day live runs | AssemblyAI cites U3.5 Pro Realtime at 3.40% trailing WER with the lowest time to first token ([AssemblyAI blog](https://www.assemblyai.com/blog/universal-3-5-pro-realtime-human-parity-zone)) [verified-2nd]. An earlier five-model run found Nova-2/3 fastest but at ~25% WER ([Gradium](https://gradium.ai/content/stt-api-benchmark-2026-latency-accuracy)) [verified-2nd; competitor write-up] | Live leaderboard not read directly [unverified] |
| **Cekura orchestration benchmarks** | Cekura (QA vendor) | Whole-platform agents with STT/LLM/TTS held constant | Fastest reply on agent-performance track: ElevenLabs 1.27 s; voice-quality track: Retell 2.38 s; S2S fastest Grok Voice 3.0 1.34 s ([benchmarks.cekura.ai](https://benchmarks.cekura.ai/)) [verified]. Earlier: Vapi P5–P95 1.66 to 2.95 s; LiveKit median ~2.46 s; Pipecat ~3.15 s [verified-2nd] | Metric definition not on the summary page |
| **Hamming** | Hamming (QA vendor) | Production turn latency | P50 1.4 to 1.7 s, P90 3.3 to 3.8 s [verified-2nd] | Method unpublished |
| **AA Speech-to-Speech index** | Artificial Analysis | S2S reasoning, conversation, agentic tasks + time to first audio | see §5 [verified] | TTFA only |

**The Soniox puzzle.** Pipecat has Soniox stt-rt-v5 at 1.09% semantic WER, near the top. AA has "Soniox Realtime" at 11.9% WER, the worst of 15, and also the cheapest (~$2 per 1,000 min) [verified, chart]. Possible causes: a different model version or configuration (AA tested before v5's 16 June 2026 launch, or with different language settings), semantic vs literal WER, or Earnings22 numbers. I could not resolve it. **Use it on a slide as proof that a single leaderboard is not enough.**

**The ElevenLabs flip.** ElevenLabs Scribe v2 Realtime is joint-best on AA (3.6%) but in the bottom third on Pipecat (3.13% semantic WER) [verified]. Same model, different audio and scoring.

### 4.3 Vendor latency claims (as stated)

| Vendor / model | Claim | Definition given | Source |
|---|---|---|---|
| Deepgram Flux | ~260 ms end of turn; p95 1.5 s | Median audio time after user stops, successful detections | [deepgram.com/flux](https://deepgram.com/flux) [verified] |
| Deepgram Nova-3 | ≤300 ms transcription latency | Server processing time | [Deepgram docs](https://developers.deepgram.com/docs/measuring-streaming-latency.mdx) [verified-2nd] |
| AssemblyAI Universal-Streaming | ~300 ms immutable transcripts; emission P50 317 / P90 597 ms | Word spoken to word returned | [AssemblyAI](https://www.assemblyai.com/docs/streaming/benchmarks) [verified] |
| AssemblyAI U3.5 Pro Realtime | Time to complete turn P50 568 / P90 829 ms | End of turn to final | same [verified] |
| Speechmatics | Partials <500 ms; finals 0.7 to 4 s (`max_delay`) | — | [Speechmatics](https://docs.speechmatics.com/features/realtime-latency) [verified] |
| Soniox v5 Real-Time (16 Jun 2026) | "Faster endpointing"; no ms figure | — | [Soniox](https://soniox.com/blog/soniox-v5-real-time) [verified-2nd] |
| Gladia Solaria | Partials <103 ms; finals ~270 ms | Inconsistent across pages | [Speech Tech Mag](https://www.speechtechmag.com/Articles/News/Speech-Technology-News/Gladia-Launches-Solaria-a-Multilingual-Speech-to-Text-Model%C2%A0-168792.aspx) [verified-2nd] |
| ElevenLabs Scribe v2 Realtime (Nov 2025) | ~150 ms | Not defined | [ElevenLabs changelog](https://elevenlabs.io/docs/changelog/2025/11/12) [verified-2nd] |
| Cartesia Ink-2 (preview May 2026) | No ms claim found; promotes AA ranking | — | [Cartesia docs](https://docs.cartesia.ai/build-with-cartesia/stt-models/latest) [verified-2nd] |
| OpenAI gpt-live-transcribe | Tunable `delay` minimal to xhigh; "exact delay in milliseconds can vary"; no server or semantic VAD | — | [OpenAI](https://developers.openai.com/api/docs/guides/realtime-transcription) [verified] |
| Google Chirp 3 streaming / Gemini 3.5 Transcribe Live | No vendor ms found; AA 1.26 s to final; Pipecat 458 ms (Gemini 3.5 transcribe live) | — | [unverified vendor claim] |
| Azure Speech real-time | No vendor ms found; Pipecat 1,016 ms; AA 0.60 s | — | [unverified vendor claim] |
| AWS Transcribe streaming | Chunk 50 to 200 ms; stabilisation trades speed for accuracy; Pipecat 1,136 ms | — | [AWS](https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html) [verified] |
| NVIDIA Nemotron speech streaming | 80 / 160 / 560 / 1,120 ms chunks, chosen at runtime | Chunk = current frame + right context | [Model card](https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b) [verified] |
| Kyutai STT | 1B: 500 ms delay; 2.6B: 2.5 s delay; 400 streams per H100 | Fixed delay | [Kyutai](https://kyutai.org/stt) [verified-2nd] |

---

## 5. Cascaded vs speech-to-speech

### 5.1 Latency

Artificial Analysis speech-to-speech leaderboard, time to first audio (TTFA, "seconds required to generate the first token of audio output", averaged on Big Bench Audio), read 3 Nov 2026 ([AA](https://artificialanalysis.ai/speech-to-speech)) [verified]:

| Model | TTFA (s) | Big Bench Audio | S2S index |
|---|---|---|---|
| Gemini 2.5 Flash Native Audio Dialog | 0.63 | 69% | — |
| GPT-Realtime-1.5 | 0.81 | 81% | 70.3 |
| Grok Voice 3.0 | 0.81 | 99% | 86.9 |
| Gemini 3.1 Flash Live Minimal | 0.96 | 71% | 64.2 |
| GPT-Realtime-2.1 Minimal | 0.97 | 87% | 70.7 |
| GPT Realtime (Aug '25) | 0.98 | 83% | 69.1 |
| GPT-Realtime-2 (High) | 1.14 | 97% | 73.6 |
| Nova 2.0 Sonic (Mar 2026) | 1.14 | 88% | — |
| Gemini 3.8 Live | 1.18 | 92% | 74.5 |
| GPT-Live-1 (Astra, medium) | 1.34 | 90% | 83.2 |
| Gemini 3.1 Flash Live High | 2.99 | 97% | 72.0 |
| Moshi (Kyutai) | — | 4% | — |

- **Moshi** claims 160 ms theoretical (80 ms frame + 80 ms acoustic delay) and ~200 ms in practice on an L4 GPU. It is full duplex, but its reasoning is weak: 4% on Big Bench Audio ([model card](https://huggingface.co/kyutai/moshiko-candle-q8)) [verified-2nd, AA verified].
- **The pattern** [calc]. More reasoning means slower first audio. Gemini 3.1 Flash Live goes from 0.96 s (minimal) to 2.99 s (high). TTFA excludes turn detection and the caller's network, so add both before comparing with a cascade's 0.9 to 1.3 s voice-to-voice. Pipecat's view: "today, both the OpenAI and Google speech-to-speech models are slower than a well-tuned cascaded (multi-model) voice agent" ([primer](https://voiceaiandvoiceagents.com/)) [verified].

### 5.2 Why enterprises still cascade

| Reason | Evidence |
|---|---|
| **Auditable transcript.** Speech-to-speech APIs "don't offer fast or reliable transcription" good enough "for compliance, downstream evals, or for use in an application UI" | primer [verified] |
| **Tool use and instruction following.** S2S models "do not follow instructions or call tools as reliably as text-mode LLMs". Developers report native-audio Gemini models struggling with function calls that half-cascade models handled | primer [verified]; [Google forum](https://discuss.ai.google.dev/t/bring-back-the-half-cascade-gemini-live-2-5-flash-preview-model/111736) [verified-2nd; anecdotal] |
| **Context control.** Enterprise agents need "a lot of context manipulation and summarization"; the OpenAI Realtime API's own context makes this "tricky"; Gemini Live "is best regarded as an alpha release" for this | primer [verified; Pipecat's opinion] |
| **Choice of LLM.** Use any frontier or private model; swap models without changing voice | structural |
| **Language coverage and choice of STT.** Pick the best STT per language or dialect; add keyterm prompting | structural |
| **Cost.** Primer: per-minute cost from "$0.20 per minute or more" for the OpenAI Realtime API down to "$0.02 per minute" for optimised cascades. A Realtime API agent is "3 to 5 times more expensive" than a GPT-4.1 cascade. AA lists GPT-Realtime-2 (High) at $4.14 per hour of input audio and Gemini 3.1 Flash Live (High) at $1.75 | primer [verified]; [AA S2S article](https://artificialanalysis.ai/articles/announcing-the-artificial-analysis-speech-to-speech-index) [verified] |
| **Where S2S wins.** More natural voice; better understanding of tone; much better on mixed-language speech (e.g. language learning) | primer [verified] |

### 5.3 Hybrid approaches

- **Half-cascade:** native audio input, text-to-speech output. Google offered this in the Live API "for better performance and reliability in production... especially with tool use" ([Gemini Live docs](https://ai.google.dev/api/multimodal-live)) [verified-2nd]. Forum posts say Google has been replacing these models with native audio [verified-2nd].
- **Parallel STT for the record.** Run an S2S model for the conversation and a separate streaming or batch STT on the same audio for the compliance transcript and QA [structural; common pattern, no source quantified].
- **Cascade with S2S-style tricks.** Speculative LLM calls on eager end-of-turn (Flux), streaming TTS, and LLM turn tags (Pipecat) [verified].

---

## 6. Deployment for low latency

### 6.1 Region and edge

- Put the STT, LLM, TTS and orchestration in **one region near the caller**. Mismatched regions for Vapi, the LLM and the transcriber add delay. "Region matters more than any single parameter" ([AssemblyAI, Oct 2026](https://assemblyai.com/blog/how-to-build-lowest-latency-voice-agent-vapi)) [verified].
- RTT, UK user: ~15 ms to eu-west-2 vs ~140 ms to us-west-1. Europe to US ~250 ms; India to US ~350 ms ([primer](https://voiceaiandvoiceagents.com/)) [verified]. Image: `d-primer-edge-routing.svg`.
- EU endpoints exist: AssemblyAI `streaming.eu.assemblyai.com` at the US price [verified]. ElevenLabs offers EU and India data residency [verified-2nd].
- **Near the telephony.** Telnyx says hosting Deepgram Flux at its edge cuts speech-to-response latency by 100 to 300 ms ([Telnyx](https://telnyx.com/release-notes/deepgram-flux-voice-ai-release.md)) [verified-2nd; partner claim]. Twilio's ConversationRelay quotes p50 491 ms / p95 713 ms platform latency from internal benchmarks [verified].

### 6.2 Self-hosting, GPU vs CPU

- **Why self-host:** privacy, data residency, latency where APIs have no nearby region, fine-tuning ([primer §5.4.1](https://voiceaiandvoiceagents.com/)) [verified]. Most frontier streaming models are available as containers: NVIDIA, Deepgram, Soniox, Speechmatics, AssemblyAI, Cartesia [verified-2nd]. Deepgram is also on AWS SageMaker [verified].
- **GPU throughput vs latency** (NVIDIA Nemotron on one H100): 240 concurrent streams at a 160 ms chunk, 560 at 320 ms, 900 at 560 ms [verified, chart]. Kyutai: ~400 streams per H100 [verified-2nd]. Smaller chunks give lower latency, less accuracy and fewer streams per GPU.
- **CPU is enough for turn detection and VAD.** Smart Turn v3 runs in 12.6 ms on a c7a.2xlarge [verified]. Silero VAD takes under 1/8 of a vCPU per stream [verified]. Avoid burstable instances for turn models (LiveKit) [verified].
- **Hosting is not the cost driver.** "Cloud runtime costs for the agent processes themselves are less than one percent of total per-minute cost" (primer) [verified].

### 6.3 On-device

- **Apple SpeechAnalyzer / SpeechTranscriber** (iOS 26, WWDC25): on-device, long-form, with opt-in volatile results. One developer measured ~0.3 to 0.5 s to the first volatile result on an iPhone 16e (iOS 26.5, warm start) ([dev.to](https://dev.to/simple_memo/ios-26s-speechanalyzer-on-a-live-mic-the-5-things-the-docs-dont-tell-you-2ng5)) [unverified; single developer].
- **Moonshine v2** (arXiv 2602.12241, Feb 2026): streaming encoder with sliding-window attention for "bounded, low-latency inference" on edge devices; quality claimed on par with models 6x larger ([arXiv](https://arxiv.org/abs/2602.12241)) [verified-2nd]. Latency figures of 50 to 107 ms circulate on aggregator pages [unverified].
- **Use cases:** dictation, offline field work, privacy-first captions. On-device removes network latency but caps model size, so accuracy is usually below cloud frontier models.

### 6.4 Concurrency limits

| Provider | Limit | Source |
|---|---|---|
| Deepgram PAYG | 150 concurrent streaming connections | [Deepgram pricing](https://deepgram.com/pricing) [verified] |
| AssemblyAI PAYG | 100 new streams per minute (free tier 5) | [AssemblyAI pricing](https://www.assemblyai.com/pricing) [verified] |
| ElevenLabs Scribe v2 Realtime | Enterprise plans 30+ concurrent sessions | [AlternativeTo](https://alternativeto.net/news/2025/11/elevenlabs-launches-scribe-v2-realtime-its-latest-ultra-low-latency-speech-to-text-model) [verified-2nd] |

Contact-centre peaks (Monday 9 am) can exceed default limits. Negotiate concurrency, not just price.

### 6.5 Streaming vs batch pricing

| Model | Streaming | Batch | Ratio [calc] | Source |
|---|---|---|---|---|
| Deepgram Nova-3 (mono) | $0.0077/min ($0.462/hr) | $0.0043/min ($0.258/hr) | 1.8x | [Deepgram](https://deepgram.com/pricing) [verified] |
| Deepgram Nova-3 (multi) | $0.0092/min | $0.0052/min | 1.8x | same [verified] |
| AssemblyAI top model | Universal-3.6 Pro Realtime $0.45/hr | Universal-3.5 Pro $0.21/hr | 2.1x | [AssemblyAI](https://www.assemblyai.com/pricing) [verified] |
| AssemblyAI basic | Universal-Streaming $0.15/hr | Universal-2 $0.15/hr | 1.0x | same [verified] |
| OpenAI | gpt-live-transcribe $0.017/min ($1.02/hr) | GPT-4o Transcribe ~$6/1,000 min ($0.36/hr) on AA | ~2.8x | [OpenAI](https://developers.openai.com/api/docs/models/gpt-live-transcribe) [verified]; AA batch [verified] |
| ElevenLabs | Scribe v2 Realtime ~$6.5/1,000 min on AA chart | Scribe v2 $3.67/1,000 min | ~1.8x | AA [chart / verified] |

Also: AssemblyAI streaming is "billed on how long the WebSocket stays open, not on how much audio is sent" [verified]. An agent that holds the connection through hold music pays for it.

---

## 7. Use-case patterns

### 7.1 Latency tiers

| Tier | Latency budget | Use cases | What dominates |
|---|---|---|---|
| **Conversational real time** | ~1 s voice-to-voice; STT final ≤300 to 500 ms | Voice agents (Vapi, Retell, LiveKit, Pipecat, ElevenLabs Agents) | Turn detection, LLM TTFT, network |
| **Assistive real time** | 1 to 5 s | Agent assist, real-time QA and compliance alerts, live meeting notes | Partial stability, speaker attribution, suggestion relevance |
| **Display real time** | 1 to 5 s; Ofcom mean 4.5 s for TV | Live captions (Teams, Zoom, Meet, broadcast, events) | Flicker, readability, accuracy on names |
| **Near-real-time / post-call** | Seconds to minutes after the end | Clinical notes, post-call analytics, QA scoring, summaries | Accuracy, diarisation, formatting; batch wins |

### 7.2 Contact centre

- **Dual-channel audio is the default and an advantage.** Telephony platforms expose the caller and agent as separate tracks: Twilio's `inbound_track`, `outbound_track` and `both_tracks` ([Twilio docs](https://www.twilio.com/docs/voice/twiml/stream)) [verified]. AssemblyAI: "multichannel audio in a single connection isn't supported", so open one stream per channel. Speaker identity is then deterministic, with no diarisation needed ([AssemblyAI](https://assemblyai.com/blog/build-real-time-agent-assist)) [verified]. Mono recordings need streaming diarisation, whose corrections can arrive ~0.5 s after the stream ends [verified].
- **Platforms:**
  - *Amazon Connect Contact Lens:* real-time analytics on live calls since Dec 2020; streaming segments since 2022; four real-time languages vs 18 post-call [verified-2nd].
  - *Genesys Cloud:* transcription 3 to 5 s with the low-latency toggle; full transcript ~15 s after the call [verified].
  - *Google Agent Assist:* real-time transcription and knowledge suggestions; no latency published [verified-2nd].
  - *NICE CXone:* no figure found [unverified].
- **Pattern:** stream both channels → partial transcripts → rules or LLM classifiers for prompts and compliance → final transcripts → batch re-transcription after the call for QA and analytics. Batch is cheaper and more accurate (§3.1, §6.5), so many teams **re-run the recording in batch for the system of record**.

### 7.3 Live captions

- Accuracy and stability matter more than milliseconds. Partial-results stabilisation (AWS) or immutable partials (AssemblyAI) reduce flicker. Speechmatics recommends partials with `max_delay` 0.7 to 1.0 s for captions [verified-2nd].
- A broadcast chain already allows 3 to 5 s (§1.3). Ofcom even encouraged short transmission delays of "up to about 30 seconds" on some non-time-sensitive programmes to improve subtitle quality ([Ofcom 2013 statement](https://www.ofcom.org.uk/__data/assets/pdf_file/0017/45602/subtitling.pdf)) [verified-2nd].
- OpenAI suggests its `low` delay setting "for low-latency live captions" [verified].

### 7.4 Voice agents

- **Platforms:** Vapi, Retell, ElevenLabs Agents, Bland and Synthflow (managed); LiveKit Agents and Pipecat (frameworks, open source).
- **Measured differences are large and depend on configuration.** Cekura's best platform reply time is 1.27 s; Hamming's production P50 is 1.4 to 1.7 s; vendor claims are ~600 ms [verified / verified-2nd].
- **Checklist from the sources:**
  - model-based turn detection, not a fixed timeout;
  - STT with a finalise signal;
  - stream the LLM into TTS sentence by sentence;
  - one region;
  - WebRTC for apps;
  - measure P95, not P50;
  - occasionally measure voice-to-voice from a recording waveform (primer).

### 7.5 Clinical and ambient scribing

- **Effectively batch.** Microsoft Dragon Copilot "transcribes the conversation, extracts the relevant information and creates a note once the clinician stops ambient recording" ([Microsoft support](https://support.microsoft.com/es-es/topic/record-a-patient-conversation-c0d40e4d-249f-4d58-8197-97c49e8f5af6)) [verified-2nd]. Yale New Haven Health: Abridge notes available "within 30 seconds of the completion of the visit recording" ([YNHHS](https://ynhhs.org/publications/perspectives/071124/abridge-program)) [verified-2nd]. Fred Hutch reports "less than a minute" [verified-2nd, headline].
- **What does need streaming:** capture reliability (audio must not be lost when offline; Abridge holds notes until the phone reconnects [verified-2nd]); live captions for deaf or hard-of-hearing patients; in-visit prompts (unverified as a product feature).
- **Implication:** clinical clients should judge vendors on accuracy for medical terms, speaker attribution and note quality, not streaming latency. The streaming accuracy penalty (§3.1) is a reason *not* to stream when you don't need to.

---

## 8. Open questions and things not verified

- No peer-reviewed study ties voice-agent response delay to abandonment or CSAT. Every number in circulation is vendor-made.
- The Soniox gap between AA and Pipecat is unexplained.
- No published latency for Teams, Zoom or Meet live captions. No vendor ms figures for Google Chirp 3 streaming, Azure or NICE.
- Ofcom's final 2024 guidance wording on 4.5 s is confirmed only via the consultation and secondary coverage, not the final PDF.
- The 20 ms μ-law packet size for Twilio is common practice, not documented in what I read.
- Coval's live leaderboard was not read directly.

---

## Source index (primary)

- Stivers et al. 2009, PNAS: https://pmc.ncbi.nlm.nih.gov/articles/PMC2705608/
- Levinson & Torreira 2015: https://doi.org/10.3389/fpsyg.2015.00731
- Pipecat STT benchmark: https://github.com/pipecat-ai/stt-benchmark ; Daily write-up: https://www.daily.co/blog/benchmarking-stt-for-voice-agents/
- Voice AI & Voice Agents primer: https://voiceaiandvoiceagents.com/
- Twilio latency guide: https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents
- Artificial Analysis streaming STT: https://artificialanalysis.ai/articles/new-streaming-speech-to-text-benchmark-aa-wer-streaming ; methodology: https://artificialanalysis.ai/speech-to-text/methodology ; batch: https://artificialanalysis.ai/speech-to-text ; S2S: https://artificialanalysis.ai/speech-to-speech
- Deepgram Flux: https://deepgram.com/flux ; pricing: https://deepgram.com/pricing ; endpointing: https://developers.deepgram.com/docs/endpointing
- AssemblyAI streaming benchmarks: https://www.assemblyai.com/docs/streaming/benchmarks ; turn detection: https://www.assemblyai.com/docs/streaming/turn-detection ; pricing: https://www.assemblyai.com/pricing
- Speechmatics latency: https://docs.speechmatics.com/features/realtime-latency
- NVIDIA Nemotron streaming: https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b
- LiveKit turn detector: https://docs.livekit.io/agents/build/turns/turn-detector/
- Smart Turn v3: https://www.daily.co/blog/announcing-smart-turn-v3-with-cpu-inference-in-just-12ms/
- OpenAI realtime VAD / transcription: https://developers.openai.com/api/docs/guides/realtime-vad ; https://developers.openai.com/api/docs/guides/realtime-transcription
- AWS Transcribe streaming: https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html
- Ofcom: https://www.ofcom.org.uk/__data/assets/pdf_file/0024/264336/accessibility-best-practice-summary.pdf
- Genesys: https://help.genesys.cloud/faqs/what-is-the-expected-level-of-accuracy-when-working-voice-transcription/
