// Twenty CRM Inspired Product & Feature Decomposition Controller
import { api } from './api.js';

export function renderProductCatalog(container, product, icps, onRefresh, onLaunchOnboarding) {
  const features = product.features || [];
  const wedges = features.filter(f => f.isWedgeFor && f.isWedgeFor.length > 0);
  const discardedBloat = features.filter(f => !f.isWedgeFor || f.isWedgeFor.length === 0);
  const deEngineeringRatio = features.length > 0 ? Math.round((discardedBloat.length / features.length) * 100) : 0;

  container.innerHTML = `
    <!-- Product Header & Summary -->
    <div class="section-header">
      <div class="section-title-group">
        <h2>Product & Feature Inventory</h2>
        <p>Deconstruct your product monolith into discrete capabilities. Every early customer cohort should only be pitched a single 10% slice.</p>
      </div>

      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-secondary btn-sm" id="btn-open-onboarding-wizard">
          Run Product Onboarding Wizard
        </button>
        <button class="btn btn-primary btn-sm" id="btn-add-feature-inline">
          <span>+</span> Add Product Feature
        </button>
      </div>
    </div>

    <!-- Product Overview Ledger -->
    <div class="product-overview-banner">
      <div class="product-identity-block">
        <div class="identity-kicker">[REGISTERED PRODUCT IDENTITY]</div>
        <h3 class="product-identity-title">${product.name || 'Unnamed Product'}</h3>
        <p class="product-identity-tagline">${product.tagline || 'Add a 1-line product premise'}</p>
        <p class="product-identity-desc">${product.description || ''}</p>
      </div>

      <div class="product-de-engineering-meter">
        <div class="meter-header">
          <span class="meter-title">DE-ENGINEERING RATIO</span>
          <span class="meter-pct">${deEngineeringRatio}% BLOAT STRIPPED</span>
        </div>
        <div class="meter-bar">
          <div class="meter-fill" style="width: ${deEngineeringRatio}%;"></div>
        </div>
        <div class="meter-stats-row">
          <span>Total Features: <strong>${features.length}</strong></span>
          <span>&middot;</span>
          <span>Active Wedges: <strong style="color: var(--terracotta);">${wedges.length}</strong></span>
          <span>&middot;</span>
          <span>Discarded for Discovery: <strong style="color: var(--text-tertiary);">${discardedBloat.length}</strong></span>
        </div>
      </div>
    </div>

    <!-- Twenty CRM Style Feature Table -->
    <div class="twenty-table-wrapper">
      <div class="table-toolbar">
        <div class="table-search-box">
          <input type="text" class="search-input" id="feature-search" placeholder="FILTER FEATURES BY NAME OR TAG...">
        </div>
        <div class="table-status-filters">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-tertiary);">INVENTORY:</span>
          <span class="filter-chip active" data-filter="all">ALL (${features.length})</span>
          <span class="filter-chip" data-filter="wedge">WEDGES (${wedges.length})</span>
          <span class="filter-chip" data-filter="bloat">MONSTER BLOAT (${discardedBloat.length})</span>
        </div>
      </div>

      <table class="twenty-data-table" id="features-data-table">
        <thead>
          <tr>
            <th style="width: 100px;">CODE</th>
            <th style="width: 280px;">FEATURE NAME & PURPOSE</th>
            <th style="width: 140px;">CATEGORY</th>
            <th style="width: 110px;">COMPLEXITY</th>
            <th>DISCOVERY ROLE</th>
            <th style="width: 90px; text-align: right;">ACTION</th>
          </tr>
        </thead>
        <tbody id="features-table-body">
          ${renderFeatureRows(features, icps)}
        </tbody>
      </table>
    </div>
  `;

  // Bind Open Onboarding Wizard
  document.getElementById('btn-open-onboarding-wizard')?.addEventListener('click', onLaunchOnboarding);

  // Bind Add Feature Inline Modal
  document.getElementById('btn-add-feature-inline')?.addEventListener('click', () => {
    openAddFeatureModal(onRefresh);
  });

  // Filter chips
  container.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      container.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const filter = e.currentTarget.dataset.filter;
      const filtered = filter === 'wedge' 
        ? features.filter(f => f.isWedgeFor && f.isWedgeFor.length > 0)
        : filter === 'bloat'
        ? features.filter(f => !f.isWedgeFor || f.isWedgeFor.length === 0)
        : features;
      const tbody = document.getElementById('features-table-body');
      if (tbody) tbody.innerHTML = renderFeatureRows(filtered, icps);
      bindRowActions(tbody, onRefresh);
    });
  });

  // Search filter
  document.getElementById('feature-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = features.filter(f => 
      f.name.toLowerCase().includes(q) || 
      (f.category && f.category.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q))
    );
    const tbody = document.getElementById('features-table-body');
    if (tbody) tbody.innerHTML = renderFeatureRows(filtered, icps);
    bindRowActions(tbody, onRefresh);
  });

  const tbody = document.getElementById('features-table-body');
  if (tbody) bindRowActions(tbody, onRefresh);
}

