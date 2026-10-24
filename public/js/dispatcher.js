// Multi-Inbox Dispatcher & Sequences Controller (Swiss Editorial System)
export function renderDispatcher(container, inboxes, templates, icps, onAddInbox) {
  container.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <h2>Multi-Domain Safe Dispatcher</h2>
        <p>Rotate sending volume across secondary domains. Protect your core brand reputation with strict daily quotas (25 to 35 messages/day).</p>
      </div>
      <button class="btn btn-primary" id="btn-add-inbox">
        <span>+</span> Connect Domain Account
      </button>
    </div>

    <!-- Inboxes Health Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
      ${inboxes.map(inbox => `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-default); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem; box-shadow: var(--shadow-hard-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${inbox.email}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem;">${inbox.provider}</div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; background: var(--status-positive-bg); color: var(--status-positive); border: 1px solid var(--status-positive-border); padding: 0.15rem 0.45rem;">
              ${inbox.status.toUpperCase()}
            </span>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-family: var(--font-mono); margin-bottom: 0.35rem;">
              <span style="color: var(--text-tertiary);">DAILY DISPATCH CAP:</span>
              <span style="font-weight: 600; color: var(--text-primary);">
                ${inbox.sentToday} / ${inbox.dailyLimit} SENT
              </span>
            </div>
            <div style="height: 5px; background: var(--bg-canvas); border: 1px solid var(--border-hairline); overflow: hidden;">
              <div style="width: ${(inbox.sentToday / inbox.dailyLimit) * 100}%; height: 100%; background: var(--terracotta);"></div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-hairline); padding-top: 0.5rem; font-family: var(--font-mono); font-size: 0.72rem;">
            <span style="color: var(--text-tertiary);">DELIVERABILITY SCORE:</span>
            <span style="font-weight: 700; color: ${inbox.healthScore >= 95 ? 'var(--status-positive)' : 'var(--terracotta)'};">
              ${inbox.healthScore}%
            </span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Active Conversational Sequences -->
    <div class="section-header" style="margin-top: 1.5rem;">
      <div class="section-title-group">
        <h3>Conversational Sequence Directives</h3>
        <p>Short, curiosity-driven peer questions that stop pitching features and start discovery conversations.</p>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${templates.map(tpl => {
        const icp = icps.find(i => i.id === tpl.icpId) || { name: 'Cohort' };
        return `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-default); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: var(--shadow-hard-sm);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; background: var(--bg-subtle); color: var(--terracotta); border: 1px solid var(--border-default); padding: 0.15rem 0.45rem;">
                  [TOUCH 0${tpl.touch}] ${tpl.delayDays > 0 ? `+${tpl.delayDays} DAYS` : 'DAY 01'}
                </span>
                <span style="font-family: var(--font-serif); font-weight: 700; color: var(--text-primary); font-size: 1rem;">${tpl.subject}</span>
              </div>
              <span class="lead-icp-pill">${icp.name}</span>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55; background: var(--bg-canvas); padding: 0.85rem 1rem; border: 1px solid var(--border-hairline); white-space: pre-wrap;">${tpl.body}</div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-tertiary);">
              <span>[SAFETY PROTOCOL] Any inbound reply permanently halts all subsequent touches for that lead</span>
              <span style="color: var(--terracotta);">Tags: {{firstName}}, {{company}}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  document.getElementById('btn-add-inbox')?.addEventListener('click', onAddInbox);
}
