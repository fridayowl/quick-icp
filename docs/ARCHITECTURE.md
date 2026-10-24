# Quick ICP System Architecture & Technical Specifications

This document outlines the architectural design, data models, validation scoring algorithms, and security guidelines of Quick ICP.

---

## 1. System Overview

Quick ICP is designed as a **local-first, zero-friction discovery engine**. It eliminates bloated database dependencies by utilizing an asynchronous atomic JSON store with an Express HTTP API, paired with a modern vanilla JavaScript & CSS web UI.

```
┌────────────────────────────────────────────────────────┐
│                   Browser Client                       │
│  - Modern Vanilla JS modules (ESM)                     │
│  - Pure CSS Design System (Custom properties, HSL)     │
│  - Native HTML5 <dialog> elements                      │
│  - Real-time polling & optimistic UI updates           │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON API / Static
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Node.js Express Server                 │
│  - Port 3030 (default)                                 │
│  - RESTful Endpoints: /api/icps, /api/leads, etc.     │
│  - Sequence Auto-Kill Engine                           │
│  - Heuristic Pain & WTP Natural Language Extractor     │
│  - Dynamic ICP Validation Algorithm                    │
└───────────────────────────┬────────────────────────────┘
                            │ Atomic File I/O
                            ▼
┌────────────────────────────────────────────────────────┐
│               Data Layer: data/store.json              │
│  - ICP hypotheses & wedges                             │
│  - Leads & conversation histories                      │
│  - Secondary domain sending inboxes & health meters    │
│  - Verified discovery call notes & quotes              │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Data Entities

### 2.1 Ideal Customer Profile (ICP)
```typescript
interface ICP {
  id: string;                     // e.g. "icp_agency"
  name: string;                   // Display title of the target persona
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  tierColor: string;              // Hex color representation
  targetRole: string;             // e.g. "Agency Owner / Head of Client Ops"
  companySize: string;            // e.g. "5 - 35 employees"
  industry: string;               // e.g. "Marketing & Digital Agencies"
  coreProblem: string;            // The agonizing daily friction
  currentWorkaround: string;      // What they currently use (e.g. Google Sheets)
  productWedge: string;           // The single 1-feature 10% slice to pitch
  discardedFeatures: string;      // Features forbidden to pitch for this audience
  validationThreshold: string;    // Exit criteria for validation
  status: "Active Testing" | "Validated" | "Killed" | "Paused";
  metrics: {
    leadsContacted: number;
    repliesCount: number;
    replyRate: number;            // Percentage (0 - 100%)
    callsBooked: number;
    callsCompleted: number;
    avgPainScore: number;         // 1.0 to 5.0 scale
    validatedCount: number;       // Number of leads in 'validated' stage
    validationScore: number;      // Calculated score (0 - 100%)
  };
}
```

### 2.2 Lead
```typescript
interface Lead {
  id: string;                     // e.g. "lead_sarah"
  name: string;
  title: string;
  company: string;
  email: string;
  icpId: string;                  // Foreign key to ICP
  stage: "contacted" | "replied" | "call_scheduled" | "call_completed" | "validated" | "disqualified";
  inboxId: string;                // Secondary sending domain ID
  lastContacted: string;          // ISO Timestamp
  sentiment: string;              // e.g. "Interested in Wedge"
  sequenceStatus: "active" | "auto_killed" | "completed";
  threads: MessageThread[];
  callNotes: CallNote | null;
}
```

### 2.3 Message Thread
```typescript
interface MessageThread {
  id: string;
  sender: "outbound" | "inbound";
  from: string;
  to: string;
  date: string;                   // ISO Timestamp
  subject: string;
  snippet: string;
  body: string;
}
```

### 2.4 Call Note (Extracted Discovery Signal)
```typescript
interface CallNote {
  date: string;
  painSeverity: number;           // 1 (mild nuisance) to 5 (bleeding neck)
  wedgeResonance: string;         // Reaction to the 1-feature wedge
  discardedReaction: string;      // What they confirmed they do NOT want
  willingnessToPay: string;       // Extracted dollar amount or range
  keyQuotes: string[];            // Verbatim quotes captured on the call
  summary: string;                // Founder synthesis
}
```

---

## 3. The Validation Scoring Algorithm

Each ICP's validation score is dynamically calculated across all assigned leads using a weighted multi-factor formula:

$$\text{Validation Score} = \min\left(100, \, \text{Round}\left(F_{\text{reply}} + F_{\text{call}} + F_{\text{pain}} + B_{\text{validation}}\right)\right)$$

Where:
* **Reply Factor ($F_{\text{reply}}$)**: Up to 30 points. Benchmark: A 25% reply rate receives full 30 points:
  $$F_{\text{reply}} = \min\left(\frac{\text{replyRate}}{25}, 1\right) \times 30$$
* **Call Factor ($F_{\text{call}}$)**: Up to 30 points. Benchmark: 4 booked discovery calls receives full 30 points:
  $$F_{\text{call}} = \min\left(\frac{\text{callsBooked}}{4}, 1\right) \times 30$$
* **Pain Severity Factor ($F_{\text{pain}}$)**: Up to 25 points. Evaluated on a 5-point scale:
  $$F_{\text{pain}} = \left(\frac{\text{avgPainScore}}{5}\right) \times 25$$
* **Alpha Partner Bonus ($B_{\text{validation}}$)**: Up to 15 bonus points for leads officially marked as `validated`:
  $$B_{\text{validation}} = \min\left(\text{validatedCount} \times 7.5, \, 15\right)$$

---

## 4. Immediate Sequence Auto-Kill Protocol

To prevent embarrassing automated follow-ups sent after a human prospect has already replied:
1. Inbound webhook or simulated reply arrives for a specific `leadId`.
2. The server marks `lead.sequenceStatus = "auto_killed"`.
3. If `lead.stage === "contacted"`, it automatically transitions the lead to `replied` ("In Conversation").
4. A notification is flagged in the Unified Inbox for founder action.
5. All future scheduled sequence steps for this recipient are permanently purged.
