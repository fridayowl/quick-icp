// ==========================================================================
// SIMPLE FOUNDER WORKBOOK: 3 STEPS TO YOUR FIRST 5 CONVERSATIONS
// ==========================================================================
import { api } from './api.js';

const PRESETS = [
  {
    name: 'InvoiceBot AI',
    desc: 'Turns client PDF invoices and messy email attachments into organized Stripe payment links in 1 click.',
    features: [
      '1-Click PDF to Stripe Invoice generator',
      'Automated overdue email reminder sequence',
      'Multi-currency tax calculator'
    ],
    audience1: 'Freelance Web Designers & Devs',
    pain1: 'Chasing clients for unpaid invoices and manually creating line-items',
    wedge1: '1-Click PDF to Stripe Invoice generator',
    audience2: 'Boutique Marketing Agencies (5-15 people)',
    pain2: 'Spending 8 hours every Friday reconciling bank accounts with Excel',
    wedge2: 'Automated overdue email reminder sequence'
  },
  {
    name: 'SyncFlow',
    desc: 'Connects production PostgreSQL databases to customer CRMs and sends instant webhook alerts on schema changes.',
    features: [
      'Postgres-to-CRM Realtime Webhook Bridge',
      'Audit-Ready Webhook Replay Log',
      'Dead Letter Queue Slack Alerter'
    ],
    audience1: 'FinTech Compliance Leads',
    pain1: 'Manual audit reconciliations taking 20 hours every month in Google Sheets',
    wedge1: 'Audit-Ready Webhook Replay Log',
    audience2: 'Solo SaaS Founders',
    pain2: 'Losing trial signups due to silent Zapier webhook sync failures',
    wedge2: 'Dead Letter Queue Slack Alerter'
  },
  {
    name: 'NotionPress',
    desc: 'Publishes private Notion workspace documents directly into ultra-fast, SEO-optimized blog articles.',
    features: [
      'Instant Notion page to HTML static generator',
      'Automatic OpenGraph banner image creator',
      'Custom domain SSL routing'
    ],
    audience1: 'Content Marketers at Series A Startups',
    pain1: 'Waiting 3 days for developers to deploy new marketing blog posts',
    wedge1: 'Instant Notion page to HTML static generator',
    audience2: 'Technical Newsletter Writers',
    pain2: 'Formatting markdown code snippets across Substack and Ghost manually',
    wedge2: 'Automatic OpenGraph banner image creator'
  }
];

