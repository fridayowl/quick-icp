// Kanban Discovery CRM Controller (Swiss Editorial System)
const STAGES = [
  { id: 'contacted', label: 'Outreach Active', color: '#64748b' },
  { id: 'in_conversation', label: 'In Conversation', color: '#ea580c' },
  { id: 'call_scheduled', label: 'Discovery Call Booked', color: '#cbd5e1' },
  { id: 'call_completed', label: 'Call Logged / Evaluated', color: '#f59e0b' },
  { id: 'validated', label: 'Target Validated', color: '#22c55e' },
  { id: 'disqualified', label: 'Cohort Disqualified', color: '#dc2626' }
];

export function renderKanban(container, leads, icps, activeIcpFilter, onStageChange, onOpenCallNotes, onOpenThread, onSimulateReply, onAddLead) {
  const filteredLeads = activeIcpFilter ? leads.filter(l => l.icpId === activeIcpFilter) : leads;

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <h2>Discovery CRM Pipeline</h2>
        <p>Track early customer discovery interviews. Advance prospects as problem severity and willingness to pay are confirmed.</p>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <select class="form-select" id="kanban-icp-filter" style="width: 250px; font-size: 0.8rem; font-family: var(--font-mono);">
          <option value="">ALL COHORTS</option>
          ${icps.map(i => `<option value="${i.id}" ${i.id === activeIcpFilter ? 'selected' : ''}>${i.name.toUpperCase()}</option>`).join('')}
        </select>

        <button class="btn btn-primary" id="btn-add-lead">
          <span>+</span> Add Lead
        </button>
      </div>
    </div>

    ${filteredLeads.length === 0 ? `
      <div style="margin-bottom: 1.5rem; padding: 1.5rem 1.75rem; background: var(--bg-surface); border: 1px dashed var(--border-default); display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-terracotta); font-weight: 700;">[PIPELINE READY]</span>
          <div style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); font-weight: 700; margin: 0.2rem 0;">No prospects enqueued in discovery pipeline yet.</div>
          <div style="font-size: 0.88rem; color: var(--text-secondary);">Add 10 to 15 target prospects per cohort (Step 04) to test your candidate audiences.</div>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-empty-banner-add-lead">+ Add First Prospect</button>
      </div>
    ` : ''}

    <div class="kanban-wrapper">
      ${STAGES.map((stage, idx) => {
        const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
        return `
          <div class="kanban-column" data-stage="${stage.id}">
            <div class="kanban-column-header">
              <div class="col-title-group">
                <span class="col-indicator" style="background: ${stage.color};"></span>
                <span class="col-title">[0${idx + 1}] ${stage.label}</span>
              </div>
              <span class="col-count">${stageLeads.length}</span>
            </div>

            <div class="kanban-cards-container" data-stage="${stage.id}">
              ${stageLeads.map(lead => renderLeadCard(lead, icps)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Bind ICP filter
  document.getElementById('kanban-icp-filter')?.addEventListener('change', (e) => {
    const selectedIcp = e.target.value;
    renderKanban(container, leads, icps, selectedIcp, onStageChange, onOpenCallNotes, onOpenThread, onSimulateReply, onAddLead);
  });

  // Bind Add Lead
  document.getElementById('btn-add-lead')?.addEventListener('click', onAddLead);
  document.getElementById('btn-empty-banner-add-lead')?.addEventListener('click', onAddLead);

  // Setup HTML5 Drag and Drop
  setupDragAndDrop(container, onStageChange);

  // Setup Card action listeners
  container.querySelectorAll('.btn-log-call').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onOpenCallNotes(e.currentTarget.dataset.id);
    });
  });

  container.querySelectorAll('.btn-view-thread').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onOpenThread(e.currentTarget.dataset.id);
    });
  });

  container.querySelectorAll('.btn-sim-reply').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onSimulateReply(e.currentTarget.dataset.id);
    });
  });
}

function renderLeadCard(lead, icps) {
  const icp = icps.find(i => i.id === lead.icpId) || { name: 'Unknown Cohort', tierColor: '#64748b' };
  const hasNotes = lead.callNotes && lead.callNotes.painSeverity;
  const threadCount = lead.threads ? lead.threads.length : 0;

  return `
    <div class="lead-card" draggable="true" data-lead-id="${lead.id}">
      <div class="lead-top">
        <div>
          <div class="lead-name">${lead.name}</div>
          <div class="lead-role">${lead.title} @ ${lead.company}</div>
        </div>
      </div>

      <span class="lead-icp-pill" style="border-left: 2px solid var(--terracotta);">
        ${icp.name}
      </span>

      <div class="lead-sentiment-tag">
        <span>STATUS // ${lead.sentiment ? lead.sentiment.toUpperCase() : 'WAITING FOR REPLY'}</span>
      </div>

      ${hasNotes ? `
        <div class="lead-pain-meter">
          <span>PAIN RATING: ${lead.callNotes.painSeverity}/5</span>
        </div>
        ${lead.callNotes.verbatimQuotes ? `
          <div class="lead-quote-preview">
            &ldquo;${lead.callNotes.verbatimQuotes}&rdquo;
          </div>
        ` : ''}
      ` : ''}

      <div class="lead-card-actions">
        <button class="card-btn-icon btn-view-thread" data-id="${lead.id}" title="Inspect Thread">
          <span>THREAD [${threadCount}]</span>
        </button>

        ${lead.stage === 'contacted' ? `
          <button class="card-btn-icon action-highlight btn-sim-reply" data-id="${lead.id}" title="Simulate human prospect response to trigger instant auto-kill">
            SIM REPLY
          </button>
        ` : ''}

        <button class="card-btn-icon btn-log-call" data-id="${lead.id}">
          ${hasNotes ? 'EDIT NOTES' : 'LOG CALL'}
        </button>
      </div>
    </div>
  `;
}

function setupDragAndDrop(container, onStageChange) {
  let draggedCardId = null;

  container.querySelectorAll('.lead-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCardId = card.dataset.leadId;
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', draggedCardId);
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  });

  container.querySelectorAll('.kanban-cards-container').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const targetStage = col.dataset.stage;
      if (draggedCardId && targetStage) {
        onStageChange(draggedCardId, targetStage);
      }
    });
  });
}
