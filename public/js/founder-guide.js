// ==========================================================================
// FOUNDER ROADMAP & ZERO-TO-ICP PLAYBOOK (FOUNDER-FIRST DISCOVERY ENGINE)
// ==========================================================================

const STEPS_DATA = [
  {
    id: 1,
    key: 'inventory',
    title: 'The Honest Feature Dump',
    kicker: 'STEP 01 // PRODUCT INVENTORY',
    shortName: 'Feature Dump',
    subtitle: 'Inventory what you actually built.',
    why: 'Founders stack features. Strangers get overwhelmed by all-in-one claims. You need your full list before you can carve out a sharp weapon.',
    trapTitle: 'The "It Does Everything" Fallacy',
    trapBody: 'Pitching a platform. Strangers want an aspirin for today\'s headache, not another suite.',
    actionHeader: 'EXACT TASK',
    actionSteps: [
      'Name your product and state what it does in 1 plain sentence.',
      'List 4 to 8 distinct features you have built or designed.',
      'Rate each feature: working today, in progress, or planned.'
    ],
    exampleTitle: 'B2B Example (SyncFlow)',
    exampleText: `Product: SyncFlow
Features Built:
1. Real-time PostgreSQL to Webhook pipeline
2. Visual drag-and-drop workflow canvas
3. Team permission roles & SSO
4. Automated retry queue with Dead Letter Alerts
5. Custom JavaScript data transformation blocks`,
    toolActionLabel: '[00] Open Product Catalog',
    targetTab: 'product',
    checkCompletion: (state) => (state.product?.features?.length || 0) >= 3
  },
  {
    id: 2,
    key: 'audiences',
    title: 'Brainstorm 2–3 Candidate Audiences',
    kicker: 'STEP 02 // AUDIENCE HYPOTHESES',
    shortName: 'Audiences',
    subtitle: 'Test 2–3 cohorts in parallel. Don\'t bet on one guess.',
    why: 'An ICP is a specific title at a specific stage with acute friction and budget authority.',
    trapTitle: 'Targeting "Everyone"',
    trapBody: 'Targeting everyone means your message speaks to no one. You need a role with direct friction.',
    actionHeader: 'AUDIENCE FORMULA',
    actionSteps: [
      'Fill in: "[Job Title] at [Company Stage] suffering from [Ugly Problem]."',
      'Identify their current workaround: spreadsheets, scripts, or manual effort.',
      'Create 2 to 3 candidate cohorts to compare market pull.'
    ],
    exampleTitle: '3-Cohort Example',
    exampleText: `Cohort A: "FinTech Compliance Leads" (Problem: manual audit reconciliations; Workaround: Shared Sheets)
Cohort B: "Solo SaaS Founders" (Problem: losing trial signups due to failed webhooks; Workaround: Zapier)
Cohort C: "Enterprise Platform Engineers" (Problem: ETL pipelines breaking on schema changes; Workaround: PagerDuty)`,
    toolActionLabel: '[01] Launch Hypothesis Lab',
    targetTab: 'icp-lab',
    checkCompletion: (state) => (state.icps?.length || 0) >= 2
  },
  {
    id: 3,
    key: 'wedge',
    title: 'Cut 90% of Your Product (1-Feature Wedge)',
    kicker: 'STEP 03 // DE-ENGINEERING',
    shortName: '1-Feature Wedge',
    subtitle: 'Pick the single sharpest feature. Forbid the rest.',
    why: 'A wedge penetrates first. Pitching 10 features creates confusion and looks hard to adopt.',
    trapTitle: 'Feature Vomiting',
    trapBody: 'Listing every feature on Call 1 makes your product look bloated, slow, and expensive.',
    actionHeader: 'DE-ENGINEER YOUR PRODUCT',
    actionSteps: [
      'Look at Cohort A\'s #1 daily friction.',
      'Pick the ONE feature from your catalog that kills that friction.',
      'Mark all other features as "FORBIDDEN TO MENTION" on initial calls.'
    ],
    exampleTitle: 'Wedge Example',
    exampleText: `Product: SyncFlow (30,000 lines of code)
Cohort: FinTech Compliance Leads
1-Feature Wedge: "Audit-Ready Webhook Replay Log"
Forbidden on Call 1: Visual canvas, custom JS transforms, multi-tenant billing.`,
    toolActionLabel: '[01] Assign Wedges in Lab',
    targetTab: 'icp-lab',
    checkCompletion: (state) => state.icps?.some(i => i.wedgeFeature && i.wedgeFeature.trim() !== '')
  },
  {
    id: 4,
    key: 'sourcing',
    title: 'Find 15 Real People per Cohort',
    kicker: 'STEP 04 // PROSPECT SOURCING',
    shortName: 'Source 15 People',
    subtitle: 'Source 15 real practitioners per cohort.',
    why: 'Blasting thousands burns your domain. 15 targeted practitioners give you 5 real conversations.',
    trapTitle: 'Buying Scraped Lists',
    trapBody: 'High bounce rates, burned sender domain, and zero genuine customer insights.',
    actionHeader: 'FIND 15 TARGETS FAST',
    actionSteps: [
      'LinkedIn: Search "[Target Title]" in quotes, filter by company size 10-100.',
      'GitHub / Communities: Check practitioners asking "How do you handle [Problem]?"',
      'Add 15 targeted names into your Discovery Pipeline.'
    ],
    exampleTitle: 'Search Filter Example',
    exampleText: `Title: "Head of Compliance" OR "Lead Compliance Officer"
Industry: Financial Services / FinTech
Location: United States / UK
Company Headcount: 20–200 employees`,
    toolActionLabel: '[02] Add to Discovery Pipeline',
    targetTab: 'kanban',
    checkCompletion: (state) => (state.leads?.length || 0) >= 6
  },
  {
    id: 5,
    key: 'outreach',
    title: 'The 45-Word Peer Curiosity Email',
    kicker: 'STEP 05 // LOW-FRICTION DISCOVERY',
    shortName: '45-Word Touch',
    subtitle: 'Ask an authentic practitioner curiosity question.',
    why: 'Pitch emails get deleted. A brief peer question about their workflow gets 25%+ replies.',
    trapTitle: 'The 15-Minute Demo Pitch',
    trapBody: 'Asking for 15 minutes of someone\'s time without offering value converts at < 1%.',
    actionHeader: '45-WORD RULES',
    actionSteps: [
      'Keep it under 50 words total.',
      'No links, pitch decks, or calendar invites.',
      'Ask how they handle the friction today, never if they want to buy.',
      'When they reply, automation halts immediately for human dialogue.'
    ],
    exampleTitle: 'Peer Curiosity Template',
    exampleText: `Subject: Quick question about audit logs at {{company}}

Hi {{firstName}},

Saw you lead compliance at {{company}}. Quick question: when webhooks fail during customer reconciliations, are you guys tracking failures in spreadsheets or an internal replay queue?

Doing some research on this workflow—curious how your team handles it.

Best,
{{my_name}}`,
    toolActionLabel: '[04] Open Safe Dispatcher',
    targetTab: 'dispatcher',
    checkCompletion: (state) => state.leads?.some(l => l.stage !== 'uncontacted')
  },
  {
    id: 6,
    key: 'discovery',
    title: 'Run a 15-Min Call & Kill or Double-Down',
    kicker: 'STEP 06 // CONVERSATION TO COMMITMENT',
    shortName: 'Call & Decision',
    subtitle: 'Listen for past pain and budget. Never demo on Call 1.',
    why: 'Compliments are polite lies. Verify past spending and willingness to commit time or money.',
    trapTitle: 'Opening Screenshare',
    trapBody: 'Screensharing turns prospects into passive critics asking for features they won\'t buy.',
    actionHeader: '5 MOM-TEST QUESTIONS',
    actionSteps: [
      '1. "Tell me about the last time [Problem] happened?"',
      '2. "What did you do to fix it? What did that cost in time or money?"',
      '3. "What other tools have you tried? Why did you stop?"',
      '4. "Who else on your team gets paged when this breaks?"',
      '5. "If this were fixed next week, what is the next step to pilot it?"'
    ],
    exampleTitle: 'Kill / Double-Down Criteria',
    exampleText: `Kill Cohort if:
- They say "It's annoying, but not worth paying to fix"
- Unwilling to commit 20 minutes to pilot

Double Down if:
- They say "Can I use this right now? I will pay today."
- They introduce you to the check-signer within 24 hours.`,
    toolActionLabel: '[03] Open Call Analyzer',
    targetTab: 'inbox',
    checkCompletion: (state) => state.leads?.some(l => ['call_completed', 'validated'].includes(l.stage))
  }
];

