// ICP Lab & Comparison Matrix Controller
export function renderIcpLab(container, icps, onSelectIcp, onOpenAddModal) {
  container.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <h2>Multi-ICP Comparison Lab</h2>
        <p>Test 3–5 candidate customer profiles in parallel. Find the single wedge that gets urgent conversations.</p>
      </div>
      <button class="btn btn-primary" id="btn-add-icp">
        <span>+</span> Add New ICP Hypothesis
      </button>
    </div>

    <div class="icp-grid">
      ${icps.map(icp => renderIcpCard(icp)).join('')}
    </div>
  `;

  document.getElementById('btn-add-icp')?.addEventListener('click', onOpenAddModal);

  // Bind card action buttons
  container.querySelectorAll('.btn-view-pipeline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const icpId = e.currentTarget.dataset.id;
      onSelectIcp(icpId);
    });
  });
}

function renderIcpCard(icp) {
  const m = icp.metrics || {
    validationScore: 0,
    replyRate: 0,
    callsBooked: 0,
    avgPainScore: 0,
    leadsContacted: 0
  };

  // SVG Gauge calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (m.validationScore / 100) * circumference;
  const gaugeColor = m.validationScore >= 70 ? 'var(--accent-emerald)' : m.validationScore >= 40 ? 'var(--accent-primary)' : 'var(--accent-rose)';

  return `
    <div class="icp-card" data-icp-id="${icp.id}">
      <div class="icp-card-header">
        <div class="icp-title-wrap">
          <span class="icp-tier-badge" style="background: ${icp.tierColor}20; color: ${icp.tierColor}; border: 1px solid ${icp.tierColor}40">
            ${icp.tier} • ${icp.status}
          </span>
          <h3 class="icp-name">${icp.name}</h3>
          <div class="icp-role-sub">
            <span>🎯 <strong>${icp.targetRole}</strong></span>
            <span>• ${icp.industry} (${icp.companySize})</span>
          </div>
        </div>

        <div class="validation-gauge" title="ICP Validation Score: ${m.validationScore}%">
          <svg viewBox="0 0 72 72">
            <circle class="gauge-bg" cx="36" cy="36" r="${radius}"></circle>
            <circle class="gauge-val" cx="36" cy="36" r="${radius}" 
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
          <span>⚡ The 1-Feature Wedge (Unbundled from Monster)</span>
        </div>
        <div class="wedge-desc">${icp.productWedge}</div>
      </div>

      <!-- Problem & Current Workaround -->
      <div class="problem-details">
        <div class="detail-row">
          <span class="detail-label">Hair-on-Fire Pain</span>
          <span class="detail-text">${icp.coreProblem}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Current Workaround</span>
          <span class="detail-text">${icp.currentWorkaround}</span>
        </div>
      </div>

      <!-- Discarded Features to Stop Pitching -->
      <div class="discarded-features-tag">
        <span>🚫</span>
        <div>
          <strong>Features Discarded For This ICP:</strong> ${icp.discardedFeatures}
        </div>
      </div>

      <!-- Mini Metrics Bar -->
      <div class="icp-metrics-bar">
        <div>
          <div class="mini-metric-num">${m.leadsContacted}</div>
          <div class="mini-metric-lbl">Contacted</div>
        </div>
        <div>
          <div class="mini-metric-num" style="color: var(--accent-cyan);">${m.replyRate}%</div>
          <div class="mini-metric-lbl">Reply Rate</div>
        </div>
        <div>
          <div class="mini-metric-num" style="color: var(--accent-emerald);">${m.callsBooked}</div>
          <div class="mini-metric-lbl">Calls Booked</div>
        </div>
        <div>
          <div class="mini-metric-num" style="color: var(--accent-amber);">${m.avgPainScore}/5</div>
          <div class="mini-metric-lbl">Avg Pain</div>
        </div>
      </div>

      <!-- Card Actions -->
      <div class="icp-card-actions">
        <button class="btn btn-secondary btn-sm btn-view-pipeline" data-id="${icp.id}">
          View Pipeline in CRM &rarr;
        </button>
        <span style="font-size: 0.75rem; color: var(--text-dim); margin-left: auto;">
          Goal: ${icp.validationThreshold}
        </span>
      </div>
    </div>
  `;
}
