// Unified Discovery Inbox Controller
export function renderInbox(container, leads, icps, activeLeadId, onSelectLead, onSendMessage, onSimulateReply, onOpenCallNotes) {
  // Sort leads so those with latest messages appear first
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
        <p>Real-time conversations across rotated inboxes. Sequences automatically halt the second a lead responds.</p>
      </div>

      ${selectedLead ? `
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" id="inbox-sim-reply-btn">
            ⚡ Simulate Inbound Prospect Reply
          </button>
          <button class="btn btn-primary btn-sm" id="inbox-log-notes-btn">
            🎙️ Log Discovery Call Notes
          </button>
        </div>
      ` : ''}
    </div>

    <div class="inbox-layout">
      <!-- Threads Sidebar -->
      <div class="threads-sidebar">
        <div class="threads-search-bar">
          <input type="text" class="search-input" id="thread-search" placeholder="Search conversations...">
        </div>
        <div class="threads-list" id="threads-container">
          ${sortedLeads.map(lead => {
            const isSelected = selectedLead && selectedLead.id === lead.id;
            const icp = icps.find(i => i.id === lead.icpId) || { name: 'ICP' };
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
                  ${hasInbound ? `<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size: 0.68rem; padding: 0.1rem 0.4rem; border-radius: 4px;">Replied</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Active Conversation Panel -->
      <div class="conversation-panel">
        ${selectedLead ? renderActiveConversation(selectedLead, icps) : `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-dim);">
            Select a conversation to read and reply.
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
      textarea.value = `Hey ${selectedLead.name.split(' ')[0]}, that makes total sense. We're keeping this prototype deliberately simple to fix that exact headache.\n\nWould you have 15 minutes Tuesday or Wednesday for a quick look? No sales pitch whatsoever—just want to see if our 1-click approach solves it for you.`;
    }
  });
}

function renderActiveConversation(lead, icps) {
  const icp = icps.find(i => i.id === lead.icpId) || { name: 'ICP' };
  const hasReplied = lead.threads.some(t => t.sender === 'inbound');

  return `
    <div class="convo-header">
      <div class="convo-lead-info">
        <h3>${lead.name}</h3>
        <p>${lead.title} @ <strong>${lead.company}</strong> (${lead.email}) • ${icp.name}</p>
      </div>

      <div class="convo-header-actions">
        ${hasReplied ? `
          <div class="auto-pause-banner">
            <span>⚡ Cold Sequence Auto-Terminated (Live Conversation)</span>
          </div>
        ` : `
          <div style="font-size: 0.78rem; color: var(--text-dim);">
            Sequence Active (Touch 1 of 2)
          </div>
        `}
      </div>
    </div>

    <div class="messages-stream">
      ${lead.threads.map(msg => `
        <div class="message-card ${msg.sender === 'outbound' ? 'message-outbound' : 'message-inbound'}">
          <div class="message-meta">
            <span><strong>${msg.sender === 'outbound' ? 'You (Rotated Inbox)' : lead.name}</strong> &lt;${msg.from}&gt;</span>
            <span>${formatDateTime(msg.timestamp)}</span>
          </div>
          <div class="message-body">${escapeHtml(msg.body)}</div>
        </div>
      `).join('')}
    </div>

    <div class="reply-composer-area">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Reply to ${lead.name}:</span>
        <button class="quick-templates-btn" id="btn-insert-discovery-template">
          ⚡ Insert "15-Min Discovery Ask" Template
        </button>
      </div>

      <textarea class="composer-textarea" id="reply-text" placeholder="Type your response or proposed time..."></textarea>

      <div class="composer-actions">
        <span style="font-size: 0.75rem; color: var(--text-dim);">
          Sending via rotated sender account to protect deliverability
        </span>
        <button class="btn btn-primary btn-sm" id="btn-send-reply">
          Send Message &rarr;
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
