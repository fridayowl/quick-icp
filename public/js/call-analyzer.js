// Discovery Call & Transcript Insight Extractor Controller
import { api } from './api.js';

export function setupCallNotesModal(dialogEl, leads, onSaved) {
  let currentLead = null;

  dialogEl.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-group">
        <h3 id="modal-lead-title">Log Discovery Call Notes & Extract Insights</h3>
        <p>Unbundle your over-engineered product. Find which 10% slice this customer actually cares about.</p>
      </div>
      <button class="modal-close-btn" id="modal-close-x">&times;</button>
    </div>

    <div class="modal-body">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span style="font-size: 0.75rem; color: var(--text-dim); align-self: center;">Quick test samples:</span>
        <button class="btn btn-secondary btn-sm" id="btn-sample-agency" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">
          Agency Call (High Pain)
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-sample-cto" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">
          CTO Call (Existing Tool)
        </button>
      </div>

      <div class="form-group">
        <label class="form-label">
          <span>Raw Call Notes / Audio Transcript</span>
          <span style="font-weight: normal; font-size: 0.72rem; color: var(--accent-cyan);">Paste notes or spoken feedback</span>
        </label>
        <textarea class="form-textarea" id="call-raw-text" rows="5" placeholder="Paste notes from your 15-min call: What did they complain about? What made their eyes light up? What features did they ignore?"></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary btn-sm" id="btn-run-analyzer">
          ✨ Extract ICP Insights
        </button>
      </div>

      <!-- Structured Insights Output -->
      <div id="analysis-result-container" style="display: none;">
        <div class="extracted-card">
          <div class="extracted-grid">
            <div class="extracted-item">
              <span class="extracted-label">Pain Severity (1-5)</span>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="range" min="1" max="5" value="4" class="form-range" id="field-pain-score" style="width: 120px;">
                <span class="extracted-val" id="val-pain-score" style="color: var(--accent-amber);">4 / 5</span>
              </div>
            </div>

            <div class="extracted-item">
              <span class="extracted-label">Willingness to Pay (WTP)</span>
              <input type="text" class="form-input" id="field-wtp" value="$150 / month">
            </div>
          </div>

          <div class="extracted-item">
            <span class="extracted-label">⚡ The 1-Feature Wedge That Resonated</span>
            <input type="text" class="form-input" id="field-wedge-resonance">
          </div>

          <div class="extracted-item">
            <span class="extracted-label">🚫 Monster Features They Didn't Care About</span>
            <input type="text" class="form-input" id="field-discarded">
          </div>

          <div class="extracted-item">
            <span class="extracted-label">💬 Verbatim Customer Quote</span>
            <input type="text" class="form-input" id="field-quotes">
          </div>

          <div class="form-group" style="margin-top: 0.5rem;">
            <label class="form-label">Move Lead To Stage</label>
            <select class="form-select" id="field-next-stage">
              <option value="call_completed">Call Completed / Evaluated</option>
              <option value="validated" selected>⭐ ICP Validated (Design Partner Alpha)</option>
              <option value="disqualified">Wrong ICP / Disqualify</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" id="btn-cancel-modal">Cancel</button>
      <button class="btn btn-success btn-sm" id="btn-save-notes">Save Notes & Update Scorecard</button>
    </div>
  `;

  // Bind close
  dialogEl.querySelector('#modal-close-x')?.addEventListener('click', () => dialogEl.close());
  dialogEl.querySelector('#btn-cancel-modal')?.addEventListener('click', () => dialogEl.close());

  // Slider change
  const painSlider = dialogEl.querySelector('#field-pain-score');
  const painVal = dialogEl.querySelector('#val-pain-score');
  painSlider?.addEventListener('input', (e) => {
    if (painVal) painVal.textContent = `${e.target.value} / 5`;
  });

  // Sample buttons
  dialogEl.querySelector('#btn-sample-agency')?.addEventListener('click', () => {
    const rawBox = dialogEl.querySelector('#call-raw-text');
    if (rawBox) {
      rawBox.value = `Spoke with the agency owner for 18 minutes. She said pulling Meta ad metrics into Google slides is a complete nightmare every single Friday. Her team loses 12 collective hours. 
She loved our 1-click export prototype. Didn't care at all about live dashboards or client login portals. 
She said: "If this saves my account managers 12 collective hours every week, $200 a month is a total no-brainer. Take my card."`;
    }
  });

  dialogEl.querySelector('#btn-sample-cto')?.addEventListener('click', () => {
    const rawBox = dialogEl.querySelector('#call-raw-text');
    if (rawBox) {
      rawBox.value = `CTO was nice but already locked into Census on an annual contract. They wrote an internal script for Postgres sync and works okay for now. Pain severity is low.
Said they have $0 budget for new ETL tooling right now. Said: "Census is pricey at $400/mo, but our engineers already set it up. Switching cost is too high right now."`;
    }
  });

  // Run analyzer
  dialogEl.querySelector('#btn-run-analyzer')?.addEventListener('click', async () => {
    const rawText = dialogEl.querySelector('#call-raw-text')?.value?.trim();
    if (!rawText) return;

    const btn = dialogEl.querySelector('#btn-run-analyzer');
    if (btn) btn.innerHTML = `<span>⏳ Extracting...</span>`;

    try {
      const res = await api.analyzeCallText(rawText, currentLead?.icpId);
      
      const resultContainer = dialogEl.querySelector('#analysis-result-container');
      if (resultContainer) resultContainer.style.display = 'block';

      // Fill extracted fields
      if (painSlider) painSlider.value = res.painSeverity;
      if (painVal) painVal.textContent = `${res.painSeverity} / 5`;
      
      const wtpInput = dialogEl.querySelector('#field-wtp');
      if (wtpInput) wtpInput.value = res.willingnessToPay;

      const wedgeInput = dialogEl.querySelector('#field-wedge-resonance');
      if (wedgeInput) wedgeInput.value = res.wedgeResonance;

      const discardedInput = dialogEl.querySelector('#field-discarded');
      if (discardedInput) discardedInput.value = res.discardedFeatures;

      const quoteInput = dialogEl.querySelector('#field-quotes');
      if (quoteInput) quoteInput.value = res.verbatimQuotes;

      const stageSelect = dialogEl.querySelector('#field-next-stage');
      if (stageSelect) {
        stageSelect.value = res.painSeverity >= 4 ? 'validated' : res.painSeverity <= 2 ? 'disqualified' : 'call_completed';
      }
    } catch (err) {
      alert('Analysis error: ' + err.message);
    } finally {
      if (btn) btn.innerHTML = `<span>✨ Extract ICP Insights</span>`;
    }
  });

  // Save notes
  dialogEl.querySelector('#btn-save-notes')?.addEventListener('click', async () => {
    if (!currentLead) return;

    const painSeverity = Number(painSlider?.value) || 4;
    const willingnessToPay = dialogEl.querySelector('#field-wtp')?.value || '';
    const wedgeResonance = dialogEl.querySelector('#field-wedge-resonance')?.value || '';
    const discardedFeatures = dialogEl.querySelector('#field-discarded')?.value || '';
    const verbatimQuotes = dialogEl.querySelector('#field-quotes')?.value || '';
    const nextStage = dialogEl.querySelector('#field-next-stage')?.value || 'call_completed';

    await api.saveCallNotes(currentLead.id, {
      painSeverity,
      willingnessToPay,
      wedgeResonance,
      discardedFeatures,
      verbatimQuotes,
      nextStage,
      durationMinutes: 15
    });

    dialogEl.close();
    onSaved();
  });

  return {
    open(lead) {
      currentLead = lead;
      const titleEl = dialogEl.querySelector('#modal-lead-title');
      if (titleEl) titleEl.textContent = `Call Notes & Insights: ${lead.name} (${lead.company})`;
      
      // Populate existing if available
      const rawBox = dialogEl.querySelector('#call-raw-text');
      const resultContainer = dialogEl.querySelector('#analysis-result-container');
      
      if (lead.callNotes) {
        if (rawBox) rawBox.value = lead.callNotes.verbatimQuotes || '';
        if (resultContainer) resultContainer.style.display = 'block';
        if (painSlider) painSlider.value = lead.callNotes.painSeverity || 4;
        if (painVal) painVal.textContent = `${lead.callNotes.painSeverity || 4} / 5`;
        
        const wtp = dialogEl.querySelector('#field-wtp');
        if (wtp) wtp.value = lead.callNotes.willingnessToPay || '';
        
        const wedge = dialogEl.querySelector('#field-wedge-resonance');
        if (wedge) wedge.value = lead.callNotes.wedgeResonance || '';

        const disc = dialogEl.querySelector('#field-discarded');
        if (disc) disc.value = lead.callNotes.discardedFeatures || '';

        const quotes = dialogEl.querySelector('#field-quotes');
        if (quotes) quotes.value = lead.callNotes.verbatimQuotes || '';
      } else {
        if (rawBox) rawBox.value = '';
        if (resultContainer) resultContainer.style.display = 'none';
      }

      dialogEl.showModal();
    }
  };
}
