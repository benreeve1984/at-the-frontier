window.SX = {
 "columns": [
  {
   "key": "azure",
   "label": "Cloud services: Azure",
   "unit": "$ per audio hour: batch / live",
   "color": "var(--blue)",
   "items": [
    {
     "id": "azure-speech-batch",
     "name": "Azure Speech batch",
     "price": "$0.18 / \u2013",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": true,
      "weights": false,
      "saas": false,
      "note": "First-party Azure; also containers."
     },
     "status": "GA",
     "notes": "Cheapest hyperscaler batch list price ($0.18/hr), tied with Google dynamic batch.",
     "basis": "$0.18 per audio hour (S1 Speech to Text Batch)",
     "data": "Azure data terms; EU/UK regions; HIPAA BAA.",
     "langs": "100+ locales (Microsoft marketing; not counted).",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "azure-openai-gpt-transcribe",
     "name": "Azure OpenAI GPT-Transcribe",
     "price": "$0.27 / \u2013",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "OpenAI model run by Microsoft in Azure."
     },
     "status": "GA",
     "notes": "Lets an Azure-only client use OpenAI's newest transcription model inside its tenancy.",
     "basis": "Global $0.27/hr; Data Zone $0.297/hr (Azure Retail Prices API, effective 2026-08-01)",
     "data": "Azure OpenAI data terms; Data Zone keeps processing in EU or US; abuse-monitoring retention can be waived on approval.",
     "langs": "Multilingual with language hints (OpenAI); count not published.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "azure-fast-transcription",
     "name": "Azure Fast Transcription",
     "price": "$0.36 / \u2013",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": true,
      "weights": false,
      "saas": false,
      "note": "First-party; disconnected container option for fast transcription added 2026."
     },
     "status": "GA",
     "notes": "The default route for synchronous file transcription on Azure.",
     "basis": "$0.36 per audio hour (Fast Transcription meter); synchronous, faster than real time",
     "data": "Azure data terms; files under 5 hours / 500 MB.",
     "langs": "15 locales for the multilingual (no locale) mode; full list via API.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "azure-llm-speech",
     "name": "Azure LLM Speech",
     "price": "$0.36 / \u2013",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party Azure Speech."
     },
     "status": "GA",
     "notes": "Microsoft's LLM-based transcription and translation inside Azure Speech.",
     "basis": "Same SKU and price as fast transcription ($0.36/hr)",
     "data": "Azure data terms.",
     "langs": "50 batch. 50 languages, auto language detection when locale omitted.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "azure-mai-transcribe-2",
     "name": "MAI-Transcribe-2",
     "price": "$0.54 / \u2013",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Microsoft first-party model ('Direct from Azure'); used via fast transcription enhancedMode or Foundry."
     },
     "status": "preview (check status before production, per Microsoft docs)",
     "notes": "Microsoft's own frontier ASR line: MAI-Transcribe-1 (Apr 2026, 25 languages, $0.36/hr), 1.5 (Jun 2026, 43 languages), 2 (Aug\u2013Sep 2026, 60 languages).",
     "basis": "Azure Retail Prices API meter 'MAI-Transcribe-2' $0.54 per hour (effective 2026-10-01; two meters: Azure Speech and Azure Direct Models)",
     "data": "Azure data terms.",
     "langs": "60 batch. 60 languages (Foundry catalog).",
     "dia": "Batch yes, live no",
     "verified": false
    },
    {
     "id": "azure-mai-transcribe-2-streaming",
     "name": "MAI-Transcribe-2 Streaming",
     "price": "\u2013 / $0.54",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Foundry 'Direct from Azure'."
     },
     "status": "preview",
     "notes": "Microsoft's answer to gpt-live-transcribe inside Azure.",
     "basis": "Assumed $0.54/hr (MAI-Transcribe-2 meter); mapping of meter to streaming not confirmed",
     "data": "Azure data terms.",
     "langs": "60 streaming. 60 languages with continuous automatic language detection (catalog + press).",
     "dia": "Batch no, live no",
     "verified": false
    },
    {
     "id": "azure-speech-containers",
     "name": "Azure Speech containers",
     "price": "$0.76 / $0.76",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": true,
      "weights": false,
      "saas": false,
      "note": "Customer-run container; connected mode reports usage to Azure."
     },
     "status": "GA (disconnected needs approval)",
     "notes": "The hyperscaler option for air-gapped STT.",
     "basis": "Connected container commitment 2k hr/month: $1,520 (overage $0.76/hr); 100k: $38,000 ($0.38/hr)",
     "data": "Audio stays in customer environment.",
     "langs": "",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "azure-speech-realtime",
     "name": "Azure Speech real-time",
     "price": "\u2013 / $1.00",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": true,
      "weights": false,
      "saas": false,
      "note": "First-party Azure. Connected and disconnected containers allow on-prem/VPC (commitment tiers, approval needed)."
     },
     "status": "GA",
     "notes": "The most expensive hyperscaler streaming list price; commitment tiers bring it to $0.40\u20130.80/hr.",
     "basis": "$1.00 per audio hour, billed per second (Azure Retail Prices API, S1 Speech To Text)",
     "data": "Azure data terms; EU and UK regions; HIPAA BAA; audio not stored for real-time by default; customer-managed keys.",
     "langs": "Microsoft quotes 100+ locales for STT (not counted today). Continuous language ID is a paid add-on in real-time.",
     "dia": "Batch yes, live yes, +$0.30/hr",
     "verified": true
    },
    {
     "id": "azure-openai-gpt-live-transcribe",
     "name": "Azure OpenAI GPT-Live-Transcribe",
     "price": "\u2013 / $1.02",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "Azure",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "OpenAI models hosted by Microsoft."
     },
     "status": "GA",
     "notes": "",
     "basis": "gpt-live-transcribe Global $1.02/hr, Data Zone $1.122/hr; gpt-realtime-whisper Global $1.02/hr",
     "data": "Azure OpenAI terms; Data Zone option.",
     "langs": "",
     "dia": "Batch no, live no",
     "verified": true
    }
   ]
  },
  {
   "key": "awsgcp",
   "label": "Cloud services: AWS and Google",
   "unit": "$ per audio hour: batch / live",
   "color": "var(--blue)",
   "items": [
    {
     "id": "vertex-gemini-3-5-transcribe",
     "name": "Gemini 3.5 Transcribe (Vertex)",
     "price": "$0.31 / \u2013",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Google first-party model on Vertex."
     },
     "status": "GA on Gemini API (Aug 2026); Vertex listing live",
     "notes": "Google's new purpose-built transcription model; cheaper than Chirp 3 list price ($0.96/hr).",
     "basis": "$2.00/M audio tokens in, $12.00/M text tokens out; Google's blended estimate $0.0051/audio-min (25 audio tokens/s, 175 text tokens/min)",
     "data": "Vertex data terms (no training on customer data; residency per region; ZDR possible by config).",
     "langs": "85 batch / 85 streaming. 85+ languages, auto-detection, mid-session code-mixing.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "aws-transcribe-batch",
     "name": "Amazon Transcribe",
     "price": "$0.36 / \u2013",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party AWS service; PrivateLink supported for batch APIs; customer-managed KMS keys for custom resources added 2026-09."
     },
     "status": "GA",
     "notes": "Now the cheapest hyperscaler batch list price ($0.36/hr), level with OpenAI whisper-1 and Azure Fast Transcription.",
     "basis": "$0.0001 per second = $0.006/min, US East and EU (London, Frankfurt, Ireland) same; billed per second, 15 s minimum per request",
     "data": "AWS data terms; HIPAA eligible (BAA); EU regions available (London, Frankfurt, Ireland, Paris, Stockholm). AWS may use content to improve the service unless you opt out via an AI services opt-out policy (AWS Organizations).",
     "langs": "113 batch / 99 streaming. 113 locales batch, 99 streaming (45 of them marked streaming* = limited regions). Automatic language ID and multi-language ID in batch.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "aws-bedrock-data-automation-audio",
     "name": "Bedrock Data Automation",
     "price": "$0.36 / \u2013",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party Bedrock feature."
     },
     "status": "GA",
     "notes": "Useful when you want transcript + structured output in one AWS-native call.",
     "basis": "$0.006 per audio minute standard output (Bedrock pricing example: 15,000 min = $90)",
     "data": "Bedrock data terms.",
     "langs": "Not checked.",
     "dia": "Batch not stated, live not stated",
     "verified": true
    },
    {
     "id": "vertex-gemini-3-5-transcribe-live",
     "name": "Gemini 3.5 Transcribe Live (Vertex)",
     "price": "\u2013 / $0.54",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": ""
     },
     "status": "GA on Gemini API (Aug 2026); Vertex listed",
     "notes": "",
     "basis": "$3.50/M audio in, $21.00/M text out; blended $0.008925/audio-min; only final committed tokens billed",
     "data": "Vertex data terms.",
     "langs": "85 streaming. 85+ languages with code-mixing.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "aws-transcribe-streaming",
     "name": "Transcribe streaming",
     "price": "\u2013 / $0.60",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party AWS. Also inside Amazon Connect contact lens."
     },
     "status": "GA",
     "notes": "$0.60/hr streaming makes it the cheapest hyperscaler real-time STT at list price.",
     "basis": "$0.0001667 per second = $0.01/min; same in US East and EU regions",
     "data": "As batch: HIPAA eligible, EU regions, AI services opt-out policy needed to stop service-improvement use.",
     "langs": "113 batch / 99 streaming. Streaming supports 99 locales per the language table; some only in certain regions. Streaming automatic language ID supported.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "gcp-stt-chirp-3",
     "name": "Google Chirp 3",
     "price": "$0.96 / $0.96",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Google Cloud",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party GCP; us and eu multi-regions GA."
     },
     "status": "GA (Oct 2025); preview in some regions",
     "notes": "Price is the same for all V2 standard models (chirp_2, chirp_3, telephony).",
     "basis": "$0.016/min = $0.96/hr for first 500k min/month (standard models incl. chirp), per-second rounding",
     "data": "Google Cloud terms; EU multi-region; CMEK; HIPAA BAA covers Speech-to-Text (Google; not re-read). V1 API charges more without data logging ($0.024/min).",
     "langs": "109 batch / 109 streaming. 109 locales listed (29 GA, rest preview) for StreamingRecognize, Recognize and BatchRecognize; automatic language detection.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "aws-transcribe-call-analytics",
     "name": "Transcribe Call Analytics",
     "price": "$1.80 / $1.80",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party AWS; integrates with Amazon Connect."
     },
     "status": "GA",
     "notes": "Contact-centre bundle; compare with Transcribe streaming ($0.60/hr) plus your own LLM.",
     "basis": "$0.0005 per second T1 (first 250k min/month) = $0.03/min",
     "data": "As Transcribe.",
     "langs": "Fewer languages than standard Transcribe (column 'Call Analytics*' in AWS table); count not extracted.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "aws-transcribe-medical",
     "name": "Transcribe Medical",
     "price": "$4.50 / $4.50",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "AWS",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "First-party AWS."
     },
     "status": "GA",
     "notes": "12x the price of standard Transcribe. Deepgram, AssemblyAI, Speechmatics and ElevenLabs sell medical models at $0.15\u20130.26/hr.",
     "basis": "$0.00125 per second = $0.075/min, batch and streaming",
     "data": "HIPAA eligible.",
     "langs": "1 batch / 1 streaming. US English (from memory; not re-read).",
     "dia": "Batch yes, live yes",
     "verified": true
    }
   ]
  },
  {
   "key": "lab",
   "label": "AI lab models",
   "unit": "$ per audio hour: batch / live",
   "color": "var(--purple)",
   "items": [
    {
     "id": "xai-grok-stt",
     "name": "xAI Grok STT",
     "price": "$0.10 / $0.20",
     "deploy": {
      "hosted": [],
      "billing": "xAI",
      "private": false,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA (2026-04-17)",
     "notes": "Cheapest proprietary streaming price found ($0.20/hr). xAI's own WER table (6.9% overall) is a vendor claim.",
     "basis": "$0.10/hr batch (REST), $0.20/hr streaming (WebSocket)",
     "data": "xAI API terms; no EU residency found.",
     "langs": "25 batch / 25 streaming. 25+ languages with switching.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "gemini-3-8-flash-audio",
     "name": "Gemini 3.8 Flash (prompted)",
     "price": "$0.11 / \u2013",
     "deploy": {
      "hosted": [
       "GCP"
      ],
      "billing": "Gemini API / Vertex",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Also on Vertex."
     },
     "status": "GA (2026-09-02)",
     "notes": "Good for transcribe-and-analyse in one call; no WER guarantees.",
     "basis": "$0.75/M input tokens (page does not list a separate audio rate; assumed same), $3.75/M output; 25 audio tokens/s = 90k tokens/hr, 175 output tokens/min",
     "data": "As Gemini API / Vertex.",
     "langs": "Broad multilingual; no count for ASR.",
     "dia": "Batch yes, live no",
     "verified": false
    },
    {
     "id": "mistral-voxtral-mini-transcribe-3",
     "name": "Voxtral Mini Transcribe 3",
     "price": "$0.21 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "Mistral",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Premier (closed) weights."
     },
     "status": "public preview (2026-10-20)",
     "notes": "Claims to beat Gemini 3.5 Transcribe on FLEURS (vendor claim).",
     "basis": "$0.0035/min; cached input $0.00035/min",
     "data": "Mistral EU hosting by default; ZDR available on request (Mistral; not re-read).",
     "langs": "Mistral claims 3rd on FLEURS; language count not on model page.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "mistral-voxtral-small-transcribe-3",
     "name": "Voxtral Small Transcribe 3",
     "price": "$0.24 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "Mistral",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Premier."
     },
     "status": "public preview (2026-10-20)",
     "notes": "Mistral claims it beats MAI-Transcribe-2, GPT-Transcribe, Scribe v2 and Gemini 3.5 Transcribe (vendor claim).",
     "basis": "$0.004/min",
     "data": "As Mistral.",
     "langs": "",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "openai-gpt-transcribe",
     "name": "OpenAI GPT-Transcribe",
     "price": "$0.27 / \u2013",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "OpenAI",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Also in Azure OpenAI (Global $0.27, Data Zone $0.297)."
     },
     "status": "GA (launched 2026-07-28)",
     "notes": "OpenAI's recommended file model; 25% cheaper than gpt-4o-transcribe.",
     "basis": "$0.0045 per audio minute",
     "data": "OpenAI API: not used for training; 30-day abuse retention unless ZDR approved; EU data residency available for eligible customers (OpenAI; not re-read).",
     "langs": "Multilingual with language hints; returns detected languages. OpenAI reports Common Voice 22-language WER 19.27% vs 40.37% for whisper-1.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "gemini-api-3-5-transcribe",
     "name": "Gemini 3.5 Transcribe",
     "price": "$0.30 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "Google AI Studio / Gemini API",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Same model on Vertex is the cloud-hosted option."
     },
     "status": "GA (Aug 2026)",
     "notes": "",
     "basis": "$2.00/M audio in ($0.003/min), $12.00/M text out ($0.002/min): ~$0.005/min",
     "data": "Paid tier: not used to improve products. Free tier: used.",
     "langs": "85 batch / 85 streaming. 85+ languages, code-mixing.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "mistral-voxtral-mini-transcribe-realtime-3",
     "name": "Voxtral Realtime 3",
     "price": "\u2013 / $0.48",
     "deploy": {
      "hosted": [],
      "billing": "Mistral",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Premier; previous realtime model (2602) has Apache-2.0 weights."
     },
     "status": "public preview (2026-10-20)",
     "notes": "",
     "basis": "$0.008/min",
     "data": "As Mistral.",
     "langs": "",
     "dia": "Batch no, live yes",
     "verified": true
    },
    {
     "id": "gemini-api-3-5-transcribe-live",
     "name": "Gemini 3.5 Transcribe Live",
     "price": "\u2013 / $0.54",
     "deploy": {
      "hosted": [],
      "billing": "Gemini API",
      "private": false,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA (Aug 2026)",
     "notes": "",
     "basis": "$3.50/M audio in ($0.005/min), $21/M text out ($0.004/min): ~$0.009/min",
     "data": "As Gemini API.",
     "langs": "85 streaming. ",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "openai-gpt-live-transcribe",
     "name": "OpenAI GPT-Live-Transcribe",
     "price": "\u2013 / $1.02",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "OpenAI",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Also in Azure OpenAI."
     },
     "status": "GA (2026-07-28)",
     "notes": "Does not support server VAD/semantic VAD; pair with your own turn detection.",
     "basis": "$0.017 per audio minute (Realtime API transcription session)",
     "data": "As OpenAI API.",
     "langs": "Language hints; does not return detected language.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "openai-gpt-realtime-whisper",
     "name": "OpenAI gpt-realtime-whisper",
     "price": "\u2013 / $1.02",
     "deploy": {
      "hosted": [
       "Azure"
      ],
      "billing": "OpenAI",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Also in Azure OpenAI."
     },
     "status": "GA",
     "notes": "OpenAI says gpt-live-transcribe beats it on two multilingual tests.",
     "basis": "$0.017 per audio minute",
     "data": "As OpenAI API.",
     "langs": "",
     "dia": "Batch no, live no",
     "verified": true
    }
   ]
  },
  {
   "key": "spec",
   "label": "Specialist providers",
   "unit": "$ per audio hour: batch / live",
   "color": "var(--orange)",
   "items": [
    {
     "id": "soniox-v5",
     "name": "Soniox v5",
     "price": "$0.10 / $0.12",
     "deploy": {
      "hosted": [],
      "billing": "Soniox",
      "private": false,
      "weights": false,
      "saas": true,
      "note": "Data residency options in docs."
     },
     "status": "GA (Jun 2026)",
     "notes": "Lowest-priced multilingual streaming with diarisation included.",
     "basis": "Token-based: async $1.50/M audio tokens, real-time $2.00/M; ~30k audio tokens/hr; text $3.50\u20134.00/M; Soniox's own blended figure $0.10/hr async, $0.12/hr real-time",
     "data": "Docs list data residency and security pages (not re-read).",
     "langs": "60 batch / 60 streaming. 60+ languages, language ID, translation in the same call.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "speechmatics-melia-1",
     "name": "Speechmatics Melia 1",
     "price": "$0.12 / $0.20",
     "deploy": {
      "hosted": [],
      "billing": "Speechmatics",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "Enterprise: on-prem containers, virtual appliance, hybrid, on-device."
     },
     "status": "GA (new)",
     "notes": "UK vendor with explicit EU/UK-friendly data handling.",
     "basis": "Pre-recorded $0.12/hr; real-time $0.20/hr; billed per second from credits",
     "data": "SOC 2 Type II, ISO 27001, GDPR, HIPAA; choice of EU/US/AUS processing; real-time not stored; batch auto-deleted after 7 days; no training unless opted in.",
     "langs": "56 batch / 56 streaming. 56 languages, no language choice needed, switches mid-sentence.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "assemblyai-universal-2",
     "name": "AssemblyAI Universal-2",
     "price": "$0.15 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "AssemblyAI",
      "private": false,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA",
     "notes": "Slam-1 no longer appears on the pricing page.",
     "basis": "$0.15/hr",
     "data": "As AssemblyAI.",
     "langs": "99 batch. 99 languages.",
     "dia": "Batch yes, live no, +$0.02/hr",
     "verified": true
    },
    {
     "id": "assemblyai-universal-streaming",
     "name": "AssemblyAI Universal-Streaming",
     "price": "\u2013 / $0.15",
     "deploy": {
      "hosted": [],
      "billing": "AssemblyAI",
      "private": true,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA",
     "notes": "Cheapest mainstream streaming price for English.",
     "basis": "$0.15/hr",
     "data": "As AssemblyAI.",
     "langs": "6 streaming. English only; multilingual variant en, es, de, fr, pt, it.",
     "dia": "Batch no, live yes, +$0.12/hr",
     "verified": true
    },
    {
     "id": "speechmatics-linden-1",
     "name": "Speechmatics Linden 1",
     "price": "\u2013 / $0.15",
     "deploy": {
      "hosted": [],
      "billing": "Speechmatics",
      "private": true,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA",
     "notes": "",
     "basis": "$0.15/hr real-time only (shown reduced from $0.20)",
     "data": "As Speechmatics.",
     "langs": "",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "gladia-solaria-3",
     "name": "Gladia Solaria-3",
     "price": "$0.18 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "Gladia",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "'Custom hosting' on Enterprise."
     },
     "status": "GA",
     "notes": "French vendor; best for European call audio.",
     "basis": "EUR 0.16/hr (0\u2013100 h/month) falling to EUR 0.12/hr at 10k+ h; converted at USD 1.1216/EUR",
     "data": "GDPR, HIPAA, SOC 2; self-serve trains on data by default (opt-out free); Enterprise no-training and ZDR.",
     "langs": "5 batch. EN, FR, DE, ES, IT (pricing page says 6); no code-switching.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "rev-ai-reverb",
     "name": "Rev Reverb",
     "price": "$0.20 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "Rev",
      "private": true,
      "weights": true,
      "saas": true,
      "note": "Reverb open weights (non-commercial licence, from memory); on-prem by contract."
     },
     "status": "GA",
     "notes": "",
     "basis": "Reverb English $0.20/hr; foreign-language $0.30/hr; billed per second, 15 s minimum",
     "data": "HIPAA processing available on request; Rev says no training on API data (not re-read).",
     "langs": "58 batch. English + 57 foreign languages.",
     "dia": "Batch yes, live not stated",
     "verified": true
    },
    {
     "id": "assemblyai-universal-3-5-pro",
     "name": "AssemblyAI Universal-3.5 Pro",
     "price": "$0.21 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "AssemblyAI",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "Self-hosted option listed in product menu ('Self Hosted', 'self-hosted streaming' docs)."
     },
     "status": "GA",
     "notes": "",
     "basis": "$0.21/hr pay as you go",
     "data": "SOC 2; HIPAA BAA; EU data residency endpoint (docs 'Cloud endpoints & data residency').",
     "langs": "18 batch. 18 languages, native code-switching; fall back to Universal-2 for others.",
     "dia": "Batch yes, live no, +$0.02/hr",
     "verified": true
    },
    {
     "id": "elevenlabs-scribe-v2",
     "name": "ElevenLabs Scribe v2",
     "price": "$0.22 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "ElevenLabs",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "Private deployments listed in docs."
     },
     "status": "GA",
     "notes": "",
     "basis": "$0.22/hr API (USD, not credits)",
     "data": "HIPAA-eligible with BAA and Zero Retention Mode; EU data residency offering.",
     "langs": "90 batch. 90+ languages.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "deepgram-nova-3",
     "name": "Deepgram Nova-3",
     "price": "$0.26 / $0.46",
     "deploy": {
      "hosted": [],
      "billing": "Deepgram; AWS Marketplace (SageMaker model packages)",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "Self-hosted containers (Enterprise) in customer VPC/on-prem; SageMaker deployment runs air-gapped in your AWS account."
     },
     "status": "GA",
     "notes": "Deepgram is acquiring Daily (Pipecat) - announced 2026-10-29.",
     "basis": "Pay as you go: pre-recorded $0.0043/min mono, $0.0052 multi; streaming $0.0077 mono, $0.0092 multi; per-second billing, no rounding",
     "data": "SOC 2, HIPAA BAA (Enterprise), GDPR with EU endpoint api.eu.deepgram.com, PCI. Audio not used for training per Deepgram data page (not re-read).",
     "langs": "Monolingual 40+ languages ('60+ languages' on pricing page incl. Nova-2); multilingual code-switching in 10 languages (en, es, fr, de, hi, ru, pt, ja, it, nl).",
     "dia": "Batch yes, live yes, +$0.12/hr",
     "verified": true
    },
    {
     "id": "gladia-solaria-1",
     "name": "Gladia Solaria-1",
     "price": "$0.30 / $0.76",
     "deploy": {
      "hosted": [],
      "billing": "Gladia",
      "private": true,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA",
     "notes": "",
     "basis": "Async EUR 0.27/hr (falls to EUR 0.21); real-time EUR 0.68/hr",
     "data": "As Gladia.",
     "langs": "100 batch / 100 streaming. 100+ languages, code-switching.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "speechmatics-enhanced",
     "name": "Speechmatics Enhanced",
     "price": "$0.38 / $0.40",
     "deploy": {
      "hosted": [],
      "billing": "Speechmatics",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "On-prem and on-device on Enterprise."
     },
     "status": "GA",
     "notes": "",
     "basis": "Enhanced: batch $0.38/hr, real-time $0.40/hr. Standard $0.23/hr both.",
     "data": "As Speechmatics.",
     "langs": "55 batch / 55 streaming. 55+ languages; all available in real time.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "elevenlabs-scribe-v2-realtime",
     "name": "Scribe v2 Realtime",
     "price": "\u2013 / $0.39",
     "deploy": {
      "hosted": [],
      "billing": "ElevenLabs",
      "private": true,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA",
     "notes": "",
     "basis": "$0.39/hr",
     "data": "As ElevenLabs.",
     "langs": "90 streaming. 90+ languages.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "cartesia-ink-2",
     "name": "Cartesia Ink 2",
     "price": "\u2013 / $0.39",
     "deploy": {
      "hosted": [],
      "billing": "Cartesia",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "On-prem / VPC by sales."
     },
     "status": "GA (2026-09-17)",
     "notes": "",
     "basis": "3 credits per audio second; Cartesia states $0.39/hr on Scale plan ($299/mo, 8M credits)",
     "data": "SOC 2 Type II.",
     "langs": "5 streaming. en, fr, hi, ja, es.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "assemblyai-universal-3-6-pro-realtime",
     "name": "AssemblyAI U-3.6 Pro Realtime",
     "price": "\u2013 / $0.45",
     "deploy": {
      "hosted": [],
      "billing": "AssemblyAI",
      "private": true,
      "weights": false,
      "saas": true,
      "note": ""
     },
     "status": "GA (new)",
     "notes": "",
     "basis": "$0.45/hr",
     "data": "As AssemblyAI.",
     "langs": "32 streaming. 32 languages.",
     "dia": "Batch no, live yes, +$0.12/hr",
     "verified": true
    },
    {
     "id": "deepgram-flux",
     "name": "Deepgram Flux",
     "price": "\u2013 / $0.46",
     "deploy": {
      "hosted": [],
      "billing": "Deepgram",
      "private": true,
      "weights": false,
      "saas": true,
      "note": "Self-hostable (Flux fixes in 2026-03 self-hosted release)."
     },
     "status": "GA",
     "notes": "Built for cascaded voice agents.",
     "basis": "Flux English $0.0077/min, multilingual $0.0078/min (PAYG)",
     "data": "As Deepgram.",
     "langs": "10 streaming. English; multilingual model covers en, es, fr, de, hi, ru, pt, ja, it, nl.",
     "dia": "Batch no, live no",
     "verified": true
    }
   ]
  },
  {
   "key": "open",
   "label": "Open models",
   "unit": "$ per audio hour: batch / live",
   "color": "var(--green)",
   "items": [
    {
     "id": "apple-speechanalyzer",
     "name": "Apple SpeechAnalyzer (on device)",
     "price": "free / free",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": false,
      "weights": false,
      "saas": false,
      "note": "Runs on device; system-managed model assets."
     },
     "status": "GA",
     "notes": "",
     "basis": "Free on Apple devices",
     "data": "Audio never leaves the device.",
     "langs": "10 batch / 10 streaming. 10 languages at launch (developer blog); later counts unconfirmed.",
     "dia": "Batch no, live no",
     "verified": false
    },
    {
     "id": "groq-whisper-large-v3-turbo",
     "name": "Whisper turbo on Groq",
     "price": "$0.04 / \u2013",
     "deploy": {
      "hosted": [],
      "billing": "Groq",
      "private": false,
      "weights": true,
      "saas": true,
      "note": "Open model hosted by Groq."
     },
     "status": "GA",
     "notes": "Cheapest hosted Whisper.",
     "basis": "$0.04/hr; 10 s minimum billed per request",
     "data": "Groq terms.",
     "langs": "99 batch. Whisper multilingual.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "together-hosted-asr",
     "name": "Together (hosted open models)",
     "price": "$0.09 / $0.21",
     "deploy": {
      "hosted": [],
      "billing": "Together",
      "private": false,
      "weights": true,
      "saas": true,
      "note": ""
     },
     "status": "GA",
     "notes": "",
     "basis": "Per audio minute: Whisper v3 $0.0015, Parakeet TDT v3 $0.0015, Nemotron 3 ASR Streaming $0.0015, Nemotron 3.5 ASR $0.0045, Whisper v3 streaming $0.0035",
     "data": "Together terms.",
     "langs": "",
     "dia": "Batch not stated, live not stated",
     "verified": true
    },
    {
     "id": "nvidia-nemotron-3-5-asr-streaming",
     "name": "Nemotron 3.5 ASR Streaming",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "NIM container also available."
     },
     "status": "released 2026-05/06",
     "notes": "The open streaming model to beat for voice agents.",
     "basis": "Weights free (OpenMDW-1.1). Hosted: Together lists Nemotron 3 ASR Streaming at $0.0015/min",
     "data": "Runs wherever you host it.",
     "langs": "40 batch / 40 streaming. 40 language-locales; language-ID prompting, optional auto detection.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "nvidia-nemotron-3-5-transcribe",
     "name": "Nemotron 3.5 Transcribe 30B",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "1x H100 80GB."
     },
     "status": "released 2026-10-07",
     "notes": "Best open English WER on Open ASR Leaderboard per card (4.71).",
     "basis": "Weights free (OpenMDW-1.1); BF16, FP8, NVFP4",
     "data": "Self-hosted.",
     "langs": "40 batch. 40 languages.",
     "dia": "Batch yes, live no",
     "verified": true
    },
    {
     "id": "nvidia-parakeet-tdt-0-6b-v3",
     "name": "Parakeet TDT 0.6B v3",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "Also NVIDIA NIM."
     },
     "status": "released 2025-08",
     "notes": "Parakeet-unified-en-0.6b (Apr 2026) adds streaming at 160 ms minimum latency for English.",
     "basis": "Weights free (CC-BY-4.0); hosted on Together $0.0015/min",
     "data": "Self-hosted.",
     "langs": "25 batch. 25 European languages, auto language detection.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "nvidia-canary-1b-v2",
     "name": "Canary 1B v2",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": ""
     },
     "status": "released 2025",
     "notes": "",
     "basis": "Weights free (CC-BY-4.0)",
     "data": "Self-hosted.",
     "langs": "25 batch. 25 EU languages; translation en<->24.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "openai-whisper-large-v3",
     "name": "Whisper large-v3 / turbo",
     "price": "open",
     "deploy": {
      "hosted": [
       "AWS",
       "GCP",
       "Azure"
      ],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "Available in SageMaker JumpStart, Vertex Model Garden and Foundry catalog (from memory)."
     },
     "status": "released 2023 / 2024",
     "notes": "Still the most downloaded ASR weights on Hugging Face (5.6M for turbo).",
     "basis": "Weights free (MIT). Hosted from $0.04/hr (Groq turbo)",
     "data": "Self-hosted.",
     "langs": "99 batch. ~99 languages (from memory).",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "mistral-voxtral-mini-4b-realtime-2602",
     "name": "Voxtral Mini 4B Realtime",
     "price": "open",
     "deploy": {
      "hosted": [
       "AWS"
      ],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "SageMaker JumpStart (Jul 2026)."
     },
     "status": "released 2026-02 (API version deprecated 2026-10-31)",
     "notes": "",
     "basis": "Weights free (Apache-2.0)",
     "data": "Self-hosted.",
     "langs": "13 streaming. 13 languages per HF metadata.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "qwen3-asr",
     "name": "Qwen3-ASR",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "vLLM serving."
     },
     "status": "released 2026-01-29",
     "notes": "",
     "basis": "Weights free (Apache-2.0)",
     "data": "Self-hosted.",
     "langs": "52 batch / 52 streaming. 30 languages + 22 Chinese dialects; language ID.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "ibm-granite-speech-5",
     "name": "IBM Granite Speech 5",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": "GGUF/ONNX builds."
     },
     "status": "released 2026-08 / 2026-10",
     "notes": "Enterprise-friendly licence from a vendor clients know.",
     "basis": "Weights free (Apache-2.0)",
     "data": "Self-hosted.",
     "langs": "7 batch. 2B: en, fr, de, es, pt, ja (+translation); TurboCTC: en, fr, de, es, pt, it, ja.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "meta-omnilingual-asr",
     "name": "Meta Omnilingual ASR",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": ""
     },
     "status": "released 2025-11",
     "notes": "The option for low-resource languages no API covers.",
     "basis": "Weights free (Apache-2.0)",
     "data": "Self-hosted.",
     "langs": "1600 batch. 1,600+ languages, zero-shot variant for unseen languages.",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "kyutai-stt",
     "name": "Kyutai STT",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": ""
     },
     "status": "released 2025-06",
     "notes": "No newer Kyutai STT found in 2026.",
     "basis": "Weights free (CC-BY-4.0)",
     "data": "Self-hosted.",
     "langs": "2 streaming. en+fr (1B) or en (2.6B).",
     "dia": "Batch no, live no",
     "verified": true
    },
    {
     "id": "microsoft-vibevoice-asr",
     "name": "Microsoft VibeVoice-ASR",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": ""
     },
     "status": "released 2026-01 / 2026-09",
     "notes": "",
     "basis": "Weights free (MIT)",
     "data": "Self-hosted.",
     "langs": "50 batch / 10 streaming. Batch 50+ languages, 60-min single pass; streaming 10 languages.",
     "dia": "Batch yes, live yes",
     "verified": true
    },
    {
     "id": "moonshine-streaming",
     "name": "Moonshine (on device)",
     "price": "open",
     "deploy": {
      "hosted": [],
      "billing": "",
      "private": true,
      "weights": true,
      "saas": false,
      "note": ""
     },
     "status": "released 2026-01; language variants 2026-08",
     "notes": "",
     "basis": "Weights free (MIT for English models; check per-language licence)",
     "data": "On device.",
     "langs": "1 streaming. English; separate tiny/small models for es, zh, ar, vi, tl etc.",
     "dia": "Batch no, live no",
     "verified": true
    }
   ]
  }
 ],
 "ladder": [
  {
   "name": "Self-hosted NVIDIA Nemotron (H100 at $4/hr, full load)",
   "batch": 0.001,
   "live": 0.017,
   "fam": "open"
  },
  {
   "name": "Whisper turbo on Groq",
   "batch": 0.04,
   "live": null,
   "fam": "open"
  },
  {
   "name": "Together (hosted Parakeet, Whisper)",
   "batch": 0.09,
   "live": 0.21,
   "fam": "open"
  },
  {
   "name": "Soniox v5",
   "batch": 0.1,
   "live": 0.12,
   "fam": "spec"
  },
  {
   "name": "xAI Grok STT",
   "batch": 0.1,
   "live": 0.2,
   "fam": "lab"
  },
  {
   "name": "Speechmatics Melia 1",
   "batch": 0.12,
   "live": 0.2,
   "fam": "spec"
  },
  {
   "name": "AssemblyAI Universal-2 / Universal-Streaming",
   "batch": 0.15,
   "live": 0.15,
   "fam": "spec"
  },
  {
   "name": "Azure Speech",
   "batch": 0.18,
   "live": 1.0,
   "fam": "cloud"
  },
  {
   "name": "AssemblyAI Universal-3.5 Pro / 3.6 Pro Realtime",
   "batch": 0.21,
   "live": 0.45,
   "fam": "spec"
  },
  {
   "name": "Mistral Voxtral Mini Transcribe 3 / Realtime 3",
   "batch": 0.21,
   "live": 0.48,
   "fam": "lab"
  },
  {
   "name": "ElevenLabs Scribe v2 / v2 Realtime",
   "batch": 0.22,
   "live": 0.39,
   "fam": "spec"
  },
  {
   "name": "Deepgram Nova-3",
   "batch": 0.258,
   "live": 0.462,
   "fam": "spec"
  },
  {
   "name": "OpenAI GPT-Transcribe / GPT-Live-Transcribe",
   "batch": 0.27,
   "live": 1.02,
   "fam": "lab"
  },
  {
   "name": "Gemini 3.5 Transcribe / Live (Vertex)",
   "batch": 0.306,
   "live": 0.536,
   "fam": "cloud"
  },
  {
   "name": "Amazon Transcribe",
   "batch": 0.36,
   "live": 0.6,
   "fam": "cloud"
  },
  {
   "name": "Cartesia Ink 2",
   "batch": null,
   "live": 0.39,
   "fam": "spec"
  },
  {
   "name": "Gladia Solaria-1",
   "batch": 0.3,
   "live": 0.76,
   "fam": "spec"
  },
  {
   "name": "Google Chirp 3",
   "batch": 0.96,
   "live": 0.96,
   "fam": "cloud"
  },
  {
   "name": "Amazon Transcribe Call Analytics",
   "batch": 1.8,
   "live": 1.8,
   "fam": "cloud"
  },
  {
   "name": "OpenAI GPT-Live 1 (speech-to-speech)",
   "batch": null,
   "live": 3.0,
   "fam": "s2s"
  },
  {
   "name": "AWS Transcribe Medical",
   "batch": 4.5,
   "live": 4.5,
   "fam": "cloud"
  }
 ],
 "calc": [
  {
   "name": "Amazon Transcribe",
   "batch": 0.36,
   "live": 0.6,
   "dia": [
    true,
    true,
    0,
    0
   ],
   "cloud": "AWS"
  },
  {
   "name": "Azure Speech",
   "batch": 0.18,
   "live": 1.0,
   "dia": [
    true,
    true,
    0,
    0.3
   ],
   "cloud": "Azure"
  },
  {
   "name": "Google Chirp 3",
   "batch": 0.96,
   "live": 0.96,
   "dia": [
    true,
    false,
    0,
    0
   ],
   "cloud": "Google Cloud"
  },
  {
   "name": "Gemini 3.5 Transcribe (Vertex)",
   "batch": 0.306,
   "live": 0.536,
   "dia": [
    true,
    false,
    0,
    0
   ],
   "cloud": "Google Cloud"
  },
  {
   "name": "OpenAI GPT-Transcribe / Live (also in Azure)",
   "batch": 0.27,
   "live": 1.02,
   "dia": [
    false,
    false,
    0,
    0
   ],
   "cloud": "Azure"
  },
  {
   "name": "Deepgram Nova-3",
   "batch": 0.258,
   "live": 0.462,
   "dia": [
    true,
    true,
    0.12,
    0.12
   ],
   "cloud": ""
  },
  {
   "name": "AssemblyAI Universal-3.5 / 3.6 Pro",
   "batch": 0.21,
   "live": 0.45,
   "dia": [
    true,
    true,
    0.02,
    0.12
   ],
   "cloud": ""
  },
  {
   "name": "ElevenLabs Scribe v2",
   "batch": 0.22,
   "live": 0.39,
   "dia": [
    true,
    false,
    0,
    0
   ],
   "cloud": ""
  },
  {
   "name": "Speechmatics Melia 1",
   "batch": 0.12,
   "live": 0.2,
   "dia": [
    true,
    true,
    0,
    0
   ],
   "cloud": ""
  },
  {
   "name": "Soniox v5",
   "batch": 0.1,
   "live": 0.12,
   "dia": [
    true,
    true,
    0,
    0
   ],
   "cloud": ""
  },
  {
   "name": "Self-hosted open models, 3\u00d7 headroom",
   "batch": 0.003,
   "live": 0.05,
   "dia": [
    true,
    false,
    0,
    0
   ],
   "cloud": "any"
  }
 ],
 "langs": [
  {
   "lang": "English",
   "metric": "WER",
   "best": 2.6,
   "who": "Gemini 3.1 Pro, Scribe v2",
   "gpt": 3.2,
   "v3": 4.2,
   "v2": 4.2
  },
  {
   "lang": "Spanish",
   "metric": "WER",
   "best": 2.1,
   "who": "MAI-Transcribe-2",
   "gpt": 2.3,
   "v3": 2.8,
   "v2": 3.0
  },
  {
   "lang": "French",
   "metric": "WER",
   "best": 2.8,
   "who": "MAI-Transcribe-2",
   "gpt": 3.7,
   "v3": 5.4,
   "v2": 8.3
  },
  {
   "lang": "German",
   "metric": "WER",
   "best": 2.8,
   "who": "MAI-Transcribe-2, Gemini 3.1 Pro",
   "gpt": 3.2,
   "v3": 4.1,
   "v2": 4.5
  },
  {
   "lang": "Portuguese",
   "metric": "WER",
   "best": 2.5,
   "who": "MAI-Transcribe-2",
   "gpt": 3.4,
   "v3": 4.0,
   "v2": 4.3
  },
  {
   "lang": "Italian",
   "metric": "WER",
   "best": 1.1,
   "who": "MAI-Transcribe-2, Gemini 3.5 Transcribe",
   "gpt": 1.9,
   "v3": 2.2,
   "v2": 4.0
  },
  {
   "lang": "Dutch",
   "metric": "WER",
   "best": 3.4,
   "who": "Gemini 3.1 Pro",
   "gpt": 4.0,
   "v3": 5.7,
   "v2": 6.7
  },
  {
   "lang": "Polish",
   "metric": "WER",
   "best": 2.0,
   "who": "MAI-Transcribe-2",
   "gpt": 3.3,
   "v3": 4.9,
   "v2": 5.4
  },
  {
   "lang": "Russian",
   "metric": "WER",
   "best": 3.1,
   "who": "MAI-Transcribe-2",
   "gpt": 4.3,
   "v3": 5.0,
   "v2": 5.6
  },
  {
   "lang": "Turkish",
   "metric": "WER",
   "best": 3.9,
   "who": "MAI-Transcribe-2",
   "gpt": 4.6,
   "v3": 6.4,
   "v2": 8.4
  },
  {
   "lang": "Arabic",
   "metric": "WER",
   "best": 8.7,
   "who": "MAI-Transcribe-2",
   "gpt": 10.3,
   "v3": 14.7,
   "v2": 16.0
  },
  {
   "lang": "Hindi",
   "metric": "WER",
   "best": 3.7,
   "who": "MAI-Transcribe-2",
   "gpt": 6.2,
   "v3": 17.4,
   "v2": 21.5
  },
  {
   "lang": "Bengali",
   "metric": "WER",
   "best": 4.8,
   "who": "MAI-Transcribe-2",
   "gpt": 8.9,
   "v3": 46.4,
   "v2": 104.1
  },
  {
   "lang": "Indonesian",
   "metric": "WER",
   "best": 2.5,
   "who": "MAI-Transcribe-2, Gemini 3.5 Transcribe",
   "gpt": 4.5,
   "v3": 6.3,
   "v2": 7.1
  },
  {
   "lang": "Vietnamese",
   "metric": "WER",
   "best": 2.9,
   "who": "Gemini 3.1 Pro",
   "gpt": 4.4,
   "v3": 8.9,
   "v2": 10.3
  },
  {
   "lang": "Thai",
   "metric": "CER",
   "best": 3.4,
   "who": "MAI-Transcribe-2",
   "gpt": 5.4,
   "v3": 8.7,
   "v2": 11.5
  },
  {
   "lang": "Mandarin",
   "metric": "CER",
   "best": 4.5,
   "who": "MAI-Transcribe-2",
   "gpt": 6.2,
   "v3": 7.0,
   "v2": 14.7
  },
  {
   "lang": "Cantonese",
   "metric": "CER",
   "best": 5.6,
   "who": "Gemini 3.1 Pro",
   "gpt": 7.8,
   "v3": 21.9,
   "v2": null
  },
  {
   "lang": "Japanese",
   "metric": "CER",
   "best": 1.8,
   "who": "MAI-Transcribe-2",
   "gpt": 3.9,
   "v3": 5.3,
   "v2": 5.3
  },
  {
   "lang": "Korean",
   "metric": "WER",
   "best": 3.3,
   "who": "Gemini 3.1 Pro, Scribe v2",
   "gpt": 4.0,
   "v3": 4.6,
   "v2": 14.3
  },
  {
   "lang": "Swahili",
   "metric": "WER",
   "best": 9.2,
   "who": "Gemini 3.5 Transcribe",
   "gpt": 19.8,
   "v3": 35.4,
   "v2": 39.3
  }
 ],
 "pareto": {
  "batch": {
   "views": [
    {
     "label": "Artificial Analysis, batch",
     "points": [
      {
       "id": "nvidia-nemotron-3.5-transcribe-30b-a4b-b0",
       "name": "Nemotron 3.5 Transcribe @ DeepInfra",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.12,
       "score": 3.42,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-small-transcribe-3-b1",
       "name": "Voxtral Small Transcribe 3",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 2.09,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-mini-transcribe-3-b2",
       "name": "Voxtral Mini Transcribe 3",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.21,
       "score": 2.22,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "xai-grok-voice-transcribe-2.0-b3",
       "name": "Grok Voice Transcribe 2.0",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.1002,
       "score": 2.29,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "stepfun-stepaudio-3-asr-b4",
       "name": "StepAudio 3 ASR",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.4,
       "score": 2.5,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "microsoft-mai-transcribe-2-b5",
       "name": "Microsoft MAI-Transcribe-2",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.1002,
       "score": 2.04,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-3.5-transcribe-b6",
       "name": "Gemini 3.5 Transcribe",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.3,
       "score": 2.6,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "speechmatics-melia-b7",
       "name": "Speechmatics Melia",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 4.87,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "soniox-v5-async-b8",
       "name": "Soniox v5 Async",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.0996,
       "score": 3.81,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "gladia-solaria-3-b9",
       "name": "Solaria-3",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.6096,
       "score": 3.23,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "microsoft-mai-transcribe-1.5-b10",
       "name": "Microsoft MAI-Transcribe-1.5",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.36,
       "score": 2.38,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-3.1-pro-high-b12",
       "name": "Gemini 3.1 Pro Preview (High)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1.089,
       "score": 2.82,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-3.1-pro-low-b13",
       "name": "Gemini 3.1 Pro Preview (Low)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.4632,
       "score": 3.58,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "smallestai-pulse-b14",
       "name": "Smallest AI Pulse",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.3,
       "score": 3.33,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-mini-transcribe-2-b15",
       "name": "Voxtral Mini Transcribe 2",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.18,
       "score": 3.59,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "elevenlabs-scribe-v2-b16",
       "name": "ElevenLabs Scribe v2",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.2202,
       "score": 2.18,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "smallestai-pulse-pro-b17",
       "name": "Smallest AI Pulse Pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 3.41,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-3-flash-high-b18",
       "name": "Gemini 3 Flash (High)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.822,
       "score": 2.93,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "amazon-nova-2-pro-b19",
       "name": "Nova 2 Pro (Bedrock)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.186,
       "score": 4.86,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "nvidia-parakeet-tdt-0.6b-v3-b20",
       "name": "Parakeet TDT 0.6B V3 @ Together AI",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.09,
       "score": 4.55,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "nvidia-canary-qwen-2.5b-b21",
       "name": "Canary Qwen 2.5B @ Replicate",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.0444,
       "score": 4.27,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-small-b22",
       "name": "Voxtral Small",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 2.77,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-gpt-4o-transcribe-b24",
       "name": "OpenAI GPT-4o Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.36,
       "score": 3.96,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-gpt-4o-mini-transcribe-b25",
       "name": "OpenAI GPT-4o Mini Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.18,
       "score": 4.47,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-chirp-3-b26",
       "name": "Chirp 3",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.96,
       "score": 4.32,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "deepgram-nova-3-b27",
       "name": "Deepgram Nova-3",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.258,
       "score": 5.18,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "aws-transcribe-b28",
       "name": "Amazon Transcribe (Bedrock)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.36,
       "score": 4.12,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "fal-wizper-large-v3-b29",
       "name": "Wizper Large v3 @ fal.ai",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.03,
       "score": 4.69,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-whisper-large-v3-b30",
       "name": "Whisper Large v3 @ fal.ai",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.069,
       "score": 4.07,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-whisper-large-v3-b31",
       "name": "Whisper Large v3 @ Together AI",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.09,
       "score": 4.53,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "speechmatics-enhanced-b32",
       "name": "Speechmatics Enhanced",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.75,
       "score": 4.05,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "rev-ai-b33",
       "name": "Rev AI",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.1998,
       "score": 5.92,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-gpt-transcribe-b34",
       "name": "GPT Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.27,
       "score": 3.31,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "inworld-stt-1-b35",
       "name": "Inworld STT 1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.15,
       "score": 3.93,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "modulate-stt-vfast-b36",
       "name": "Modulate STT Batch English VFast",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.025,
       "score": 4.23,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "reson8-resonant-1-b37",
       "name": "Reson8 Resonant-1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.216,
       "score": 3.39,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "zoom-scribe-v2-pro-b38",
       "name": "Zoom Scribe V2 Pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.2,
       "score": 2.75,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3.5-pro-b39",
       "name": "AssemblyAI Universal-3.5 Pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.21,
       "score": 2.99,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "stepfun-stepaudio-2.5-asr-b40",
       "name": "StepAudio 2.5 ASR",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.022,
       "score": 4.67,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3-pro-b43",
       "name": "AssemblyAI Universal-3 Pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.21,
       "score": 3.12,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "gradium-stt-b44",
       "name": "Gradium Speech-to-Text",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.78,
       "score": 6.79,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-2.5-flash-lite-b45",
       "name": "Gemini 2.5 Flash Lite",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.3936,
       "score": 5.17,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-mini-b46",
       "name": "Voxtral Mini @ DeepInfra",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.06,
       "score": 3.84,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-2.5-flash-b47",
       "name": "Gemini 2.5 Flash",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.3996,
       "score": 5.14,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-2.5-pro-b48",
       "name": "Gemini 2.5 Pro",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.6834,
       "score": 2.86,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "gladia-solaria-1-b49",
       "name": "Solaria-1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.6102,
       "score": 4.07,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "deepgram-nova-3-b50",
       "name": "Deepgram Nova-3, Telnyx",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Priced through Telnyx's resale of the model."
       },
       "cost": 0.444,
       "score": 4.82,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-b51",
       "name": "Universal, AssemblyAI",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.15,
       "score": 3.82,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-whisper-large-v3-turbo-b52",
       "name": "Whisper Large v3 Turbo @ Groq",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.04,
       "score": 4.62,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-whisper-large-v3-turbo-b53",
       "name": "Whisper Large v3 Turbo, Telnyx",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Priced through Telnyx's resale of the model."
       },
       "cost": 0.9,
       "score": 5.53,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "nvidia-parakeet-rnnt-1.1b-b54",
       "name": "Parakeet RNNT 1.1B @ Replicate",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.1146,
       "score": 5.42,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "replicate-incredibly-fast-whisper-b55",
       "name": "Incredibly Fast Whisper @ Replicate",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.0894,
       "score": 5.65,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-whisper-large-v3-b56",
       "name": "Whisper Large v3 @ Replicate",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 0.2538,
       "score": 10.06,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "deepgram-nova-2-b57",
       "name": "Deepgram Nova-2, Telnyx",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": "Priced through Telnyx's resale of the model."
       },
       "cost": 0.444,
       "score": 5.09,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-chirp-b58",
       "name": "Google Chirp",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.96,
       "score": 31.21,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "speechmatics-standard-b59",
       "name": "Speechmatics Standard",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.45,
       "score": 5.12,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-whisper-large-v2-b60",
       "name": "Whisper Large v2",
       "family": "open",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 0.36,
       "score": 4.06,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-3.1-flash-lite-minimal-b61",
       "name": "Gemini 3.1 Flash-Lite Preview (Minimal)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.3498,
       "score": 3.43,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "alibaba-fun-realtime-asr-preview-b62",
       "name": "Fun-Realtime-ASR-preview",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.1692,
       "score": 1.73,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      }
     ],
     "metric": "AA-WER v2, % (lower is better)",
     "method": "Independent \u00b7 held-out voice-agent, parliament and earnings-call audio \u00b7 read 3 Nov 2026"
    }
   ]
  },
  "live": {
   "views": [
    {
     "label": "Price",
     "points": [
      {
       "id": "openai-gpt-live-transcribe-p0",
       "name": "GPT Live Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1.02,
       "score": 3.98,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "xai-grok-voice-transcribe-1.0-streaming-p1",
       "name": "Grok Voice Transcribe 1.0 (Streaming)",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.1998,
       "score": 3.93,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3.5-pro-realtime-max-accuracy-p2",
       "name": "AssemblyAI U3.5 Realtime Pro - Max Accuracy",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.45,
       "score": 4.03,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3-pro-realtime-p3",
       "name": "AssemblyAI U3 Realtime Pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.45,
       "score": 4.13,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "elevenlabs-scribe-v2-realtime-p4",
       "name": "ElevenLabs Scribe v2 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.39,
       "score": 2.96,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "gladia-solaria-1-realtime-p5",
       "name": "Gladia Solaria 1 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.75,
       "score": 7.82,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "deepgram-flux-p6",
       "name": "Deepgram Flux",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.39,
       "score": 7.39,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "speechmatics-enhanced-realtime-p7",
       "name": "Speechmatics Realtime Enhanced",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.7998,
       "score": 8.05,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "soniox-v4-realtime-p12",
       "name": "Soniox v4 Real-Time",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.12,
       "score": 4.49,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "inworld-stt-1-realtime-p13",
       "name": "Inworld Realtime STT 1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.0834,
       "score": 3.79,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "openai-gpt-realtime-whisper-p14",
       "name": "OpenAI GPT Realtime Whisper",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1.02,
       "score": 4.46,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-chirp-3-streaming-p15",
       "name": "Chirp 3 Streaming",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.96,
       "score": 4.85,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-mini-transcribe-realtime-p16",
       "name": "Voxtral Mini Transcribe Realtime",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 0.36,
       "score": 4.48,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "rev-ai-p17",
       "name": "RevAI Streaming",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.1998,
       "score": 10.14,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "deepgram-nova-3-p18",
       "name": "Deepgram Nova-3 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.288,
       "score": 6.5,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "smallestai-pulse-realtime-p19",
       "name": "Smallest Pulse realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 5.14,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "gradium-stt-p20",
       "name": "Gradium STT Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.72,
       "score": 7.51,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "alibaba-qwen3-asr-flash-realtime-p21",
       "name": "Qwen3 ASR Flash Realtime",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.324,
       "score": 3.76,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "aws-transcribe-streaming-p22",
       "name": "Amazon Transcribe Streaming",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1.44,
       "score": 5.1,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "azure-speech-realtime-p23",
       "name": "Azure STT Real-time Transcription",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1.0002,
       "score": 5.25,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "cartesia-ink-2-external-endpointing-p24",
       "name": "Cartesia Ink-2 (external endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 3.17,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "cartesia-ink-preview-external-endpointing-p25",
       "name": "Cartesia Ink Preview (external endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 3.16,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "cartesia-ink-2-semantic-endpointing-p26",
       "name": "Cartesia Ink-2 (semantic endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 3.25,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "cartesia-ink-preview-semantic-endpointing-p27",
       "name": "Cartesia Ink Preview (semantic endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.24,
       "score": 3.21,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "soniox-v5-realtime-p29",
       "name": "Soniox v5 Real-Time",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.12,
       "score": 4.5,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3.5-pro-realtime-min-latency-p30",
       "name": "AssemblyAI U3.5 Realtime Pro - Min Latency",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.45,
       "score": 4.02,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "meta-muse-voice-transcribe-p31",
       "name": "Muse Voice Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.18,
       "score": 3.06,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "xai-grok-voice-transcribe-2.0-streaming-p32",
       "name": "Grok Voice Transcribe 2.0 (Streaming)",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.1998,
       "score": 2.79,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "microsoft-mai-transcribe-2-streaming-p33",
       "name": "MAI-Transcribe-2-Streaming",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.54,
       "score": 2.51,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3.6-pro-realtime-min-latency-p34",
       "name": "Universal-3.6 Pro Realtime - Min Latency",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.45,
       "score": 3.62,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-3.6-pro-realtime-max-accuracy-p35",
       "name": "Universal-3.6 Pro Realtime - Max Accuracy",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.45,
       "score": 3.9,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-mini-realtime-3-480ms-p36",
       "name": "Voxtral Mini Transcribe Realtime 3 480ms",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.48,
       "score": 3.57,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "assemblyai-universal-streaming-english-p37",
       "name": "Universal Streaming English",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.15,
       "score": 8.18,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "stepfun-stepaudio-2.5-asr-stream-p38",
       "name": "StepAudio 2.5 ASR Stream",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.18,
       "score": 6.34,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "mistral-voxtral-mini-realtime-3-960ms-p39",
       "name": "Voxtral Mini Transcribe Realtime 3 960ms",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.48,
       "score": 3.35,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "sarvam-saaras-v4-realtime-p40",
       "name": "Saaras v4 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.311,
       "score": 3.54,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "reson8-resonant-1-realtime-p41",
       "name": "Resonant-1 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 1.3523,
       "score": 3.22,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "zoom-scribe-live-p42",
       "name": "Zoom Scribe Live",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.25,
       "score": 3.8,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "google-gemini-3.5-transcribe-live-p43",
       "name": "Gemini 3.5 Transcribe Live",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 0.54,
       "score": 2.89,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "speechmatics-linden-1-p44",
       "name": "Speechmatics Agent STT Linden 1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.3,
       "score": 4.08,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "modulate-stt-streaming-english-p45",
       "name": "Modulate STT Streaming English",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.05,
       "score": 4.77,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      },
      {
       "id": "alebex-stt-p46",
       "name": "Alebex STT",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 0.0858,
       "score": 3.81,
       "n": 1,
       "costBasis": "List price per audio hour, from Artificial Analysis's normalised price."
      }
     ],
     "metric": "AA-WER streaming, % (lower is better)",
     "x": "price",
     "method": "Independent \u00b7 Artificial Analysis streaming board \u00b7 final transcripts \u00b7 3 Nov 2026"
    },
    {
     "label": "Time to final",
     "points": [
      {
       "id": "openai-gpt-live-transcribe-l0",
       "name": "GPT Live Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 857,
       "score": 3.98,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "xai-grok-voice-transcribe-1.0-streaming-l1",
       "name": "Grok Voice Transcribe 1.0 (Streaming)",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 373,
       "score": 3.93,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "assemblyai-universal-3.5-pro-realtime-max-accuracy-l2",
       "name": "AssemblyAI U3.5 Realtime Pro - Max Accuracy",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 202,
       "score": 4.03,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "assemblyai-universal-3-pro-realtime-l3",
       "name": "AssemblyAI U3 Realtime Pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 453,
       "score": 4.13,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "elevenlabs-scribe-v2-realtime-l4",
       "name": "ElevenLabs Scribe v2 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 78,
       "score": 2.96,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "gladia-solaria-1-realtime-l5",
       "name": "Gladia Solaria 1 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 1523,
       "score": 7.82,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "deepgram-flux-l6",
       "name": "Deepgram Flux",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 21,
       "score": 7.39,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "speechmatics-enhanced-realtime-l7",
       "name": "Speechmatics Realtime Enhanced",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 317,
       "score": 8.05,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "nvidia-nemotron-3-asr-streaming-en-80ms-l8",
       "name": "Nemotron 3 ASR 80ms @ NVIDIA",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 73,
       "score": 8.38,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "nvidia-nemotron-3-asr-streaming-en-160ms-l9",
       "name": "Nemotron 3 ASR 160ms @ NVIDIA",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 98,
       "score": 7.61,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "nvidia-nemotron-3-asr-streaming-en-560ms-l10",
       "name": "Nemotron 3 ASR 560ms @ NVIDIA",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 252,
       "score": 5.96,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "nvidia-nemotron-3-asr-streaming-en-1120ms-l11",
       "name": "Nemotron 3 ASR 1120ms @ NVIDIA",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 418,
       "score": 5.36,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "soniox-v4-realtime-l12",
       "name": "Soniox v4 Real-Time",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 62,
       "score": 4.49,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "inworld-stt-1-realtime-l13",
       "name": "Inworld Realtime STT 1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 79,
       "score": 3.79,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "openai-gpt-realtime-whisper-l14",
       "name": "OpenAI GPT Realtime Whisper",
       "family": "lab",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 780,
       "score": 4.46,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "google-chirp-3-streaming-l15",
       "name": "Chirp 3 Streaming",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1186,
       "score": 4.85,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "mistral-voxtral-mini-transcribe-realtime-l16",
       "name": "Voxtral Mini Transcribe Realtime",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 671,
       "score": 4.48,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "rev-ai-l17",
       "name": "RevAI Streaming",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 697,
       "score": 10.14,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "deepgram-nova-3-l18",
       "name": "Deepgram Nova-3 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 77,
       "score": 6.5,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "smallestai-pulse-realtime-l19",
       "name": "Smallest Pulse realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 150,
       "score": 5.14,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "gradium-stt-l20",
       "name": "Gradium STT Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 300,
       "score": 7.51,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "alibaba-qwen3-asr-flash-realtime-l21",
       "name": "Qwen3 ASR Flash Realtime",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 403,
       "score": 3.76,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "aws-transcribe-streaming-l22",
       "name": "Amazon Transcribe Streaming",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 488,
       "score": 5.1,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "azure-speech-realtime-l23",
       "name": "Azure STT Real-time Transcription",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 625,
       "score": 5.25,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "cartesia-ink-2-external-endpointing-l24",
       "name": "Cartesia Ink-2 (external endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 136,
       "score": 3.17,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "cartesia-ink-preview-external-endpointing-l25",
       "name": "Cartesia Ink Preview (external endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 140,
       "score": 3.16,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "cartesia-ink-2-semantic-endpointing-l26",
       "name": "Cartesia Ink-2 (semantic endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 407,
       "score": 3.25,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "cartesia-ink-preview-semantic-endpointing-l27",
       "name": "Cartesia Ink Preview (semantic endpoints)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 427,
       "score": 3.21,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "nvidia-nemotron-3-asr-streaming-en-80ms-l28",
       "name": "Nemotron 3 ASR 80ms, Together AI",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, here priced on a third-party host."
       },
       "cost": 70,
       "score": 7.03,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "soniox-v5-realtime-l29",
       "name": "Soniox v5 Real-Time",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 54,
       "score": 4.5,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "assemblyai-universal-3.5-pro-realtime-min-latency-l30",
       "name": "AssemblyAI U3.5 Realtime Pro - Min Latency",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 191,
       "score": 4.02,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "meta-muse-voice-transcribe-l31",
       "name": "Muse Voice Transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 163,
       "score": 3.06,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "xai-grok-voice-transcribe-2.0-streaming-l32",
       "name": "Grok Voice Transcribe 2.0 (Streaming)",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 247,
       "score": 2.79,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "microsoft-mai-transcribe-2-streaming-l33",
       "name": "MAI-Transcribe-2-Streaming",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 128,
       "score": 2.51,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "assemblyai-universal-3.6-pro-realtime-min-latency-l34",
       "name": "Universal-3.6 Pro Realtime - Min Latency",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 138,
       "score": 3.62,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "assemblyai-universal-3.6-pro-realtime-max-accuracy-l35",
       "name": "Universal-3.6 Pro Realtime - Max Accuracy",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 147,
       "score": 3.9,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "mistral-voxtral-mini-realtime-3-480ms-l36",
       "name": "Voxtral Mini Transcribe Realtime 3 480ms",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 755,
       "score": 3.57,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "assemblyai-universal-streaming-english-l37",
       "name": "Universal Streaming English",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 34,
       "score": 8.18,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "stepfun-stepaudio-2.5-asr-stream-l38",
       "name": "StepAudio 2.5 ASR Stream",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 285,
       "score": 6.34,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "mistral-voxtral-mini-realtime-3-960ms-l39",
       "name": "Voxtral Mini Transcribe Realtime 3 960ms",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 1119,
       "score": 3.35,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "sarvam-saaras-v4-realtime-l40",
       "name": "Saaras v4 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 422,
       "score": 3.54,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "reson8-resonant-1-realtime-l41",
       "name": "Resonant-1 Realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 278,
       "score": 3.22,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "zoom-scribe-live-l42",
       "name": "Zoom Scribe Live",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 205,
       "score": 3.8,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "google-gemini-3.5-transcribe-live-l43",
       "name": "Gemini 3.5 Transcribe Live",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 359,
       "score": 2.89,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "speechmatics-linden-1-l44",
       "name": "Speechmatics Agent STT Linden 1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 167,
       "score": 4.08,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "modulate-stt-streaming-english-l45",
       "name": "Modulate STT Streaming English",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 621,
       "score": 4.77,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      },
      {
       "id": "alebex-stt-l46",
       "name": "Alebex STT",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 128,
       "score": 3.81,
       "n": 1,
       "costBasis": "Mean time from the end of speech (after a voice detector) to the final transcript, network included."
      }
     ],
     "metric": "AA-WER streaming, % (lower is better)",
     "x": "ms",
     "method": "Independent \u00b7 Artificial Analysis \u00b7 mean time to final after a voice detector marks end of speech"
    },
    {
     "label": "Pipecat, median",
     "points": [
      {
       "id": "pc0",
       "name": "AssemblyAI universal-3-6-pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 307,
       "score": 0.8,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc2",
       "name": "AssemblyAI universal-3-5-pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 282,
       "score": 0.95,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc4",
       "name": "AssemblyAI universal-streaming-english",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 256,
       "score": 2.42,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc6",
       "name": "AWS Transcribe streaming (default)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1136,
       "score": 1.35,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc8",
       "name": "Azure Speech real-time (default)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1016,
       "score": 1.01,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc10",
       "name": "Cartesia ink-2",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 299,
       "score": 1.02,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc12",
       "name": "Cartesia ink-whisper",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 266,
       "score": 3.78,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc14",
       "name": "Deepgram nova-3-general",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 247,
       "score": 1.37,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc16",
       "name": "ElevenLabs scribe_v2_realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 281,
       "score": 3.13,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc18",
       "name": "Google gemini-3.5-transcribe-live",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 458,
       "score": 1.97,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc20",
       "name": "Google latest-long",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 878,
       "score": 2.46,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc22",
       "name": "Gradium default",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 585,
       "score": 3.79,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc24",
       "name": "Meta muse-voice-transcribe-1.0",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 392,
       "score": 0.73,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc26",
       "name": "Mistral voxtral-mini-transcribe-realtime-2602",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 525,
       "score": 5.11,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc28",
       "name": "NVIDIA Nemotron 3.0 ASR (en)",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 221,
       "score": 1.95,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc30",
       "name": "NVIDIA Nemotron 3.5 ASR (multilingual)",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 236,
       "score": 4.58,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc32",
       "name": "OpenAI gpt-4o-transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 637,
       "score": 2.95,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc34",
       "name": "OpenAI gpt-realtime-whisper",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 740,
       "score": 2.3,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc36",
       "name": "Smallest AI pulse",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 398,
       "score": 1.94,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc38",
       "name": "Soniox stt-rt-v5",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 260,
       "score": 1.09,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc40",
       "name": "Soniox stt-rt-v4",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 249,
       "score": 1.13,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc42",
       "name": "Speechmatics linden-1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 369,
       "score": 0.96,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc44",
       "name": "Speechmatics default (pre-linden)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 495,
       "score": 0.96,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc46",
       "name": "xAI grok-voice-transcribe-2.0",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 1322,
       "score": 0.79,
       "n": 1,
       "costBasis": "P50 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      }
     ],
     "metric": "Semantic WER, % (lower is better)",
     "x": "ms",
     "method": "Daily / Pipecat (being acquired by Deepgram) \u00b7 1,000 voice-agent turns \u00b7 median \u00b7 1 Oct 2026"
    },
    {
     "label": "Pipecat, slowest 5%",
     "points": [
      {
       "id": "pc1",
       "name": "AssemblyAI universal-3-6-pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 401,
       "score": 0.8,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc3",
       "name": "AssemblyAI universal-3-5-pro",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 354,
       "score": 0.95,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc5",
       "name": "AssemblyAI universal-streaming-english",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 362,
       "score": 2.42,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc7",
       "name": "AWS Transcribe streaming (default)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "AWS"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1527,
       "score": 1.35,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc9",
       "name": "Azure Speech real-time (default)",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "Azure"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1345,
       "score": 1.01,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc11",
       "name": "Cartesia ink-2",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 328,
       "score": 1.02,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc13",
       "name": "Cartesia ink-whisper",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 364,
       "score": 3.78,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc15",
       "name": "Deepgram nova-3-general",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 298,
       "score": 1.37,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc17",
       "name": "ElevenLabs scribe_v2_realtime",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 348,
       "score": 3.13,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc19",
       "name": "Google gemini-3.5-transcribe-live",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 532,
       "score": 1.97,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc21",
       "name": "Google latest-long",
       "family": "cloud",
       "deploy": {
        "hosted": [
         "GCP"
        ],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": false,
        "note": ""
       },
       "cost": 1155,
       "score": 2.46,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc23",
       "name": "Gradium default",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 614,
       "score": 3.79,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc25",
       "name": "Meta muse-voice-transcribe-1.0",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 1292,
       "score": 0.73,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc27",
       "name": "Mistral voxtral-mini-transcribe-realtime-2602",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 973,
       "score": 5.11,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc29",
       "name": "NVIDIA Nemotron 3.0 ASR (en)",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 238,
       "score": 1.95,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc31",
       "name": "NVIDIA Nemotron 3.5 ASR (multilingual)",
       "family": "open",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": ""
       },
       "cost": 253,
       "score": 4.58,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc33",
       "name": "OpenAI gpt-4o-transcribe",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 965,
       "score": 2.95,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc35",
       "name": "OpenAI gpt-realtime-whisper",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 878,
       "score": 2.3,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc37",
       "name": "Smallest AI pulse",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 533,
       "score": 1.94,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc39",
       "name": "Soniox stt-rt-v5",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 305,
       "score": 1.09,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc41",
       "name": "Soniox stt-rt-v4",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 281,
       "score": 1.13,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc43",
       "name": "Speechmatics linden-1",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 438,
       "score": 0.96,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc45",
       "name": "Speechmatics default (pre-linden)",
       "family": "spec",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": true,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 676,
       "score": 0.96,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      },
      {
       "id": "pc47",
       "name": "xAI grok-voice-transcribe-2.0",
       "family": "lab",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": false,
        "saas": true,
        "note": ""
       },
       "cost": 1895,
       "score": 0.79,
       "n": 1,
       "costBasis": "P95 time from the actual end of speech to the final transcript, including a 200 ms voice-detector wait."
      }
     ],
     "metric": "Semantic WER, % (lower is better)",
     "x": "ms",
     "method": "Daily / Pipecat \u00b7 same runs \u00b7 95th-percentile time to final"
    }
   ]
  },
  "open": {
   "views": [
    {
     "label": "Open ASR Leaderboard",
     "points": [
      {
       "id": "nvidia-nemotron-3.5-transcribe-30b-a4b",
       "name": "Nemotron-3.5-Transcribe-30B-A4B",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 8.4635,
       "score": 6.1,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (473\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "qwen-qwen3-asr-1.7b",
       "name": "Qwen3-ASR-1.7B",
       "family": "qwen",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 4.7869,
       "score": 6.14,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (836\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "ibm-granite-speech-5.0-2b",
       "name": "granite-speech-5.0-2b",
       "family": "ibm",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 7.2935,
       "score": 6.59,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (548\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "edge0-ark-asr-0.6b",
       "name": "ARK-ASR-0.6B",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 6.019,
       "score": 6.7,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (665\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "thestageai-thewhisper-large-v3-turbo",
       "name": "thewhisper-large-v3-turbo",
       "family": "whisper",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 3.3786,
       "score": 6.71,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (1,184\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "cohere-transcribe-03-2026",
       "name": "cohere-transcribe-03-2026",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 4.3304,
       "score": 6.72,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (924\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "bosonai-higgs-audio-v3-stt",
       "name": "higgs-audio-v3-stt",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 36.4797,
       "score": 6.82,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (110\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-canary-qwen-2.5b",
       "name": "canary-qwen-2.5b",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 4.5368,
       "score": 6.83,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (882\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "edge0-ark-asr-3b",
       "name": "ARK-ASR-3B",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 8.3276,
       "score": 6.85,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (480\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-parakeet-tdt-0.6b-v2-fast-gpu-asr",
       "name": "parakeet-tdt-0.6b-v2 (fast)",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.2318,
       "score": 6.88,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (17,254\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "openmoss-team-moss-transcribe-diarize",
       "name": "MOSS-Transcribe-Diarize",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 10.3236,
       "score": 6.9,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (387\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-parakeet-tdt-0.6b-v2",
       "name": "parakeet-tdt-0.6b-v2",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.6506,
       "score": 6.91,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (6,148\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "ibm-granite-speech-5.0-470m-turboctc-nc",
       "name": "granite-speech-5.0-470m-turboctc-nc",
       "family": "ibm",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.1897,
       "score": 6.91,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (21,082\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "ibm-granite-speech-4.1-2b",
       "name": "granite-speech-4.1-2b",
       "family": "ibm",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 7.3148,
       "score": 6.92,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (547\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-parakeet-tdt-0.6b-v3-fast-gpu-asr",
       "name": "parakeet-tdt-0.6b-v3 (fast)",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.2793,
       "score": 6.93,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (14,320\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "qwen-qwen3-asr-0.6b",
       "name": "Qwen3-ASR-0.6B",
       "family": "qwen",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 5.3367,
       "score": 6.99,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (750\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-parakeet-tdt-0.6b-v3",
       "name": "parakeet-tdt-0.6b-v3",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.6327,
       "score": 7.03,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (6,322\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "ibm-granite-speech-4.1-2b-nar",
       "name": "granite-speech-4.1-2b-nar",
       "family": "ibm",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 1.8934,
       "score": 7.08,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (2,113\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "ibm-granite-speech-5.0-470m-turboctc",
       "name": "granite-speech-5.0-470m-turboctc",
       "family": "ibm",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.1866,
       "score": 7.34,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (21,435\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "mistral-voxtral-small",
       "name": "Voxtral-Small-24B-2507",
       "family": "mistral",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 39.4244,
       "score": 7.35,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (101\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-nemotron-speech-streaming-en-0.6b",
       "name": "nemotron-speech-streaming-en-0.6b",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 3.5844,
       "score": 7.37,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (1,116\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "ibm-granite-4.0-1b-speech",
       "name": "granite-4.0-1b-speech",
       "family": "ibm",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 5.9971,
       "score": 7.44,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (667\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "distil-whisper-large-v3.5",
       "name": "distil-large-v3.5",
       "family": "whisper",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 4.4533,
       "score": 7.55,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (898\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "fermionresearch-phonon-2",
       "name": "Phonon-2",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 2.0238,
       "score": 7.77,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (1,977\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "soundsgoodai-zipformer-cr-ctc-transducer-xl-290m-fast-gpu-asr-beam",
       "name": "Zipformer-cr-ctc-transducer-XL-290M (fast)",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.1809,
       "score": 7.85,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (22,109\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "openai-whisper-large-v3",
       "name": "whisper-large-v3",
       "family": "whisper",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 8.4973,
       "score": 8.18,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (471\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "funaudiollm-fun-asr-nano-2512-hf",
       "name": "Fun-ASR-Nano-2512",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 7.8994,
       "score": 8.23,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (506\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "mistral-voxtral-mini",
       "name": "Voxtral-Mini-3B-2507",
       "family": "mistral",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 22.2494,
       "score": 8.29,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (180\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-canary-1b-v2",
       "name": "canary-1b-v2",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 2.1579,
       "score": 8.35,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (1,854\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "openllm-france-luciole-8b-audio-1.0",
       "name": "Luciole-8B-Audio-1.0",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 4.0032,
       "score": 8.59,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (999\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "openai-whisper-large-v3-turbo",
       "name": "whisper-large-v3-turbo",
       "family": "whisper",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 4.9449,
       "score": 8.68,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (809\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "edge0-audio8-asr-0.1b",
       "name": "Audio8-ASR-0.1B",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 5.5113,
       "score": 9.1,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (726\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "espnet-owsm-ctc-v4-1b",
       "name": "owsm_ctc_v4_1B",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 5.1066,
       "score": 9.15,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (783\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "microsoft-vibevoice-asr",
       "name": "VibeVoice-ASR-HF",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 18.3579,
       "score": 9.26,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (218\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "meta-omnilingual-asr-llm-7b-v2",
       "name": "omniASR-LLM-7B-v2",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 30.8166,
       "score": 9.43,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (130\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "mistral-voxtral-mini-4b-realtime-2602",
       "name": "Voxtral-Mini-4B-Realtime-2602",
       "family": "mistral",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 38.6548,
       "score": 9.59,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (103\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "soundsgoodai-zipformer-cr-ctc-transducer-xl-290m-fast-gpu-asr-ctc-greedy",
       "name": "Zipformer-cr-ctc-transducer-XL-290M (fast)",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.1622,
       "score": 9.62,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (24,659\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "futo-org-asr4all-l",
       "name": "asr4all-l",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.1907,
       "score": 9.77,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (20,971\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "abr-ai-niagara-84m-batch.en",
       "name": "niagara-84m-batch.en",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 2.061,
       "score": 10.66,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (1,941\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "nvidia-nemotron-3.5-asr-streaming-0.6b",
       "name": "nemotron-3.5-asr-streaming-0.6b",
       "family": "nvidia",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 2.9562,
       "score": 10.85,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (1,353\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "futo-org-asr4all-m",
       "name": "asr4all-m",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.1383,
       "score": 11.05,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (28,913\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "abr-ai-niagara-38m-batch.en",
       "name": "niagara-38m-batch.en",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.8724,
       "score": 12.16,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (4,585\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "google-gemma-4-e4b-it",
       "name": "gemma-4-E4B-it",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 24.8927,
       "score": 12.96,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (161\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "meta-omnilingual-asr-ctc-7b-v2",
       "name": "omniASR-CTC-7B-v2",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 7.659,
       "score": 13.26,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (522\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "futo-org-asr4all-s",
       "name": "asr4all-s",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.0981,
       "score": 13.64,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (40,786\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "abr-ai-niagara-19m-batch.en",
       "name": "niagara-19m-batch.en",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.9147,
       "score": 14.1,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (4,373\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      },
      {
       "id": "abr-ai-niagara-9m-batch.en",
       "name": "niagara-9m-batch.en",
       "family": "other",
       "deploy": {
        "hosted": [],
        "billing": null,
        "private": false,
        "weights": true,
        "saas": false,
        "note": "Open weights, run in the client's own environment."
       },
       "cost": 0.5542,
       "score": 17.47,
       "n": 1,
       "costBasis": "Our estimate: GPU time at the measured throughput (7,217\u00d7 real time) on one H200 at $4 an hour, at full load. Real systems need two to three times this for peaks."
      }
     ],
     "metric": "Mean WER on 9 English sets, % (lower is better)",
     "yMax": 10.5,
     "method": "Independent \u00b7 Hugging Face Open ASR Leaderboard \u00b7 open models with measured throughput \u00b7 2 Nov 2026"
    }
   ]
  }
 }
};
