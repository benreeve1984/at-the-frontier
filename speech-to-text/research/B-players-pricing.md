# B. Players, prices and where they run: speech to text (checked 2026-11-03)

Machine-readable version: `B-players.json` (79 entries, same ids). Prices were checked on 2026-11-03 against the vendor pricing page, the vendor docs, or the cloud's own price API (Azure Retail Prices API, the AWS price map behind aws.amazon.com/transcribe/pricing). Entries with `"verified": false` and anything marked **(unverified)** below came from a secondary source or from memory, or the mapping from a price meter to a product is not confirmed.

Hosting and billing are kept apart, as in sessions 1 and 2. `hosted` lists the clouds whose own infrastructure runs the model. `billing` lists ways to pay. A marketplace listing does not move processing into your cloud.

## TL;DR for the deck

1. **Batch transcription now costs $0.10–0.40 per audio hour almost everywhere.** Soniox and xAI charge $0.10, Gladia Solaria-3 about $0.18, Azure batch $0.18, Mistral Voxtral 3 $0.21–0.24, AssemblyAI Universal-3.5 Pro $0.21, ElevenLabs Scribe v2 $0.22, Deepgram Nova-3 $0.26, OpenAI GPT-Transcribe $0.27, Gemini 3.5 Transcribe about $0.30, and AWS, Azure Fast Transcription and whisper-1 $0.36. Hosted Whisper on Groq is $0.04. Google Chirp 3 at $0.96 is the outlier at list price (Google's own dynamic batch is $0.18).
2. **Real-time costs about 1.5 to 4 times batch, and the spread is wide: $0.12 to $1.02 per hour.**
   - Cheapest: Soniox $0.12, AssemblyAI Universal-Streaming $0.15, Speechmatics Linden $0.15, xAI $0.20, Speechmatics Melia $0.20.
   - Middle: ElevenLabs Scribe v2 Realtime and Cartesia Ink 2 $0.39, AssemblyAI Universal-3.6 Pro $0.45, Deepgram Nova-3 and Flux $0.46, Mistral Voxtral Realtime 3 $0.48, Gemini 3.5 Transcribe Live $0.54, AWS Transcribe $0.60.
   - Top: Google Chirp 3 $0.96, Azure real-time $1.00, OpenAI GPT-Live-Transcribe $1.02.
3. **Every frontier lab now sells a dedicated transcription model, all launched in the last four months.** OpenAI GPT-Transcribe and GPT-Live-Transcribe (28 Jul 2026), Google Gemini 3.5 Transcribe and Transcribe Live (Aug 2026), Microsoft MAI-Transcribe-2 and 2-Streaming (Aug–Sep 2026), Mistral Voxtral Transcribe 3 (20 Oct 2026). Most publish a FLEURS or WER table showing themselves ahead, so test on the client's own audio.
4. **OpenAI is retiring every older transcription model on 26 Feb 2027**, including whisper-1, gpt-4o-transcribe, gpt-4o-mini-transcribe, gpt-4o-transcribe-diarize and the translations endpoint. The new models have no diarisation, word timestamps or subtitle output at launch. **A client who needs speaker labels from OpenAI has no replacement.**
5. **Each hyperscaler now has a modern model that runs in its own cloud.**
   - **Azure** has the most choice: Azure Speech, LLM Speech, MAI-Transcribe-2, and OpenAI's GPT-Transcribe ($0.27) and GPT-Live-Transcribe ($1.02), with EU/US Data Zone at +10%.
   - **Google** has Chirp 3 and Gemini 3.5 Transcribe on Vertex.
   - **AWS** has Transcribe, with flat $0.36 batch and $0.60 streaming prices. It has no frontier-lab ASR model on Bedrock beyond 2025's Voxtral 1.0 and Nova Sonic.
   - None of the specialist vendors (Deepgram, AssemblyAI, Speechmatics, ElevenLabs, Soniox) is first-party hosted in any cloud. Their route into a client's tenancy is **self-hosting** (Deepgram, Speechmatics, AssemblyAI, Gladia, Cartesia, ElevenLabs on Enterprise).
6. **Self-hosting open models is close to free per audio hour once you have the GPU.**
   - NVIDIA says Nemotron 3.5 ASR Streaming runs 240 to 2,400 live streams per H100, which is about $0.002–0.02 per audio hour at $4 per GPU-hour.
   - NVIDIA's Nemotron 3.5 Transcribe NIM processes about 8,000 audio hours per GPU-hour.
   - The cost is engineering and peak capacity, not the per-hour rate.
7. **Diarisation is usually included in batch, but streaming diarisation is often an add-on or missing.**
   - **Add-on:** Azure +$0.30/hr in real-time (free in batch), Deepgram +$0.12/hr in both modes, AssemblyAI +$0.12 streaming and +$0.02 batch.
   - **Included in streaming:** Soniox, xAI and Speechmatics.
   - **Missing:** Chirp 3, Gemini 3.5 Transcribe Live, OpenAI's new models, ElevenLabs Realtime and Cartesia Ink 2 **do not offer streaming diarisation at all**.
8. **Consolidation and churn:** Deepgram announced on 29 Oct 2026 that it is acquiring Daily, maker of the Pipecat voice-agent framework. Google shuts down Gemini 2.5 Flash native audio on 17 Nov 2026. Mistral retires Voxtral Transcribe 2 on 30 Apr 2027. Azure's Fast Transcription and MAI-Transcribe-2 promotional prices end on 31 Dec 2026.

## Assumptions behind the normalised costs

- **Unit:** US$ per hour of input audio, pay-as-you-go list price, single channel. Multichannel audio is billed per channel by Google, Deepgram and others.
- **Per-minute and per-second rates** are multiplied by 60 or 3,600. Minimums are noted: AWS 15 s per request, Rev 15 s, Groq 10 s. Deepgram, Azure, Google and AWS bill per second.
- **Gemini tokens:** Google documents 25 audio tokens per second (90,000 per hour) and assumes 175 output text tokens per minute (10,500 per hour). The same assumption is used for Gemini general models (3.8 Flash, 3.5 Flash-Lite, 4 Argon). Thinking tokens are billed as output and are not included. For 3.8 Flash and 4 Argon the pricing page lists one input price with no separate audio rate, so audio is assumed to cost the same **(unverified)**.
- **OpenAI:** The new models are priced per minute. For gpt-realtime-2.1 (speech-to-speech) OpenAI's pages do not state audio tokens per second, so no per-hour figure is given. An estimate of about 600 input audio tokens per minute gives ~$1.15/hr of listening on gpt-realtime-2.1 **(unverified)**.
- **Soniox:** uses Soniox's own figure of ~30,000 audio tokens per hour, which gives $0.10/hr async and $0.12/hr real-time before text tokens.
- **Gladia:** EUR converted at USD 1.1216 (ECB reference rate, 2 Nov 2026).
- **Cartesia:** 3 credits per audio second. Cartesia states $0.39/hr on the $299/month Scale plan. Small plans cost more per hour.
- **Self-hosted GPU cost:** H100 at $2–8 per GPU-hour. Together lists $1.99–3.99 for HGX H100 clusters and $5.49 for dedicated endpoints; Fireworks lists $8.00. $4 is used as the midpoint. Throughput comes from the vendor's model card. Real deployments need headroom for peaks, so multiply by 2 to 3 times.

## 1. Price ladder

**Batch (pre-recorded files), $ per audio hour**

| Band | $/hr | Who |
|---|---:|---|
| Near zero | 0–0.06 | Self-hosted open models (Nemotron, Parakeet, Qwen3-ASR, Whisper: <$0.01 at full load), Groq Whisper turbo $0.04, Gemini 3.5 Flash-Lite ~$0.05 |
| Very cheap | 0.09–0.20 | Together Whisper/Parakeet $0.09, Soniox $0.10, xAI $0.10, Gemini 3.8 Flash ~$0.11, Speechmatics Melia 1 $0.12, AssemblyAI Universal-2 $0.15, Gladia Solaria-3 ~$0.18, Azure batch $0.18, Google dynamic batch $0.18, OpenAI gpt-4o-mini-transcribe $0.18 (retiring), Rev Reverb $0.20 |
| Mainstream | 0.21–0.40 | Voxtral Mini Transcribe 3 $0.21, AssemblyAI Universal-3.5 Pro $0.21, ElevenLabs Scribe v2 $0.22, Speechmatics Standard $0.23, Voxtral Small Transcribe 3 $0.24, Deepgram Nova-3 $0.26 (multilingual $0.31), OpenAI GPT-Transcribe $0.27, Gemini 3.5 Transcribe ~$0.30, Gladia Solaria-1 ~$0.30, AWS Transcribe $0.36, Azure Fast Transcription / LLM Speech $0.36, whisper-1 $0.36, Speechmatics Enhanced $0.38 |
| Premium | 0.54–0.96 | MAI-Transcribe-2 $0.54 meter (promo price to 31 Dec 2026 **unverified**), Google Chirp 3 $0.96 (falls to $0.24 above 2M min/month) |
| Specialist bundles | 1.80–6.00 | AWS Call Analytics $1.80, AWS Transcribe Medical $4.50, Google medical $4.68, AWS HealthScribe $6.00 |

**Streaming (real-time), $ per audio hour**

| Band | $/hr | Who |
|---|---:|---|
| Self-hosted | ~0.002–0.02 | Nemotron 3.5 ASR Streaming on one H100 (240–2,400 streams) |
| Cheap | 0.12–0.24 | Soniox $0.12, AssemblyAI Universal-Streaming $0.15, Speechmatics Linden 1 $0.15, xAI $0.20, Speechmatics Melia 1 $0.20, Together Whisper streaming $0.21, Speechmatics Oak 1 $0.23 |
| Mainstream | 0.39–0.60 | ElevenLabs Scribe v2 Realtime $0.39, Cartesia Ink 2 $0.39, Speechmatics Enhanced $0.40, AssemblyAI Universal-3.6 Pro $0.45, Deepgram Nova-3 / Flux $0.46 (multilingual Nova-3 $0.55), Voxtral Realtime 3 $0.48, Gemini 3.5 Transcribe Live ~$0.54, MAI-Transcribe-2-Streaming $0.54 **(unverified mapping)**, AWS Transcribe $0.60 |
| Expensive | 0.76–1.02 | Gladia real-time ~$0.76, Google Chirp 3 $0.96, Azure real-time $1.00 (+$0.30 per add-on), OpenAI GPT-Live-Transcribe and GPT-Realtime-Whisper $1.02 (Azure Data Zone $1.12) |
| Speech-to-speech | 3.00–4.80 | OpenAI GPT-Live 1 $3.00 + backend model, xAI Grok Voice $4.80, Deepgram Voice Agent bundle $3.00–9.78 |

Volume discounts: Deepgram Growth (from $4,000/yr prepaid) cuts about 15–20%. Azure commitment tiers take real-time from $1.00 to $0.80 (2k hours a month) or $0.40 (100k hours a month). Google tiers take Chirp from $0.96 to $0.24 above 2M minutes a month. AWS Call Analytics falls from $1.80 to $0.68. Speechmatics offers up to 25% off, plus 33% off if you opt in to model training.

## 2. Inside each cloud, and what runs outside

**AWS**
- **Amazon Transcribe:** batch $0.36/hr and streaming $0.60/hr, flat. It covers 113 locales in batch and 99 in streaming (45 of those only in some regions). Speaker partitioning is included. Custom language models cost the same as standard at the first tier. PII redaction adds $0.144/hr.
  - The page shows a flat $0.006/min. AWS's list price in 2025 was tiered from $0.024/min (from memory). **No AWS announcement of the cut was found**, so confirm the price in the client's own billing console before quoting it.
- **Call Analytics** costs $1.80/hr at tier 1. **Medical** costs $4.50/hr. **HealthScribe** costs $6.00/hr. **Bedrock Data Automation** audio standard output costs $0.36/hr.
- **Nova 2.5 Sonic** (speech-to-speech, GA 5 Oct 2026, including the Stockholm region) costs speech $3/$12 per M tokens. AWS says text-token rates apply when it is used for transcription.
- **Bedrock** also hosts Voxtral Mini/Small 1.0 (2025 generation) at $0.04–0.30 per M tokens. How audio tokens are counted is not documented.
- **SageMaker** routes that run in the client's account:
  - JumpStart: Voxtral-Mini-4B-Realtime (Jul 2026) and Whisper.
  - Marketplace model packages: Deepgram, which Deepgram says runs air-gapped.
- **Not on AWS infrastructure:** OpenAI, Google, AssemblyAI, Speechmatics, ElevenLabs, Soniox. AWS Marketplace listings for these are billing only.

**Azure**
- **Azure Speech:**
  - Real-time $1.00/hr. Batch $0.18/hr. Fast transcription $0.36/hr. Custom models $1.20 real-time and $0.225 batch.
  - Real-time diarisation and continuous language ID cost +$0.30/hr each and are free in batch.
- **LLM Speech:** 50 languages, with translation, at the Fast Transcription price.
- **MAI-Transcribe-2:** 60 languages, preview, retail meter $0.54/hr. A promotion runs to 31 Dec 2026, and a $0.10/hr "Fast Transcription Promo" meter appeared on 1 Sep 2026. Which product that meter covers is **unverified**.
- **MAI-Transcribe-2-Streaming:** preview, 60 languages.
- **OpenAI models in Azure:**
  - gpt-transcribe: $0.27 Global, $0.297 Data Zone.
  - gpt-live-transcribe and gpt-realtime-whisper: $1.02 Global, $1.122 Data Zone.
  - Whisper batch: $0.36.
  - gpt-realtime-2.1 and GPT-Live 1: $3.00/hr Global.
- **Voice Live API** bundles STT, an LLM and TTS.
- **Containers:**
  - Connected containers run from $0.76/hr overage on the 2k-hour tier down to $0.38/hr on the 100k tier.
  - Disconnected (air-gapped) Fast Transcription costs from $8,208 a year for 2k hours a month.
  - **Azure is the only hyperscaler with a supported air-gapped STT product.**
- No Deepgram, ElevenLabs or Voxtral model was found as a first-party Foundry model. Check the Foundry catalog for the client's region.

**Google Cloud**
- **Speech-to-Text V2:**
  - chirp_3 is GA in the `us` and `eu` multi-regions: 109 locales (29 GA), streaming, sync and batch.
  - Diarisation is batch-only, for a subset of languages.
  - $0.96/hr, falling to $0.24 with volume. Dynamic batch costs $0.18/hr.
- **Gemini 3.5 Transcribe on Vertex** costs $0.306/hr: 85+ languages, diarisation (up to 8 speakers), word timestamps, 1,000-term vocabulary.
- **Gemini 3.5 Transcribe Live on Vertex** costs $0.536/hr. Only final committed tokens are billed. It has no diarisation, and sessions are limited to 10 minutes.
- **Gemini 3.8 Live** (speech-to-speech) costs $3/M audio in and $12/M audio out.
- Gemini general models can also transcribe through a prompt, at about $0.05–0.29/hr.
- The specialist vendors are not hosted on Vertex. Whisper is in Model Garden (from memory).

**Outside all three clouds:** OpenAI direct, the Gemini API (AI Studio), Mistral (EU-hosted), xAI, Deepgram cloud, AssemblyAI, Speechmatics, Gladia, Soniox, ElevenLabs, Cartesia, Rev, Groq, Together, Fireworks.

## 3. Self-hosting

| Option | Licence | Fit | Throughput (source) | Rough cost per audio hour at $4/GPU-hr |
|---|---|---|---|---|
| NVIDIA Nemotron 3.5 ASR Streaming 0.6B | OpenMDW-1.1 | Live, 40 locales, 80–1,120 ms chunks | 240 streams per H100 at 80 ms, 2,400 at 1,120 ms (HF card) | $0.017 (80 ms) to $0.0017 (1.1 s) |
| NVIDIA Nemotron 3.5 Transcribe 30B-A4B | OpenMDW-1.1 | Batch, 40 languages, speaker-attributed, translation | 2,238 audio-s/s on one RTX PRO 6000 via NIM. The open vLLM path is ~2x slower (HF card) | <$0.001 |
| NVIDIA Parakeet TDT 0.6B v3 / Canary 1B v2 | CC-BY-4.0 | Batch, 25 EU languages | not re-checked. Together hosts it at $0.09/hr | <$0.01 (estimate) |
| Qwen3-ASR 0.6B / 1.7B | Apache-2.0 | 52 languages and dialects, streaming and offline | 0.6B: ~2,000x real time at concurrency 128 (Qwen) | ~$0.002 |
| Whisper large-v3 / turbo | MIT | Batch, ~99 languages | Groq sells turbo at $0.04/hr as a ceiling | ~$0.01–0.04 |
| IBM Granite Speech 5.0 2B / 470M TurboCTC | Apache-2.0 | 6–7 languages, edge-capable | not stated | low |
| Microsoft VibeVoice-ASR / -Streaming-7B | MIT | 60-min single-pass with diarisation (50+ languages); streaming with speaker labels (10 languages) | not stated | not estimated |
| Meta Omnilingual ASR (300M–7B) | Apache-2.0 | 1,600+ languages, long tail | not stated | not estimated |
| Voxtral Mini 4B Realtime 2602 | Apache-2.0 | Streaming, 13 languages; Arabic variant | not stated | not estimated |
| Kyutai STT 1B / 2.6B | CC-BY-4.0 | Streaming en/fr, 0.5 s / 2.5 s delay | not stated | not estimated |
| Moonshine Streaming | MIT (English) | On-device, <1 GB | edge | device only |

**Commercial self-host (customer VPC or on-prem):**
- Deepgram: Enterprise containers, needs NVIDIA GPUs, FIPS 140-3 images, or a SageMaker model package.
- Speechmatics: containers, virtual appliance, hybrid, on-device.
- AssemblyAI: self-hosted streaming.
- Gladia: "custom hosting".
- Cartesia: on-prem by sales.
- ElevenLabs: "private deployments".
- Azure: Speech containers.
- These are priced by contract. None publishes a per-hour rate.

## 4. Diarisation pricing and support

| Vendor / model | Batch | Streaming | Extra cost |
|---|---|---|---|
| AWS Transcribe | yes | yes | included |
| Azure Speech | yes (free in batch) | yes | +$0.30/hr real-time |
| Google Chirp 3 | yes (batch, subset of languages) | **no** | included |
| Gemini 3.5 Transcribe | yes (≤8 speakers) | **no** (Live) | included |
| OpenAI GPT-Transcribe / Live | **no** | **no** | diarize model retiring 26 Feb 2027 |
| MAI-Transcribe-2 / LLM Speech | yes (mono only) | not stated | included |
| Deepgram Nova-3 | yes | yes | +$0.12/hr ($0.10 Growth) |
| AssemblyAI | yes | yes | +$0.02/hr batch, +$0.12/hr streaming |
| Speechmatics | yes | yes | included |
| Soniox | yes | yes | included |
| xAI Grok STT | yes | yes | included |
| ElevenLabs Scribe v2 | yes (≤32 speakers) | **no** | included |
| Gladia | yes (async only) | **no** | included |
| Mistral Voxtral 3 | yes | yes (Realtime 3) | included |
| Cartesia Ink 2 | n/a | **no** | n/a |

## 5. Languages: batch vs streaming

Streaming usually covers fewer languages, and the newest "pro" models cover fewer still.
- AWS Transcribe: 113 batch, 99 streaming.
- Google Chirp 3: 109 locales for both, but only 29 GA.
- Gemini 3.5 Transcribe: 85+ for both.
- Azure: 100+ locales for STT (Microsoft's figure). LLM Speech 50, MAI-Transcribe-2 60.
- AssemblyAI: Universal-2 99 vs Universal-3.5 Pro 18 (batch); Universal-3.6 Pro Realtime 32, Universal-Streaming English or 6.
- Deepgram: Nova-3 has 40+ monolingual languages, with code-switching in 10. Flux is English or 10.
- Speechmatics: 55–56 in both modes. Melia 1 code-switches without a language choice.
- ElevenLabs Scribe v2 / Realtime: 90+ for both.
- Soniox: 60+ for both, translation included.
- Gladia: Solaria-1 100+ for both; Solaria-3 5 languages, batch only.
- xAI: 25+.
- Cartesia Ink 2: 5.
- Open models: Meta Omnilingual 1,600+, Qwen3-ASR 52, Nemotron 40, Parakeet/Canary 25.

## 6. Data handling and residency

- **Inside the client's cloud tenancy:**
  - AWS: Transcribe, Nova Sonic, Bedrock Voxtral.
  - Azure: Speech, LLM Speech, MAI, Azure OpenAI with Data Zone EU/US at +10%.
  - Google: Speech-to-Text with `eu` multi-region, Gemini on Vertex.
  - Watch-outs:
    - AWS AI services may use content for service improvement unless the organisation sets an AI services opt-out policy.
    - MAI-Transcribe-1/1.5 route globally to fixed regions (East/West US; then Central US, Sweden Central, Southeast Asia). Check residency before sending EU audio.
- **EU processing from specialists:**
  - Deepgram: dedicated EU endpoint `api.eu.deepgram.com`.
  - AssemblyAI: EU data residency endpoint.
  - Speechmatics: EU, US or AUS processing location. Real-time audio is never stored. Batch audio is auto-deleted after 7 days.
  - Mistral: EU-hosted.
  - ElevenLabs: data residency offering.
  - Gladia: French company. **Self-serve trains on customer audio by default** (opt-out is free); Enterprise is no-training plus ZDR.
- **Model-training defaults to check:**
  - Gladia self-serve and the Gemini API free tier use customer data by default.
  - Speechmatics trains on data only if you opt in, for a 33% discount.
  - OpenAI, Gemini paid tier and Vertex do not train on API data.
- **HIPAA BAAs:** AWS, Azure, Google, Deepgram (Enterprise), AssemblyAI, Speechmatics, ElevenLabs (with Zero Retention Mode), Gladia, Rev (on request).

## 7. Recent and scheduled changes (2025–2026)

**OpenAI**
- 28 Jul 2026: GPT-Transcribe ($0.0045/min) and GPT-Live-Transcribe ($0.017/min) launched.
- 26 Feb 2027: whisper-1, gpt-4o-transcribe, gpt-4o-mini-transcribe, gpt-4o-transcribe-diarize and /v1/audio/translations shut down (notice given 26 Aug 2026).
- 20 Jan 2027: gpt-realtime and gpt-4o-realtime shut down, replaced by gpt-realtime-2.1.
- 6 Jan 2027: tts-1 and gpt-4o-mini-tts shut down.

**Google**
- Chirp 3 GA 13 Oct 2025.
- Gemini 3.5 Transcribe and Transcribe Live: Aug 2026.
- Gemini 3.8 Live: 15 Sep 2026.
- Gemini 2.5 Flash native audio and 3.1 Flash Live preview shut down 17 Nov 2026.
- Gemini 2.5 Flash routes to 3.5 Flash-Lite from 1 Dec 2026.
- Gemini 4 Argon token prices double on 1 Dec 2026. Gemini 3.8 and 3.6 Flash prices double on 1 Jan 2027.

**Microsoft**
- MAI-Transcribe-1 (2 Apr 2026, $0.36/hr, 25 languages).
- MAI-Transcribe-1.5 (2 Jun 2026, 43 languages).
- MAI-Transcribe-2 and 2-Streaming (preview, Aug–Sep 2026, 60 languages).
- LLM Speech 07 2026.
- Promotional pricing to 31 Dec 2026.
- Disconnected Fast Transcription containers (meters from Jun 2026).
- A new "Emb Speech to Text" meter at $1.00/hr effective 1 Nov 2026 **(meaning unverified)**.

**AWS**
- Transcribe list price is now flat $0.006/min batch and $0.01/min streaming (date of change not found).
- Nova 2 Sonic: Dec 2025. Nova 2.5 Sonic: 5 Oct 2026, same price.
- Customer-managed KMS keys for Transcribe custom resources: Sep 2026.
- Voxtral-Mini-4B-Realtime on SageMaker JumpStart: Jul 2026.

**Mistral**
- Voxtral Transcribe 2 and Realtime (open weights, Feb 2026).
- Voxtral 3 family (20 Oct 2026, public preview, closed "Premier" weights).
- Voxtral 2 API models deprecated 31 Oct 2026 and retired 30 Apr 2027.

**Specialists**
- Deepgram is acquiring Daily/Pipecat (announced 29 Oct 2026, not yet closed). Flux Multilingual launched, and Flux TTS is promoted with matching credits to 31 Dec 2026.
- AssemblyAI launched Universal-3.5 Pro, Universal-3.6 Pro Realtime, a Sync API and a Dictation API. Slam-1 is no longer on the pricing page.
- Soniox v5 (Jun 2026). v4 aliases now route to v5.
- Speechmatics: Melia 1, Oak 1 and Linden 1, with Linden cut from $0.20 to $0.15.
- ElevenLabs: Scribe v2, v2 Realtime and v2 Medical.
- Cartesia Ink 2 (17 Sep 2026).
- xAI Grok STT/TTS APIs (17 Apr 2026). The company now brands itself SpaceXSI.

**Open weights**
- Qwen3-ASR (29 Jan 2026).
- NVIDIA Nemotron Speech Streaming (Jan 2026), Parakeet-unified-en (Apr), Nemotron 3.5 ASR Streaming (May–Jun) and Nemotron 3.5 Transcribe (7 Oct 2026).
- IBM Granite Speech 5.0 (Aug–Oct 2026).
- Microsoft VibeVoice-ASR (Jan 2026) and Streaming-7B (Sep 2026).
- Meta Omnilingual ASR (Nov 2025).
- Moonshine Streaming (Jan 2026).

## 8. Gaps and things not confirmed

- **AWS Transcribe price cut:** the current flat rate was read from AWS's own price data, but no announcement or effective date was found.
- **Azure MAI-Transcribe-2:** which product the $0.54 and $0.10 promo meters map to, and the price after 31 Dec 2026.
- **MAI-Transcribe-2-Streaming:** latency and diarisation.
- **OpenAI:** realtime audio tokens per second (needed to normalise gpt-realtime per hour). Whether GPT-Transcribe will gain diarisation before 26 Feb 2027.
- **Gemini general models:** whether 3.8 Flash and 4 Argon bill audio at the text rate.
- **Bedrock Voxtral:** audio-token accounting.
- **Fireworks:** speech pricing (third-party figure only).
- **Rev:** streaming price.
- **Apple SpeechTranscriber:** language count after iOS 26.
- **ZDR terms** for Soniox, xAI and Cartesia were not read.
- **Language counts:** Deepgram's exact monolingual Nova-3 count, and the AWS Call Analytics language list.
- **Images:** none downloaded. No vendor visual was clear enough to reuse without a JS-rendered page.
