# Contributing to Quick ICP

First off, thank you for considering contributing to Quick ICP! It's people like you who make open source such a powerful ecosystem for founders and developers.

---

## 🌟 Our Philosophy

Quick ICP is built on several stubborn design principles:
1. **Zero-Bloat Vanilla Tech**: Keep client-side dependencies minimal. Vanilla JS modules and clean CSS custom properties keep this tool fast, inspectable, and timeless.
2. **Local-First & Frictionless**: A founder should be able to clone the repository and run `npm start` within 5 seconds without setting up external database servers or Docker clusters.
3. **Founder-First UX**: Prioritize signal over noise. Every feature must help a founder invalidate or validate an ICP faster.

---

## 🛠️ Development Setup

### Prerequisites
* Node.js v18 or later
* Git

### Step-by-Step Instructions

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/fridayowl/quick-icp.git
   cd quick-icp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3030](http://localhost:3030)

5. **Verify Syntax & Code Quality**:
   ```bash
   npm test
   ```

---

## 📝 Submitting Changes

1. **Create a Topic Branch**:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```

2. **Commit Your Changes**:
   Use descriptive commit messages following the Conventional Commits style:
   * `feat: add export to CSV for validated ICP leads`
   * `fix: correct validation score clamp logic`
   * `docs: improve The Mom Test question templates`

3. **Push to Your Fork**:
   ```bash
   git push origin feature/your-awesome-feature
   ```

4. **Open a Pull Request**:
   Fill in the pull request template with screenshots, a clear summary of your changes, and the rationale.

---

## 💡 Areas Where We'd Love Help

* **Local LLM Call Analyzer**: Native Ollama / DeepSeek / Gemini API integration for deeper natural language transcript extraction.
* **IMAP/SMTP Mailbox Connectors**: Direct sync with Google Workspace / Outlook secondary inboxes.
* **CRM Bidirectional Webhooks**: Two-way sync with [Twenty CRM](https://twenty.com) and HubSpot.
* **Export & Reporting**: PDF/Markdown one-page executive ICP scorecard export for investors or co-founders.

Thank you for helping founders build things people actually want!
