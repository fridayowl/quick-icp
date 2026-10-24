// ICP Lab & Comparison Matrix Controller (Swiss Editorial System)
export function renderIcpLab(container, icps, onSelectIcp, onOpenAddModal) {
  container.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <h2>Hypothesis Comparison Lab</h2>
        <p>Test 3 to 5 candidate cohorts simultaneously. Identify which 1-feature wedge earns genuine customer pull.</p>
      </div>
      <button class="btn btn-primary" id="btn-add-icp">
        <span>+</span> Add Hypothesis
      </button>
    </div>

    <div class="icp-grid">
      ${icps.length > 0 ? icps.map((icp, idx) => renderIcpCard(icp, idx)).join('') : `
        <div style="grid-column: 1 / -1; padding: 3.5rem 2rem; background: var(--bg-surface); border: 1px dashed var(--border-default); text-align: center;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-terracotta); font-weight: 700;">[NO CANDIDATE AUDIENCES DEFINED]</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; margin: 0.75rem 0 0.5rem; color: var(--text-primary);">Who suffers from this friction every Tuesday?</h3>
          <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto 1.5rem; font-size: 0.95rem; line-height: 1.5;">
            Never bet your company on a single demographic guess. Define 2 to 3 candidate cohorts so you can pitch a 1-feature wedge and see who has real budget.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-empty-add-icp">
              + Add Candidate Hypothesis
            </button>
          </div>
        </div>
      `}
    </div>
  `;

  document.getElementById('btn-add-icp')?.addEventListener('click', onOpenAddModal);
  document.getElementById('btn-empty-add-icp')?.addEventListener('click', onOpenAddModal);

  // Bind card action buttons
  container.querySelectorAll('.btn-view-pipeline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const icpId = e.currentTarget.dataset.id;
      onSelectIcp(icpId);
    });
  });
}

function renderIcpCard(icp, idx) {
  const m = icp.metrics || {
    validationScore: 0,
    replyRate: 0,
    callsBooked: 0,
    avgPainScore: 0,
    leadsContacted: 0
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (m.validationScore / 100) * circumference;
  const gaugeColor = m.validationScore >= 75 ? 'var(--terracotta)' : m.validationScore >= 40 ? '#94a3b8' : '#475569';

  return `
    <div class="icp-card" data-icp-id="${icp.id}">
      <div class="icp-card-header">
        <div class="icp-title-wrap">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="icp-tier-badge">
              [COHORT 0${idx + 1}] // ${icp.tier.toUpperCase()}
            </span>
            <span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-tertiary);">
              ${icp.status.toUpperCase()}
            </span>
          </div>
          <h3 class="icp-name">${icp.name}</h3>
          <div class="icp-role-sub">
            <strong>${icp.targetRole}</strong>
            <span>&middot;</span>
            <span>${icp.industry} (${icp.companySize})</span>
          </div>
        </div>

        <div class="validation-gauge" title="Validation Confidence Score: ${m.validationScore}%">
          <svg viewBox="0 0 64 64">
            <circle class="gauge-bg" cx="32" cy="32" r="${radius}"></circle>
            <circle class="gauge-val" cx="32" cy="32" r="${radius}" 
              stroke="${gaugeColor}" 
              stroke-dasharray="${circumference}" 
              stroke-dashoffset="${offset}"></circle>
          </svg>
          <span class="gauge-text">${m.validationScore}%</span>
        </div>
      </div>

      <!-- The 1-Feature Wedge -->
      <div class="wedge-box">
        <div class="wedge-title">
          <span>[WEDGE] // THE 10% PRODUCT SLICE</span>
        </div>
        <div class="wedge-desc">${icp.productWedge}</div>
      </div>

      <!-- Problem & Workaround -->
      <div class="problem-details">
        <div class="detail-row">
          <span class="detail-label">OPERATIONAL AGONY</span>
          <span class="detail-text">${icp.coreProblem}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">EXISTING WORKAROUND</span>
          <span class="detail-text">${icp.currentWorkaround}</span>
        </div>
      </div>

      <!-- Discarded Features -->
      <div class="discarded-features-tag">
        <span class="discarded-indicator">DISCARDED</span>
        <div class="discarded-body">
          <strong>Forbidden to Pitch:</strong> ${icp.discardedFeatures}
        </div>
      </div>

      <!-- Monospace Telemetry Bar -->
      <div class="icp-metrics-bar">
        <div>
          <div class="mini-metric-num">${m.leadsContacted}</div>
          <div class="mini-metric-lbl">Contacted</div>
        </div>
        <div>
          <div class="mini-metric-num" style="color: var(--terracotta);">${m.replyRate}%</div>
          <div class="mini-metric-lbl">Reply Rate</div>
        </div>
        <div>
          <div class="mini-metric-num">${m.callsBooked}</div>
          <div class="mini-metric-lbl">Calls Booked</div>
        </div>
        <div>
          <div class="mini-metric-num" style="color: ${m.avgPainScore >= 4 ? 'var(--terracotta)' : 'var(--text-primary)'};">${m.avgPainScore}/5</div>
          <div class="mini-metric-lbl">Avg Pain</div>
        </div>
      </div>

      <!-- Card Actions -->
      <div class="icp-card-actions">
        <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-tertiary); margin-right: auto;">
          Exit Goal: ${icp.validationThreshold}
        </span>
        <button class="btn btn-secondary btn-sm btn-view-pipeline" data-id="${icp.id}">
          Inspect Pipeline &rarr;
        </button>
      </div>
    </div>
  `;
}