function renderFeatureRows(features, icps) {
  if (features.length === 0) {
    return `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-tertiary); font-family: var(--font-mono);">
          [NO FEATURES FOUND IN CATALOG. CLICK "ADD PRODUCT FEATURE" TO ENROLL ONE]
        </td>
      </tr>
    `;
  }

  return features.map((feat, idx) => {
    const isWedge = feat.isWedgeFor && feat.isWedgeFor.length > 0;
    const wedgeCohorts = isWedge 
      ? feat.isWedgeFor.map(icpId => {
          const icp = icps.find(i => i.id === icpId);
          return icp ? icp.name : icpId;
        }).join(', ')
      : null;

    return `
      <tr class="twenty-table-row ${isWedge ? 'row-wedge' : ''}" data-feat-id="${feat.id}">
        <td class="col-code">
          [F-0${idx + 1}]
        </td>
        <td class="col-title">
          <div class="feat-name">${feat.name}</div>
          <div class="feat-desc">${feat.description || 'No description logged.'}</div>
        </td>
        <td class="col-category">
          <span class="category-pill">${feat.category || 'General'}</span>
        </td>
        <td class="col-complexity">
          <span class="complexity-badge ${feat.complexity ? feat.complexity.toLowerCase() : 'medium'}">
            ${feat.complexity || 'Medium'}
          </span>
        </td>
        <td class="col-role">
          ${isWedge ? `
            <div class="wedge-role-badge">
              <span class="badge-tag">[1-FEATURE WEDGE]</span>
              <span class="badge-cohorts">Tested on: <strong>${wedgeCohorts}</strong></span>
            </div>
          ` : `
            <div class="bloat-role-badge">
              <span class="badge-tag">[MONSTER BLOAT]</span>
              <span class="badge-note">Discarded / Forbidden on early calls</span>
            </div>
          `}
        </td>
        <td class="col-actions">
          <button class="table-btn-delete" data-id="${feat.id}" title="Remove feature">&times;</button>
        </td>
      </tr>
    `;
  }).join('');
}

function bindRowActions(tbody, onRefresh) {
  tbody.querySelectorAll('.table-btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const featId = e.currentTarget.dataset.id;
      if (confirm('Remove this feature from the product monolith?')) {
        await api.deleteProductFeature(featId);
        onRefresh();
      }
    });
  });
}

// Modal helper: Add Feature Inline
function openAddFeatureModal(onRefresh) {
  let modal = document.getElementById('add-feature-modal');
  if (!modal) {
    modal = document.createElement('dialog');
    modal.id = 'add-feature-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-group">
        <div class="modal-kicker">FEATURE INVENTORY</div>
        <h3>Add Feature to Product Monolith</h3>
        <p>Log a capability of your software so it can be unbundled into candidate wedges.</p>
      </div>
      <button class="modal-close-btn" id="close-feature-modal">&times;</button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label class="form-label" for="feat-name-input">Feature Name</label>
        <input type="text" class="form-input" id="feat-name-input" placeholder="e.g. 1-Click Client Audit PDF Export">
      </div>

      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label" for="feat-category-input">Category</label>
          <input type="text" class="form-input" id="feat-category-input" placeholder="e.g. Reporting / Data Sync / Auth">
        </div>
        <div class="form-group">
          <label class="form-label" for="feat-complexity-select">Engineering Complexity</label>
          <select class="form-select" id="feat-complexity-select">
            <option value="Low">Low (1-2 days to prototype)</option>
            <option value="Medium" selected>Medium (1-2 weeks)</option>
            <option value="High">High (Architectural / Multi-week)</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="feat-desc-input">Single Sentence Function</label>
        <textarea class="form-textarea" id="feat-desc-input" rows="2" placeholder="What does this feature actually do when a user clicks it?"></textarea>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" id="cancel-feat-modal">Cancel</button>
      <button class="btn btn-primary btn-sm" id="submit-feat-modal">Save Feature</button>
    </div>
  `;

  modal.querySelector('#close-feature-modal')?.addEventListener('click', () => modal.close());
  modal.querySelector('#cancel-feat-modal')?.addEventListener('click', () => modal.close());

  modal.querySelector('#submit-feat-modal')?.addEventListener('click', async () => {
    const name = modal.querySelector('#feat-name-input')?.value?.trim();
    const category = modal.querySelector('#feat-category-input')?.value?.trim() || 'General';
    const complexity = modal.querySelector('#feat-complexity-select')?.value;
    const description = modal.querySelector('#feat-desc-input')?.value?.trim() || '';

    if (!name) {
      alert('Please provide a feature name.');
      return;
    }

    await api.addProductFeature({ name, category, complexity, description, isWedgeFor: [] });
    modal.close();
    onRefresh();
  });

  modal.showModal();
}
