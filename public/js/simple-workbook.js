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
        
        <!-- Minimal Hero -->
        <div class="workbook-hero-card">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <h1 class="workbook-hero-title">Find your first 5 customers.</h1>
            <button class="btn btn-secondary btn-sm" id="btn-toggle-pro-mode" style="font-family: var(--font-mono); font-size: 0.72rem; padding: 0.4rem 0.8rem;">
              ⚙ Pro Mode
            </button>
          </div>

          <!-- Quick Fill Preset Strip -->
          <div class="quick-fill-strip" style="margin-top: 0.75rem;">
            <span class="quick-fill-label">PRESETS:</span>
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
            <span class="simple-step-label">1. Product</span>
          </button>
          
          <button class="simple-step-indicator ${activeStep === 2 ? 'active' : ''}" data-step="2">
            <div class="step-indicator-top">
              <span class="simple-step-num">STEP 02</span>
              <span class="step-badge-status ${form.audience1 ? 'done' : (activeStep === 2 ? 'current' : '')}">
                ${form.audience1 ? '[SAVED]' : (activeStep === 2 ? '[CURRENT]' : '[TODO]')}
              </span>
            </div>
            <span class="simple-step-label">2. Audiences</span>
          </button>
          
          <button class="simple-step-indicator ${activeStep === 3 ? 'active' : ''}" data-step="3">
            <div class="step-indicator-top">
              <span class="simple-step-num">STEP 03</span>
              <span class="step-badge-status ${activeStep === 3 ? 'current' : ''}">
                ${activeStep === 3 ? '[READY]' : '[ACTION]'}
              </span>
            </div>
            <span class="simple-step-label">3. Action Plan</span>
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
          <h2 class="simple-card-title">What did you build?</h2>
        </div>

        <div class="easy-field-group">
          <label class="easy-label" for="inp-product-name">Product Name</label>
          <input type="text" class="easy-input" id="inp-product-name" placeholder="e.g. DocuSync" value="${escapeHtml(form.productName)}">
        </div>

        <div class="easy-field-group">
          <label class="easy-label" for="inp-product-desc">What does it do?</label>
          <textarea class="easy-textarea" id="inp-product-desc" rows="2" placeholder="e.g. Turns customer feedback into tickets in 1 click.">${escapeHtml(form.productDesc)}</textarea>
        </div>

        <div class="easy-field-group">
          <label class="easy-label">Core Capabilities</label>
          <div class="easy-feature-list" id="simple-feature-list">
            ${form.features.map((feat, idx) => `
              <div class="easy-feature-row">
                <span class="feature-num-badge">0${idx + 1}</span>
                <input type="text" class="easy-input feature-input" data-idx="${idx}" placeholder="e.g. 1-click PDF export" value="${escapeHtml(feat)}">
                ${form.features.length > 1 ? `<button class="easy-btn-remove btn-remove-feat" data-idx="${idx}" title="Remove">&times;</button>` : ''}
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-add-feature-row" style="align-self: flex-start; margin-top: 0.5rem;">
            + Add Capability
          </button>
        </div>

        <div class="simple-card-footer">
          <span></span>
          <button class="btn btn-primary" id="btn-step1-next" style="padding: 0.75rem 1.4rem;">
            Next: Target Audiences &rarr;
          </button>
        </div>
      `;
    }

    if (activeStep === 2) {
      return `
        <div class="simple-card-header">
          <h2 class="simple-card-title">Who needs it most?</h2>
        </div>

        <div class="cohort-comparison-grid">
          
          <!-- Cohort 1 -->
          <div class="cohort-card-builder">
            <div class="cohort-builder-tag">
              <span style="color: var(--accent-terracotta);">[GROUP A] PRIMARY</span>
              <span style="color: var(--text-muted); font-size: 0.65rem;">TIER 1</span>
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-audience-1">Who are they?</label>
              <input type="text" class="easy-input" id="inp-audience-1" placeholder="e.g. Agency Owners (5–20 people)" value="${escapeHtml(form.audience1)}">
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-pain-1">Daily Friction</label>
              <textarea class="easy-textarea" id="inp-pain-1" rows="2" placeholder="e.g. Manually matching CSV reports in Excel every Friday">${escapeHtml(form.pain1)}</textarea>
            </div>

            <div class="wedge-highlight-box">
              <span class="wedge-box-label">1-Feature Wedge</span>
              <select class="form-select" id="sel-wedge-1" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-canvas); margin-top: 0.2rem;">
                ${form.features.map(f => `<option value="${escapeHtml(f)}" ${form.wedge1 === f ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Cohort 2 -->
          <div class="cohort-card-builder">
            <div class="cohort-builder-tag">
              <span style="color: var(--text-muted);">[GROUP B] SECONDARY</span>
              <span style="color: var(--text-muted); font-size: 0.65rem;">TIER 2</span>
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-audience-2">Who are they?</label>
              <input type="text" class="easy-input" id="inp-audience-2" placeholder="e.g. Freelance Designers" value="${escapeHtml(form.audience2)}">
            </div>

            <div class="easy-field-group">
              <label class="easy-label" for="inp-pain-2">Daily Friction</label>
              <textarea class="easy-textarea" id="inp-pain-2" rows="2" placeholder="e.g. Chasing client invoices and payment links">${escapeHtml(form.pain2)}</textarea>
            </div>

            <div class="wedge-highlight-box">
              <span class="wedge-box-label">1-Feature Wedge</span>
              <select class="form-select" id="sel-wedge-2" style="font-family: var(--font-mono); font-size: 0.8rem; background: var(--bg-canvas); margin-top: 0.2rem;">
                ${form.features.map((f, i) => `<option value="${escapeHtml(f)}" ${(form.wedge2 === f || (!form.wedge2 && i === 1)) ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('')}
              </select>
            </div>
          </div>

        </div>

        <div class="simple-card-footer">
          <button class="btn btn-secondary" id="btn-step2-prev">
            &larr; Back
          </button>
          <button class="btn btn-primary" id="btn-step2-next" style="padding: 0.75rem 1.4rem;">
            Generate Action Plan &rarr;
          </button>
        </div>
      `;
    }

    if (activeStep === 3) {
      const prodName = form.productName || 'Your Product';
      const targetAudience = form.audience1 || 'Agency Owners';
      const targetPain = form.pain1 || 'reconciling reports manually in Excel';
      const wedgeFeature = form.wedge1 || form.features[0] || '1-click summary export';

      const pitch = `We help ${targetAudience} eliminate ${targetPain} using ${wedgeFeature}.`;

      const emailSubject = `Quick question about ${targetPain.split(' ')[0] || 'workflow'} at {{company}}`;
      const emailBody = `Hi {{firstName}},

Saw you lead ${targetAudience.split(' ')[0] || 'your team'} at {{company}}.

Quick question: when ${targetPain}, how are you guys handling that today? Are you doing it manually or did you hack together an internal tool?

Curious how your team approaches it—doing some research in this space.

Best,
[Your Name]`;

      const contactedCount = form.simpleContacts.filter(c => c.status !== 'not_contacted').length;
      const progressPct = form.simpleContacts.length > 0 ? Math.round((contactedCount / form.simpleContacts.length) * 100) : 0;

      return `
        <div class="simple-card-header">
          <h2 class="simple-card-title">Action Plan</h2>
        </div>

        <div class="cheat-sheet-grid">
          
          <!-- Block 1: 1-Sentence Pitch -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[01] 1-SENTENCE PITCH</span>
              <button class="cheat-sheet-copy-btn" id="btn-copy-pitch">COPY</button>
            </div>
            <h3 class="cheat-sheet-headline">${escapeHtml(pitch)}</h3>
          </div>

          <!-- Block 2: 40-Word Curiosity Email -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[02] CURIOSITY OUTREACH (NO PITCHING)</span>
              <button class="cheat-sheet-copy-btn" id="btn-copy-email">COPY MESSAGE</button>
            </div>

            <div class="terminal-message-window">
              <div class="terminal-window-bar">
                <span class="dot-circle" style="background: #000000;"></span>
                <span class="terminal-title">message_template.txt</span>
              </div>
              <div class="cheat-sheet-box">${escapeHtml(emailBody)}</div>
            </div>
          </div>

          <!-- Block 3: The 5 Golden Call Questions -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[03] 5 CALL QUESTIONS (ZERO PITCHING)</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div class="question-item-row">
                <span class="q-num-badge">Q1</span>
                <div class="q-text-body">"Walk me through the last time [Problem] happened at your company?"</div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q2</span>
                <div class="q-text-body">"How did you fix it? (What tools or spreadsheets did you use?)"</div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q3</span>
                <div class="q-text-body">"What did that cost your team in wasted hours or money?"</div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q4</span>
                <div class="q-text-body">"Have you tried paying for other software before? Why didn't you stick with it?"</div>
              </div>

              <div class="question-item-row">
                <span class="q-num-badge">Q5</span>
                <div class="q-text-body">"If we solved this by next Monday, would you be open to testing an early prototype?"</div>
              </div>
            </div>
          </div>

          <!-- Block 4: Your 5 People Checklist -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[04] FIRST 5 TARGET CONTACTS</span>
              <button class="btn btn-secondary btn-sm" id="btn-add-contact-row" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">+ Add Contact</button>
            </div>
            
            <!-- Progress Strip -->
            <div class="contact-progress-strip">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-terracotta); font-weight: 700;">
                PROGRESS: ${contactedCount} / ${form.simpleContacts.length} (${progressPct}%)
              </span>
              <div class="contact-progress-bar">
                <div class="contact-progress-fill" style="width: ${progressPct}%;"></div>
              </div>
            </div>

            <!-- Minimal Gamified Banner -->
            <div style="background: var(--dp-color-surface); border: 1px solid var(--dp-color-ink); padding: 0.85rem 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div>
                <strong style="font-size: 0.95rem; color: var(--dp-color-ink);">Customer Conversation Game</strong>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.5rem;">1-tap notes & AI practice simulator.</span>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-secondary btn-sm" id="btn-workbook-open-sim" style="font-family: var(--font-mono); font-size: 0.72rem;">🕹️ Practice Simulator</button>
                <button class="btn btn-primary btn-sm" id="btn-workbook-open-deck" style="font-family: var(--font-mono); font-size: 0.72rem;">🎮 1-Tap Call Deck</button>
              </div>
            </div>

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
