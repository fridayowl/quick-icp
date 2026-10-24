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
    subtitle: 'Before you can find who wants your product, inventory what you actually built.',
    why: 'Founders build software by stacking features (auth, database sync, UI builder, webhook triggers, exports). When you try to explain all of this to a stranger, they get overwhelmed, think "sounds complicated", and ghost you. You cannot pick a sharp weapon until you lay all your tools on the table.',
    trapTitle: 'The "It Does Everything" Fallacy',
    trapBody: 'Pitching your product as a platform or all-in-one suite. Strangers do not want another platform; they want an aspirin for the exact headache that woke them up this morning.',
    actionHeader: 'YOUR EXACT TASK RIGHT NOW',
    actionSteps: [
      'Name your product and state in 1 sentence what it does without buzzwords.',
      'List 4 to 8 distinct features you have already built or designed.',
      'Rate each feature honestly: is it working today, in progress, or planned?'
    ],
    exampleTitle: 'Real B2B SaaS Example (SyncFlow)',
    exampleText: `Product: SyncFlow
Features Built:
1. Real-time PostgreSQL to Webhook pipeline
2. Visual drag-and-drop workflow canvas
3. Team permission roles & SSO
4. Automated retry queue with Dead Letter Alerts
5. Custom JavaScript data transformation blocks`,
    toolActionLabel: '[00] Open Product & Feature Catalog',
    targetTab: 'product',
    checkCompletion: (state) => (state.product?.features?.length || 0) >= 3
  },
  {
    id: 2,
    key: 'audiences',
    title: 'Brainstorm 2–3 Candidate Audiences',
    kicker: 'STEP 02 // AUDIENCE HYPOTHESES',
    shortName: 'Audiences',
    subtitle: 'Never bet your entire startup on one demographic guess. Test 3 in parallel.',
    why: 'An "ICP" (Ideal Customer Profile) is NOT an imaginary buyer persona with a stock photo and hobbies. It is a specific job title at a specific type of company who feels intense pain every Tuesday and has corporate credit card authority to fix it.',
    trapTitle: 'Targeting "Everyone" or "Small Businesses"',
    trapBody: '"Anyone who uses databases" is not an audience. If you target everyone, your marketing speaks to no one. You need someone whose boss yells at them when this problem happens.',
    actionHeader: 'THE AUDIENCE SPECIFICATION FORMULA',
    actionSteps: [
      'Fill in this sentence: "[Job Title] at [Company Stage] who is currently suffering because [Ugly Problem]."',
      'Identify their current ugly workaround: are they using messy spreadsheets, hacked Python scripts, or 10-person Slack channels?',
      'Create 2 to 3 candidate cohorts so you can compare real market pull side-by-side.'
    ],
    exampleTitle: 'The 3-Cohort Contrast Example',
    exampleText: `Cohort A: "FinTech Compliance Leads" (Problem: manual audit reconciliations taking 20 hours/month; Workaround: Shared Google Sheets)
Cohort B: "Solo SaaS Founders" (Problem: losing trial signups due to failed webhook syncs; Workaround: Manual Zapier scripts)
Cohort C: "Enterprise Data Platform Engineers" (Problem: custom ETL pipelines breaking on schema changes; Workaround: PagerDuty on-call)`,
    toolActionLabel: '[01] Launch Hypothesis Lab',
    targetTab: 'icp-lab',
    checkCompletion: (state) => (state.icps?.length || 0) >= 2
  },
  {
    id: 3,
    key: 'wedge',
    title: 'Cut 90% of Your Product (The 1-Feature Wedge)',
    kicker: 'STEP 03 // DE-ENGINEERING',
    shortName: '1-Feature Wedge',
    subtitle: 'Pick the single sharpest feature for each audience. Forbid the rest.',
    why: 'A wedge is a piece of wood that splits an oak log. Your full product is the log. The 1-Feature Wedge is the tip of the blade. When you pitch ONE specific capability that cures their acute pain, they immediately understand what you do.',
    trapTitle: 'Feature Vomiting on Discovery',
    trapBody: 'When founders get insecure, they start listing every feature they spent months coding: "Oh, it also does exports, and SSO, and custom webhooks, and dark mode!" The prospect thinks: "This looks bloated and hard to learn."',
    actionHeader: 'HOW TO DE-ENGINEER YOUR PRODUCT',
    actionSteps: [
      'Take Cohort A. Look at their #1 daily headache.',
      'Pick the ONE feature from your catalog that directly kills that headache. That is your WEDGE.',
      'Mark every other feature in your app as "FORBIDDEN TO MENTION" on initial discovery calls.'
    ],
    exampleTitle: 'Wedge De-Engineering Example',
    exampleText: `Product: SyncFlow (30,000 lines of code)
Cohort: FinTech Compliance Leads
The 1-Feature Wedge: "Audit-Ready Webhook Replay Log"
Forbidden to mention on Call 1: Visual drag-and-drop builder, custom JS transforms, multi-tenant billing.`,
    toolActionLabel: '[01] Assign Wedges in Hypothesis Lab',
    targetTab: 'icp-lab',
    checkCompletion: (state) => state.icps?.some(i => i.wedgeFeature && i.wedgeFeature.trim() !== '')
  },
  {
    id: 4,
    key: 'sourcing',
    title: 'Find 15 Real Human Beings per Cohort',
    kicker: 'STEP 04 // PROSPECT SOURCING',
    shortName: 'Source 15 People',
    subtitle: 'You do not need 10,000 leads. You need 15 target prospects to test truth.',
    why: 'Mass cold email blasting 5,000 people burns your domain and teaches you nothing. 15 hand-picked people with the exact job title who posted about your problem gives you 5 deep conversations in 48 hours.',
    trapTitle: 'Buying Low-Quality Contact Lists',
    trapBody: 'Buying scraped lead lists of 10,000 generic emails. 80% bounce, your domain gets blacklisted, and zero people reply.',
    actionHeader: 'WHERE TO FIND 15 TARGETS IN 30 MINUTES',
    actionSteps: [
      'LinkedIn Free Search: Type "[Target Title]" in quotes, filter by "People", "Current Company: 10-100 employees".',
      'GitHub / Open Source Issues: Look for people complaining about competitor tools or filing issues on similar open-source libraries.',
      'Slack / Discord / Subreddits: Check communities where practitioners ask "How do you guys handle [Problem]?"',
      'Add 15 targeted names into your Discovery Pipeline.'
    ],
    exampleTitle: 'Search Query Cheat Sheet',
    exampleText: `LinkedIn Search Filter:
Title: "Head of Compliance" OR "Lead Compliance Officer"
Industry: Financial Services / FinTech
Location: United States (or your home market)
Company Headcount: 20–200 employees`,
    toolActionLabel: '[02] Add Leads to Discovery Pipeline',
    targetTab: 'kanban',
    checkCompletion: (state) => (state.leads?.length || 0) >= 6
  },
  {
    id: 5,
    key: 'outreach',
    title: 'The 45-Word Peer Curiosity Email',
    kicker: 'STEP 05 // LOW-FRICTION DISCOVERY',
    shortName: '45-Word Touch',
    subtitle: 'Never pitch your software. Ask an authentic practitioner question.',
    why: 'People smell a sales pitch in 2 seconds and delete it. But when an engineer or founder asks a genuine, humble peer question about their workflow, practitioners love to share their war stories. The Mom Test principle: talk about their life, not your product.',
    trapTitle: 'The "15-Minute Demo Pitch"',
    trapBody: '"Hi John, I am the founder of X, an AI-powered platform for Y. Do you have 15 minutes this Thursday for a demo?" Reply rate: 0.2%. It asks for their time without offering any value.',
    actionHeader: 'THE 45-WORD MOM TEST TEMPLATE',
    actionSteps: [
      'Rule 1: Keep it under 50 words total.',
      'Rule 2: Never include a link, calendly, or attachment.',
      'Rule 3: Ask how they handle the friction today, never if they want to buy.',
      'Rule 4: When they reply, Quick ICP auto-kills all automated follow-ups so you can talk human-to-human.'
    ],
    exampleTitle: 'Copy-Paste Curiosity Template',
    exampleText: `Subject: Quick question about audit logs at {{company}}

Hi {{firstName}},

Saw you lead compliance at {{company}}. 

Quick question: when webhooks fail during customer reconciliations, are you guys tracking failures in spreadsheets or did you build an internal replay queue?

Doing some research on this workflow friction—curious how your team handles it.

Best,
{{my_name}}`,
    toolActionLabel: '[04] Open Safe Dispatcher & Templates',
    targetTab: 'dispatcher',
    checkCompletion: (state) => state.leads?.some(l => l.stage !== 'uncontacted')
  },
  {
    id: 6,
    key: 'discovery',
    title: 'Run a 15-Min Call & Kill or Double-Down',
    kicker: 'STEP 06 // CONVERSATION TO COMMITMENT',
    shortName: 'Call & Decision',
    subtitle: 'Never demo your app on Call 1. Listen for past pain and budget.',
    why: 'Compliments ("That sounds really cool!") are deadly lies. You want truth: Have they spent money on this? How much time did it waste last week? Will they introduce you to the person who signs the checks? If not, kill the ICP cohort quickly and move to the next one.',
    trapTitle: 'Opening Your Laptop and Demoing',
    trapBody: 'The moment you screenshare, the prospect shifts into "movie critic" mode. They give feature requests for things they will never pay for. Keep your laptop closed and ask diagnostic questions.',
    actionHeader: 'THE 5 DIAGNOSTIC MOM-TEST QUESTIONS',
    actionSteps: [
      '1. "Tell me about the last time [Problem] happened?" (Listen for specifics, not theories).',
      '2. "What did you do to fix it? What did that cost in time or money?" (Past behavior = truth).',
      '3. "What other tools have you tried? Why did you stop using them?"',
      '4. "Who else on your team gets paged when this breaks?"',
      '5. "If we had this fixed by next week, what is the next step to pilot it?"'
    ],
    exampleTitle: 'The Kill Criteria Checklist',
    exampleText: `Kill the ICP Cohort if:
- 15 contacts say "We don't really have that issue"
- They say "It's annoying, but not worth paying to fix"
- They are unwilling to commit 20 minutes to pilot

Double down on the ICP Cohort if:
- They say "Can I use this right now? I will pay with my credit card."
- They introduce you to their VP or Head of Finance within 24 hours.`,
    toolActionLabel: '[03] Open Unified Inbox & Call Analyzer',
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
                <span class="guide-block-title">Why this matters for a founder</span>
                <p class="guide-text">${activeStep.why}</p>
              </div>

              <!-- Warning Callout -->
              <div class="guide-callout-warning">
                <span class="callout-title">DANGER // ${activeStep.trapTitle}</span>
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
                <span class="guide-block-title">Concrete Reference / Copy-Paste Formula</span>
                <div class="guide-callout-example">
                  <span class="example-tag">${activeStep.exampleTitle}</span>
                  <div class="example-content">
                    <button class="copy-btn-inline" id="btn-copy-example">COPY</button>
                    ${escapeHtml(activeStep.exampleText)}
                  </div>
                </div>
              </div>

              <div class="guide-section-block" style="background: var(--bg-surface-elevated); padding: 1.25rem; border: 1px solid var(--border-default);">
                <span class="guide-block-title">Next Action Trigger</span>
                <p class="guide-text" style="margin-bottom: 1rem;">
                  Ready to complete this step? Jump directly into the workspace tool configured for this stage:
                </p>
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
                SYSTEM STATUS:
              </span>
              <span class="badge ${activeStep.checkCompletion(state) ? 'badge-primary' : 'badge-neutral'}" style="font-family: var(--font-mono);">
                ${activeStep.checkCompletion(state) ? '[AUTO-VERIFIED: COMPLETE]' : '[AWAITING FOUNDER ACTION]'}
              </span>
            </div>

            <div class="guide-nav-buttons">
              <button class="btn btn-secondary btn-sm" id="btn-prev-step" ${activeStep.id === 1 ? 'disabled' : ''}>
                &larr; Previous Step
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-next-step" ${activeStep.id === STEPS_DATA.length ? 'disabled' : ''}>
                Next Step &rarr;
              </button>
            </div>
          </div>
        </div>

        <!-- 5. Founder "Where Are You Stuck?" Troubleshooter -->
        <div class="troubleshooter-section">
          <div class="troubleshooter-header">
            <span class="guide-step-tagline">FOUNDER DIAGNOSTIC TOOL</span>
            <h3 class="troubleshooter-title">Where are you stuck right now?</h3>
            <p class="troubleshooter-sub">Click any common founder bottleneck to get the exact psychological diagnosis and immediate unlock.</p>
          </div>

          <div class="troubleshooter-grid">
            <div class="trouble-card">
              <h4 class="trouble-q">"I don't know who to sell to or who my customer is."</h4>
              <p class="trouble-a">You have a solution searching for a problem. Stop asking "who can use this?". Instead, ask: "Who is losing their job or wasting 10 hours a week if this isn't solved?" Test 3 cohorts in Step 02.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="2">Go to Step 02: Brainstorm Audiences &rarr;</button>
              </div>
            </div>

            <div class="trouble-card">
              <h4 class="trouble-q">"People on calls say 'sounds cool', but nobody buys."</h4>
              <p class="trouble-a">Compliments are worthless. They are being polite to get off the phone. Never ask if they like your idea. Ask: "How did you solve this last Tuesday? How much did that cost?" If they haven't spent money trying to fix it, they never will.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="6">View The 5 Mom-Test Call Questions &rarr;</button>
              </div>
            </div>

            <div class="trouble-card">
              <h4 class="trouble-q">"Nobody is replying to my cold emails."</h4>
              <p class="trouble-a">Your email is too long and asks for a 15-minute demo. Delete your pitch. Use a 45-word peer curiosity question asking how they manage their current friction. You will see replies jump from 1% to 25%+.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="5">Copy The 45-Word Email Template &rarr;</button>
              </div>
            </div>

            <div class="trouble-card">
              <h4 class="trouble-q">"I feel like I need to build 3 more features before launching."</h4>
              <p class="trouble-a">Classic founder avoidance trap. You are building software because writing code feels safe, while hearing "no" from a customer hurts. More features actually decrease conversion by confusing buyers. Cut to a 1-feature wedge today.</p>
              <div class="trouble-action">
                <button class="btn btn-secondary btn-sm" data-jump-step="3">Unbundle Your 1-Feature Wedge &rarr;</button>
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
