# TraceLens Intelligence: Phone Intelligence & Digital Footprint Analyzer

A full-stack, enterprise-grade cybersecurity and OSINT (Open Source Intelligence) platform designed for authorized individuals and security researchers to analyze phone number numbering metadata, discover indexed public web references, audit digital footprint exposures, and review account security posture.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> TraceLens operates strictly within ethical OSINT, privacy, and cybersecurity boundaries. All features prioritize verifiable public facts, transparent source attribution, and actionable user remediation without compromising private account security.

- **Confirmed Architectural Stance (Default Fallback)**: Since the clarification prompt was dismissed without custom selection, TraceLens will implement a **hybrid provider architecture**:
  1. High-accuracy E.164 international numbering parser and carrier metadata engine (supporting 240+ country codes with ISO validation, numbering plans, mobile vs. landline vs. VoIP type detection, and plausibility scoring).
  2. Server-side Gemini with Google Search grounding (`gemini-3.8-flash` with search tools) for live public web indexing, news/breach mentions, public corporate registries, and business directories.
  3. Configurable provider abstraction layer allowing optional API keys for specialized services (Numverify, SerpApi, IPinfo, Hunter) with graceful fallbacks and clear "Unconfigured Provider" setup cards.
- **Privacy & Responsible Disclosure**: Sensitive digits in phone numbers are masked by default (e.g. `+1 (555) •••-8921`) with an unmask toggle for authorized owners. Explicit user authorization and consent are enforced via interactive confirmation before any footprint query initiates.
- **Anti-Hallucination & Provenance**: Every reported finding distinguishes between **Confirmed Information** (direct E.164 spec/telecom register), **Probable Matches** (multiple corroborating public directories), and **Unverified Leads** (single index citation). Unsearched or failed sources are explicitly logged in the audit trail.

---

## 1. Overview & Core Concept

- **What It Does**: TraceLens Intelligence ingests an international phone number, validates formatting and national numbering plans, queries authorized public indexing sources to identify exposed mentions across public web pages, directory listings, and social profiles, presents an interactive footprint audit with confidence metrics and source links, and generates downloadable security reports with remediation guidance.
- **Target Audience / Persona**:
  - Security analysts and fraud investigators conducting legitimate contact verification.
  - Individuals auditing their personal digital footprint to locate exposed contact details on data broker platforms or public forums.
  - Compliance and privacy officers evaluating corporate phone number exposures.
- **Key Value**: Delivers transparent, verifiable OSINT intelligence without fake "hacker" theater. Replaces speculative guesswork with cryptographic E.164 validation, direct citation links, source availability metrics, and actionable data broker opt-out recommendations.

---

## 2. User Experience & Visual Design

Following the **SaaS & Enterprise Dashboard Constitution** (`references/3_saas_dashboard.md` and `frontend-design`):

### A. Layout Structure & Navigation
- **Top Bar Contract**:
  - **Zone 1 (Brand)**: Single wordmark `TraceLens Intelligence` in crisp bold display typography (`Plus Jakarta Sans`).
  - **Zone 2 (Navigation)**: 4 concise single-line links (`Footprint Analyzer`, `Network & IP`, `Remediation Guide`, `Audit History`).
  - **Zone 3 (Action)**: Primary action button `New Investigation` with hotkey support.
- **Main Viewport**: Clean 1440px desktop baseline with responsive mobile stack. Single-elevation surface depth utilizing dark slate neutrals (`bg-slate-950` canvas, `bg-slate-900/80` container panels, `border-slate-800` hairline dividers).
- **Zero-Pill Metadata**: Metadata labels, dates, country codes, and confidence scores render as clean unboxed text separated by typographic interpuncts (`·`) and slashes (`/`), eliminating colored candy badges.
- **Tabular Figures**: All timestamps, E.164 counts, confidence percentages, and latency figures enforce `font-mono tabular-nums`.

### B. Core User Flows
1. **Intake & Consent**:
   - Interactive international phone input with country selector (flag, dial code, search filter).
   - Real-time format validation and live preview of E.164 standard notation.
   - Mandatory Consent & Authorization Gate: Explicit confirmation that the researcher has legitimate authorization to audit this number.
2. **Analysis Pipeline Stages**:
   - Synchronous multi-stage prober with real-time stage progression:
     1. *Syntax & E.164 Telecom Registry Validation*
     2. *Carrier, Line Type & Geolocation Lookup*
     3. *Public Search Index & Directory Harvesting*
     4. *Public Email & Profile Association Mapping*
     5. *Digital Footprint & Risk Assessment Synthesis*
3. **Intelligence Results Matrix**:
   - **Telecom Profile**: Country, national format, international format, line type (Mobile / Landline / VoIP / Toll-Free), carrier/network operator, validity status.
   - **Public Web Mentions**: Deduplicated public page hits with snippet previews, exact matched URL, first indexed date, and direct outbound links (`rel="noopener noreferrer"`).
   - **Associated Identifiers**: Legitimate publicly documented emails or business listings with association evidence and confidence ratings (Confirmed / Probable / Unverified).
   - **Social & Public Profiles**: Verified public links on platforms (e.g. LinkedIn company directories, GitHub gists, public forum signatures) with strict separation between public profile existence vs. authenticated account possession.
   - **Source Transparency Ledger**: Full accounting of active providers (e.g., Telecom Registry, Gemini Search Grounding, Public Web Index) and unconfigured integrations with setup instructions.
