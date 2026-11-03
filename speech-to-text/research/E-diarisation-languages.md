# Research pack E: Speaker diarisation and language coverage

Session 3, "Speech to text". Compiled 3 November 2026.

Tags: **[verified]** = checked against a primary source this session (link inline). **[verified-2nd]** = checked, but only through a secondary source, a summariser, or a vendor page read second-hand. **[unverified]** = found but not confirmed. **[calc]** = my arithmetic or my reading of verified material.

Companion files: `E-languages.json` (per-language error rates, 126 rows), `E-coverage.json` (20 systems: languages in batch and streaming, diarisation, code-switching), `images-E.md` (13 visuals in `assets/speech-to-text/vendor/e-*`).

A warning that applies to every number in this pack: diarisation and multilingual error rates move a lot with scoring settings. A DER changes with the collar and with whether overlap is scored. A FLEURS WER changes with text normalisation. Gemini 3.1 Pro on Hindi FLEURS is 4.3 in Microsoft's chart, 4.5 in Qwen's report and 10.53 in FireRedAudio's report. Compare numbers only within one table.

---

## Executive summary

1. **Diarisation is still the weak link in "who said what".** On DIHARD III, which mixes hard real-world domains, the best published systems sit around 14–20% DER. Meetings, restaurants and web video are worse: 44–54% DER even for the leader in pyannoteAI's streaming benchmark. Clean two-person phone calls are around 5–7%.
2. **Speaker count is the cliff.** NVIDIA's open Streaming Sortformer scores 6.65% DER on two-speaker CALLHOME calls, 13.35% with four speakers and 24.51% with six. On DIHARD III it scores 15.09% with up to four speakers and 41.42% with five to nine. It is hard-capped at four speakers.
3. **Streaming costs less accuracy than you would expect, if the model is built for it.** Sortformer at 1.04 s latency is about one point worse than at 30.4 s on most sets. The vendor gap is bigger. In pyannoteAI's own streaming benchmark on DIHARD III, pyannote scores 19.8% DER, Speechmatics real-time 31.3%, Deepgram Nova-3 39.1% and AssemblyAI Universal-Streaming 39.2%. Most of the competitors' error is missed speech. This is a vendor-run benchmark, so treat it with care.
4. **Many products still do not diarise in real time.** Real-time diarisation is offered by AWS, Azure, Deepgram (+$0.002/min), AssemblyAI (beta, max 10 speakers), Speechmatics, Soniox (max 15), Mistral Voxtral 3 and pyannoteAI Live-1. It is not offered by OpenAI's live model, Google Gemini 3.5 Transcribe ("Not Supported"), Chirp 3, Gladia, or ElevenLabs Scribe v2 Realtime (not listed).
5. **Speech-LLMs transcribe well but diarise badly.** On Indic DiarBench (22 Indian languages, July 2026), Gemini 3 Pro has 74.0% DER, mostly missed speech and confusion on short turns, yet the best WDER (33.0%). India's Sarvam has the best DER (16.0%), ahead of AWS (23.5%), ElevenLabs, Azure, Deepgram and AssemblyAI. A March 2026 study found LLM-based systems are "competitive in two-speaker settings but degrade as speaker count and overlap increase".
6. **The cheapest diarisation is a microphone per person.** Dual-channel contact-centre recordings and per-participant streams from meeting bots (Recall.ai offers them for Teams, Meet and Zoom) turn diarisation into bookkeeping. Speechmatics calls channel diarisation "perfect speaker separation at the channel level". For contact centres, insist on stereo recording before buying any diarisation.
7. **Diarisation is not identification, but the law may not care.** Diarisation labels "Speaker 1, Speaker 2" within one file. Identification matches voices to enrolled people, and under GDPR that is special-category biometric data needing explicit consent. Illinois BIPA suits against Walmart (Aug 2026) and Lowe's allege that call-centre AI that "isolates the speaker's vocal characteristics" creates voiceprints. Statutory damages are $1,000–$5,000 per person.
8. **Language counts are marketing. Streaming counts are smaller.** Batch claims range from 18 (AssemblyAI's top model) to 1,600+ (Meta Omnilingual, open). Streaming is narrower: AWS 99 locales against 113 in batch, Rev 9+ against 58+, Gladia's newest model batch-only, Flux-multi 10 languages. OpenAI publishes no count for its 2026 models.
9. **For the 21 big business languages, the frontier is now 2–5% WER, with three exceptions.** In Microsoft's FLEURS chart (Sept 2026), the best system is under 5% for 18 of 21 languages. Arabic (8.7%), Swahili (9.2%) and Cantonese (5.6%) lag. Whisper large-v2 scored 104% WER on Bengali and 39% on Swahili in 2022. The best 2026 systems score 4.8% and 9.2%.
10. **Error tracks training data, so FLEURS flatters.** In the Whisper paper, WER halves for every 16× increase in training hours (r² = 0.83). Whisper had 438,218 hours of English, 12 of Hindi and 1.3 of Bengali. FLEURS is read Wikipedia sentences. On spontaneous speech the numbers are several times worse: Sarvam's best model is about 19% WER on IndicVoices, against 3.7% for the best Hindi system on FLEURS. EdAcc's accented English gives 19.7% WER against 2.7% on clean US read speech.
11. **Code-switching is supported in name more than in measurement.** Deepgram (55 languages), AssemblyAI, Soniox, Speechmatics (7 bilingual packs), Azure MAI-Transcribe-2 (Hinglish and Spanglish), Gemini 3.5 and Sarvam all claim it. There is no head-to-head benchmark of commercial APIs. The one public data point is HiKE (Korean–English). There, GPT-4o-transcribe has a 21.8% mixed error rate against 2.5% CER on monolingual Korean, and errors at the switch points (PIER) are 28.8%.
12. **Regional specialists beat global vendors where it matters.** Sarvam leads on Indian diarisation. Intron's Sahara V2 reports 12.4% WER on African names, against over 50% for proprietary systems (vendor paper). Cohere Transcribe Arabic leads the open Arabic leaderboard at 25.87% average WER, but Maghrebi (Casablanca) is still near 50%.

**Slide lines.** "A transcript with the wrong names on it is worse than no names at all." "Ask how many languages it supports *in streaming*, then ask for the error rate on *your* accents."

---

# PART 1: DIARISATION

## 1. What diarisation is, in plain terms

Diarisation answers "who spoke when". It splits a recording into turns and gives each turn an anonymous label, such as SPEAKER_00 or SPEAKER_01, that stays the same for the same voice. It does not know names. A separate step, speaker identification, maps a label to a known person.

The pyannote.metrics docs draw the classic chain as four boxes. Voice activity detection gives "detection", speaker change detection gives "segmentation", speech turn clustering gives "diarization", and supervised speaker recognition gives "identification" ([pyannote.metrics docs](https://pyannote.github.io/pyannote-metrics/reference.html)) [verified]. The figure is `e-pyannote-metrics-pipeline.png`.

### 1.1 The classic modular pipeline

1. **Voice activity detection (VAD).** Find the stretches that contain speech, and throw away silence, music and noise. Speech that VAD misses can never be attributed. Anything it wrongly keeps becomes a false alarm.
2. **Segmentation.** Cut speech into short pieces that each contain one speaker, or detect where speakers change. Modern systems use a neural model over short sliding windows. pyannote's `segmentation-3.0` uses a "powerset" output that predicts single speakers and pairs of overlapping speakers as separate classes. The release notes call it "much better overlapping speech detection" ([pyannote 3.0.0 release, Sept 2023](https://github.com/pyannote/pyannote-audio/releases/tag/3.0.0)) [verified].
3. **Speaker embeddings.** Turn each piece into a fixed-length vector (a "voiceprint-like" fingerprint) so that the same voice gives nearby vectors. The families, in order of age:
   - i-vectors, the statistical models used before about 2017;
   - **x-vectors**, deep-network embeddings (Snyder et al., 2018);
   - **ECAPA-TDNN** (Desplanques et al., 2020). SpeechBrain's checkpoint gets 0.80% equal error rate on cleaned VoxCeleb1, per pyannoteAI's survey ([blog](https://www.pyannote.ai/blog/top-7-speaker-diarization-apis-and-models-in-2026)) [verified-2nd];
   - **WeSpeaker ResNet34**, which pyannote 3.1 wraps ("add WeSpeaker embedding wrapper based on PyTorch"; model `wespeaker-voxceleb-resnet34-LM`) ([3.1.0 release](https://github.com/pyannote/pyannote-audio/releases/tag/3.1.0)) [verified].
4. **Clustering.** Group the vectors so that each cluster is one speaker. The options:
   - *Agglomerative hierarchical clustering* repeatedly merges the closest pair of groups.
   - *Spectral clustering* builds a similarity graph and splits it.
   - *VBx* uses a Bayesian hidden Markov model over x-vectors, which also smooths speaker changes over time (Landini et al., BUT).
   - pyannote's `community-1` (Sept 2025) "relies on VBx clustering instead of agglomerative hierarchical clustering", as suggested by BUT researchers ([4.0.0 release](https://github.com/pyannote/pyannote-audio/releases/tag/4.0.0)) [verified].
   - The hardest decision here is **how many clusters**. The number of speakers is usually unknown.
5. **Overlap handling and resegmentation.** Assign overlapping regions to two speakers, then refine the boundaries.
6. **Reconciliation with ASR.** Map speaker turns onto the words the recogniser produced. Errors creep in when a word straddles a turn boundary.
   - pyannote now outputs an **"exclusive" diarisation**, in which "only one speaker (the most likely to be transcribed) is active at any given time". It exists to simplify "the reconciliation between fine-grained speaker diarization timestamps and (sometimes not so precise) transcription timestamps" ([4.0.0 release](https://github.com/pyannote/pyannote-audio/releases/tag/4.0.0); [community-1 blog](https://www.pyannote.ai/blog/community-1)) [verified].

### 1.2 End-to-end neural diarisation (EEND) and Sortformer

- **EEND** (Fujita et al., Hitachi, 2019) trains one network to output, for every short frame, the probability that each of N speakers is talking. It handles overlap naturally, because several speakers can be "on" at once. The catch is the **permutation problem**: the network's speaker 1 has no fixed meaning, so training must try every assignment of outputs to true speakers ("permutation-invariant loss"). Later variants (EEND-EDA) add "attractors" to cope with an unknown number of speakers ([EDA paper](https://arxiv.org/pdf/2106.10654)) [verified: title and topic only].
- **NVIDIA Sortformer** (Sept 2024) replaces the permutation trick with a rule: speakers are numbered in order of when they first speak ("arrival time order", trained with a "Sort Loss"). This makes the output easy to line up with ASR tokens ([paper](https://arxiv.org/abs/2409.06656); model card figure `e-sortformer-intro.png`) [verified].
- **Streaming Sortformer** (July 2025, [arXiv 2507.18446](https://arxiv.org/abs/2507.18446)) keeps an "Arrival-Order Speaker Cache" of embeddings for speakers already heard. A new chunk is compared against that memory, which keeps labels consistent over hours of audio ([model card](https://huggingface.co/nvidia/diar_streaming_sortformer_4spk-v2.1)) [verified].
  - The current model is `diar_streaming_sortformer_4spk-v2.1`, with 117M parameters.
  - It is trained on about 5,000 hours of real and simulated conversations, primarily English.
  - Output is a probability per 80 ms frame for each of 4 speakers.
  - Two recommended configurations: "very high latency" at 30.4 s, and "low latency" at 1.04 s input buffer, with a real-time factor of 0.093 on an RTX 6000 Ada.
  - Stated limits: "It can detect a maximum of 4 speakers; performance degrades on recordings with 5 and more speakers." Also: "Performance may degrade on non-English speech" and on noisy out-of-domain data [verified].
  - NVIDIA's own voice-agent docs say the diarisation model "is not robust to noise" ([NeMo voice agent docs](https://docs.nvidia.com/nemo/labs-voice-agent/about/core-concepts/speech-pipeline/speaker-diarization)) [verified-2nd].

### 1.3 Diarisation inside speech-LLMs and joint ASR models

A newer approach asks one model to emit words and speaker tags together. Google showed this in 2019 with an RNN-T that emits speaker-role tokens: on doctor–patient conversations, word-level diarisation error fell from 15.8% to 2.2% ([El Shafey, Soltau & Shafran, Interspeech 2019](https://arxiv.org/abs/1907.05337)) [verified]. That works when the roles are fixed (doctor and patient) and the language gives clues about who is speaking.

Products in 2026:
- **OpenAI** `gpt-4o-transcribe-diarize` (Oct 2025) returns `diarized_json` with speaker segments. It accepts up to four 2–10 s reference clips of known speakers ([OpenAI docs](https://developers.openai.com/api/docs/guides/speech-to-text)) [verified].
  - It does not work in Realtime sessions [verified].
  - It is now deprecated, shutting down 2027-02-26, and its successor `gpt-transcribe` documents no diarisation [verified].
  - Developers report that the diarize model drops words that plain `gpt-4o-transcribe` caught ([forum](https://community.openai.com/t/introducing-gpt-4o-transcribe-diarize-now-available-in-the-audio-api/1362933)) [verified-2nd].
- **Google Gemini 3.5 Transcribe** diarises files only: "Supported (up to 8 speakers)", "Attribution for 3+ speakers is experimental" [verified].
  - It is "Incompatible with custom vocabulary".
  - Its live endpoint shows "Not Supported" ([docs](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe)) [verified].
  - The launch blog says "up to three speakers", which conflicts with the docs [verified].
- **Mistral Voxtral 3** (Public Preview, 20 Oct 2026) diarises in both file and realtime modes. It accepts up to 8 reference clips and 10 speakers in total ([docs](https://docs.mistral.ai/studio/audio/concepts/speakers-and-diarization)) [verified].
- **Research LLMs** built for this include VibeVoice-ASR (Microsoft, Jan 2026), which does ASR, diarisation and timestamps in "a single end-to-end generation task" for up to 60 minutes ([arXiv 2601.18184](https://arxiv.org/abs/2601.18184)) [verified]. Others are DiaScriber and DM-ASR.
- **How they compare:**
  - "Who Spoke What When?" (Mar 2026) found "LLM-based systems are competitive in two-speaker settings but degrade as speaker count and overlap increase, whereas modular pipelines remain more robust" ([arXiv 2603.22709](https://arxiv.org/abs/2603.22709)) [verified].
  - The VibeVoice report says Gemini models "exhibit substantial timestamp inaccuracies and occasional content hallucinations" on long audio [verified-2nd: search snippet of the paper].
  - The cleanest head-to-head is Indic DiarBench (§5.3).

**Plain reading** [calc]: speech-LLMs know *what* was said very well. They are poor at *when*, and so poor at *who*, because diarisation depends on precise timing. If you need speaker labels, use a dedicated diariser, or a vendor whose diarisation is a separate, benchmarked component.

---

## 2. How diarisation is measured

### 2.1 Diarisation error rate (DER)

DER is "the aggregate durations of all three types of errors divided by the total duration of speech in the recording" ([pyannoteAI benchmark](https://www.pyannote.ai/benchmark)) [verified]:

> DER = (missed speech + false alarm + speaker confusion) / total reference speech

The three errors, in pyannoteAI's own definitions [verified]:
- **Missed detection** "happens when a speech turn (or part of it) is missed, or when two speakers talk on top of each other, and only one of them is detected."
- **False alarm** "happens when the system detects a speech turn when there is none."
- **Speaker confusion** "happens when a system assigns a speech turn to the wrong speaker, when it merges two speakers into one, or when it splits one speaker into multiple ones."

Before scoring, the system's anonymous labels are matched one-to-one to the reference speakers in the way that gives the lowest error. Calling someone "SPEAKER_03" instead of "Alice" is not an error in itself.

Two settings change the number a lot:
- **Collar.** A forgiveness window (traditionally 0.25 s) around each reference boundary that is not scored, because humans disagree about exactly where turns start. Sortformer's card uses a 0.25 s collar for CALLHOME and 0 s for DIHARD, AMI, AliMeeting and NOTSOFAR [verified]. pyannote's tables are "no forgiveness collar, nor skipping overlapping speech" ([HF card via search](https://huggingface.co/pyannote/speaker-diarization-community-1)) [verified-2nd: card is gated].
- **Overlap scoring.** Old NIST practice could exclude overlapped speech. DIHARD III scored overlap with no collar, using dscore v1.0.1 ([DIHARD III](https://arxiv.org/pdf/2012.01477)) [verified-2nd]. Excluding overlap removes the hardest seconds and flatters the score.

DER can exceed 100%, because false alarms are unbounded. DIHARD notes that "DER can easily exceed 500%" on recordings dominated by one speaker ([DIHARD III eval plan](https://arxiv.org/pdf/2006.05815)) [verified-2nd].

### 2.2 Worked example [calc]

Reference, 60 s call:
- Agent A speaks 0–30 s.
- Customer B speaks 25–60 s.
- They overlap for 5 s. Total reference speaker-time = 30 + 35 = **65 s**. Overlap counts once per speaker.

System output (after the best label mapping, S1 = A, S2 = B):

| Time | Reference | System | Error |
|---|---|---|---|
| 0–25 s | A | S1 | none |
| 25–27 s | A + B | S1 only | B missed, 2 s |
| 27–30 s | A + B | S2 only | A missed, 3 s |
| 30–40 s | B | S2 | none |
| 40–44 s | B | S1 | confusion, 4 s |
| 44–60 s | B | S2 | none |
| 62–64 s | silence (a cough) | S2 | false alarm, 2 s |

- DER = (5 missed + 2 false alarm + 4 confusion) / 65 = **16.9%**.
- With overlap excluded from scoring, the 5 s of missed overlap disappears and the denominator becomes 55 s of single-speaker speech. DER = (2 + 4) / 55 = **10.9%**.

Same output, two published numbers. A 0.25 s collar would trim the score further, by not scoring half a second around the 25 s and 30 s boundaries.

### 2.3 Jaccard error rate (JER)

JER was introduced in DIHARD II. Each reference speaker is paired with a system speaker, a per-speaker error is computed, and the errors are averaged. So **every speaker counts equally**, however much they talk, and JER "will never exceed 100%". DIHARD III notes that JER is "highly correlated" with DER but usually higher, "especially in recordings where one or more speakers is particularly dominant" ([DIHARD III eval plan](https://arxiv.org/pdf/2006.05815); [dscore](https://github.com/nryant/dscore)) [verified-2nd].

Why it matters [calc]: in a sales call where the agent talks 80% of the time, DER can look fine while the customer, the person you care about, is badly attributed. JER exposes that.

### 2.4 Word-level metrics: WDER and cpWER

DER is measured in seconds. A transcript reader cares about **words with the wrong name on them**.

- **WDER** (word diarisation error rate), defined by El Shafey et al. ([arXiv 1907.05337](https://arxiv.org/abs/1907.05337)) [verified]:
  > WDER = (S_IS + C_IS) / (S + C)

  Here S_IS is ASR substitutions with the wrong speaker, C_IS is correct words with the wrong speaker, S is all substitutions and C is all correct words. The authors say it "must be used in combination with the ASR Word Error Rate (WER) to account for deletions and insertions", and that "this word-level metric reflects the performance in an actual application better than the time-level metric."
  - *Example* [calc]: a 1,000-word call has 950 words recognised as correct or substituted. 38 of them carry the wrong speaker tag. WDER = 38/950 = 4.0%.
- **cpWER** (concatenated minimum-permutation WER), the main metric of CHiME-6. It joins all of each speaker's words into one stream for the reference and for the output, then computes WER under the speaker mapping that minimises it ([CHiME-6](https://arxiv.org/pdf/2004.09249)) [verified-2nd]. A word in the wrong speaker's stream counts as a deletion in one stream and an insertion in another. So cpWER blends recognition and attribution errors into one number.
- **Variants:**
  - **DA-WER** (CHiME-7) uses the DER-minimising mapping.
  - **tcpWER** (CHiME-8) adds time constraints, so words must also land near the right time ([CHiME-7/8 review](https://arxiv.org/pdf/2507.18161); [MeetEval](https://github.com/fgnt/meeteval)) [verified-2nd].
  - **tcpSemER** (Mar 2026) replaces word matching with semantic similarity to catch errors that change meaning ([arXiv 2603.22709](https://arxiv.org/abs/2603.22709)) [verified].

**Which to ask vendors for** [calc]: DER, with the collar and overlap settings stated, for the diariser. WDER or cpWER for the end-to-end transcript. A vendor quoting only "accuracy" for diarisation has told you nothing.

---

## 3. What makes diarisation hard

1. **Overlapping speech.** Classic clustering gives each moment to one speaker, so overlap becomes missed speech. pyannoteAI's benchmark corpus has 9.3% overlapped speech ([benchmark](https://www.pyannote.ai/benchmark)) [verified]. In pyannoteAI's streaming benchmark, competitors' errors are dominated by missed speech (19.7–25.3% of DER), not confusion (5.5–11.8%) [verified]. An ICML 2026 workshop paper found the "primary cause of diarization errors stem from missed speech segments followed by speaker confusion, especially in high-speaker-count settings" ([Lanzendörfer et al.](https://icml.cc/virtual/2026/77326)) [verified-2nd].
2. **Many speakers.** See the Sortformer cliff in §5.2: 6.65% DER at 2 speakers, 24.51% at 6 [verified]. Precision-2 got the speaker count exactly right on 70% of a hard internal set of 2–10 speaker files, up from 50% for Precision-1 ([changelog](https://www.pyannote.ai/changelog)) [verified]. So, even for the leader, three times in ten the speaker count is wrong.
3. **Short turns.** Backchannels ("yeah", "mm-hm", "right") last a fraction of a second, too short for a reliable embedding. Indic DiarBench attributes Gemini 3 Pro's 74% DER "largely" to "missed detection on small utterances like affirmations and interjections" ([arXiv 2607.23808](https://arxiv.org/abs/2607.23808)) [verified].
4. **Similar voices.** Siblings, same-gender same-accent colleagues, and a single agent's many customers on one line. Embeddings that sit close together get merged, which shows up as confusion [calc].
5. **Far-field rooms.** One table microphone picks up reverberation and uneven levels. Sortformer: AMI headset mics (IHM) 16.67% against a single distant mic (SDM) 20.57%; AliMeeting near 12.6% against far 15.6% [verified].
6. **Unknown number of speakers.** pyannoteAI ran its benchmark without telling any system the speaker count ("We did not provide the number of speakers for any of them") [verified]. Several vendors treat speaker-count parameters as "hints, not hard constraints" (Gladia) [verified].
7. **Streaming.** A live system must commit to a label before it has heard the rest of the conversation. Three consequences [calc]:
   - It can't go back and merge two clusters it later realises are one person.
   - A speaker who first appears late may be confused with an earlier one.
   - Labels must stay stable for the whole call. Sortformer's speaker cache and pyannoteAI's streaming model exist for this.
   - Soniox says its real-time diarisation has "Higher speaker attribution errors compared to async mode" ([docs](https://soniox.com/docs/stt/concepts/speaker-diarization)) [verified].
   - pyannoteAI notes that streaming partial output can be revised, and scores only the completed output ([streaming benchmark](https://www.pyannote.ai/blog/streaming-diarization-benchmark)) [verified].
8. **Domain and language.** Sortformer warns of degradation on non-English speech [verified]. DIHARD's "restaurant" and "webvideo" domains are 44–54% DER even for the best streaming system (§5.4).

---

## 4. Diarisation versus speaker identification and verification

| | Diarisation | Identification | Verification |
|---|---|---|---|
| Question | Who spoke when, with anonymous labels | Which known person is this? | Is this the person they claim to be? |
| Needs enrolment? | No | Yes, stored voiceprints of known people | Yes, one voiceprint per claimed identity |
| Typical use | Meeting and call transcripts | Naming meeting participants, CRM tagging | Phone-banking authentication (e.g. Nuance, Pindrop) |
| Data kept | Embeddings usually transient, within one file | Persistent biometric templates | Persistent biometric templates |

Vendor offerings for naming speakers:
- **Speechmatics:** speaker identification from short sample clips, in Batch, Realtime and Agent STT. Not yet on its new Melia and Oak models ([docs](https://docs.speechmatics.com/speech-to-text/models)) [verified].
- **Mistral and OpenAI:** reference clips per request (8 for Mistral, 4 for the deprecated OpenAI model) [verified].
- **AssemblyAI:** "speaker identification" maps labels to names or roles from the *text* (`known_values`), not from voiceprints [verified].
- **Rev AI:** "does not support speaker identification" [verified].

### 4.1 Privacy and biometric law

**GDPR:**
- Article 4(14) defines biometric data as personal data from "specific technical processing relating to the physical, physiological or behavioural characteristics of a natural person, which allow or confirm the unique identification of that natural person" ([Art. 4](https://gdpr-info.eu/art-4-gdpr/)) [verified].
- Article 9(1) prohibits processing "biometric data for the purpose of uniquely identifying a natural person" unless an exception applies, such as "explicit consent" ([Art. 9](https://gdpr-info.eu/art-9-gdpr/)) [verified].
- The EDPB's Guidelines 02/2021 on virtual voice assistants state that "voice data is inherently biometric personal data". Processing to uniquely identify someone needs an Article 6 basis plus an Article 9 derogation [verified-2nd: quoted in consultation responses]. Industry respondents (the banking federation, the car makers' association) argued that only voice used for unique identification should count [verified-2nd].
- *Reading* [calc]: speaker identification and verification are clearly Article 9 processing. Plain diarisation within one file is arguably not, because it does not identify anyone. But it computes voice embeddings, which is the same "specific technical processing", so how long you keep embeddings matters.

**Illinois BIPA** (Biometric Information Privacy Act) names "voiceprints" as biometric identifiers:
- Statutory damages are $1,000 per negligent violation and $5,000 per intentional or reckless one.
- The SB 2979 amendment, signed 2 August 2024, limits recovery to one per person for repeated collection by the same method, and allows electronic consent ([Thompson Hine](https://www.thompsonhine.com/insights/illinois-legislature-amends-bipa-to-limit-damages-and-expand-consent-options/); [Fisher Phillips](https://www.fisherphillips.com/en/insights/insights/breaking-bipa-news-illinois-curtails-massive-damage-awards-in-biometric-cases)) [verified-2nd].
- Cases relevant to speech-to-text (all allegations, none decided):
  - **Walmart** (N.D. Ill., filed 4 Aug 2026). An AI system allegedly records store calls and "isolates the speaker's vocal characteristics" ([Biometric Update](https://www.biometricupdate.com/202608/walmart-sued-over-alleged-voiceprint-collection-from-customer-calls); [complaint PDF](https://www.courthousenews.com/wp-content/uploads/2026/08/walmart-bipa-class-action.pdf)) [verified-2nd].
  - **Lowe's.** The complaint distinguishes ordinary recording from speaker recognition that converts "vocal characteristics ... into a mathematical representation or template" ([CX Today](https://cxtoday.com/voice-ai-lawsuits-put-contact-centers-on-bipa-watch)) [verified-2nd].
  - **Earlier call-centre suits:** *Cisneros v. Nuance*; claims involving Amazon Connect and Pindrop voiceprints ([ABA](https://www.americanbar.org/groups/litigation/resources/newsletters/class-actions-derivative-suits/voiceprints-ai-bipa-new-trends-biometric-privacy-litigation/)) [verified-2nd].
  - **A May 2026 wave** of N.D. Ill. class actions against Meta, Nvidia, Microsoft, Apple, Samsung, Amazon and Adobe, over voiceprints used to train voice models [verified-2nd].
  - **Microsoft Teams** was the subject of a BIPA voiceprint claim in Feb 2026 ([ID Tech data card](https://learn.idtechwire.com/cards/microsoft-teams-bipa-voiceprint-illinois-2026-02-17)) [unverified: card only].
- *Reading* [calc]: the Lowe's complaint's "mathematical representation" wording describes a diarisation embedding as well as an authentication voiceprint. Whether transient diarisation embeddings count as voiceprints is untested. For clients with Illinois callers, get legal advice before enabling voice enrolment. Know whether your vendor keeps embeddings. Prefer channel separation, which needs no voice analysis at all.

---

## 5. Current numbers

### 5.1 pyannote (open) and pyannoteAI (commercial)

DER (%), "fully automatic processing, no forgiveness collar, nor skipping overlapping speech". Table last updated Sept 2025, from the community-1 model card ([HF](https://huggingface.co/pyannote/speaker-diarization-community-1); gated, read via search summary and mirror) [verified-2nd]:

| Dataset | pyannote 3.1 (open) | community-1 (open) | Precision-2 (API) |
|---|---|---|---|
| AISHELL-4 (Mandarin meetings) | 12.2 | 11.7 | 11.4 |
| AMI headset mix (IHM) | 18.8 | 17.0 | 12.9 |
| VoxConverse v0.3 (broadcast) | 11.2 | 11.2 | 8.5 |
| RAMC (Mandarin phone) | 22.2 | 20.8 | 10.5 |

- pyannoteAI's survey adds community-1 at 19.9% on AMI single distant mic and 20.2% on DIHARD III full ([blog](https://www.pyannote.ai/blog/top-7-speaker-diarization-apis-and-models-in-2026)) [verified-2nd].
- History: pyannote 2.1 to 3.0 cut DIHARD III from 26.9 to 21.7, and AMI SDM from 27.1 to 22.2 ([3.0.0 release](https://github.com/pyannote/pyannote-audio/releases/tag/3.0.0)) [verified].
- **Precision-3** (17 Sept 2026): average DER "from 16.02 to 14.35 DER across 15 benchmark datasets" against Precision-2, a 10.4% relative cut. Speaker misattribution falls 18.7% ([changelog](https://www.pyannote.ai/changelog)) [verified].
- **Live-1** streaming (GA 7 July 2026): "under 300ms latency", €0.198/hour Developer. The beta listed a maximum of 8 speakers [verified].
- pyannoteAI's batch benchmark page (Oct 2026) compares Precision-3 and community-1 against AssemblyAI Universal-Pro-3.5, Deepgram Nova-3, ElevenLabs Scribe-v2, Soniox async-v5 and Speechmatics on 10 DIHARD domains (259 recordings, about 67 h). The numbers render client-side and I could not extract them ([benchmark](https://www.pyannote.ai/benchmark)) [unverified: values not read].
- Independent check: an ICML 2026 workshop paper (Lanzendörfer et al., ETH) found "PyannoteAI achieves the best performance at 11.2% DER", with DiariZen (open) at 13.3%. That covers 5 models, 4 datasets and 196.6 h in five languages ([ICML](https://icml.cc/virtual/2026/77326)) [verified-2nd].
- Price: community-1 hosted at €0.035/audio hour; Precision-2 from €0.096/hr [verified-2nd].

### 5.2 NVIDIA Streaming Sortformer 4spk-v2.1 (open)

DER (%), overlap included ([model card](https://huggingface.co/nvidia/diar_streaming_sortformer_4spk-v2.1)) [verified]:

| Dataset (speakers) | 30.4 s latency | 1.04 s latency |
|---|---|---|
| CALLHOME phone, 2 spk (collar 0.25 s) | 5.65 | 6.65 |
| CALLHOME, 3 spk | 10.03 | 11.25 |
| CALLHOME, 4 spk | 12.33 | 13.35 |
| CALLHOME, 5 spk | 22.35 | 22.12 |
| CALLHOME, 6 spk | 22.26 | 24.51 |
| CH109 American English phone, 2 spk | 5.04 | 5.09 |
| DIHARD III, ≤4 spk (no collar) | 14.84 | 15.09 |
| DIHARD III, 5–9 spk | 38.90 | 41.42 |
| AMI headset (IHM) | 15.90 | 16.67 |
| AMI single distant mic (SDM) | 17.80 | 20.57 |
| AliMeeting near / far | 11.73 / 13.55 | 12.60 / 15.60 |
| NOTSOFAR-1, ≤4 spk / ≥5 spk | 15.95 / 34.81 | 17.26 / 36.76 |

- Reading [calc]: going from 30 s to 1 s latency costs 0.05–2.8 points. Going from ≤4 to ≥5 speakers costs about 19–26 points.
- A community CoreML port reports 31.7% on AMI SDM in its own configuration ([FluidInference](https://docs.fluidinference.com/diarization/sortformer)) [verified-2nd]. Configuration matters.
- Figures: `e-sortformer-intro.png`, `e-sortformer-streaming-steps.png`.

### 5.3 Indic DiarBench: commercial APIs and LLMs on 22 Indian languages

About 108 h of meetings, far-field and in-the-wild audio, with English code-mixing and overlap. July 2026 ([arXiv 2607.23808](https://arxiv.org/abs/2607.23808), duration-weighted aggregates, %) [verified]:

| System | DER | cpWER | WDER | Missed | False alarm | Confusion |
|---|---|---|---|---|---|---|
| Sarvam | **16.0** | **38.8** | 33.1 | 6.3 | 3.9 | 5.9 |
| AWS Transcribe | 23.5 | 43.7 | 34.3 | 13.1 | 3.1 | 7.4 |
| Deepgram Nova-3 | 32.0 | 63.2 | 39.3 | 18.3 | 5.4 | 8.3 |
| Azure STT | 34.8 | 60.8 | 39.5 | 24.4 | 1.7 | 8.7 |
| ElevenLabs Scribe | 35.0 | 58.3 | 40.7 | 13.6 | 6.2 | 15.3 |
| GPT-4o | 36.2 | 83.1 | 40.4 | 17.7 | 3.8 | 14.7 |
| AssemblyAI | 40.5 | 88.6 | 43.7 | 25.5 | 5.5 | 9.6 |
| Gemini 3 Pro | 74.0 | 58.9 | **33.0** | 41.7 | 5.8 | 26.5 |

This is the best single slide for "regional specialist beats global vendors", and for "LLMs transcribe well but can't time-stamp speakers". The paper gives no affiliation detail, and dataset authors can favour local vendors, so it needs independent replication [calc].

### 5.4 Streaming diarisation across vendors (pyannoteAI-run)

DIHARD III, all languages, completed output, Oct 2026 ([pyannoteAI blog](https://www.pyannote.ai/blog/streaming-diarization-benchmark)) [verified; vendor-run]:

| Streaming system | DER | False alarm | Missed | Confusion |
|---|---|---|---|---|
| pyannoteAI (Live-1) | 19.8 | 4.8 | 7.7 | 7.3 |
| Speechmatics real-time v2 | 31.3 | 6.2 | 19.7 | 5.5 |
| Deepgram Nova-3 | 39.1 | 4.6 | 25.3 | 9.3 |
| AssemblyAI Universal-Streaming v3 | 39.2 | 6.9 | 20.4 | 11.8 |

Per domain, on the English set (pyannote / Deepgram / AssemblyAI / Speechmatics):
- Phone calls (CTS): 10.3 / 33.5 / 32.3 / 23.2
- Meetings: 44.6 / 60.9 / 67.0 / 58.1
- Restaurant: 54.4 / 76.3 / 63.7 / 66.3
- Web video: 44.9 / 78.5 / 74.4 / 74.9

The page text gives other figures for web video (51–59%) than its own table [verified: inconsistency noted]. Latency is excluded from the benchmark. Gladia, Soniox and Sortformer are not included.

### 5.5 Vendor capability matrix (diarisation)

All from vendor docs read 3 Nov 2026 [verified unless marked; full detail in `E-coverage.json`]:

| Vendor / current model | Batch diarisation | Streaming diarisation | Max speakers | Extra cost |
|---|---|---|---|---|
| AWS Transcribe | Yes | Yes | 30 | Not stated |
| Azure AI Speech | Yes | Yes (ConversationTranscriber) | <36 batch; streaming not stated | Not stated |
| Google Chirp 3 | Yes (BatchRecognize, 14 locales) | No | Not stated | Not stated |
| Google Gemini 3.5 Transcribe | Yes | **No** | 8 (3+ experimental) | Not stated |
| OpenAI gpt-4o-transcribe-diarize (deprecated) | Yes | **No** | Not stated; 4 reference clips | Separate model |
| OpenAI gpt-transcribe / gpt-live-transcribe | Not documented | **No** | n/a | n/a |
| Deepgram Nova-3 | Yes | Yes | Not stated | Batch included; streaming +$0.0020/min |
| AssemblyAI Universal-3.5 Pro / 3.6 Pro RT | Yes | Yes (beta) | 10 streaming (hard cap 1–10); batch defaults 10/30 | +$0.02/hr batch; +$0.12/hr streaming |
| Speechmatics Enhanced | Yes | Yes | No default limit | Not stated |
| Speechmatics Melia 1 / Oak 1 | Speaker and channel | Channel only | — | — |
| Soniox v5 | Yes | Yes | 15 | Bundled ($0.10/hr async, $0.12/hr RT) |
| ElevenLabs Scribe v2 | Yes | Not listed for Realtime | 32 | Not stated |
| Gladia Solaria | Yes (count = hint) | **Not offered** | — | — |
| Rev AI | Yes | Not stated | 8 English, 6 other | Not stated |
| Mistral Voxtral 3 | Yes | Yes (not with turn detection) | 10 total | Not stated |
| pyannoteAI Precision-3 / Live-1 | Yes | Yes | No ceiling / 8 (beta) | €0.198/hr Live-1 |
| NVIDIA Streaming Sortformer (open) | — | Yes | **4** | Self-host |
| Sarvam Saaras | Yes | Not stated | Not stated | Not stated |

Note [calc]: no vendor publishes a DER for its own streaming diarisation on a public benchmark that I could find. The only cross-vendor streaming numbers are pyannoteAI's.

---

## 6. Practical shortcuts that beat any algorithm

1. **Dual-channel (stereo) contact-centre recording.** Agent on the left channel, customer on the right. Each channel is one speaker, so "diarisation" is just which channel the words came from.
   - Speechmatics: channel diarisation "gives you perfect speaker separation at the channel level and more accurate handling of cross-talk" ([docs](https://docs.speechmatics.com/speech-to-text/realtime/realtime-diarization)) [verified].
   - AssemblyAI streaming: "we recommend creating a separate session for each channel" ([docs](https://www.assemblyai.com/docs/streaming/label-speakers-and-separate-channels)) [verified].
   - Most contact-centre platforms can record stereo, but many default to mono to save storage [unverified: general practice]. If the client's archive is mono, every downstream analysis inherits diarisation error.
   - Caveats [calc]: a transfer, conference or supervisor barge-in puts several voices on one channel. Use channel plus speaker diarisation (Speechmatics offers both together) [verified].
2. **Per-participant streams from meeting bots.** Recall.ai can deliver "separate audio files for each participant" after a meeting. In real time it can stream per-participant raw PCM (16 kHz mono) over websocket ([Recall.ai realtime](https://docs.recall.ai/docs/how-to-get-separate-audio-per-participant-realtime); [async](https://docs.recall.ai/docs/how-to-get-separate-audio-per-participant-async)) [verified-2nd].
   - Platform support: Teams and Google Meet; Zoom via native bot only.
   - Screenshare audio is not separated.
   - The feature is "compute heavy" (4-core bots recommended).
   - Caveats [calc]:
     - A conference room is one "participant" with many voices.
     - Echo and bleed from loudspeakers can leak into other streams.
     - The platform's own participant names make identification trivial and consent-friendly, because no voiceprint is needed.
3. **Voice agents.** The bot's own speech is known, so only the human side needs recognition. Diarisation matters only when several humans share one line (speakerphone). Then it matters a lot, and real-time support is patchy (§5.5) [calc].
4. **Tell the system the speaker count** when you know it, such as a two-party call. Treat vendor speaker-count settings as hints [verified for Gladia].

---

# PART 2: LANGUAGES

## 7. Coverage claims: batch versus streaming

From vendor docs, 3 Nov 2026 [verified unless marked; "count" = I counted the docs table]:

| System | Batch | Streaming | Notes |
|---|---|---|---|
| Meta Omnilingual ASR (open, Nov 2025) | **1,600+** | — (offline models) | 78% of languages under 10% CER; chart claims 5,400 more "enabled by in-context learning" |
| Meta MMS (open, May 2023) | 1,100+ ASR; 4,017 language ID | — | Trained largely on read religious texts |
| Azure AI Speech | 148 locales (count) | 148 locales | MAI-Transcribe-2: 60 languages, file only |
| AWS Transcribe | 113 locales (count) | 99 locales (count) | Some streaming locales missing in 5 regions |
| Google Chirp 3 | 110 locales (29 GA, 81 Preview; count) | Same model | Diarisation 14 locales |
| Gladia Solaria-1 / Solaria-3 | 100+ / 5 | 100+ (Solaria-1 only) | Newest model is batch-only |
| Whisper large-v3 (open) | 99 (98 in OpenAI API docs) | — | Not a streaming model |
| ElevenLabs Scribe v2 | 90+ (94 in tiers) | 90+ | Tiers: Excellent 36, High 21, Good 18, Moderate 19 |
| Gemini 3.5 Transcribe | 85+ (about 84 rows) | 85+ | Gemini Live API: 70 |
| Soniox v5 | 60+ | 60+ (all) | Same list both modes |
| Rev AI | 58+ | **9+** | |
| Deepgram Nova-3 | 55 (multilingual) + monolingual | Same; Flux-multi 10 | |
| Speechmatics | 55 + 7 bilingual packs | Same | Melia realtime 56, preview |
| Mistral Voxtral 3 | 50 | 45 "languages and dialects" | Public Preview |
| NVIDIA Nemotron 3.5 streaming (open) | — | 40 locales (19 ready, 13 broad, 8 need fine-tuning) | Canary/Parakeet: 25 European |
| AssemblyAI Universal-3.5 Pro / 3.6 Pro RT | **18** (99 via Universal-2 fallback) | **32**; Multilingual Streaming 6 | Top model covers few languages |
| Sarvam Saaras v4 | 23 (22 Indian + English) | v3-realtime | |
| AI4Bharat IndicConformer (open) | 22 official Indian languages | — | |
| OpenAI gpt-transcribe / gpt-live-transcribe | **No count published** | No count published | |

Reading [calc]:
- **The streaming list is the one that matters** for contact centres and voice agents. It is often smaller, and sometimes served by an older or weaker model.
- **Count definitions differ.** Some count locales (en-US, en-GB), some count languages, and some count anything in the list, including "Moderate" tiers. ElevenLabs' tiering is honest about this: 19 of its 94 languages are "Moderate".
- **"Supported" is not "usable".** See the error tables below.

Images: `e-mms-language-coverage-map.png`, `e-omnilingual-incontext.png` (Omnilingual 1,600 + 5,400 vs Whisper 99), `e-omnilingual-performance.png`.

---

## 8. Quality varies enormously by language

### 8.1 Per-language table for 21 business languages

**Source A:** Microsoft MAI-Transcribe-2 per-language chart, FLEURS test, "forced language", 60 languages, 7 systems, 3 Sept 2026 ([microsoft.ai](https://microsoft.ai/models/mai-transcribe-2/)) [verified; read from the embedded data table].
- It is vendor-run. Microsoft's model often wins its own chart.
- The chart labels every value "word error rate". For CJK and Thai the values only make sense as character error rate, but the scoring is not stated [unverified metric].

**Source B:** Whisper large-v2, Whisper paper Table 13 (Dec 2022), FLEURS ([arXiv 2212.04356](https://arxiv.org/abs/2212.04356)) [verified].

| Language | ISO | Script | Best in MAI chart (system, %) | 2nd best | GPT-transcribe | Whisper large-v3 (MAI chart) | Whisper large-v2 (2022 paper) |
|---|---|---|---|---|---|---|---|
| English | en | Latin | 2.6 (Gemini 3.1 Pro = Scribe v2) | 2.7 (MAI-T2) | 3.2 | 4.2 | 4.2 |
| Spanish | es | Latin | 2.1 (MAI-T2) | 2.2 (Gemini 3.5 T) | 2.3 | 2.8 | 3.0 |
| French | fr | Latin | 2.8 (MAI-T2) | 2.9 (Gemini 3.1 Pro) | 3.7 | 5.4 | 8.3 |
| German | de | Latin | 2.8 (MAI-T2 = Gemini 3.1 Pro) | 2.9 (Gemini 3.5 T) | 3.2 | 4.1 | 4.5 |
| Portuguese | pt | Latin | 2.5 (MAI-T2) | 2.7 (Gemini 3.5 T) | 3.4 | 4.0 | 4.3 |
| Italian | it | Latin | 1.1 (MAI-T2 = Gemini 3.5 T) | 1.3 (Scribe v2) | 1.9 | 2.2 | 4.0 |
| Dutch | nl | Latin | 3.4 (Gemini 3.1 Pro) | 3.6 (MAI-T2) | 4.0 | 5.7 | 6.7 |
| Polish | pl | Latin | 2.0 (MAI-T2) | 2.8 (Gemini 3.1 Pro) | 3.3 | 4.9 | 5.4 |
| Russian | ru | Cyrillic | 3.1 (MAI-T2) | 3.4 (Gemini 3.5 T) | 4.3 | 5.0 | 5.6 |
| Turkish | tr | Latin | 3.9 (MAI-T2) | 4.0 (Scribe v2) | 4.6 | 6.4 | 8.4 |
| **Arabic** | ar | Arabic | **8.7** (MAI-T2) | 8.9 (Gemini 3.5 T) | 10.3 | 14.7 | 16.0 |
| Hindi | hi | Devanagari | 3.7 (MAI-T2) | 4.0 (Gemini 3.5 T) | 6.2 | 17.4 | 21.5 |
| Bengali | bn | Bengali | 4.8 (MAI-T2) | 5.0 (Gemini 3.5 T) | 8.9 | 46.4 | **104.1** |
| Indonesian | id | Latin | 2.5 (MAI-T2 = Gemini 3.5 T) | 2.8 (Gemini 3.1 Pro) | 4.5 | 6.3 | 7.1 |
| Vietnamese | vi | Latin | 2.9 (Gemini 3.1 Pro) | 3.2 (Gemini 3.5 T) | 4.4 | 8.9 | 10.3 |
| Thai (CER) | th | Thai | 3.4 (MAI-T2) | 3.8 (Gemini 3.5 T) | 5.4 | 8.7 | 11.5 |
| Mandarin (CER) | zh | Han | 4.5 (MAI-T2) | 5.6 (Scribe v2) | 6.2 | 7.0 | 14.7 |
| **Cantonese** (CER) | yue | Han | **5.6** (Gemini 3.1 Pro) | 6.6 (MAI-T2) | 7.8 | 21.9 | not in table |
| Japanese (CER) | ja | Kana/kanji | 1.8 (MAI-T2) | 2.3 (Scribe v2) | 3.9 | 5.3 | 5.3 |
| Korean | ko | Hangul | 3.3 (Gemini 3.1 Pro = Scribe v2) | 3.4 (MAI-T2) | 4.0 | 4.6 | 14.3 (WER) |
| **Swahili** | sw | Latin | **9.2** (Gemini 3.5 T) | 10.5 (Gemini 3.1 Pro) | **19.8** | 35.4 | 39.3 |

Chart averages over all 60 languages: MAI-Transcribe-2 5.2, Gemini 3.1 Pro 5.3, Gemini 3.5 Transcribe 5.9, Scribe v2 6.2, GPT-transcribe 10.4, Whisper v3 22.8 [verified via sub-research].

**Cross-check:** Qwen3.5-Omni Technical Report, Table 13 (Apr 2026), with Qwen's own normalisation ([arXiv 2604.15804](https://arxiv.org/abs/2604.15804)) [verified]. Qwen3.5-Omni-Plus is best on most languages, often lower than every MAI figure: Italian 0.8, Korean 1.7 CER, Cantonese 2.2 CER. But Bengali comes out at 16.2–24.1 for every system. That shows the size of normalisation effects: Bengali is about 5 in Microsoft's chart and 16+ in Qwen's.

Other per-language sources:
- Voxtral Mini Transcribe V2 Table 7 ([arXiv 2602.11298](https://arxiv.org/abs/2602.11298)): e.g. Arabic 13.54, Hindi 10.33, Korean 12.29 WER [verified].
- NVIDIA Canary-1b-v2 and Parakeet-v3 cards: 25 European languages only [verified].
- Qwen3-ASR ([arXiv 2601.21337](https://arxiv.org/abs/2601.21337)) for Cantonese: Qwen3-ASR-1.7B 3.98, GPT-4o-Transcribe 4.98, Whisper-large-v3 9.18 CER on FLEURS-yue [verified].
- ElevenLabs Scribe v2 gives accuracy *bands* only, with no benchmark named ([docs](https://elevenlabs.io/docs/overview/capabilities/speech-to-text)) [verified]:
  - ≤5% WER: en, es, fr, de, pt, it, nl, pl, ru, tr, id, vi, ja
  - 5–10%: hi, bn, yue, sw, cmn
  - 10–20%: ar, th, ko
- Not obtained: OpenAI's March 2025 gpt-4o-transcribe per-language FLEURS chart (openai.com returned 403), and Google's own per-language Gemini numbers [unverified].

Reading [calc]:
1. **On FLEURS read speech, the 2026 frontier is within 1–2 points across most major languages.** Model choice matters more for the hard languages than the easy ones.
2. **GPT-transcribe is mid-pack outside Western Europe.** Swahili 19.8 against 9.2; Bengali 8.9 against 4.8; Hindi 6.2 against 3.7.
3. **Arabic stays near 9% even for the leaders**, and FLEURS Arabic is Modern Standard read speech. Dialects are far worse (§10.3).
4. **Whisper large-v3, still the default open model, is 2–10× worse than the frontier** outside English and Western Europe. Bengali 46.4, Swahili 35.4, Cantonese 21.9, Hindi 17.4.

### 8.2 WER versus CER, and why CJK and Thai use characters

- **WER** = (substitutions + deletions + insertions) / reference words. It needs word boundaries.
- Chinese, Japanese and Thai are written **without spaces between words**. Word segmentation is itself ambiguous, so WER would measure the segmenter as much as the recogniser. **CER** does the same calculation over characters.
- The Whisper paper puts a space between every character for Chinese, Japanese, Thai, Lao and Burmese, "effectively measuring the character error rate", but scores Korean as WER (14.3) [verified]. The large-v3 README chart uses CER for Korean, Thai, Japanese, Mandarin and Cantonese [verified via sub-research].
- FireRedAudio (Aug 2026) uses CER with spaces removed for Korean, and errors per grapheme cluster for Thai, Lao, Burmese and Khmer ([arXiv 2608.24168](https://arxiv.org/abs/2608.24168)) [verified via sub-research].
- **CER and WER are not comparable** [calc]. A 5% CER in Mandarin is not "the same quality" as 5% WER in English. One wrong character in a two-character word is a whole word wrong in WER terms.
- Meta reports **CER for all 1,600+ languages** in Omnilingual ASR, partly because so many have no settled word segmentation [verified: paper reports CER throughout].

### 8.3 Training data and the long tail

Whisper paper, Figure 11 (hours of transcribed speech per language) and §3.4 ([arXiv 2212.04356](https://arxiv.org/abs/2212.04356)) [verified]:

| Language | Hours | Language | Hours |
|---|---|---|---|
| English | 438,218 (65%) | Italian | 2,585 |
| Chinese | 23,446 | Dutch | 2,077 |
| German | 13,344 | Indonesian | 1,014 |
| Spanish | 11,100 | Arabic | 739 |
| Russian | 9,761 | Vietnamese | 691 |
| French | 9,752 | Thai | 226 |
| Portuguese | 8,573 | **Hindi** | **12** |
| Korean | 7,993 | **Swahili** | **5.4** |
| Japanese | 7,054 | **Bengali** | **1.3** |
| Turkish / Polish | 4,333 / 4,278 | | |

- The squared correlation between log WER and log training hours is **0.83**. The fit implies "WER halves for every 16× increase in training data". Outliers worse than the trend, namely Hebrew, Telugu, Chinese and Korean, have their own scripts and are "more distantly related to the Indo-European languages" [verified]. Figure: `e-whisper-training-hours-vs-wer.png`.
- Data errors propagate. Welsh appeared to have 9,000 hours of *translation* data, which the authors attribute to mislabelling by the language-identification system [verified].
- Bengali at 1.3 hours gave 104.1% WER. Today's best is 4.8% on FLEURS [verified]. That gap was closed by data, not just model size [calc].
- **Omnilingual ASR's tiers** (blog table, `e-omnilingual-performance.png`) [verified]:

  | Tier | Languages | Training data | Share with CER under 10% |
  |---|---|---|---|
  | High-resource | 249 | 50+ h | 95% (236) |
  | Medium-resource | 881 | 10–50 h | 95% (841) |
  | Low-resource | 546 | under 10 h | 36% (195) |

  Overall, 78% of languages have CER under 10. The paper's Table 10 gives 1,237 of 1,570 languages [verified via sub-research].
- Benchmarks also follow the data. FLEURS covers about 102 languages, all read Wikipedia sentences. Business audio is spontaneous, noisy and domain-specific [calc].

---

## 9. Code-switching

Code-switching means changing language mid-conversation, or mid-sentence: Hinglish, Spanglish, Arabic–French in the Maghreb, Mandarin–English in Singapore and Malaysia, Taglish in the Philippines. It is normal in exactly the markets where global clients run contact centres [calc].

### 9.1 Who claims support

All [verified] from docs:
- **Deepgram:** `language=multi`, 55 languages on Nova-3, batch and streaming. "Flux Multilingual handles code-switching natively" (10 languages).
- **AssemblyAI:** "Native code switching" on Universal-3.5 Pro (18 languages) and Universal-3.6 Pro Realtime (32).
- **Soniox:** a language tag on every token, both modes.
- **Speechmatics:** bilingual packs `ar_en`, `cmn_en`, `en_ms`, `cmn_en_ms_ta`, `es+en`, `en_ta`, `tl`, plus Melia "multi".
- **Azure MAI-Transcribe-2:** "For commonly blended language pairs such as Hinglish and Spanglish", files only.
- **Gemini 3.5 Transcribe:** "mid-session code-mixing", both endpoints.
- **OpenAI gpt-transcribe:** "multiple language hints" for "multilingual audio, and code-switching".
- **Sarvam:** `codemix` output mode.
- **Gladia Solaria-1:** yes. **Solaria-3:** no.
- **VibeVoice-ASR** (open research): "natively handles code-switching within and across utterances" [verified].
- Not stated: ElevenLabs, Rev, Mistral.

### 9.2 Benchmarks

There is **no head-to-head of commercial APIs on code-switched audio** that I could find [verified: searched].

What exists:
- **HiKE** (Korean–English; EACL Findings 2026) ([arXiv 2509.24613](https://arxiv.org/abs/2509.24613)) [verified]. MER is the mixed error rate (characters for Korean, words for English). PIER is the error rate at the switch points.

  | Model | MER overall | PIER overall | Monolingual Korean CER | Monolingual English WER |
  |---|---|---|---|---|
  | GPT-4o-transcribe | **21.8** | **28.8** | 2.5 | 3.3 |
  | Whisper-Large | 26.1 | 36.0 | 3.2 | 4.4 |
  | Whisper-Medium | 31.3 | 41.3 | 3.4 | 4.6 |
  | SenseVoice-Small | 32.5 | 54.7 | 6.4 | 7.6 |
  | Gemma-3n (8B) | 76.6 | 54.8 | 10.7 | 13.0 |
  | Seamless-M4T-v2 | 83.6 | 64.7 | 6.4 | 6.3 |

  Reading [calc]: the best system is about 7–9× worse on mixed speech than on either language alone. Errors concentrate exactly where the language switches, often on the English loanword or product name that matters.
- **CS-FLEURS** (Interspeech 2025): 113 code-switched language pairs across 52 languages, mostly synthetic (TTS or read generated sentences). It includes 60 pairs centred on Arabic, Mandarin, Hindi and Spanish. Whisper "struggles with transcribing code-switched speech, especially for language pairs with distinct scripts" ([arXiv 2509.14161](https://arxiv.org/abs/2509.14161)) [verified: abstract; Whisper finding verified-2nd].
- **Mandarin–English corpora:** DOTA-ME-CS (18.54 h) and CS-Dialogue (104 h, 200 speakers) [verified-2nd].
- **Singapore pairs:** Malay–English, Mandarin–Malay and Tamil–English test sets (Interspeech 2025) [verified-2nd].
- **Indic DiarBench** includes English code-mixing in 22 Indian languages, with cpWER 38.8–88.6 (§5.3) [verified].

**Practical advice** [calc]:
- Build a 30–60 minute test set of real client calls in the target mix.
- Score overall WER *and* the error on the switched words.
- Don't rely on "multi" flags.
- Script choice matters for Hinglish. Do you want Hindi words in Devanagari or romanised? Vendors differ. Sarvam offers explicit output modes [verified that modes exist].

---

## 10. Accents, dialects and bias

### 10.1 The canonical study: Koenecke et al. 2020

*Racial disparities in automated speech recognition*, PNAS 117(14):7684–7689 ([PDF](https://5harad.com/papers/asr-disparities.pdf)) [verified]:
- Five systems (Amazon, Apple, Google, IBM, Microsoft) on matched interview snippets from Black and white American speakers: 2,141 each, 19.8 h.
- Average WER **0.35 for Black speakers against 0.19 for white speakers**.
- Best system (Microsoft): 0.27 against 0.15. Worst (Apple): 0.45 against 0.23.
- Black men 0.41, Black women 0.30. White men 0.21, white women 0.17.
- "More than 20% of snippets of black speakers have an error rate of at least 0.5; in contrast, fewer than 2% of snippets of white speakers are above that threshold."
- The gap tracks dialect density (AAVE features) and is attributed mainly to acoustic models, not language models.
- Figure: `e-koenecke-2020-wer-by-race.png`.
- These are 2019-era systems. No equally rigorous study of 2026 commercial systems has been published that I found [verified: searched].

### 10.2 Accented English, 2023–2026

- **EdAcc** (Edinburgh, 2023): about 40 h of video calls across many L1 and L2 Englishes. The best model (Whisper large) averages **19.7% WER against 2.7% on US English clean read speech**. "Across all models, we observe a drop in performance on Indian, Jamaican, and Nigerian English speakers" ([arXiv 2303.18110](https://arxiv.org/abs/2303.18110)) [verified].
- **AfriSpeech-MultiBench** (Intron Health, Nov 2025): over 100 African English accents in more than 10 countries and 7 domains, including call centre, finance, legal and medical ([arXiv 2511.14255](https://arxiv.org/abs/2511.14255)) [verified: abstract].
  - Findings: "multimodal LLMs are more accent-robust yet struggle with domain-specific named entities"; "proprietary models deliver high accuracy on clean speech but vary significantly by country and domain"; "hallucinations still remain a big problem" [verified].
  - Intron-Sahara V2 reports 12.4% WER on the names subset, against "40-70% for open-source models and over 50% for proprietary systems" [verified-2nd: search summary of the paper; vendor-authored].
- **Svarah** (Indian-accented English): 9.6 h, 117 speakers, 65 districts. Sarvam calls its performance "strong" but publishes no number ([Sarvam](https://www.sarvam.ai/blogs/asr)) [verified].
- **2025 work** includes commercial-system racial-bias tests on Pacific Northwest English ([arXiv 2510.22495](https://arxiv.org/abs/2510.22495)), smartphone ASR across 11 accents finding "a bias favoring American English", and a Laryngoscope audit showing worse performance for d/Deaf and hard-of-hearing speakers. None gives a clean commercial WER gap I could verify [verified-2nd].
- **Hallucination harms:** Koenecke et al.'s "Careless Whisper" (2024) found Whisper inventing text, more often for speakers with aphasia. That is covered in pack A (`a-careless-whisper-harms.png`) [cross-reference].

### 10.3 Arabic dialects

FLEURS Arabic is Modern Standard Arabic read aloud. Customers speak Egyptian, Gulf, Levantine and Maghrebi dialects, often mixed with French or English.

**Open Universal Arabic ASR Leaderboard:** WER, six test sets, open models only ([arXiv 2412.13788](https://arxiv.org/abs/2412.13788)). Snapshot of 7 July 2026, from [Cohere's blog](https://cohere.com/blog/transcribe-arabic) [verified-2nd: read via summariser]:

| Test set | Cohere Transcribe Arabic | Meta OmniASR 7B-LLM | Whisper large-v3 |
|---|---|---|---|
| Average | **25.87** | 28.32 | 36.86 |
| SADA (Saudi media) | 37.47 | 41.61 | 55.96 |
| Common Voice | 5.82 | 9.75 | 17.83 |
| MGB-2 (broadcast) | 15.54 | 14.13 | 16.26 |
| Casablanca (8 dialects incl. Maghrebi) | 49.71 | 56.46 | 71.81 |

- The MASC columns from the summariser looked transposed, so I have left them out.
- A third-party model card (Audar-ASR-V1-Turbo) claims a 24.7% average [unverified].
- Reading [calc]: the best open Arabic model gets one word in two wrong on Maghrebi dialects. Arabic is the clearest case for testing on the client's own dialect mix before choosing a vendor. Commercial API results on this leaderboard are not published.

### 10.4 Regional Indian languages

- **Sarvam Saaras V3** (Feb 2026): "~19% WER" on IndicVoices, 19.31% on the 10 most popular languages. It claims a lead over GPT-4o Transcribe, Scribe v2, Gemini 3 Pro and Deepgram Nova-3, but publishes no competitor numbers. Trained on "1 million+ hours of curated multilingual audio" ([Sarvam blog](https://www.sarvam.ai/blogs/asr)) [verified].
  - Reading [calc]: IndicVoices is spontaneous and multi-dialect, so a vendor's ~19% there is consistent with a ~4% FLEURS Hindi score. **Ask for numbers on spontaneous speech, not FLEURS.**
- **AI4Bharat IndicConformer:** open, "all 22 official Indian languages" [verified].
- **Indic DiarBench:** Sarvam best on DER and cpWER (§5.3) [verified].

---

## 11. Language identification and translation

### 11.1 Automatic language ID (LID)

- **Whisper:** zero-shot LID accuracy on FLEURS is 64.5% across 102 languages, against 77.7% for supervised mSLAM. On the 82 languages it was trained on, 80.3% (Whisper paper Table 5, §3.6) [verified]. So one clip in five of a *supported* language gets the wrong language label.
- **Known failure modes:**
  - **Short or noisy clips.** A YouTube Shorts study found errors clustered in "short, shouted utterances", with chants decoded as Turkish ([arXiv 2604.00994](https://arxiv.org/pdf/2604.00994)) [verified-2nd].
  - **Wrong language, then translation.** If LID guesses wrong, Whisper can output a *translation* into the guessed language instead of a transcript. Users report English coming out as Welsh, and accented speech coming out "translated" ([OpenAI forum](https://community.openai.com/t/whisper-3-detects-incorrect-language-translates-instead-of-transcribes/828870); [Welsh thread](https://community.openai.com/t/solved-whisper-translates-into-welsh/120780)) [verified-2nd]. With Tagalog–English audio, Whisper "tended to return English translations instead of Tagalog transcriptions" ([AAPB](https://blog.americanarchive.org/2023/08/24/assessment-of-whisper-ai-as-a-tagalog-language-transcription-tool/)) [verified-2nd].
  - **One label for a mixed call.** At-start LID picks one language and misses later switches.
- **Vendor limits** [verified]:
  - Deepgram: "Language Detection is not currently supported for streaming" (35 languages, batch).
  - Speechmatics: `auto` "Currently supported with Batch transcription only".
  - OpenAI gpt-live-transcribe "doesn't return detected-language predictions".
  - Azure: "up to four languages for at-start LID or up to 10 languages for continuous LID".
  - AWS: streaming LID per channel, or multi-language. Not for Swedish or Vietnamese.
  - AssemblyAI streaming reports language per turn.
  - Soniox tags language per token.
  - MMS's LID covers 4,017 languages ([Meta MMS](https://ai.meta.com/blog/multilingual-model-speech-recognition/)) [verified].
- **Advice** [calc]: if the call's language is known from the IVR menu, phone number or CRM, *pass it*. Microsoft's own FLEURS chart is run with the language forced. Auto-detect is for when you truly don't know, and it needs a few seconds of clean speech.

### 11.2 Translation while transcribing

- Whisper was trained on both transcription and X→English translation. A task token chooses which one (approach figure in pack A). Zero-shot it scored 29.1 BLEU on CoVoST2 X→en, beating prior work on medium- and low-resource languages but not high-resource ones (paper Table 4) [verified].
- The risk is the reverse case in §11.1: translation when you wanted a transcript.
- For contact centres [calc]: keep the original-language transcript as the record, and translate as a separate, labelled step. A translated transcript is not evidence of what the customer said. I did not verify each vendor's live-translation feature in this pack [unverified].

---

## 12. Low-resource languages, open models and regional specialists

### 12.1 Meta MMS (May 2023)

- Labelled data for "over 1,100 languages and unlabeled data for nearly 4,000", built largely from recordings of religious texts such as the Bible ([blog](https://ai.meta.com/blog/multilingual-model-speech-recognition/)) [verified].
- On "the 54 FLEURS languages that enable a direct comparison", the blog chart shows WER of 44.3 for Whisper (100 languages, 680k h), 19.1 for MMS (61 languages, 3k h) and 18.7 for MMS (1,107 languages, 45k h) [verified; `e-mms-vs-whisper-fleurs-wer.png`].
- It shows similar error for male and female speakers (CER 12.4 against 12.3) [verified: chart].
- Map: `e-mms-language-coverage-map.png`.

### 12.2 Meta Omnilingual ASR (10 Nov 2025)

- More than 1,600 languages, including 500 "never before transcribed by AI". Models from 300M to 7B parameters. Apache 2.0, with a CC-BY corpus covering 350 underserved languages ([blog](https://ai.meta.com/blog/omnilingual-asr-advancing-automatic-speech-recognition/)) [verified].
- The 7B LLM-ASR has CER under 10 for 78% of languages [verified].
- On FLEURS-81 it averages 5.6 CER against Whisper large-v3's 22.6, and wins 65 of 81 languages (paper Table 5). On FLEURS-102 it averages 6.2 CER, against 6.5 for Google USM-M and 6.3 for MMS ([arXiv 2511.09690](https://arxiv.org/abs/2511.09690)) [verified via sub-research].
- **"Bring your own language":** a few paired audio–text examples given in context extend it to new languages. The blog chart claims 5,400 more languages, but "zero-shot performance cannot yet match fully trained systems" [verified]. Image: `e-omnilingual-incontext.png`.
- It is a batch, offline model with no diarisation [calc from model description].
- On Arabic dialects it is second among open models (28.32 average WER, §10.3) [verified-2nd].

### 12.3 Regional specialists

| Region | Vendor / project | What they claim | Evidence quality |
|---|---|---|---|
| India | **Sarvam** (Saaras v3/v4) | ~19% WER IndicVoices; 23 languages; codemix mode; best DER on Indic DiarBench | Vendor numbers plus one third-party benchmark [verified] |
| India | **AI4Bharat** (IIT Madras) IndicConformer, IndicVoices | Open models for 22 languages; the benchmark everyone uses | [verified: coverage] |
| Africa | **Intron Health** (Sahara V2) | Leads AfriSpeech-MultiBench on names (12.4%) and close on legal (12.01%) | Vendor's own benchmark [verified-2nd] |
| Africa | **Lelapa AI** (Vulavula) | South African languages; 2024 card: isiZulu WER 45.7% (36.9% after post-processing), seSotho 37.0% (29.4%), ZA English 8.7%, on general and call-centre data | Old card; "not suitable for the general conversation domain" ([model card PDF](https://lelapa.ai/wp-content/uploads/2024/04/Lelapa-Model-Card-Lelapa-X-ASR-isiZulu-and-seSotho.pdf)) [verified-2nd] |
| Arabic | **Cohere** Transcribe Arabic (Jul 2026, open) | Best open model on the Arabic leaderboard, 25.87 average WER | Vendor blog; leaderboard independent [verified-2nd] |
| SE Asia | **Speechmatics** bilingual packs | `en_ms`, `cmn_en_ms_ta`, `tl` (Tagalog) packs | Coverage only [verified] |

Reading [calc]:
- Specialists win where (a) the language mix is local, (b) speech is spontaneous and code-mixed, and (c) names and places are local.
- Global frontier models now match specialists on *FLEURS* for big languages like Hindi. The gap shows up on spontaneous, multi-speaker, code-mixed audio, which is what contact centres record.
- A specialist with weaker global coverage may still be the right real-time choice for one market. Check streaming support, because Sarvam does not document streaming diarisation.

---

## 13. What to tell the client (synthesis) [calc]

1. **Record in stereo, or per participant.** It is free, it beats any diariser, and it avoids voice-analysis legal questions.
2. **If you must diarise, choose the diariser separately from the recogniser,** and test on your speaker counts. Two-party calls are a solved-ish problem at 5–10% DER. Meetings with six people in a room are not, at 20–45% DER.
3. **Real-time diarisation is a short vendor list.** Check it before promising live speaker labels in an agent-assist screen.
4. **Ask for streaming language lists and per-language error rates on spontaneous speech in your markets.** FLEURS numbers are a ceiling, not a forecast.
5. **Arabic dialects, Swahili and code-mixed South Asian speech are where vendor choice matters most.** Test regional specialists alongside the global players.
6. **Force the language when you know it.** Treat auto-detect as a fallback, and watch for "translation instead of transcription".
7. **Keep diarisation and identification apart in design documents.** Enrolment means biometric consent under GDPR and BIPA.

---

## Sources (main primary ones)

- NVIDIA Streaming Sortformer 4spk-v2.1 model card — https://huggingface.co/nvidia/diar_streaming_sortformer_4spk-v2.1
- Sortformer paper — https://arxiv.org/abs/2409.06656 ; Streaming Sortformer — https://arxiv.org/abs/2507.18446
- pyannote.audio releases 3.0.0 / 3.1.0 / 4.0.0 — https://github.com/pyannote/pyannote-audio/releases
- pyannoteAI changelog — https://www.pyannote.ai/changelog ; streaming benchmark — https://www.pyannote.ai/blog/streaming-diarization-benchmark ; benchmark — https://www.pyannote.ai/benchmark
- pyannote.metrics docs — https://pyannote.github.io/pyannote-metrics/reference.html
- El Shafey et al. 2019 (WDER) — https://arxiv.org/abs/1907.05337
- Indic DiarBench — https://arxiv.org/abs/2607.23808
- Who Spoke What When? — https://arxiv.org/abs/2603.22709 ; VibeVoice-ASR — https://arxiv.org/abs/2601.18184
- DIHARD III eval plan — https://arxiv.org/pdf/2006.05815 ; CHiME-6 — https://arxiv.org/pdf/2004.09249 ; MeetEval — https://github.com/fgnt/meeteval
- Vendor docs: OpenAI https://developers.openai.com/api/docs/guides/speech-to-text ; Gemini 3.5 Transcribe https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe ; Chirp 3 https://docs.cloud.google.com/speech-to-text/docs/models/chirp-3 ; Azure https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=stt ; AWS https://docs.aws.amazon.com/transcribe/latest/dg/feature-matrix.html ; Deepgram https://developers.deepgram.com/docs/multilingual-code-switching ; AssemblyAI https://www.assemblyai.com/docs/getting-started/models ; Speechmatics https://docs.speechmatics.com/speech-to-text/models ; Soniox https://soniox.com/docs/stt/models ; ElevenLabs https://elevenlabs.io/docs/overview/capabilities/speech-to-text ; Gladia https://docs.gladia.io/chapters/introduction/models ; Rev https://docs.rev.ai/faq ; Mistral https://docs.mistral.ai/studio/audio/concepts/speakers-and-diarization ; Sarvam https://docs.sarvam.ai
- Recall.ai per-participant audio — https://docs.recall.ai/docs/how-to-get-separate-audio-per-participant-realtime
- GDPR Art. 4 / Art. 9 — https://gdpr-info.eu/art-4-gdpr/ , https://gdpr-info.eu/art-9-gdpr/
- Microsoft MAI-Transcribe-2 per-language chart — https://microsoft.ai/models/mai-transcribe-2/
- Whisper paper — https://arxiv.org/abs/2212.04356 ; Whisper README chart — https://github.com/openai/whisper
- Qwen3.5-Omni report — https://arxiv.org/abs/2604.15804 ; Qwen3-ASR — https://arxiv.org/abs/2601.21337 ; FireRedAudio — https://arxiv.org/abs/2608.24168 ; Voxtral Realtime — https://arxiv.org/abs/2602.11298
- Meta MMS — https://ai.meta.com/blog/multilingual-model-speech-recognition/ ; Omnilingual ASR — https://ai.meta.com/blog/omnilingual-asr-advancing-automatic-speech-recognition/ , https://arxiv.org/abs/2511.09690
- HiKE — https://arxiv.org/abs/2509.24613 ; CS-FLEURS — https://arxiv.org/abs/2509.14161
- Koenecke et al. 2020 — https://5harad.com/papers/asr-disparities.pdf ; EdAcc — https://arxiv.org/abs/2303.18110 ; AfriSpeech-MultiBench — https://arxiv.org/abs/2511.14255
- Open Universal Arabic ASR Leaderboard — https://arxiv.org/abs/2412.13788 ; Cohere Transcribe Arabic — https://cohere.com/blog/transcribe-arabic
- Sarvam Saaras V3 — https://www.sarvam.ai/blogs/asr
