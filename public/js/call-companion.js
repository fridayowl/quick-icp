// ==========================================================
// GAMIFIED CALL COMPANION & CONVERSATION SIMULATOR
// Provides interactive step-by-step call navigation, 1-tap note
// snapping (zero typing fatigue), live Mom-Test coaching, XP rewards,
// and a virtual practice partner for founders.
// ==========================================================

import { api } from './api.js';
import { addXp, getGamificationState, getCurrentLevel, LEVELS, QUESTS, BADGES, markQuestCompleted, awardBadge } from './gamification-store.js';

// Practice Personas for Simulator
const SIMULATOR_PERSONAS = [
  {
    id: 'persona_sarah',
    name: 'Sarah Miller',
    role: 'Managing Director, Boutique Marketing Agency (12 people)',
    avatar: '🧑‍💼',
    context: 'Agency delivers client performance reports every Friday. Team spends 8+ hours manually copying CSVs from Meta, Google, and Stripe into Excel.',
    wedgeResonance: '1-Click PDF to White-label Report Export',
    script: [
      {
        speaker: 'Sarah',
        text: "Hey! Thanks for setting this up. I only have about 15 minutes before our all-hands, but curious what you wanted to chat about?",
        options: [
          {
            type: 'bad',
            text: "We built an all-in-one AI platform with 15 automation features. Can I show you a 10-minute demo?",
            reply: "Honestly, we get 5 cold demo requests a day and our schedule is packed. We already use HubSpot and Notion.",
            feedback: "🚨 You pitched your product! The prospect backed away. Always ask about their current workflow first.",
            xp: 0
          },
          {
            type: 'good',
            text: "Thanks for making time Sarah! I'm doing research on how boutique agencies handle weekly client reporting. How does your team tackle that today?",
            reply: "Oh god, don't remind me. It's Friday right now and two of my account directors are currently drowning in CSV exports. We literally spend half of every Friday manually matching numbers into Google Slides.",
            feedback: "🎯 Mom Test Master! You asked about their actual workflow. Ugly manual agony uncovered!",
            xp: 50,
            signal: { pain: 5, workaround: 'Manual Google Slides & CSV exports', quote: 'Two of my account directors are currently drowning in CSV exports on Fridays.' }
          }
        ]
      },
      {
        speaker: 'Sarah',
        text: "We tried Zapier a while back, but the formatting kept breaking and client charts looked embarrassing. So we reverted to doing it by hand.",
        options: [
          {
            type: 'bad',
            text: "Our tool has an advanced visual workflow builder that connects to 400 integrations. Would you sign up for an annual contract?",
            reply: "I really don't want to learn another complex software tool right now. We need fewer logins, not more.",
            feedback: "🚨 Feature overload! They asked for simplicity, you pitched complexity.",
            xp: 0
          },
          {
            type: 'good',
            text: "When that Zapier setup broke, what did that actually cost the agency in lost time or client frustration?",
            reply: "One client noticed misaligned numbers on an invoice and delayed payment for 3 weeks. If someone could just give me a button that outputs clean, verified client summaries, I'd pay $200 a month with my eyes closed.",
            feedback: "💰 WTP & Dollar Anchor Unlocked! The prospect volunteered an exact price ($200/mo) and operational consequence.",
            xp: 100,
            signal: { wtp: '$200 / month', wedgeResonance: '1-Click Verified Client Summary Export', quote: 'If someone could just give me a button that outputs clean verified summaries, I\'d pay $200/mo with my eyes closed.' }
          }
        ]
      },
      {
        speaker: 'Sarah',
        text: "Do you guys have something simple we could test for our Friday reporting run next week?",
        options: [
          {
            type: 'good',
            text: "We have an early alpha specifically focused on just that 1 export. If I set up a test with your CSV format for next Friday, would you test it?",
            reply: "Yes, absolutely. Send me a calendar invite for Thursday afternoon and I'll have our lead account manager join too.",
            feedback: "🏆 Victory! Design Partner Alpha secured. ICP Cohort validated!",
            xp: 100,
            signal: { outcome: 'validated', nextStep: 'Alpha Demo Thursday' }
          }
        ]
      }
    ]
  },
  {
    id: 'persona_david',
    name: 'David Zhang',
    role: 'VP of Engineering, Series A FinTech',
    avatar: '👨‍💻',
    context: 'Engineering team has Postgres webhooks silently failing to sync customer events to HubSpot CRM, causing lost enterprise trials.',
    wedgeResonance: 'Dead Letter Queue Slack Alerter',
    script: [
      {
        speaker: 'David',
        text: "Hey, saw your note about database sync reliability. We're an engineering team, so we're pretty cynical about sales pitches, but what's your angle?",
        options: [
          {
            type: 'bad',
            text: "We are an AI-powered next-gen enterprise data orchestrator with unified governance!",
            reply: "Yeah, sounds like marketing buzzwords. We already have Kafka and Datadog.",
            feedback: "🚨 Buzzword trap! Engineers run away from vague marketing speak.",
            xp: 0
          },
          {
            type: 'good',
            text: "No sales pitch David. Curious: when production Postgres webhooks fail or drop silently, how does your on-call team catch it today?",
            reply: "Honestly, right now we only catch it when our Sales VP pings us on Slack complaining that a customer didn't receive their onboarding email. It's mortifying.",
            feedback: "🎯 Bullseye! The customer admitted their embarrassing failure mode.",
            xp: 50,
            signal: { pain: 4, workaround: 'Caught by Sales VP complaining in Slack', quote: 'We only catch it when our Sales VP pings us complaining that a customer didn\'t get their email.' }
          }
        ]
      },
      {
        speaker: 'David',
        text: "We thought about building an internal dead-letter queue, but engineering roadmap is completely committed to the core payment API this quarter.",
        options: [
          {
            type: 'good',
            text: "If you had a standalone webhook dead-letter queue that alerted your Slack immediately with 1-click replay, would that solve the headache?",
            reply: "Literally that is all we need. We don't want a full CRM, just that exact alerter. I'd pay $300 a month out of my infrastructure budget tomorrow to stop getting pinged by sales.",
            feedback: "💎 1-Feature Wedge Verified! No bloat, pure willingness to pay.",
            xp: 100,
            signal: { wtp: '$300 / month', wedgeResonance: 'Dead Letter Queue Slack Alerter', discarded: 'Full CRM sync, custom visual query builder' }
          }
        ]
      }
    ]
  }
];

