// Unified Discovery Inbox Controller (Swiss Editorial System)
export function renderInbox(container, leads, icps, activeLeadId, onSelectLead, onSendMessage, onSimulateReply, onOpenCallNotes) {
  const sortedLeads = [...leads].filter(l => l.threads && l.threads.length > 0).sort((a, b) => {
    const aTime = a.lastContacted || '2000-01-01';
    const bTime = b.lastContacted || '2000-01-01';
    return new Date(bTime) - new Date(aTime);
  });

  const selectedLead = leads.find(l => l.id === activeLeadId) || sortedLeads[0] || null;

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <h2>Unified Discovery Inbox</h2>
        <p>Live peer conversations across secondary domains. All robotic sequences terminate the microsecond a prospect responds.</p>
      </div>

      ${selectedLead ? `
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" id="inbox-sim-reply-btn">
            SIMULATE INBOUND REPLY
          </button>
          <button class="btn btn-primary btn-sm" id="inbox-log-notes-btn">
            LOG CALL NOTES
          </button>
        </div>
      ` : ''}
    </div>

    <div class="inbox-layout">
      <!-- Threads Sidebar -->
      <div class="threads-sidebar">
        <div class="threads-search-bar">
          <input type="text" class="search-input" id="thread-search" placeholder="FILTER CONVERSATIONS...">
        </div>
        <div class="threads-list" id="threads-container">
          ${sortedLeads.length > 0 ? sortedLeads.map(lead => {
            const isSelected = selectedLead && selectedLead.id === lead.id;
            const icp = icps.find(i => i.id === lead.icpId) || { name: 'Cohort' };
            const lastMsg = lead.threads[lead.threads.length - 1];
            const hasInbound = lead.threads.some(t => t.sender === 'inbound');

            return `
              <div class="thread-item ${isSelected ? 'active' : ''}" data-lead-id="${lead.id}">
                <div class="thread-header-row">
                  <span class="thread-lead-name">${lead.name}</span>
                  <span class="thread-time">${formatDate(lead.lastContacted)}</span>
                </div>
                <div class="thread-subject">${lastMsg ? lastMsg.subject : 'No subject'}</div>
                <div class="thread-snippet">${lastMsg ? truncate(lastMsg.body, 55) : ''}</div>
                <div class="thread-badge-row">
                  <span class="lead-icp-pill">${icp.name}</span>
                  ${hasInbound ? `<span style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent-terracotta); font-weight: 700; background: rgba(234,88,12,0.15); padding: 0.1rem 0.4rem; border: 1px solid rgba(234,88,12,0.3);">REPLIED</span>` : ''}
                </div>
              </div>
            `;
          }).join('') : `
            <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.78rem;">
              [NO ACTIVE CONVERSATIONS]
            </div>
          `}
        </div>
      </div>

      <!-- Active Conversation Panel -->
      <div class="thread-detail-pane">
        ${selectedLead ? renderActiveConversation(selectedLead, icps) : `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center; padding: 2.5rem; gap: 0.75rem;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-terracotta); font-weight: 700;">[INBOX DORMANT]</span>
            <div style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-primary); font-weight: 700;">No live replies yet</div>
            <p style="font-size: 0.9rem; max-width: 440px; margin: 0; line-height: 1.5;">
              Once you dispatch low-friction curiosity touches to your prospect list (Step 05), responses will route here and automated follow-ups will instantly terminate.
            </p>
          </div>
        `}
      </div>
    </div>
  `;

  // Bind thread selection
  container.querySelectorAll('.thread-item').forEach(item => {
    item.addEventListener('click', () => {
      onSelectLead(item.dataset.leadId);
    });
  });

  // Bind Send Reply
  document.getElementById('btn-send-reply')?.addEventListener('click', () => {
    const textarea = document.getElementById('reply-text');
    const text = textarea?.value?.trim();
    if (text && selectedLead) {
      onSendMessage(selectedLead.id, text);
    }
  });

  // Bind Simulate Reply
  document.getElementById('inbox-sim-reply-btn')?.addEventListener('click', () => {
    if (selectedLead) onSimulateReply(selectedLead.id);
  });

  // Bind Log Call Notes
  document.getElementById('inbox-log-notes-btn')?.addEventListener('click', () => {
    if (selectedLead) onOpenCallNotes(selectedLead.id);
  });

  // Quick 15-min discovery template button
  document.getElementById('btn-insert-discovery-template')?.addEventListener('click', () => {
    const textarea = document.getElementById('reply-text');
    if (textarea && selectedLead) {
      textarea.value = `Hey ${selectedLead.name.split(' ')[0]}, that makes total sense. We deliberately stripped away the complex features to fix that single headache.\n\nWould you be open to a 15-minute coffee chat this Tuesday or Wednesday? No sales pitch whatsoever; just want to walk through your current workflow and see if our wedge solves it for you.`;
    }
  });
}

function renderActiveConversation(lead, icps) {
  const icp = icps.find(i => i.id === lead.icpId) || { name: 'Cohort' };
  const hasReplied = lead.threads.some(t => t.sender === 'inbound');

  return `
    <div class="thread-detail-header">
      <div class="thread-detail-meta">
        <h3>${lead.name}</h3>
        <div class="thread-detail-meta-sub">
          <span>${lead.title.toUpperCase()} @ ${lead.company.toUpperCase()}</span>
          <span>&middot;</span>
          <span>${lead.email}</span>
          <span>&middot;</span>
          <span style="color: var(--terracotta);">${icp.name.toUpperCase()}</span>
        </div>
      </div>
    </div>

    ${hasReplied ? `
      <div class="sequence-autokill-banner">
        <div>
          <span class="autokill-tag">SEQUENCE KILLED</span>
          <span>Live response detected. Automated sequence permanently halted for this contact.</span>
        </div>
        <span style="font-size: 0.65rem; color: var(--text-tertiary);">HANDOFF: ACTIVE</span>
      </div>
    ` : `
      <div style="background: var(--bg-subtle); padding: 0.5rem 1.75rem; border-bottom: 1px solid var(--border-default); font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-tertiary);">
        OUTREACH DISPATCH: ENQUEUED TOUCH 01 (WAITING FOR PROSPECT RESPONSE)
      </div>
    `}

    <div class="messages-container">
      ${lead.threads.map(msg => `
        <div class="message-card ${msg.sender === 'outbound' ? 'outbound' : 'inbound'}">
          <div class="message-header">
            <span class="message-author">${msg.sender === 'outbound' ? 'YOU (ROTATED INBOX)' : lead.name.toUpperCase()}</span>
            <span>${formatDateTime(msg.timestamp)}</span>
          </div>
          <div class="message-body">${escapeHtml(msg.body)}</div>
        </div>
      `).join('')}
    </div>

    <div class="thread-composer">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-secondary); font-weight: 600;">
          DISPATCH DIRECT REPLY:
        </span>
        <button class="btn btn-secondary btn-sm" id="btn-insert-discovery-template" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;">
          [+] Insert 15-Min Discovery Ask
        </button>
      </div>

      <textarea class="composer-textarea" id="reply-text" placeholder="Draft your conversational response or proposed call times..."></textarea>

      <div class="composer-actions">
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-tertiary);">
          ROUTED VIA ROTATED DISPATCH DOMAIN
        </span>
        <button class="btn btn-primary btn-sm" id="btn-send-reply">
          Transmit Message &rarr;
        </button>
      </div>
    </div>
  `;
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
