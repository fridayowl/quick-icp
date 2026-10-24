// Multi-Inbox Dispatcher & Sequences Controller (UZonMail Heritage)
export function renderDispatcher(container, inboxes, templates, icps, onAddInbox) {
  container.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <h2>Multi-Inbox Dispatcher & Safe Warmup Pool</h2>
        <p>Rotate sending across secondary domains. Protect your primary domain with safe daily limits (25–35/day).</p>
      </div>
      <button class="btn btn-primary" id="btn-add-inbox">
        <span>+</span> Connect Sending Inbox
      </button>
    </div>

    <!-- Inboxes Health Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
      ${inboxes.map(inbox => `
        <div class="stat-card" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-weight: 700; color: white; font-size: 0.95rem;">${inbox.email}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${inbox.provider}</div>
            </div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 600;">
              ${inbox.status}
            </span>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.3rem;">
              <span style="color: var(--text-dim);">Daily Dispatch Limit:</span>
              <span style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: white;">
                ${inbox.sentToday} / ${inbox.dailyLimit} sent today
              </span>
            </div>
            <div style="height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 999px; overflow: hidden;">
              <div style="width: ${(inbox.sentToday / inbox.dailyLimit) * 100}%; height: 100%; background: var(--accent-gradient);"></div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem; font-size: 0.78rem;">
            <span style="color: var(--text-dim);">Deliverability Health:</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${inbox.healthScore >= 95 ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">
              ${inbox.healthScore}%
            </span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Active Conversational Sequences -->
    <div class="section-header" style="margin-top: 2rem;">
      <div class="section-title-group">
        <h3>Conversational Sequence Templates</h3>
        <p>Short, curiosity-driven peer questions that stop pitching features and start discovery conversations.</p>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${templates.map(tpl => {
        const icp = icps.find(i => i.id === tpl.icpId) || { name: 'General ICP' };
        return `
          <div class="stat-card" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc; font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 4px; font-weight: 600;">
                  Touch ${tpl.touch} ${tpl.delayDays > 0 ? `(${tpl.delayDays} days later)` : '(Day 1)'}
                </span>
                <span style="font-weight: 600; color: white; font-size: 0.9rem;">${tpl.subject}</span>
              </div>
              <span class="lead-icp-pill">${icp.name}</span>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; background: rgba(0, 0, 0, 0.2); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-family: inherit; white-space: pre-wrap;">${tpl.body}</div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.74rem; color: var(--text-dim);">
              <span>⚡ Safety rule: Any inbound reply permanently halts subsequent touches</span>
              <span style="color: var(--accent-cyan);">Merge tags supported: {{firstName}}, {{company}}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('btn-add-inbox')?.addEventListener('click', onAddInbox);
}