export function renderSimpleWorkbook(container, state, onSwitchToPro, onRefresh, onOpenCompanion = () => {}) {
  let activeStep = 1;

  // Local form state seeded from app state
  const form = {
    productName: state.product?.name || '',
    productDesc: state.product?.tagline || state.product?.description || '',
    features: state.product?.features?.map(f => f.name) || [
      'Core problem solver',
      'Automated workflow / sync',
      'Simple dashboard / export'
    ],
    audience1: state.icps?.[0]?.name || '',
    pain1: state.icps?.[0]?.problemHypothesis || '',
    wedge1: state.icps?.[0]?.wedgeFeature || '',
    audience2: state.icps?.[1]?.name || '',
    pain2: state.icps?.[1]?.problemHypothesis || '',
    wedge2: state.icps?.[1]?.wedgeFeature || '',
    simpleContacts: state.leads?.slice(0, 5).map(l => ({
      name: l.name,
      company: l.company,
      channel: l.email ? 'Email' : 'LinkedIn',
      status: l.stage
    })) || [
      { name: 'Sarah Miller', company: 'Acme Cloud', channel: 'LinkedIn', status: 'not_contacted' },
      { name: 'David Zhang', company: 'Veloce Labs', channel: 'LinkedIn', status: 'not_contacted' },
      { name: '', company: '', channel: 'LinkedIn', status: 'not_contacted' }
    ]
  };

  // If user already has product and ICPs, jump directly to Step 3 (Action Plan)
  if (state.product?.name && state.icps?.length > 0) {
    activeStep = 3;
  }

  function render() {
    container.innerHTML = `
      <div class="simple-workbook-wrap">
        
        <!-- Friendly Hero -->
        <div class="workbook-hero-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
            <div>
              <span class="workbook-hero-tag">FOUNDER BLUEPRINT // ZERO JARGON</span>
              <h1 class="workbook-hero-title">Find the first 5 people who want your product.</h1>
            </div>
            <div>
              <button class="btn btn-secondary btn-sm" id="btn-toggle-pro-mode" style="font-family: var(--font-mono); font-size: 0.72rem; padding: 0.4rem 0.8rem;">
                ⚙ Switch to Pro Mode
              </button>
            </div>
          </div>
          <p class="workbook-hero-desc">
            You don't need sales textbooks or complicated pipelines. Just answer 3 basic questions to get your 1-sentence pitch, a ready-to-send message, and 5 people to contact.
          </p>

          <!-- Quick Fill Preset Strip -->
          <div class="quick-fill-strip">
            <span class="quick-fill-label">TRY AN EXAMPLE PRESET:</span>
            ${PRESETS.map((p, idx) => `
              <button class="preset-chip btn-load-preset" data-idx="${idx}">
                ✦ ${p.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 3-Step Navigation Tabs -->
        <div class="simple-step-tabs">
          <button class="simple-step-indicator ${activeStep === 1 ? 'active' : ''}" data-step="1">
            <div class="step-indicator-top">
              <span class="simple-step-num">STEP 01</span>
              <span class="step-badge-status ${form.productName ? 'done' : (activeStep === 1 ? 'current' : '')}">
                ${form.productName ? '[SAVED]' : (activeStep === 1 ? '[CURRENT]' : '[TODO]')}
              </span>
            </div>
            <span class="simple-step-label">1. What Did You Build?</span>
          </button>
          
          <button class="simple-step-indicator ${activeStep === 2 ? 'active' : ''}" data-step="2">
            <div class="step-indicator-top">
              <span class="simple-step-num">STEP 02</span>
              <span class="step-badge-status ${form.audience1 ? 'done' : (activeStep === 2 ? 'current' : '')}">
                ${form.audience1 ? '[SAVED]' : (activeStep === 2 ? '[CURRENT]' : '[TODO]')}
              </span>
            </div>
            <span class="simple-step-label">2. Who Needs It Most?</span>
          </button>
          
          <button class="simple-step-indicator ${activeStep === 3 ? 'active' : ''}" data-step="3">
            <div class="step-indicator-top">
              <span class="simple-step-num">STEP 03</span>
              <span class="step-badge-status ${activeStep === 3 ? 'current' : ''}">
                ${activeStep === 3 ? '[READY]' : '[ACTION]'}
              </span>
            </div>
            <span class="simple-step-label">3. Your Action Plan</span>
          </button>
        </div>

        <!-- Active Step Card -->
        <div class="simple-card-panel">
          ${renderCurrentStep()}
        </div>

      </div>
    `;

    bindEvents();
  }

  function renderCurrentStep() {
    if (activeStep === 1) {
      return `
        <div class="simple-card-header">
          <span class="simple-card-step-kicker">STEP 01 OF 03 // YOUR PRODUCT</span>
          <h2 class="simple-card-title">Tell us what you built in plain English.</h2>
          <p class="simple-card-sub">Pretend you are explaining your product to a friend over coffee. No buzzwords like "paradigm-shifting AI platform".</p>
        </div>

        <div class="easy-field-group">
          <label class="easy-label" for="inp-product-name">
            <span>Product Name</span>
            <span class="easy-label-hint">What do you call it?</span>
          </label>
          <input type="text" class="easy-input" id="inp-product-name" placeholder="e.g. DocuSync or FeedbackPulse" value="${escapeHtml(form.productName)}">
        </div>

        <div class="easy-field-group">
          <label class="easy-label" for="inp-product-desc">
            <span>What does it do? (In 1 sentence)</span>
            <span class="easy-label-hint">One clear sentence</span>
          </label>
          <textarea class="easy-textarea" id="inp-product-desc" rows="2" placeholder="e.g. It turns raw customer feedback from Discord and Slack into organized tickets in 1 click.">${escapeHtml(form.productDesc)}</textarea>
        </div>

        <div class="easy-field-group">
          <label class="easy-label">
            <span>What are 2 or 3 specific capabilities you coded?</span>
            <span class="easy-label-hint">${form.features.length} capabilities listed</span>
          </label>
          <div class="easy-feature-list" id="simple-feature-list">
            ${form.features.map((feat, idx) => `
              <div class="easy-feature-row">
                <span class="feature-num-badge">0${idx + 1}</span>
                <input type="text" class="easy-input feature-input" data-idx="${idx}" placeholder="e.g. One-click PDF export" value="${escapeHtml(feat)}">
                ${form.features.length > 1 ? `<button class="easy-btn-remove btn-remove-feat" data-idx="${idx}" title="Remove">&times;</button>` : ''}
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-add-feature-row" style="align-self: flex-start; margin-top: 0.5rem;">
            + Add Another Capability
          </button>
        </div>

        <div class="simple-card-footer">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">STEP 1 OF 3 // FOUNDATION</span>
          <button class="btn btn-primary" id="btn-step1-next" style="padding: 0.75rem 1.4rem;">
            Next: Who Needs This? &rarr;
          </button>
        </div>
      `;
    }

    if (activeStep === 2) {
      return `
        <div class="simple-card-header">
          <span class="simple-card-step-kicker">STEP 02 OF 03 // TARGET AUDIENCES</span>
          <h2 class="simple-card-title">Who is suffering from this headache today?</h2>
          <p class="simple-card-sub">An "Ideal Customer" is just someone who is wasting time or money doing this manually. Let's pick 2 different groups to test.</p>
        </div>

        <div class="cohort-comparison-grid">
          
          <!-- Cohort 1 -->
          <div class="cohort-card-builder">
            <div class="cohort-builder-tag">
              <span style="color: var(--accent-terracotta);">[GROUP A] PRIMARY CANDIDATE</span>
              <span style="color: var(--text-muted); font-size: 0.65rem;">TIER 1</span>
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-audience-1">Who are they?</label>
              <input type="text" class="easy-input" id="inp-audience-1" placeholder="e.g. Product Managers at startups (20–100 people)" value="${escapeHtml(form.audience1)}">
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-pain-1">What are they annoyed by right now?</label>
              <textarea class="easy-textarea" id="inp-pain-1" rows="2" placeholder="e.g. Manually copy-pasting customer bug reports from Slack into Jira every Friday">${escapeHtml(form.pain1)}</textarea>
            </div>

            <div class="wedge-highlight-box">
              <span class="wedge-box-label">The 1-Feature Wedge to Pitch</span>
              <select class="form-select" id="sel-wedge-1" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-canvas); margin-top: 0.2rem;">
                ${form.features.map(f => `<option value="${escapeHtml(f)}" ${form.wedge1 === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Cohort 2 -->
          <div class="cohort-card-builder">
            <div class="cohort-builder-tag">
              <span style="color: var(--text-muted);">[GROUP B] COMPARISON CANDIDATE</span>
              <span style="color: var(--text-muted); font-size: 0.65rem;">TIER 2</span>
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-audience-2">Who are they?</label>
              <input type="text" class="easy-input" id="inp-audience-2" placeholder="e.g. Freelance Web Designers / Solo Agency Owners" value="${escapeHtml(form.audience2)}">
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-pain-2">What is their main daily friction?</label>
              <textarea class="easy-textarea" id="inp-pain-2" rows="2" placeholder="e.g. Clients messaging them on WhatsApp and losing track of revision requests">${escapeHtml(form.pain2)}</textarea>
            </div>

            <div class="wedge-highlight-box">
              <span class="wedge-box-label">The 1-Feature Wedge to Pitch</span>
              <select class="form-select" id="sel-wedge-2" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-canvas); margin-top: 0.2rem;">
                ${form.features.map((f, i) => `<option value="${escapeHtml(f)}" ${(form.wedge2 === f || (!form.wedge2 && i === 1)) ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
              </select>
            </div>
          </div>

        </div>

        <div class="simple-card-footer">
          <button class="btn btn-secondary" id="btn-step2-prev">
            &larr; Back to Product
          </button>
          <button class="btn btn-primary" id="btn-step2-next" style="padding: 0.75rem 1.4rem;">
            Generate My Action Plan &rarr;
          </button>
        </div>
      `;
    }

    if (activeStep === 3) {
      const prodName = form.productName || 'Your Product';
      const targetAudience = form.audience1 || 'Product Managers';
      const targetPain = form.pain1 || 'wasting 4 hours a week on manual copy-pasting';
      const wedgeFeature = form.wedge1 || form.features[0] || '1-click automated sync';

      const pitch = `We help ${targetAudience} eliminate ${targetPain} using ${wedgeFeature}.`;

      const emailSubject = `Quick question about ${targetPain.split(' ')[0] || 'workflow'} at {{company}}`;
      const emailBody = `Hi {{firstName}},

Saw you lead ${targetAudience.split(' ')[0] || 'product'} at {{company}}.

Quick question: when ${targetPain}, how are you guys handling that today? Are you doing it manually or did you hack together an internal tool?

Curious how your team approaches it—doing some research in this space.

Best,
[Your Name]`;

      const contactedCount = form.simpleContacts.filter(c => c.status !== 'not_contacted').length;
      const progressPct = form.simpleContacts.length > 0 ? Math.round((contactedCount / form.simpleContacts.length) * 100) : 0;

      return `
        <div class="simple-card-header">
          <span class="simple-card-step-kicker">STEP 03 OF 03 // YOUR ACTION PLAN</span>
          <h2 class="simple-card-title">Here is your exact playbook for tomorrow morning.</h2>
          <p class="simple-card-sub">No confusion. You now have a clear pitch, a copy-paste message that gets replies, and 5 questions to ask.</p>
        </div>

        <div class="cheat-sheet-grid">
          
          <!-- Block 1: 1-Sentence Pitch -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[01] YOUR 1-SENTENCE CLARITY PITCH</span>
              <button class="cheat-sheet-copy-btn" id="btn-copy-pitch">COPY PITCH</button>
            </div>
            <h3 class="cheat-sheet-headline">${escapeHtml(pitch)}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              Use this whenever anyone asks "So what does your product do?". Notice how it leads with the customer's headache, not code.
            </p>
          </div>

          <!-- Block 2: 40-Word Curiosity Email -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[02] THE 40-WORD MESSAGE (SEND TO 5 PEOPLE ON LINKEDIN OR EMAIL)</span>
              <button class="cheat-sheet-copy-btn" id="btn-copy-email">COPY MESSAGE</button>
            </div>

            <div class="terminal-message-window">
              <div class="terminal-window-bar">
                <span class="dot-circle" style="background: #ef4444;"></span>
                <span class="dot-circle" style="background: #eab308;"></span>
                <span class="dot-circle" style="background: #22c55e;"></span>
                <span class="terminal-title">outreach_touch_01.txt</span>
              </div>
              <div class="cheat-sheet-box">${escapeHtml(emailBody)}</div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              <strong>Why this gets a 25–40% reply rate:</strong> You are NOT asking them to buy, and you are NOT pitching a 15-minute demo. You are asking an authentic peer question.
            </p>
          </div>

          <!-- Block 3: The 5 Golden Call Questions -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[03] WHAT TO ASK WHEN THEY REPLY (THE 15-MINUTE CALL)</span>
              <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--status-danger);">[NEVER DEMO ON CALL 1]</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div class="question-item-row">
                <span class="q-num-badge">Q1</span>
                <div class="q-text-body">
                  "Walk me through the last time [Problem] happened at your company?"
                  <span class="q-text-reason">Forces them to recall real past behavior instead of theoretical wishes.</span>
                </div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q2</span>
                <div class="q-text-body">
                  "How did you fix it? (What tools or spreadsheets did you use?)"
                  <span class="q-text-reason">If they didn't try to fix it, the problem is not painful enough for them to pay.</span>
                </div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q3</span>
                <div class="q-text-body">
                  "What did that cost your team in wasted hours or money?"
                  <span class="q-text-reason">Establishes the anchor value for your future pricing.</span>
                </div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q4</span>
                <div class="q-text-body">
                  "Have you tried paying for other software before? Why didn't you stick with it?"
                  <span class="q-text-reason">Identifies competitor deficiencies and procurement friction.</span>
                </div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q5</span>
                <div class="q-text-body">
                  "If we solved this by next Monday, would you be open to testing a prototype?"
                  <span class="q-text-reason">Tests commitment currency without sounding like a pushy salesman.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Block 4: Your 5 People Checklist -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[04] YOUR FIRST 5 TARGET CONTACTS</span>
              <button class="btn btn-secondary btn-sm" id="btn-add-contact-row" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">+ Add Person</button>
            </div>
            
            <!-- Progress Strip -->
            <div class="contact-progress-strip">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-terracotta); font-weight: 700;">
                OUTREACH PROGRESS: ${contactedCount} / ${form.simpleContacts.length} (${progressPct}%)
              </span>
              <div class="contact-progress-bar">
                <div class="contact-progress-fill" style="width: ${progressPct}%;"></div>
              </div>
            </div>

            <!-- Gamified Conversation Callout -->
            <div style="background: var(--dp-color-surface); border: 2px solid var(--dp-color-ink); padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <div>
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--dp-color-accent); text-transform: uppercase;">🎮 CONVERSATION GAME // ZERO OVERWHELM</span>
                  <h4 style="font-size: 1.25rem; font-weight: 800; margin: 0.25rem 0; color: var(--dp-color-ink); letter-spacing: -0.02em;">Nervous about talking to customers or writing notes?</h4>
                  <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0;">Play the 4-Round Call Deck with 1-tap note snapping, or practice with a virtual prospect persona before calling real people.</p>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button class="btn btn-secondary btn-sm" id="btn-workbook-open-sim" style="font-family: var(--font-mono); font-size: 0.75rem;">
                    🕹️ Practice with AI Persona
                  </button>
                  <button class="btn btn-primary btn-sm" id="btn-workbook-open-deck" style="font-family: var(--font-mono); font-size: 0.75rem;">
                    🎮 Open 1-Tap Call Deck
                  </button>
                </div>
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              Search LinkedIn for: <strong>${escapeHtml(targetAudience)}</strong>. Enter 5 real names and update their status as you message them.
            </p>

            <table class="simple-contacts-table">
              <thead>
                <tr>
                  <th style="width: 22%;">NAME</th>
                  <th style="width: 22%;">COMPANY</th>
                  <th style="width: 18%;">CHANNEL</th>
                  <th style="width: 20%;">STATUS</th>
                  <th style="width: 18%;">1-TAP GAME</th>
                </tr>
              </thead>
              <tbody id="simple-contacts-tbody">
                ${form.simpleContacts.map((c, idx) => `
                  <tr>
                    <td><input type="text" class="easy-input contact-inp-name" data-idx="${idx}" placeholder="e.g. Sarah Miller" value="${escapeHtml(c.name || '')}" style="padding: 0.45rem 0.65rem; font-size: 0.85rem; width: 100%;"></td>
                    <td><input type="text" class="easy-input contact-inp-comp" data-idx="${idx}" placeholder="e.g. Acme FinTech" value="${escapeHtml(c.company || '')}" style="padding: 0.45rem 0.65rem; font-size: 0.85rem; width: 100%;"></td>
                    <td>
                      <select class="form-select contact-inp-chan" data-idx="${idx}" style="padding: 0.45rem; font-size: 0.8rem; font-family: var(--font-mono);">
                        <option value="LinkedIn" ${c.channel === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                        <option value="Email" ${c.channel === 'Email' ? 'selected' : ''}>Email</option>
                        <option value="Twitter / X" ${c.channel === 'Twitter / X' ? 'selected' : ''}>Twitter / X</option>
                        <option value="Slack / Discord" ${c.channel === 'Slack / Discord' ? 'selected' : ''}>Slack / Discord</option>
                      </select>
                    </td>
                    <td>
                      <select class="form-select contact-inp-stat" data-idx="${idx}" style="padding: 0.45rem; font-size: 0.8rem; font-family: var(--font-mono);">
                        <option value="not_contacted" ${c.status === 'not_contacted' ? 'selected' : ''}>[ ] Ready to Message</option>
                        <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>[>] Message Sent</option>
                        <option value="in_conversation" ${c.status === 'in_conversation' ? 'selected' : ''}>[!] They Replied!</option>
                        <option value="call_scheduled" ${c.status === 'call_scheduled' ? 'selected' : ''}>[★] Call Booked</option>
                        <option value="validated" ${c.status === 'validated' ? 'selected' : ''}>[✓] Validated Customer</option>
                      </select>
                    </td>
                    <td>
                      <button class="btn btn-secondary btn-sm btn-contact-call-deck" data-idx="${idx}" style="font-family: var(--font-mono); font-size: 0.72rem; padding: 0.35rem 0.5rem; width: 100%; white-space: nowrap;">
                        🎮 Call Deck
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <div class="simple-card-footer">
          <button class="btn btn-secondary" id="btn-step3-edit">
            &larr; Edit Details
          </button>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-save-workbook" style="padding: 0.75rem 1.4rem;">
              Save My Discovery Plan
            </button>
            <button class="btn btn-secondary" id="btn-goto-pro" style="padding: 0.75rem 1rem;">
              Open Full Pipeline (Pro Mode) &rarr;
            </button>
          </div>
        </div>
      `;
    }
  }

  function bindEvents() {
    // Mode switch button
    container.querySelector('#btn-toggle-pro-mode')?.addEventListener('click', onSwitchToPro);
    container.querySelector('#btn-goto-pro')?.addEventListener('click', onSwitchToPro);

    // Preset chips
    container.querySelectorAll('.btn-load-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const preset = PRESETS[idx];
        if (preset) {
          form.productName = preset.name;
          form.productDesc = preset.desc;
          form.features = [...preset.features];
          form.audience1 = preset.audience1;
          form.pain1 = preset.pain1;
          form.wedge1 = preset.wedge1;
          form.audience2 = preset.audience2;
          form.pain2 = preset.pain2;
          form.wedge2 = preset.wedge2;
          activeStep = 1;
          render();
        }
      });
    });

    // Step navigation tabs
    container.querySelectorAll('.simple-step-indicator').forEach(tab => {
      tab.addEventListener('click', () => {
        saveCurrentInput();
        activeStep = parseInt(tab.dataset.step, 10);
        render();
      });
    });

    // Step 1: Add / Remove Features
    container.querySelector('#btn-add-feature-row')?.addEventListener('click', () => {
      saveCurrentInput();
      form.features.push('');
      render();
    });

    container.querySelectorAll('.btn-remove-feat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        saveCurrentInput();
        form.features.splice(idx, 1);
        render();
      });
    });

    // Step 1 Next
    container.querySelector('#btn-step1-next')?.addEventListener('click', () => {
      saveCurrentInput();
      if (!form.productName.trim()) {
        alert('Please enter your product name first.');
        return;
      }
      activeStep = 2;
      render();
    });

    // Step 2 Back & Next
    container.querySelector('#btn-step2-prev')?.addEventListener('click', () => {
      saveCurrentInput();
      activeStep = 1;
      render();
    });

    container.querySelector('#btn-step2-next')?.addEventListener('click', () => {
      saveCurrentInput();
      if (!form.audience1.trim()) {
        alert('Please enter at least one target audience in Group A.');
        return;
      }
      activeStep = 3;
      render();
    });

    // Step 3 Actions
    container.querySelector('#btn-step3-edit')?.addEventListener('click', () => {
      activeStep = 1;
      render();
    });

    // Copy Pitch
    container.querySelector('#btn-copy-pitch')?.addEventListener('click', (e) => {
      const pitch = `We help ${form.audience1 || 'customers'} eliminate ${form.pain1 || 'friction'} using ${form.wedge1 || form.features[0] || 'our product'}.`;
      navigator.clipboard.writeText(pitch).then(() => {
        e.target.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => { e.target.textContent = 'COPY PITCH'; }, 1800);
      });
    });

    // Copy Email
    container.querySelector('#btn-copy-email')?.addEventListener('click', (e) => {
      const targetAudience = form.audience1 || 'our target market';
      const targetPain = form.pain1 || 'workflow friction';
      const emailBody = `Hi {{firstName}},

Saw you lead ${targetAudience.split(' ')[0] || 'your team'} at {{company}}.

Quick question: when ${targetPain}, how are you guys handling that today? Are you doing it manually or did you hack together an internal tool?

Curious how your team approaches it—doing some research in this space.

Best,
[Your Name]`;
      navigator.clipboard.writeText(emailBody).then(() => {
        e.target.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => { e.target.textContent = 'COPY MESSAGE'; }, 1800);
      });
    });

    // Add Contact Row
    container.querySelector('#btn-add-contact-row')?.addEventListener('click', () => {
      saveCurrentInput();
      form.simpleContacts.push({ name: '', company: '', channel: 'LinkedIn', status: 'not_contacted' });
      render();
    });

    // Status Change listener for live progress
    container.querySelectorAll('.contact-inp-stat').forEach(sel => {
      sel.addEventListener('change', () => {
        saveCurrentInput();
        render();
      });
    });

    // Gamified Call Companion & Simulator buttons
    container.querySelector('#btn-workbook-open-sim')?.addEventListener('click', () => {
      onOpenCompanion(null, 'simulator');
    });

    container.querySelector('#btn-workbook-open-deck')?.addEventListener('click', () => {
      onOpenCompanion(null, 'companion');
    });

    container.querySelectorAll('.btn-contact-call-deck').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        const contact = form.simpleContacts[idx];
        const leadObj = {
          id: 'lead_' + idx,
          name: contact?.name || 'Contact ' + (idx + 1),
          company: contact?.company || 'Prospective Company',
          email: `${(contact?.name || 'user').toLowerCase().replace(/\s+/g, '')}@example.com`,
          channel: contact?.channel || 'LinkedIn',
          stage: contact?.status || 'not_contacted'
        };
        onOpenCompanion(leadObj, 'companion');
      });
    });

    // Save Workbook to Backend
    container.querySelector('#btn-save-workbook')?.addEventListener('click', async () => {
      saveCurrentInput();
      await syncToBackend();
      alert('Your discovery plan has been saved! You are ready to reach out to your 5 people.');
      render();
    });
  }

  function saveCurrentInput() {
    // Step 1
    const nameInp = container.querySelector('#inp-product-name');
    if (nameInp) form.productName = nameInp.value.trim();

    const descInp = container.querySelector('#inp-product-desc');
    if (descInp) form.productDesc = descInp.value.trim();

    const featInputs = container.querySelectorAll('.feature-input');
    if (featInputs.length > 0) {
      form.features = Array.from(featInputs).map(inp => inp.value.trim()).filter(Boolean);
    }

    // Step 2
    const a1Inp = container.querySelector('#inp-audience-1');
    if (a1Inp) form.audience1 = a1Inp.value.trim();

    const p1Inp = container.querySelector('#inp-pain-1');
    if (p1Inp) form.pain1 = p1Inp.value.trim();

    const w1Sel = container.querySelector('#sel-wedge-1');
    if (w1Sel) form.wedge1 = w1Sel.value;

    const a2Inp = container.querySelector('#inp-audience-2');
    if (a2Inp) form.audience2 = a2Inp.value.trim();

    const p2Inp = container.querySelector('#inp-pain-2');
    if (p2Inp) form.pain2 = p2Inp.value.trim();

    const w2Sel = container.querySelector('#sel-wedge-2');
    if (w2Sel) form.wedge2 = w2Sel.value;

    // Step 3 Contacts
    const nameInps = container.querySelectorAll('.contact-inp-name');
    const compInps = container.querySelectorAll('.contact-inp-comp');
    const chanInps = container.querySelectorAll('.contact-inp-chan');
    const statInps = container.querySelectorAll('.contact-inp-stat');

    if (nameInps.length > 0) {
      form.simpleContacts = Array.from(nameInps).map((inp, idx) => ({
        name: inp.value.trim(),
        company: compInps[idx]?.value.trim() || '',
        channel: chanInps[idx]?.value || 'LinkedIn',
        status: statInps[idx]?.value || 'not_contacted'
      }));
    }
  }

  async function syncToBackend() {
    const payload = {
      product: {
        name: form.productName,
        tagline: form.productDesc,
        description: form.productDesc,
        category: 'Software',
        features: form.features.map((f, i) => ({
          name: f,
          category: 'Core',
          complexity: 'Medium',
          status: 'Shipped',
          description: f
        }))
      },
      cohorts: [
        {
          name: form.audience1 || 'Audience A',
          tier: 'Tier 1',
          role: form.audience1,
          industry: 'Software / Services',
          problem: form.pain1 || 'Operational friction',
          workaround: 'Manual work',
          wedgeFeature: form.wedge1 || form.features[0] || 'Core feature',
          discardedFeatures: form.features.filter(f => f !== form.wedge1).join(', ')
        }
      ]
    };

    if (form.audience2) {
      payload.cohorts.push({
        name: form.audience2,
        tier: 'Tier 2',
        role: form.audience2,
        industry: 'Software / Services',
        problem: form.pain2 || 'Operational friction',
        workaround: 'Manual work',
        wedgeFeature: form.wedge2 || form.features[1] || 'Secondary feature',
        discardedFeatures: form.features.filter(f => f !== form.wedge2).join(', ')
      });
    }

    try {
      await api.submitExercise(payload);

      // Save contacts as leads if any have names
      const validContacts = form.simpleContacts.filter(c => c.name);
      for (const contact of validContacts) {
        await api.addLead({
          name: contact.name,
          title: form.audience1,
          company: contact.company || 'Prospective Company',
          email: `${contact.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          icpId: 'icp_cohort_1',
          stage: contact.status || 'contacted'
        });
      }

      await onRefresh();
    } catch (err) {
      console.error('Failed to sync workbook:', err);
    }
  }

  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
