// Guided Step-by-Step ICP Building Exercise (From Scratch)
import { api } from './api.js';

export function setupIcpBuilderExercise(dialogEl, onCompleted) {
  let step = 1;
  let exerciseState = {
    productName: '',
    tagline: '',
    category: 'B2B Software',
    features: [],
    cohorts: [
      {
        name: '',
        targetRole: '',
        coreProblem: '',
        productWedge: '',
        discardedFeatures: '',
        touchSubject: '',
        touchBody: ''
      }
    ]
  };

  function render() {
    dialogEl.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="modal-kicker">STEP-BY-STEP WORKBOOK // START FROM SCRATCH</div>
          <h3>${getStepTitle()}</h3>
          <p>${getStepSubtitle()}</p>
        </div>
        <button class="modal-close-btn" id="close-exercise-x">&times;</button>
      </div>

      <!-- Exercise Progress Tracker -->
      <div class="wizard-steps-bar">
        <div class="wizard-step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}">
          <span class="step-num">[01]</span>
          <span class="step-name">Your Product</span>
        </div>
        <div class="wizard-step-divider"></div>
        <div class="wizard-step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}">
          <span class="step-num">[02]</span>
          <span class="step-name">Feature Dump</span>
        </div>
        <div class="wizard-step-divider"></div>
        <div class="wizard-step-node ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}">
          <span class="step-num">[03]</span>
          <span class="step-name">Candidate Audiences</span>
        </div>
        <div class="wizard-step-divider"></div>
        <div class="wizard-step-node ${step === 4 ? 'active' : ''}">
          <span class="step-num">[04]</span>
          <span class="step-name">Battle Cards</span>
        </div>
      </div>

      <div class="modal-body" style="padding: 1.75rem 2rem;">
        ${renderStepContent()}
      </div>

      <div class="modal-footer" style="padding: 1rem 2rem;">
        ${step > 1 ? `<button class="btn btn-secondary btn-sm" id="btn-ex-prev">&larr; Back</button>` : ''}
        <button class="btn btn-primary btn-sm" id="btn-ex-next">
          ${step === 4 ? 'Generate My Discovery Pipeline &rarr;' : 'Next Step &rarr;'}
        </button>
      </div>
    `;

    bindEvents();
  }

  function getStepTitle() {
    switch (step) {
      case 1: return 'Step 1 of 4: What is your product?';
      case 2: return 'Step 2 of 4: List everything you built';
      case 3: return 'Step 3 of 4: Unbundle into Candidate ICPs';
      case 4: return 'Step 4 of 4: Your Discovery Battle Cards';
      default: return 'ICP Building Exercise';
    }
  }

  function getStepSubtitle() {
    switch (step) {
      case 1: return 'Describe the software you built in plain English. No buzzwords, just the clear capability.';
      case 2: return 'Engineers always build too much. List down all features so we can de-engineer the bloat.';
      case 3: return 'For each audience, pick the SINGLE feature that solves their agonizing daily friction.';
      case 4: return 'Review what to pitch, what NOT to pitch, and your ready-to-send discovery touches.';
      default: return '';
    }
  }

  function renderStepContent() {
    if (step === 1) {
      return `
        <div class="exercise-card-prompt">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.95rem;">
            Every discovery exercise starts with your product baseline.
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
            Whether you built a solo side-project, an open-source tool, or a full SaaS, state what it is clearly.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label" for="ex-prod-name">Product Name</label>
          <input type="text" class="form-input" id="ex-prod-name" placeholder="e.g. SyncFlow, InvoiceFast, PRPreview..." value="${exerciseState.productName}">
        </div>

        <div class="form-group">
          <label class="form-label" for="ex-prod-tagline">What does it do in one plain sentence?</label>
          <input type="text" class="form-input" id="ex-prod-tagline" placeholder="e.g. We automatically sync Postgres production data to sales CRMs and generate weekly client decks." value="${exerciseState.tagline}">
          <span class="form-hint">Tip: Explain it like you're talking to a founder friend over coffee.</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="ex-prod-category">Product Space / Category</label>
          <input type="text" class="form-input" id="ex-prod-category" placeholder="e.g. Developer Tools, Marketing Automation, FinTech, E-Commerce..." value="${exerciseState.category}">
        </div>
      `;
    }

    if (step === 2) {
      return `
        <div class="exercise-card-prompt">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.95rem;">
            The Feature Dump (Don't hold back)
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
            Type every feature, integration, or screen you built into the box below and press <strong>Enter</strong>. We need to know the entire feature monolith to isolate the 10% wedges.
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <input type="text" class="form-input" id="ex-feat-input" placeholder="Type a feature name and press Enter (e.g. 1-Click Client Report PDF Export)..." style="flex: 1;">
          <button class="btn btn-primary btn-sm" id="btn-ex-add-feat">+ Add</button>
        </div>

        <!-- Quick Inspiration Chips -->
        <div style="margin-bottom: 1.25rem;">
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-tertiary);">OR CLICK TO ADD INSPIRATION:</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.35rem;">
            <button class="chip-suggestion" data-chip="1-Click White-Label Client Report Generator">+ Client Report Export</button>
            <button class="chip-suggestion" data-chip="Realtime Database to CRM Webhook Sync">+ Webhook Sync Bridge</button>
            <button class="chip-suggestion" data-chip="Zero-Chargeback Fraud Scoring Engine">+ Fraud Detection Engine</button>
            <button class="chip-suggestion" data-chip="Visual Drag-and-Drop Workflow Canvas">+ Visual Workflow Canvas</button>
            <button class="chip-suggestion" data-chip="Enterprise Single Sign-On (SSO) & RBAC">+ SAML/SSO & Permissions</button>
            <button class="chip-suggestion" data-chip="Custom Script Compute Sandbox Node">+ Custom Code Sandbox</button>
          </div>
        </div>

        <!-- Dumped Features List -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-tertiary);">FEATURES LOGGED (${exerciseState.features.length}):</span>
          ${exerciseState.features.length >= 3 ? `<span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--status-positive); font-weight: 700;">[SUFFICIENT FOR UNBUNDLING]</span>` : `<span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--terracotta);">[ADD AT LEAST 2-3 FEATURES]</span>`}
        </div>

        <div class="wiz-features-list" id="ex-features-container">
          ${exerciseState.features.map((f, i) => `
            <div class="wiz-feature-item">
              <span class="wiz-feat-index">[FEAT-0${i + 1}]</span>
              <span class="wiz-feat-name" style="flex: 1; margin: 0 0.75rem;">${f.name}</span>
              <button class="wiz-remove-feat ex-remove-feat" data-index="${i}">&times;</button>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (step === 3) {
      return `
        <div class="exercise-card-prompt">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.95rem;">
            The Unbundling Exercise: Who is in pain over ONE feature?
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
            Create 2 to 3 candidate customer profiles in parallel. For each, pick the single feature from your list they care about most.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;" id="cohorts-builder-container">
          ${exerciseState.cohorts.map((cohort, cIdx) => renderCohortCard(cohort, cIdx)).join('')}
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-add-cohort" style="margin-top: 1.25rem;">
          + Add Another Candidate Audience Hypothesis
        </button>
      `;
    }

    if (step === 4) {
      return `
        <div class="exercise-card-prompt">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem; font-size: 0.95rem;">
            Ready to Validate: Your Discovery Battle Cards
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
            Quick ICP has isolated your 1-feature wedges and locked away your product bloat. Review your discovery directives below.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem;">
          ${exerciseState.cohorts.map((c, idx) => {
            const discarded = exerciseState.features
              .filter(f => f.name.toLowerCase() !== (c.productWedge || '').toLowerCase())
              .map(f => f.name);

            return `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-default); border-left: 3px solid var(--terracotta); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: var(--shadow-hard-sm);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--terracotta); font-weight: 700;">[COHORT 0${idx + 1}] // TIER ${idx + 1}</span>
                  <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-tertiary);">READY TO DISPATCH</span>
                </div>

                <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${c.name || 'Unnamed Audience'}</div>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">Target: <strong>${c.targetRole || 'Operator'}</strong></div>

                <div style="background: var(--bg-canvas); padding: 0.75rem; border: 1px solid var(--border-hairline);">
                  <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--terracotta); font-weight: 700; margin-bottom: 0.25rem;">THE 1-FEATURE WEDGE:</div>
                  <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-primary);">${c.productWedge || 'No wedge selected'}</div>
                </div>

                <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
                  <strong style="color: var(--text-primary);">Operational Agony:</strong> ${c.coreProblem || 'Not specified'}
                </div>

                <div style="background: var(--bg-canvas); padding: 0.65rem 0.75rem; border: 1px dashed var(--border-strong); font-size: 0.72rem; color: var(--text-tertiary);">
                  <strong style="color: var(--status-danger);">Forbidden on Calls:</strong> ${discarded.slice(0, 3).join(', ')}${discarded.length > 3 ? ` (+${discarded.length - 3} more)` : ''}
                </div>

                <div style="margin-top: auto; padding-top: 0.5rem; border-top: 1px solid var(--border-hairline); font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-tertiary);">
                  Touch 01 Subject: "${c.touchSubject || `Quick question on ${c.name} workflow`}"
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  function renderCohortCard(cohort, cIdx) {
    return `
      <div class="cohort-exercise-card" data-index="${cIdx}" style="background: var(--bg-surface); border: 1px solid var(--border-default); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; box-shadow: var(--shadow-hard-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-hairline); padding-bottom: 0.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--terracotta);">
            [CANDIDATE COHORT 0${cIdx + 1}]
          </span>
          ${cIdx > 0 ? `<button class="btn btn-secondary btn-sm remove-cohort-btn" data-index="${cIdx}" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;">Remove</button>` : ''}
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Audience Name</label>
            <input type="text" class="form-input cohort-name-input" data-index="${cIdx}" placeholder="e.g. Boutique Performance Agencies" value="${cohort.name}">
          </div>
          <div class="form-group">
            <label class="form-label">Target Role / Title</label>
            <input type="text" class="form-input cohort-role-input" data-index="${cIdx}" placeholder="e.g. Agency Owner / Head of Client Ops" value="${cohort.targetRole}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span>The 1-Feature Wedge</span>
            <span class="label-aside">[Pick from your Step 2 Feature List]</span>
          </label>
          <select class="form-select cohort-wedge-select" data-index="${cIdx}">
            <option value="">-- Choose which single feature this audience needs --</option>
            ${exerciseState.features.map(f => `
              <option value="${f.name}" ${f.name === cohort.productWedge ? 'selected' : ''}>${f.name}</option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Hair-on-Fire Pain (What breaks in their day?)</label>
          <textarea class="form-textarea cohort-problem-input" data-index="${cIdx}" rows="2" placeholder="e.g. Spends 4 hours every Friday manually pulling metrics from Meta Ads into Google Slides">${cohort.coreProblem}</textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Existing Workaround</label>
          <input type="text" class="form-input cohort-workaround-input" data-index="${cIdx}" placeholder="e.g. Frustrated junior staff copy-pasting into shared spreadsheets" value="${cohort.currentWorkaround}">
        </div>
      </div>
    `;
  }

  function bindEvents() {
    dialogEl.querySelector('#close-exercise-x')?.addEventListener('click', () => dialogEl.close());
    dialogEl.querySelector('#btn-ex-prev')?.addEventListener('click', () => {
      step = Math.max(1, step - 1);
      render();
    });

    dialogEl.querySelector('#btn-ex-next')?.addEventListener('click', async () => {
      if (step === 1) {
        const pName = dialogEl.querySelector('#ex-prod-name')?.value?.trim();
        const pTagline = dialogEl.querySelector('#ex-prod-tagline')?.value?.trim();
        const pCategory = dialogEl.querySelector('#ex-prod-category')?.value?.trim();

        if (!pName) {
          alert('Please enter your Product Name.');
          return;
        }

        exerciseState.productName = pName;
        exerciseState.tagline = pTagline || '';
        exerciseState.category = pCategory || 'B2B Software';

        // If no features yet, offer defaults based on product
        if (exerciseState.features.length === 0) {
          exerciseState.features = [
            { id: 'feat_1', name: 'Core Automation Action', category: 'Core Engine' },
            { id: 'feat_2', name: '1-Click Data / PDF Export', category: 'Export' },
            { id: 'feat_3', name: 'Real-time Webhook / API Sync', category: 'Integration' }
          ];
        }

        step = 2;
        render();
      } else if (step === 2) {
        if (exerciseState.features.length < 2) {
          alert('Please add at least 2 features to complete the unbundling exercise.');
          return;
        }

        // Initialize default cohort wedges if blank
        if (!exerciseState.cohorts[0].productWedge && exerciseState.features[0]) {
          exerciseState.cohorts[0].productWedge = exerciseState.features[0].name;
        }

        step = 3;
        render();
      } else if (step === 3) {
        saveCohortInputsFromDOM();

        // Validate cohorts
        const invalid = exerciseState.cohorts.some(c => !c.name || !c.productWedge);
        if (invalid) {
          alert('Please give each candidate audience a Name and select its 1-Feature Wedge.');
          return;
        }

        step = 4;
        render();
      } else if (step === 4) {
        // Submit full exercise to backend
        const submitPayload = {
          product: {
            name: exerciseState.productName,
            tagline: exerciseState.tagline,
            category: exerciseState.category,
            description: exerciseState.tagline
          },
          features: exerciseState.features.map(f => ({
            id: f.id || 'feat_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
            name: f.name,
            category: f.category || 'General',
            complexity: 'Medium',
            status: 'Shipped',
            description: '',
            isWedgeFor: []
          })),
          cohorts: exerciseState.cohorts.map((c, i) => {
            const discarded = exerciseState.features
              .filter(f => f.name.toLowerCase() !== (c.productWedge || '').toLowerCase())
              .map(f => f.name)
              .join(', ');

            return {
              name: c.name,
              targetRole: c.targetRole,
              coreProblem: c.coreProblem,
              currentWorkaround: c.currentWorkaround,
              productWedge: c.productWedge,
              discardedFeatures: discarded,
              touchSubject: `Quick question on ${c.name} workflow`,
              touchBody: `Hey {{firstName}}, noticed you lead operations at {{company}}.\n\nQuick peer question—how does your team currently handle ${c.coreProblem || 'this workflow'}? Did you guys solve it, or is it still a headache? Not selling anything; we built a focused 1-feature wedge and curious if it's even a real problem.`
            };
          }),
          replaceExisting: true
        };

        const res = await api.submitExercise(submitPayload);
        if (res.success) {
          dialogEl.close();
          onCompleted(exerciseState.productName);
        } else {
          alert('Error saving exercise: ' + (res.error || 'Unknown error'));
        }
      }
    });

    if (step === 2) {
      const featInput = dialogEl.querySelector('#ex-feat-input');
      const addBtn = dialogEl.querySelector('#btn-ex-add-feat');

      const addFeat = (name) => {
        if (!name) return;
        exerciseState.features.push({
          id: 'feat_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          name: name,
          category: 'Core Capability'
        });
        render();
      };

      addBtn?.addEventListener('click', () => {
        addFeat(featInput?.value?.trim());
      });

      featInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addFeat(featInput?.value?.trim());
        }
      });

      dialogEl.querySelectorAll('.chip-suggestion').forEach(chip => {
        chip.addEventListener('click', (e) => {
          addFeat(e.currentTarget.dataset.chip);
        });
      });

      dialogEl.querySelectorAll('.ex-remove-feat').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          exerciseState.features.splice(idx, 1);
          render();
        });
      });
    }

    if (step === 3) {
      dialogEl.querySelector('#btn-add-cohort')?.addEventListener('click', () => {
        saveCohortInputsFromDOM();
        exerciseState.cohorts.push({
          name: '',
          targetRole: '',
          coreProblem: '',
          productWedge: exerciseState.features[0] ? exerciseState.features[0].name : '',
          currentWorkaround: ''
        });
        render();
      });

      dialogEl.querySelectorAll('.remove-cohort-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          saveCohortInputsFromDOM();
          const idx = Number(e.currentTarget.dataset.index);
          exerciseState.cohorts.splice(idx, 1);
          render();
        });
      });
    }
  }

  function saveCohortInputsFromDOM() {
    dialogEl.querySelectorAll('.cohort-exercise-card').forEach(card => {
      const idx = Number(card.dataset.index);
      if (exerciseState.cohorts[idx]) {
        exerciseState.cohorts[idx].name = card.querySelector('.cohort-name-input')?.value?.trim() || '';
        exerciseState.cohorts[idx].targetRole = card.querySelector('.cohort-role-input')?.value?.trim() || '';
        exerciseState.cohorts[idx].productWedge = card.querySelector('.cohort-wedge-select')?.value || '';
        exerciseState.cohorts[idx].coreProblem = card.querySelector('.cohort-problem-input')?.value?.trim() || '';
        exerciseState.cohorts[idx].currentWorkaround = card.querySelector('.cohort-workaround-input')?.value?.trim() || '';
      }
    });
  }

  return {
    open(presetProduct = null) {
      step = 1;
      if (presetProduct && presetProduct.name) {
        exerciseState.productName = presetProduct.name;
        exerciseState.tagline = presetProduct.tagline || '';
        exerciseState.category = presetProduct.category || 'B2B Software';
        exerciseState.features = presetProduct.features ? [...presetProduct.features] : [];
      } else {
        exerciseState.productName = '';
        exerciseState.tagline = '';
        exerciseState.category = 'B2B SaaS';
        exerciseState.features = [];
        exerciseState.cohorts = [
          {
            name: '',
            targetRole: '',
            coreProblem: '',
            productWedge: '',
            currentWorkaround: ''
          }
        ];
      }
      render();
      dialogEl.showModal();
    }
  };
}