export function renderFounderGuide(container, state, onNavigateTab, onLaunchExercise) {
  let activeStepId = 1;

  // Auto-select the first incomplete step
  for (const step of STEPS_DATA) {
    if (!step.checkCompletion(state)) {
      activeStepId = step.id;
      break;
    }
  }

  function render() {
    const completedCount = STEPS_DATA.filter(s => s.checkCompletion(state)).length;
    const progressPct = Math.round((completedCount / STEPS_DATA.length) * 100);
    const activeStep = STEPS_DATA.find(s => s.id === activeStepId) || STEPS_DATA[0];

    container.innerHTML = `
      <div class="founder-guide-container">
        
        <!-- 1. Founder Next Step Hero Callout -->
        <div class="founder-next-step-card">
          <div class="next-step-content">
            <span class="next-step-tag">YOUR IMMEDIATE NEXT STEP // STEP 0${activeStep.id} OF 06</span>
            <h2 class="next-step-title">${activeStep.title}</h2>
            <p class="next-step-desc">${activeStep.subtitle}</p>
          </div>
          <div class="next-step-action">
            <button class="btn btn-primary" id="btn-next-step-direct" style="padding: 0.85rem 1.5rem; font-size: 0.95rem;">
              Execute Step 0${activeStep.id} Now &rarr;
            </button>
          </div>
        </div>

        <!-- 2. Interactive Progress Strip -->
        <div class="roadmap-progress-strip">
          <div class="progress-header-row">
            <div class="progress-title-group">
              <span class="progress-label">DISCOVERY VALIDATION ROADMAP:</span>
              <span class="progress-count">${completedCount} / 06 COMPLETED (${progressPct}%)</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" id="btn-guide-launch-wizard" style="font-size: 0.75rem;">
                [+] Launch 4-Step Guided Exercise
              </button>
            </div>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        <!-- 3. Stepper Horizontal Grid -->
        <div class="stepper-nav-grid">
          ${STEPS_DATA.map(step => {
            const isDone = step.checkCompletion(state);
            const isActive = step.id === activeStepId;
            return `
              <button class="stepper-step-pill ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" data-step-id="${step.id}">
                <div class="step-pill-top">
                  <span class="step-pill-idx">[0${step.id}]</span>
                  <span class="step-pill-status ${isDone ? 'status-done' : (isActive ? 'status-current' : 'status-todo')}">
                    ${isDone ? '[DONE]' : (isActive ? '[CURRENT]' : '[TODO]')}
                  </span>
                </div>
                <div class="step-pill-name">${step.shortName}</div>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 4. Active Step Detailed Deep-Dive -->
        <div class="guide-step-card">
          <div class="guide-step-header">
            <div class="guide-header-text">
              <span class="guide-step-tagline">${activeStep.kicker}</span>
              <h2 class="guide-step-heading">${activeStep.title}</h2>
              <p class="guide-step-sub">${activeStep.subtitle}</p>
            </div>
            <div>
              <button class="btn btn-primary" id="btn-step-action-header">
                ${activeStep.toolActionLabel}
              </button>
            </div>
          </div>

          <div class="guide-step-body">
            <!-- Left Column: Why & Tasks -->
            <div class="guide-column">
              <div class="guide-section-block">
                <span class="guide-block-title">WHY THIS MATTERS</span>
                <p class="guide-text">${activeStep.why}</p>
              </div>

              <!-- Warning Callout -->
              <div class="guide-callout-warning">
                <span class="callout-title">TRAP // ${activeStep.trapTitle}</span>
                <p class="callout-body">${activeStep.trapBody}</p>
              </div>

              <div class="guide-section-block">
                <span class="guide-block-title">${activeStep.actionHeader}</span>
                <ol style="margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  ${activeStep.actionSteps.map(s => `<li class="guide-text" style="color: var(--text-primary); font-size: 0.9rem;">${s}</li>`).join('')}
                </ol>
              </div>
            </div>

            <!-- Right Column: Example & Copyable Templates -->
            <div class="guide-column">
              <div class="guide-section-block">
                <span class="guide-block-title">REFERENCE / TEMPLATE</span>
                <div class="guide-callout-example">
                  <span class="example-tag">${activeStep.exampleTitle}</span>
                  <div class="example-content">
                    <button class="copy-btn-inline" id="btn-copy-example">COPY</button>
                    ${escapeHtml(activeStep.exampleText)}
                  </div>
                </div>
              </div>

              <div class="guide-section-block" style="background: var(--bg-surface-elevated); padding: 1.25rem; border: 1px solid var(--border-default);">
                <button class="btn btn-primary" id="btn-step-action-body" style="width: 100%;">
                  ${activeStep.toolActionLabel} &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Step Footer Navigation -->
          <div class="guide-step-footer">
            <div class="guide-step-status-toggle">
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
                STATUS:
              </span>
              <span class="badge ${activeStep.checkCompletion(state) ? 'badge-primary' : 'badge-neutral'}" style="font-family: var(--font-mono);">
                ${activeStep.checkCompletion(state) ? '[COMPLETE]' : '[INCOMPLETE]'}
              </span>
            </div>

            <div class="guide-nav-buttons">
              <button class="btn btn-secondary btn-sm" id="btn-prev-step" ${activeStep.id === 1 ? 'disabled' : ''}>
                &larr; Prev
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-next-step" ${activeStep.id === STEPS_DATA.length ? 'disabled' : ''}>
                Next &rarr;
              </button>
            </div>
          </div>
        </div>

        <!-- 5. Founder "Where Are You Stuck?" Troubleshooter -->
        <div class="troubleshooter-section">
          <div class="troubleshooter-header">
            <span class="guide-step-tagline">DIAGNOSTIC</span>
            <h3 class="troubleshooter-title">Where are you stuck?</h3>
          </div>

          <div class="troubleshooter-grid">
            <div class="trouble-card">
              <h4 class="trouble-q">"Who do I sell to?"</h4>
              <p class="trouble-a">Stop asking who could use this. Ask who loses their job or wastes 10 hours a week without it.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="2">Step 02: Audiences &rarr;</button>
              </div>
            </div>

            <div class="trouble-card">
              <h4 class="trouble-q">"People say 'sounds cool' but don't buy."</h4>
              <p class="trouble-a">Compliments are polite passes. Ask how they solved this last Tuesday and what it cost.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="6">Step 06: Questions &rarr;</button>
              </div>
            </div>

            <div class="trouble-card">
              <h4 class="trouble-q">"Zero cold email replies."</h4>
              <p class="trouble-a">Your email is too long and pitches a demo. Ask a 45-word peer question about their workflow instead.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="5">Step 05: 45-Word Touch &rarr;</button>
              </div>
            </div>

            <div class="trouble-card">
              <h4 class="trouble-q">"Need more features before launching."</h4>
              <p class="trouble-a">More features reduce conversion by confusing buyers. Cut down to a 1-feature wedge.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="3">Step 03: Wedge &rarr;</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    bindEvents(activeStep);
  }

  function bindEvents(activeStep) {
    // Stepper buttons
    container.querySelectorAll('.stepper-step-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeStepId = parseInt(btn.dataset.stepId, 10);
        render();
      });
    });

    // Jump step buttons from troubleshooter
    container.querySelectorAll('[data-jump-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeStepId = parseInt(btn.dataset.jumpStep, 10);
        render();
        container.querySelector('.guide-step-card')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Execute direct tool action buttons
    const triggerToolAction = () => {
      if (activeStep.targetTab) {
        onNavigateTab(activeStep.targetTab);
      }
    };

    container.getElementById('btn-next-step-direct')?.addEventListener('click', triggerToolAction);
    container.getElementById('btn-step-action-header')?.addEventListener('click', triggerToolAction);
    container.getElementById('btn-step-action-body')?.addEventListener('click', triggerToolAction);

    // Launch exercise modal
    container.getElementById('btn-guide-launch-wizard')?.addEventListener('click', () => {
      onLaunchExercise();
    });

    // Copy example button
    container.getElementById('btn-copy-example')?.addEventListener('click', (e) => {
      navigator.clipboard.writeText(activeStep.exampleText).then(() => {
        const btn = e.target;
        btn.textContent = 'COPIED!';
        setTimeout(() => { btn.textContent = 'COPY'; }, 1800);
      });
    });

    // Next / Prev step navigation
    container.getElementById('btn-prev-step')?.addEventListener('click', () => {
      if (activeStepId > 1) {
        activeStepId--;
        render();
      }
    });

    container.getElementById('btn-next-step')?.addEventListener('click', () => {
      if (activeStepId < STEPS_DATA.length) {
        activeStepId++;
        render();
      }
    });
  }

  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
