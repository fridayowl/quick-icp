# Quick ICP REST API Reference

Base URL: `http://localhost:3030/api`

---

## 1. ICP Endpoints

### `GET /api/icps`
Retrieve all registered ICPs with real-time calculated metrics and validation scores.

**Response `200 OK`**:
```json
[
  {
    "id": "icp_agency",
    "name": "Boutique Performance & SEO Agencies",
    "tier": "Tier 1",
    "tierColor": "#10b981",
    "targetRole": "Agency Owner / Head of Client Ops",
    "companySize": "5 - 35 employees",
    "industry": "Marketing & Digital Agencies",
    "coreProblem": "Spending 8 hours every Friday manually pulling client analytics...",
    "currentWorkaround": "Spreadsheets + Google Slides",
    "productWedge": "1-Click Automated White-label Executive Reporting",
    "discardedFeatures": "No custom JS nodes, no multi-warehouse sync, no webhooks",
    "validationThreshold": "5 calls with pain severity >= 4 and WTP >= $150/mo",
    "status": "Active Testing",
    "metrics": {
      "leadsContacted": 18,
      "repliesCount": 5,
      "replyRate": 27.8,
      "callsBooked": 3,
      "callsCompleted": 2,
      "avgPainScore": 4.5,
      "validatedCount": 1,
      "validationScore": 82
    }
  }
]
```

### `POST /api/icps`
Create a new ICP candidate hypothesis.

**Payload**:
```json
{
  "name": "SaaS Engineering Directors",
  "tier": "Tier 2",
  "targetRole": "Director of Engineering / VP Eng",
  "companySize": "50 - 250 employees",
  "industry": "B2B SaaS",
  "coreProblem": "Flaky PR preview environments breaking CI",
  "currentWorkaround": "Internal bash scripts & Terraform hack",
  "productWedge": "Instant ephemeral branch environments in 1 line of YAML",
  "discardedFeatures": "No custom dashboard, no billing alerts, no SOC2 compliance vault",
  "validationThreshold": "4 calls with pain severity >= 4.5"
}
```

### `PUT /api/icps/:id`
Update an existing ICP hypothesis or tier.

### `DELETE /api/icps/:id`
Delete an ICP and cascade clean associated leads.

---

## 2. Lead Endpoints

### `GET /api/leads`
Retrieve leads, with optional query filters:
* `?icpId=icp_agency`
* `?stage=contacted`

### `POST /api/leads`
Add a new prospect to an ICP cohort.

**Payload**:
```json
{
  "name": "Marcus Vance",
  "title": "Founder & Managing Director",
  "company": "Vance Growth Media",
  "email": "marcus@vancemedia.co",
  "icpId": "icp_agency",
  "stage": "contacted"
}
```

### `PUT /api/leads/:id/stage`
Update a lead's stage in the Discovery Kanban board.

**Payload**:
```json
{
  "stage": "call_scheduled"
}
```

Valid stages:
`contacted` | `replied` | `call_scheduled` | `call_completed` | `validated` | `disqualified`

---

## 3. Unified Inbox & Sequences

### `POST /api/leads/:id/reply`
Send a manual founder reply to a prospect thread.

**Payload**:
```json
{
  "body": "Hey Marcus, would Tuesday at 2pm PT work for a quick 15-min zoom?"
}
```

### `POST /api/leads/:id/simulate-reply`
Simulate an inbound customer response.
* Instantly appends the prospect's reply.
* **Automatically triggers Sequence Auto-Kill**.
* Transitions lead stage from `contacted` to `replied`.
* Recalculates ICP metrics and validation score in real time.

---

## 4. AI Insight Extraction

### `POST /api/leads/:id/analyze-call`
Submit raw discovery call notes or Zoom/Meet transcripts for heuristic parsing.

**Payload**:
```json
{
  "rawNotes": "Marcus said Friday reports take his team 9 hours every week. He literally called it a nightmare. He said: 'If you had something that did this automatically without making me train my account managers, I would happily pay $250 a month right now'. He does not care about fancy charts or integrations."
}
```

**Response `200 OK`**:
```json
{
  "painSeverity": 5,
  "willingnessToPay": "$250 / month",
  "wedgeResonance": "Automatic reporting without training account managers",
  "discardedReaction": "Does not care about fancy charts or integrations",
  "keyQuotes": [
    "\"Friday reports take his team 9 hours every week. He literally called it a nightmare.\"",
    "\"If you had something that did this automatically without making me train my account managers, I would happily pay $250 a month right now.\""
  ]
}
```

---

## 5. Inbox Safe Dispatcher

### `GET /api/inboxes`
Retrieve configured secondary sending domains, daily send throttles, sent counts, and deliverability health status.