4. **Remediation & Export**:
   - One-click PDF / JSON comprehensive report generation with investigation ID and verification hash.
   - Actionable data broker opt-out links and step-by-step identity protection checklist.

### C. Network & IP Intelligence Module
- Dedicated tool to audit the researcher's current public IP address or manually inspect a voluntarily supplied IP.
- Educational visual breakdown of device private IP vs. carrier CGNAT vs. public gateway IP, debunking phone-to-live-IP tracking myths.
- Legitimate Autonomous System Number (ASN), ISP, and geographic country resolution via public IP intelligence APIs.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Architecture with Server-Side Express Proxy**
  - *Chosen Approach*: Implement an Express backend integrated with Vite (`vite.config.ts` dev middleware and standalone `server.ts`) hosting secure `/api/*` endpoints.
  - *Why*: Strict security compliance. Never exposes server-side tokens, Gemini API keys, or provider headers to the browser. Avoids client-side CORS issues and enables robust rate limiting.
  - *Alternatives Considered*: Pure client-side application. Rejected because calling external search engines or AI SDKs from the browser violates security policies and triggers CORS blocks.

- **Decision 2: Ethical OSINT Guardrails vs. Simulated Penetration**
  - *Chosen Approach*: Enforce strict boundary definitions (Section 6 & 7 of requirements). TraceLens never claims to query live device locations, intercepts SMS, detects private active logins, or probes recovery forms.
  - *Why*: Protects against account takeover vectors, prevents social engineering, and maintains compliance with global telecom and privacy laws (GDPR/CCPA).

- **Decision 3: Multi-Provider Extensibility with Ready-to-Use Fallbacks**
  - *Chosen Approach*: The backend features modular provider adapters (`E164TelecomProvider`, `GeminiSearchProvider`, `PublicWebIndexProvider`, `IPIntelligenceProvider`). If third-party API keys (like Numverify or IPinfo) are absent, the engine falls back to standard ITU-T E.164 algorithmic databases and Gemini Google Search grounding, ensuring full real-world functionality out of the box.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TRACELENS FRONTEND (React 19)                   │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ Phone Intake & Consent │  │ Top Navigation & Audit History Bar   │  │
│  └───────────┬───────────┘  └──────────────────────────────────────┘  │
│              │                                                         │
│  ┌───────────▼───────────┐  ┌──────────────────────────────────────┐  │
│  │ Multi-Stage Prober UI │  │ Intelligence Matrix Dashboard        │  │
│  └───────────┬───────────┘  │  - Telecom & Carrier Metadata        │  │
│              │              │  - Public Web Mentions & Sources     │  │
│              │              │  - Public Email & Profile Matches    │  │
│              │              │  - Source Availability Ledger        │  │
│              │              │  - Export Engine (JSON / Clean PDF)  │  │
│              │              └──────────────────────────────────────┘  │
└──────────────┼─────────────────────────────────────────────────────────┘
               │  POST /api/analyze (E.164, consentToken, options)
               │  GET  /api/network/ip-lookup (voluntary IP)
               │  GET  /api/providers/status
               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     SECURE NODE.JS / EXPRESS BACKEND                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Middleware: Rate Limiter · SSRF Guard · Input Sanitizer · CORS    │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│  ┌──────────────────────────────────▼───────────────────────────────┐  │
│  │                TraceLens Orchestration Engine                    │  │
│  └──────┬───────────────────┬───────────────────┬───────────────────┘  │
│         │                   │                   │                      │
│  ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐               │
│  │ Telecom     │     │ Gemini AI   │     │ Public OSINT│               │
│  │ Validator   │     │ Search      │     │ Directory & │               │
│  │ (E.164, ITU,│     │ Grounding   │     │ IP Intel    │               │
│  │ Carrier Plan│     │ (Live Web)  │     │ Engine      │               │
│  └─────────────┘     └─────────────┘     └─────────────┘               │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
- **`PhoneAnalysisRequest`**: `{ rawNumber: string, countryCode: string, userConsent: boolean, analysisScope: string[] }`
- **`TelecomMetadata`**: `{ e164: string, nationalNumber: string, country: string, countryIso: string, carrier: string, lineType: 'mobile' | 'landline' | 'voip' | 'toll-free' | 'unknown', validity: 'valid' | 'invalid' | 'possible', internationalDialingCode: string }`
- **`WebReferenceFinding`**: `{ id: string, title: string, url: string, domain: string, snippet: string, matchType: 'exact' | 'partial_pattern', firstSeen?: string, sourceCategory: 'directory' | 'social' | 'news' | 'business' | 'data_broker' }`
- **`AssociatedIdentifier`**: `{ type: 'email' | 'social_profile' | 'business_listing', value: string, platform?: string, url?: string, evidence: string, confidence: 'confirmed' | 'probable' | 'unverified', discoveryDate: string }`
- **`AuditReport`**: `{ reportId: string, timestamp: string, targetMasked: string, metadata: TelecomMetadata, findings: WebReferenceFinding[], associations: AssociatedIdentifier[], sourcesSummary: { checked: string[], succeeded: string[], unavailable: string[] }, privacyRecommendations: string[] }`

### Security & Compliance Protections
- **SSRF Prevention**: Backend never accesses arbitrary user-supplied URLs. All requests originate strictly from validated provider APIs.
- **Data Minimization & Ephemeral Storage**: Number inputs and generated reports are stored strictly in-memory or client-side session store with zero persistent logging of unmasked target numbers. Explicit "Purge Session Data" button provided.
- **Rate Limiting**: Enforced on all discovery routes to prevent abuse or automated enumeration.