export function setupCallCompanion(dialogEl, leads = [], onSaved = () => {}) {
  let currentMode = 'companion'; // 'companion' or 'simulator'
  let currentLead = null;
  let activeRound = 1;

  // Active call live signals captured
  let callSession = {
    painSeverity: 4,
    workarounds: [],
    wedgeReaction: 'neutral',
    discardedBloat: [],
    wtpBudget: '',
    quotes: [],
    sessionXp: 0,
    signalsCount: 0
  };

  // Simulator State
  let simPersona = SIMULATOR_PERSONAS[0];
  let simStep = 0;
  let simChatLog = [];

  function render() {
    const gameState = getGamificationState();
    const level = getCurrentLevel(gameState.xp);
    const xpPercent = Math.min(Math.round(((gameState.xp - level.minXp) / (level.maxXp - level.minXp)) * 100), 100);

    dialogEl.innerHTML = `
      <div class="modal-header companion-header">
        <div class="companion-brand-row">
          <div class="companion-title-group">
            <div class="modal-kicker">DISCOVERY GAME ENGINE // MOM-TEST PROTOCOL</div>
            <h3 id="companion-main-title">${currentMode === 'companion' ? 'Live Discovery Call Companion' : 'Interactive Conversation Simulator'}</h3>
          </div>
          <button class="modal-close-btn" id="btn-close-companion" aria-label="Close dialog">&times;</button>
        </div>

        <!-- Mode Switcher & Gamification Level Bar -->
        <div class="companion-telemetry-row">
          <div class="companion-mode-tabs">
            <button class="companion-mode-tab ${currentMode === 'companion' ? 'active' : ''}" id="tab-mode-companion">
              [01] Live Call Deck
            </button>
            <button class="companion-mode-tab ${currentMode === 'simulator' ? 'active' : ''}" id="tab-mode-simulator">
              [02] Practice Simulator
            </button>
          </div>

          <div class="companion-gamify-badge" title="Your Founder Level based on verified discovery signals">
            <span class="game-badge-lvl">LVL ${level.level}: ${level.title}</span>
            <div class="game-xp-track">
              <div class="game-xp-bar" style="width: ${xpPercent}%;"></div>
            </div>
            <span class="game-xp-nums">${gameState.xp} / ${level.maxXp} XP</span>
            <span class="game-streak-pill">🔥 ${gameState.streak} STREAK</span>
          </div>
        </div>
      </div>

      <div class="modal-body companion-body">
        ${currentMode === 'companion' ? renderCompanionMode(gameState) : renderSimulatorMode(gameState)}
      </div>

      <div class="modal-footer companion-footer">
        <div class="companion-footer-left">
          <span class="session-xp-counter" id="live-session-xp">+${callSession.sessionXp} XP EARNED THIS SESSION</span>
        </div>
        <div class="companion-footer-actions">
          <button class="btn btn-secondary btn-sm" id="btn-cancel-companion">Cancel</button>
          ${currentMode === 'companion' 
            ? `<button class="btn btn-primary btn-sm" id="btn-finish-call">Finish Call & Bank XP &rarr;</button>`
            : `<button class="btn btn-secondary btn-sm" id="btn-reset-sim">Restart Practice</button>`
          }
        </div>
      </div>
    `;

    bindEvents();
  }

  // Render Mode 1: Live Call Companion
  function renderCompanionMode(gameState) {
    const leadName = currentLead ? `${currentLead.name} (${currentLead.company})` : 'Prospective Customer';

    return `
      <div class="companion-workspace-grid">
        <!-- Left: 4-Round Interactive Conversation Deck -->
        <div class="deck-column">
          <!-- Lead Selector Header -->
          <div class="companion-lead-bar">
            <span class="lead-bar-label">INTERVIEWING:</span>
            <strong class="lead-bar-name">${leadName}</strong>
            ${leads.length > 0 ? `
              <select class="form-select form-select-sm" id="companion-lead-select" style="max-width: 200px; margin-left: auto;">
                ${leads.map(l => `<option value="${l.id}" ${currentLead?.id === l.id ? 'selected' : ''}>${l.name} (${l.company})</option>`).join('')}
              </select>
            ` : ''}
          </div>

          <!-- Round Navigation Tabs -->
          <div class="round-stepper-strip">
            <button class="round-step-btn ${activeRound === 1 ? 'active' : ''}" data-round="1">
              <span class="r-idx">01</span> Context
            </button>
            <button class="round-step-btn ${activeRound === 2 ? 'active' : ''}" data-round="2">
              <span class="r-idx">02</span> Pain & Hack
            </button>
            <button class="round-step-btn ${activeRound === 3 ? 'active' : ''}" data-round="3">
              <span class="r-idx">03</span> Wedge Test
            </button>
            <button class="round-step-btn ${activeRound === 4 ? 'active' : ''}" data-round="4">
              <span class="r-idx">04</span> Budget & WTP
            </button>
          </div>

          <!-- Current Active Round Card -->
          <div class="round-card-container">
            ${renderRoundContent(activeRound)}
          </div>
        </div>

        <!-- Right: Real-time Notes & Live Signal Ledger -->
        <div class="ledger-column">
          <div class="ledger-header">
            <span class="ledger-title">LIVE SIGNAL LEDGER</span>
            <span class="ledger-count">${callSession.signalsCount} SIGNALS CAPTURED</span>
          </div>

          <!-- 1-Tap Quick Capture Strip -->
          <div class="quick-quote-box">
            <label class="form-label" style="font-size: 0.8rem;">
              <span>Capture Verbatim Gold</span>
              <span class="label-aside">[+40 XP]</span>
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="form-input form-input-sm" id="inp-quick-quote" placeholder="Type verbatim sentence they said...">
              <button class="btn btn-primary btn-sm" id="btn-add-quote" style="white-space: nowrap;">+ Log Quote</button>
            </div>
            
            <!-- Quick Quote Shortcut Chips -->
            <div class="quote-shortcut-strip">
              <span class="quote-chip" data-quote="We spend 8 hours every Friday manually doing this.">"8 hrs every Friday"</span>
              <span class="quote-chip" data-quote="Current tool is too bloated and expensive.">"Too bloated & expensive"</span>
              <span class="quote-chip" data-quote="If you fix this, I will pay today.">"Will pay today"</span>
            </div>
          </div>

          <!-- Structured Summary Card (Auto Generated in Real Time) -->
          <div class="live-notes-card">
            <div class="notes-block">
              <span class="notes-label">PAIN SEVERITY:</span>
              <span class="notes-val" id="disp-pain-score">${callSession.painSeverity} / 5</span>
            </div>

            <div class="notes-block">
              <span class="notes-label">WORKAROUND IDENTIFIED:</span>
              <div class="notes-tags-row" id="disp-workarounds">
                ${callSession.workarounds.length > 0 
                  ? callSession.workarounds.map(w => `<span class="signal-tag">${w}</span>`).join('') 
                  : '<span class="empty-note-text">None logged yet</span>'
                }
              </div>
            </div>

            <div class="notes-block">
              <span class="notes-label">THE 1-FEATURE WEDGE:</span>
              <span class="notes-val" id="disp-wedge-reaction">${callSession.wedgeReaction.toUpperCase()}</span>
            </div>

            <div class="notes-block">
              <span class="notes-label">DISCARDED BLOAT (Do Not Build):</span>
              <div class="notes-tags-row" id="disp-discarded">
                ${callSession.discardedBloat.length > 0 
                  ? callSession.discardedBloat.map(d => `<span class="signal-tag tag-discarded">${d}</span>`).join('') 
                  : '<span class="empty-note-text">None flagged</span>'
                }
              </div>
            </div>

            <div class="notes-block">
              <span class="notes-label">VERBATIM QUOTES:</span>
              <div class="quotes-list-box" id="disp-quotes-list">
                ${callSession.quotes.length > 0
                  ? callSession.quotes.map(q => `<div class="quote-item">&ldquo;${q}&rdquo;</div>`).join('')
                  : '<span class="empty-note-text">Capture gold nuggets above</span>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render Content for Round 1 to 4
  function renderRoundContent(round) {
    if (round === 1) {
      return `
        <div class="round-card">
          <div class="round-kicker">ROUND 01 // CONTEXT (0 - 3 MINS)</div>
          <h4 class="round-script-heading">&ldquo;How does your team currently handle this daily?&rdquo;</h4>

          <div class="signal-button-grid">
            <span class="grid-label">TEAM SIZE (+25 XP):</span>
            <div class="chips-container">
              <button class="chip-action-btn" data-type="context" data-val="Solo Founder / 1-5 Team">1 - 5</button>
              <button class="chip-action-btn" data-type="context" data-val="Growing Team (5-25)">5 - 25</button>
              <button class="chip-action-btn" data-type="context" data-val="Mid-Market (25-100)">25 - 100</button>
              <button class="chip-action-btn" data-type="context" data-val="Enterprise (100+)">100+</button>
            </div>
          </div>

          <div class="round-next-row">
            <button class="btn btn-secondary btn-sm" id="btn-next-round-2">Round 2: Pain &rarr;</button>
          </div>
        </div>
      `;
    }

    if (round === 2) {
      return `
        <div class="round-card">
          <div class="round-kicker">ROUND 02 // FRICTION (3 - 8 MINS)</div>
          <h4 class="round-script-heading">&ldquo;When was the last time that broke? What did you do to fix it?&rdquo;</h4>

          <div class="signal-button-grid">
            <span class="grid-label">PAIN SEVERITY (+40 XP):</span>
            <div class="chips-container">
              <button class="chip-action-btn ${callSession.painSeverity === 5 ? 'selected' : ''}" data-type="pain" data-val="5">🔥 Hair-on-Fire (5/5)</button>
              <button class="chip-action-btn ${callSession.painSeverity === 4 ? 'selected' : ''}" data-type="pain" data-val="4">⚡ Severe (4/5)</button>
              <button class="chip-action-btn ${callSession.painSeverity === 3 ? 'selected' : ''}" data-type="pain" data-val="3">⚠️ Annoying (3/5)</button>
              <button class="chip-action-btn ${callSession.painSeverity <= 2 ? 'selected' : ''}" data-type="pain" data-val="2">🤷 Mild (2/5)</button>
            </div>
          </div>

          <div class="signal-button-grid" style="margin-top: 1rem;">
            <span class="grid-label">EXISTING WORKAROUND (+50 XP):</span>
            <div class="chips-container">
              <button class="chip-action-btn" data-type="workaround" data-val="Excel & Google Sheets">Excel / Sheets</button>
              <button class="chip-action-btn" data-type="workaround" data-val="Manual Copy-Paste">Manual Tasks</button>
              <button class="chip-action-btn" data-type="workaround" data-val="Custom Zapier / Python Script">Custom Scripts</button>
              <button class="chip-action-btn" data-type="workaround" data-val="Hired VA or Contractor">Contractors</button>
              <button class="chip-action-btn" data-type="workaround" data-val="Competitor Tool (Overpriced)">Competitor Tool</button>
            </div>
          </div>

          <div class="round-next-row">
            <button class="btn btn-secondary btn-sm" id="btn-next-round-3">Round 3: Wedge &rarr;</button>
          </div>
        </div>
      `;
    }

    if (round === 3) {
      return `
        <div class="round-card">
          <div class="round-kicker">ROUND 03 // 1-FEATURE WEDGE (8 - 12 MINS)</div>
          <h4 class="round-script-heading">&ldquo;If you could solve only ONE friction tomorrow, which matters most?&rdquo;</h4>

          <div class="signal-button-grid">
            <span class="grid-label">WEDGE REACTION (+50 XP):</span>
            <div class="chips-container">
              <button class="chip-action-btn ${callSession.wedgeReaction === 'resonated' ? 'selected' : ''}" data-type="wedge" data-val="resonated">🔥 Loved It</button>
              <button class="chip-action-btn ${callSession.wedgeReaction === 'neutral' ? 'selected' : ''}" data-type="wedge" data-val="neutral">😐 Lukewarm</button>
              <button class="chip-action-btn ${callSession.wedgeReaction === 'rejected' ? 'selected' : ''}" data-type="wedge" data-val="rejected">❌ Didn't Care</button>
            </div>
          </div>

          <div class="signal-button-grid" style="margin-top: 1rem;">
            <span class="grid-label">FLAG BLOAT (Confirmed Not Needed) (+50 XP):</span>
            <div class="chips-container">
              <button class="chip-action-btn" data-type="bloat" data-val="No Dashboards Needed">No Dashboards</button>
              <button class="chip-action-btn" data-type="bloat" data-val="No AI Automation Needed">No AI</button>
              <button class="chip-action-btn" data-type="bloat" data-val="No Team Collaboration">No Multi-user</button>
              <button class="chip-action-btn" data-type="bloat" data-val="No Mobile App">No Mobile App</button>
            </div>
          </div>

          <div class="round-next-row">
            <button class="btn btn-secondary btn-sm" id="btn-next-round-4">Round 4: Commitment &rarr;</button>
          </div>
        </div>
      `;
    }

    if (round === 4) {
      return `
        <div class="round-card">
          <div class="round-kicker">ROUND 04 // COMMITMENT & WTP (12 - 15 MINS)</div>
          <h4 class="round-script-heading">&ldquo;We're building an early alpha for this 1 piece. Want to test it next week?&rdquo;</h4>

          <div class="signal-button-grid">
            <span class="grid-label">COMMITMENT (+100 XP):</span>
            <div class="chips-container">
              <button class="chip-action-btn" data-type="wtp" data-val="$100 - $300 / mo (High WTP)">💰 $100 - $300 / mo</button>
              <button class="chip-action-btn" data-type="wtp" data-val="$50 - $100 / mo (Standard)">💰 $50 - $100 / mo</button>
              <button class="chip-action-btn" data-type="wtp" data-val="Alpha Partner (Free Beta)">🤝 Free Alpha Partner</button>
              <button class="chip-action-btn" data-type="wtp" data-val="No Budget / Politely Passed">👋 Passed / No Budget</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Render Mode 2: Interactive Practice Simulator
  function renderSimulatorMode(gameState) {
    const currentExchange = simPersona.script[simStep] || null;

    return `
      <div class="simulator-workspace-grid">
        <!-- Left: Persona Info & Controls -->
        <div class="sim-persona-panel">
          <div class="sim-persona-card">
            <div class="sim-avatar">${simPersona.avatar}</div>
            <div class="sim-name">${simPersona.name}</div>
            <div class="sim-role">${simPersona.role}</div>
            <p class="sim-context">${simPersona.context}</p>
          </div>

          <div class="sim-switch-box">
            <label class="form-label" style="font-size: 0.75rem;">CHOOSE PRACTICE PERSONA:</label>
            <div class="sim-persona-picker">
              ${SIMULATOR_PERSONAS.map(p => `
                <button class="sim-picker-btn ${simPersona.id === p.id ? 'active' : ''}" data-pid="${p.id}">
                  ${p.avatar} ${p.name.split(' ')[0]} (${p.role.split(',')[0]})
                </button>
              `).join('')}
            </div>
          </div>

          <div class="sim-mom-test-rules">
            <div class="rule-title">MOM-TEST PRACTICE RULES:</div>
            <ul class="rule-list">
              <li>❌ Don't pitch your 15 features</li>
              <li>✅ Ask about past behavior & workflow</li>
              <li>✅ Uncover the manual hack & price anchor</li>
            </ul>
          </div>
        </div>

        <!-- Right: Interactive Conversation Stage -->
        <div class="sim-stage-panel">
          <!-- Chat History -->
          <div class="sim-chat-window" id="sim-chat-box">
            ${simChatLog.map(msg => `
              <div class="sim-bubble-row ${msg.sender === 'user' ? 'user-row' : 'persona-row'}">
                <div class="sim-bubble ${msg.sender === 'user' ? 'user-bubble' : 'persona-bubble'}">
                  <div class="bubble-speaker">${msg.sender === 'user' ? 'YOU (FOUNDER)' : simPersona.name.toUpperCase()}</div>
                  <div class="bubble-text">${msg.text}</div>
                </div>
              </div>
              ${msg.feedback ? `
                <div class="sim-feedback-card ${msg.xp > 0 ? 'good-feedback' : 'bad-feedback'}">
                  <span class="feedback-xp">${msg.xp > 0 ? `+${msg.xp} XP` : '0 XP'}</span>
                  <span class="feedback-body">${msg.feedback}</span>
                </div>
              ` : ''}
            `).join('')}

            ${currentExchange ? `
              <div class="sim-bubble-row persona-row">
                <div class="sim-bubble persona-bubble">
                  <div class="bubble-speaker">${simPersona.name.toUpperCase()}</div>
                  <div class="bubble-text">${currentExchange.text}</div>
                </div>
              </div>
            ` : `
              <div class="sim-completion-card">
                <div style="font-size: 2rem;">🏆</div>
                <h4>Practice Session Complete!</h4>
                <p>You navigated the discovery conversation without pitching and uncovered verified pain!</p>
                <button class="btn btn-primary btn-sm" id="btn-restart-sim-inside">Practice Again with Another Persona</button>
              </div>
            `}
          </div>

          <!-- Question Options Tray -->
          ${currentExchange ? `
            <div class="sim-options-tray">
              <div class="tray-label">HOW DO YOU RESPOND TO ${simPersona.name.split(' ')[0].toUpperCase()}?</div>
              <div class="options-list">
                ${currentExchange.options.map((opt, idx) => `
                  <button class="sim-option-btn" data-opt-idx="${idx}">
                    <span class="opt-bullet">[OPTION ${String.fromCharCode(65 + idx)}]</span>
                    <span class="opt-text">&ldquo;${opt.text}&rdquo;</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Bind all interactive events
  function bindEvents() {
    // Dialog close
    dialogEl.querySelector('#btn-close-companion')?.addEventListener('click', () => dialogEl.close());
    dialogEl.querySelector('#btn-cancel-companion')?.addEventListener('click', () => dialogEl.close());

    // Mode tabs
    dialogEl.querySelector('#tab-mode-companion')?.addEventListener('click', () => {
      currentMode = 'companion';
      render();
    });

    dialogEl.querySelector('#tab-mode-simulator')?.addEventListener('click', () => {
      currentMode = 'simulator';
      render();
    });

    // Round stepper
    dialogEl.querySelectorAll('.round-step-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeRound = parseInt(e.currentTarget.dataset.round, 10);
        render();
      });
    });

    dialogEl.querySelector('#btn-next-round-2')?.addEventListener('click', () => { activeRound = 2; render(); });
    dialogEl.querySelector('#btn-next-round-3')?.addEventListener('click', () => { activeRound = 3; render(); });
    dialogEl.querySelector('#btn-next-round-4')?.addEventListener('click', () => { activeRound = 4; render(); });

    // 1-Tap Chip Actions (Mode 1)
    dialogEl.querySelectorAll('.chip-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        const val = e.currentTarget.dataset.val;

        if (type === 'pain') {
          callSession.painSeverity = Number(val);
          callSession.sessionXp += 40;
          callSession.signalsCount += 1;
        } else if (type === 'workaround') {
          if (!callSession.workarounds.includes(val)) {
            callSession.workarounds.push(val);
            callSession.sessionXp += 50;
            callSession.signalsCount += 1;
          }
        } else if (type === 'wedge') {
          callSession.wedgeReaction = val;
          callSession.sessionXp += 50;
          callSession.signalsCount += 1;
        } else if (type === 'bloat') {
          if (!callSession.discardedBloat.includes(val)) {
            callSession.discardedBloat.push(val);
            callSession.sessionXp += 50;
            callSession.signalsCount += 1;
          }
        } else if (type === 'wtp') {
          callSession.wtpBudget = val;
          callSession.sessionXp += 100;
          callSession.signalsCount += 1;
        } else if (type === 'context') {
          callSession.sessionXp += 25;
          callSession.signalsCount += 1;
        }

        render();
      });
    });

    // Quick Quote Add
    dialogEl.querySelector('#btn-add-quote')?.addEventListener('click', () => {
      const inp = dialogEl.querySelector('#inp-quick-quote');
      if (inp && inp.value.trim()) {
        callSession.quotes.push(inp.value.trim());
        callSession.sessionXp += 40;
        callSession.signalsCount += 1;
        inp.value = '';
        render();
      }
    });

    dialogEl.querySelectorAll('.quote-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const quote = e.currentTarget.dataset.quote;
        if (!callSession.quotes.includes(quote)) {
          callSession.quotes.push(quote);
          callSession.sessionXp += 40;
          callSession.signalsCount += 1;
          render();
        }
      });
    });

    // Lead select dropdown
    dialogEl.querySelector('#companion-lead-select')?.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const found = leads.find(l => l.id === selectedId);
      if (found) {
        currentLead = found;
        render();
      }
    });

    // Finish Call Button
    dialogEl.querySelector('#btn-finish-call')?.addEventListener('click', async () => {
      if (!currentLead && leads.length > 0) currentLead = leads[0];

      // Bank XP
      addXp(callSession.sessionXp, 'Completed Discovery Call');
      markQuestCompleted('quest_mom_test_intro');
      if (callSession.workarounds.length > 0) markQuestCompleted('quest_workaround_hunt');
      if (callSession.discardedBloat.length > 0) markQuestCompleted('quest_bloat_slayer');
      if (callSession.quotes.length > 0) markQuestCompleted('quest_quote_catcher');

      // Auto-compile clean notes
      if (currentLead) {
        const compiledNotes = {
          painSeverity: callSession.painSeverity,
          willingnessToPay: callSession.wtpBudget || '$150/mo',
          wedgeResonance: callSession.wedgeReaction === 'resonated' ? 'Strong Resonance' : 'Mixed / Low',
          discardedFeatures: callSession.discardedBloat.join(', ') || 'None flagged',
          verbatimQuotes: callSession.quotes.join(' // ') || 'Productive discovery conversation.',
          nextStage: callSession.painSeverity >= 4 ? 'validated' : 'call_completed',
          durationMinutes: 15
        };

        try {
          await api.saveCallNotes(currentLead.id, compiledNotes);
        } catch (err) {
          console.warn('API save error', err);
        }
      }

      dialogEl.close();
      onSaved();
      alert(`🎉 Discovery Call Logged!\n+${callSession.sessionXp} XP banked to your founder scorecard!`);
    });

    // Simulator Persona Picker
    dialogEl.querySelectorAll('.sim-picker-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.currentTarget.dataset.pid;
        const found = SIMULATOR_PERSONAS.find(p => p.id === pid);
        if (found) {
          simPersona = found;
          simStep = 0;
          simChatLog = [];
          render();
        }
      });
    });

    // Simulator Question Option Selection
    dialogEl.querySelectorAll('.sim-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const optIdx = parseInt(e.currentTarget.dataset.optIdx, 10);
        const currentExchange = simPersona.script[simStep];
        if (!currentExchange) return;

        const chosen = currentExchange.options[optIdx];
        if (!chosen) return;

        // Add user response
        simChatLog.push({
          sender: 'user',
          text: chosen.text
        });

        // Add persona response + feedback
        simChatLog.push({
          sender: 'persona',
          text: chosen.reply,
          feedback: chosen.feedback,
          xp: chosen.xp
        });

        if (chosen.xp > 0) {
          addXp(chosen.xp, 'Good Mom-Test Question');
        }

        simStep += 1;
        render();

        // Scroll chat to bottom
        setTimeout(() => {
          const chatBox = dialogEl.querySelector('#sim-chat-box');
          if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 50);
      });
    });

    dialogEl.querySelector('#btn-reset-sim')?.addEventListener('click', () => {
      simStep = 0;
      simChatLog = [];
      render();
    });

    dialogEl.querySelector('#btn-restart-sim-inside')?.addEventListener('click', () => {
      simStep = 0;
      simChatLog = [];
      render();
    });
  }

  return {
    open(lead = null, mode = 'companion') {
      currentLead = lead;
      currentMode = mode;
      activeRound = 1;
      callSession = {
        painSeverity: lead?.callNotes?.painSeverity || 4,
        workarounds: [],
        wedgeReaction: 'neutral',
        discardedBloat: [],
        wtpBudget: '',
        quotes: [],
        sessionXp: 50,
        signalsCount: 0
      };
      simStep = 0;
      simChatLog = [];

      render();
      dialogEl.showModal();
    }
  };
}
