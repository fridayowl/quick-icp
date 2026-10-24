// Twenty CRM Inspired Product Onboarding Wizard
import { api } from './api.js';

export function setupOnboardingWizard(dialogEl, currentProduct, icps, onCompleted) {
  let step = 1;
  let workingProduct = {
    name: currentProduct?.name || 'SyncFlow',
    tagline: currentProduct?.tagline || 'The multi-source automation and data pipeline engine',
    description: currentProduct?.description || 'Full-stack developer platform designed to connect SQL databases, third-party APIs, and client-facing exports.',
    category: currentProduct?.category || 'Developer Tools & Automation',
    features: currentProduct?.features ? [...currentProduct.features] : []
  };

  function renderStep() {
    dialogEl.innerHTML = `
      <div class="modal-header">
        <div class="modal-title-group">
          <div class="modal-kicker">ONBOARDING // TWENTY CRM STYLE</div>
          <h3>${step === 1 ? 'Step 1: Register Product Identity' : step === 2 ? 'Step 2: List Down Product Features' : 'Step 3: Unbundle 1-Feature Wedges'}</h3>
          <p>${step === 1 ? 'Every company must establish what they built and the problem space they occupy.' : step === 2 ? 'List down all features of your software. A company must know its entire feature monolith.' : 'Isolate the 10% wedge feature for outreach. Keep the rest of the features hidden on calls.'}</p>
        </div>
        <button class="modal-close-btn" id="close-wizard-x">&times;</button>
      </div>

      <!-- Step Indicator Bar -->
      <div class="wizard-steps-bar">
        <div class="wizard-step-node ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}">
          <span class="step-num">[01]</span>
          <span class="step-name">Product Identity</span>
        </div>
        <div class="wizard-step-divider"></div>
        <div class="wizard-step-node ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}">
          <span class="step-num">[02]</span>
          <span class="step-name">Feature Monolith</span>
        </div>
        <div class="wizard-step-divider"></div>
        <div class="wizard-step-node ${step === 3 ? 'active' : ''}">
          <span class="step-num">[03]</span>
          <span class="step-name">Wedge Selection</span>
        </div>
      </div>

      <div class="modal-body">
        ${renderStepBody()}
      </div>

      <div class="modal-footer">
        ${step > 1 ? `<button class="btn btn-secondary btn-sm" id="btn-wizard-prev">&larr; Back</button>` : ''}
        <button class="btn btn-primary btn-sm" id="btn-wizard-next">
          ${step === 3 ? 'Complete Onboarding & Launch Engine &rarr;' : 'Continue to Next Step &rarr;'}
        </button>
      </div>
    `;

    bindStepEvents();
  }

  function renderStepBody() {
    if (step === 1) {
      return `
        <div class="form-group">
          <label class="form-label" for="wiz-prod-name">Product Name</label>
          <input type="text" class="form-input" id="wiz-prod-name" value="${workingProduct.name}">
        </div>

        <div class="form-group">
          <label class="form-label" for="wiz-prod-tagline">1-Line Premise / Tagline</label>
          <input type="text" class="form-input" id="wiz-prod-tagline" value="${workingProduct.tagline}">
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label" for="wiz-prod-category">Product Category</label>
            <input type="text" class="form-input" id="wiz-prod-category" value="${workingProduct.category}">
          </div>
          <div class="form-group">
            <label class="form-label">Lifecycle Stage</label>
            <select class="form-select" id="wiz-prod-stage">
              <option value="Alpha Discovery" selected>Alpha Discovery (0 - 5 customers)</option>
              <option value="Beta Pilot">Beta Pilot (Testing initial cohort)</option>
              <option value="Pivoting">Pivoting / Discarding old product</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="wiz-prod-desc">High-Level Architecture & Technical Description</label>
          <textarea class="form-textarea" id="wiz-prod-desc" rows="3">${workingProduct.description}</textarea>
        </div>
      `;
    }

    if (step === 2) {
      return `
        <div class="wizard-notice-box">
          <strong>The Feature Inventory:</strong> Document all the capabilities you have engineered. Listing your features is crucial for a company so you can track what creates genuine pull versus what is dead bloat.
        </div>

        <!-- Add Feature Input -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <input type="text" class="form-input" id="wiz-new-feat-input" placeholder="Type a feature name and press Enter (e.g. 1-Click Client PDF Export)..." style="flex: 1;">
          <button class="btn btn-primary btn-sm" id="btn-add-wiz-feat">+ Add Feature</button>
        </div>

        <!-- Pre-populated Quick Suggestion Chips -->
        <div style="margin-bottom: 1rem;">
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-tertiary);">QUICK ARCHITECTURAL SAMPLES:</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.35rem;">
            <button class="chip-suggestion" data-chip="1-Click White-Label Client Report Generator">+ Client Report Generator</button>
            <button class="chip-suggestion" data-chip="Postgres-to-CRM Realtime Webhook Bridge">+ Postgres Webhook Bridge</button>
            <button class="chip-suggestion" data-chip="Zero-Chargeback Fraud Scoring Engine">+ Fraud Scoring Rule Engine</button>
            <button class="chip-suggestion" data-chip="Visual Drag-and-Drop Workflow Canvas">+ Visual Workflow Canvas</button>
            <button class="chip-suggestion" data-chip="Enterprise SAML/SSO & RBAC Permissions">+ Enterprise SSO & RBAC</button>
            <button class="chip-suggestion" data-chip="Custom JS/Python Sandbox Transform Node">+ JS/Python Compute Sandbox</button>
          </div>
        </div>

        <!-- Active Feature Monolith List -->
        <div class="wiz-features-list" id="wiz-features-container">
          ${workingProduct.features.map((f, i) => `
            <div class="wiz-feature-item" data-index="${i}">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span class="wiz-feat-index">[F-0${i + 1}]</span>
                <div>
                  <div class="wiz-feat-name">${f.name}</div>
                  <div class="wiz-feat-sub">${f.category || 'Core Capability'} &middot; ${f.complexity || 'Medium'} Complexity</div>
                </div>
              </div>
              <button class="wiz-remove-feat" data-index="${i}" title="Remove feature">&times;</button>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (step === 3) {
      return `
        <div class="wizard-notice-box">
          <strong>The Wedge Selection:</strong> Pick 1 to 3 features from your list below to test as your active <strong>1-Feature Wedges</strong>. The system will automatically mark all remaining features as <strong>Discarded Bloat</strong> so you never distract early discovery prospects.
        </div>

        <div class="wiz-wedge-picker-list">
          ${workingProduct.features.map((f, i) => {
            const isChecked = f.isWedgeFor && f.isWedgeFor.length > 0;
            return `
              <label class="wiz-wedge-label ${isChecked ? 'selected' : ''}">
                <input type="checkbox" class="wiz-wedge-check" data-index="${i}" ${isChecked ? 'checked' : ''}>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--text-primary); font-size: 0.88rem;">${f.name}</strong>
                    <span class="wedge-tag-indicator">${isChecked ? '[ACTIVE WEDGE]' : '[WILL BE DISCARDED]'}</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem;">
                    ${f.description || f.category || 'Component feature'}
                  </div>
                </div>
              </label>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  function bindStepEvents() {
    dialogEl.querySelector('#close-wizard-x')?.addEventListener('click', () => dialogEl.close());
    dialogEl.querySelector('#btn-wizard-prev')?.addEventListener('click', () => {
      step = Math.max(1, step - 1);
      renderStep();
    });

    dialogEl.querySelector('#btn-wizard-next')?.addEventListener('click', async () => {
      if (step === 1) {
        workingProduct.name = dialogEl.querySelector('#wiz-prod-name')?.value?.trim() || workingProduct.name;
        workingProduct.tagline = dialogEl.querySelector('#wiz-prod-tagline')?.value?.trim() || workingProduct.tagline;
        workingProduct.category = dialogEl.querySelector('#wiz-prod-category')?.value?.trim() || workingProduct.category;
        workingProduct.description = dialogEl.querySelector('#wiz-prod-desc')?.value?.trim() || workingProduct.description;
        step = 2;
        renderStep();
      } else if (step === 2) {
        if (workingProduct.features.length === 0) {
          alert('Please add at least 2 features to represent your product.');
          return;
        }
        step = 3;
        renderStep();
      } else if (step === 3) {
        // Collect checked wedges
        dialogEl.querySelectorAll('.wiz-wedge-check').forEach(chk => {
          const idx = Number(chk.dataset.index);
          if (chk.checked) {
            if (!workingProduct.features[idx].isWedgeFor || workingProduct.features[idx].isWedgeFor.length === 0) {
              workingProduct.features[idx].isWedgeFor = [icps[0] ? icps[0].id : 'icp_agency'];
            }
          } else {
            workingProduct.features[idx].isWedgeFor = [];
          }
        });

        // Submit to API
        await api.completeOnboarding(workingProduct);
        dialogEl.close();
        onCompleted();
      }
    });

    if (step === 2) {
      // Add feature handler
      const addInput = dialogEl.querySelector('#wiz-new-feat-input');
      const addBtn = dialogEl.querySelector('#btn-add-wiz-feat');

      const doAdd = (name) => {
        if (!name) return;
        workingProduct.features.push({
          id: 'feat_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
          name: name,
          category: 'Core Capability',
          complexity: 'Medium',
          status: 'Shipped',
          description: '',
          isWedgeFor: []
        });
        renderStep();
      };

      addBtn?.addEventListener('click', () => {
        doAdd(addInput?.value?.trim());
      });

      addInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doAdd(addInput?.value?.trim());
        }
      });

      // Quick chip clicks
      dialogEl.querySelectorAll('.chip-suggestion').forEach(chip => {
        chip.addEventListener('click', (e) => {
          const val = e.currentTarget.dataset.chip;
          doAdd(val);
        });
      });

      // Remove buttons
      dialogEl.querySelectorAll('.wiz-remove-feat').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          workingProduct.features.splice(idx, 1);
          renderStep();
        });
      });
    }

    if (step === 3) {
      dialogEl.querySelectorAll('.wiz-wedge-check').forEach(chk => {
        chk.addEventListener('change', (e) => {
          const label = e.currentTarget.closest('.wiz-wedge-label');
          if (e.currentTarget.checked) {
            label?.classList.add('selected');
            label.querySelector('.wedge-tag-indicator').textContent = '[ACTIVE WEDGE]';
          } else {
            label?.classList.remove('selected');
            label.querySelector('.wedge-tag-indicator').textContent = '[WILL BE DISCARDED]';
          }
        });
      });
    }
  }

  return {
    open() {
      step = 1;
      workingProduct = {
        name: currentProduct?.name || 'SyncFlow',
        tagline: currentProduct?.tagline || 'The multi-source automation and data pipeline engine',
        description: currentProduct?.description || 'Full-stack developer platform designed to connect SQL databases, third-party APIs, and client-facing exports.',
        category: currentProduct?.category || 'Developer Tools & Automation',
        features: currentProduct?.features ? [...currentProduct.features] : []
      };
      renderStep();
      dialogEl.showModal();
    }
  };
}
