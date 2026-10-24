// Discovery Call & Transcript Insight Extractor Controller (Swiss Editorial System)
import { api } from './api.js';

export function setupCallNotesModal(dialogEl, leads, onSaved) {
  let currentLead = null;

  dialogEl.innerHTML = `
    <div class="modal-header">
      <div class="modal-title-group">
        <div class="modal-kicker">INTERVIEW ANALYSIS // THE MOM TEST PROTOCOL</div>
        <h3 id="modal-lead-title">Log Discovery Notes & Extract Signals</h3>
        <p>De-engineer your product. Identify the precise operational friction and verified willingness to pay.</p>
      </div>
      <button class="modal-close-btn" id="modal-close-x" aria-label="Close dialog">&times;</button>
    </div>

    <div class="modal-body">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.25rem;">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-tertiary); align-self: center;">TEST SAMPLES:</span>
        <button class="btn btn-secondary btn-sm" id="btn-sample-agency" style="font-family: var(--font-mono); font-size: 0.7rem; padding: 0.2rem 0.5rem;">
          [SAMPLE] Agency (Severe Pain)
        </button>
        <button class="btn btn-secondary btn-sm" id="btn-sample-cto" style="font-family: var(--font-mono); font-size: 0.7rem; padding: 0.2rem 0.5rem;">
          [SAMPLE] CTO (Existing Tool)
        </button>
      </div>

      <div class="form-group">
        <label class="form-label" for="call-raw-text">
          <span>Raw Call Notes or Audio Transcript</span>
          <span class="label-aside">[Paste Zoom / Meet transcript]</span>
        </label>
        <textarea class="form-textarea" id="call-raw-text" rows="5" placeholder="Paste notes from your 15-minute call: What caused visible frustration? What made their eyes light up? What features did they ignore?"></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary btn-sm" id="btn-run-analyzer">
          Extract Quantified Signals &rarr;
        </button>
      </div>

      <!-- Structured Insights Output -->
      <div id="analysis-result-container" style="display: none;">
        <div class="extracted-card">
          <div class="extracted-grid">
            <div class="extracted-item">
              <span class="extracted-label">Pain Severity Rating (1 to 5)</span>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <input type="range" min="1" max="5" value="4" class="form-range" id="field-pain-score" style="width: 130px; accent-color: var(--terracotta);">
                <span class="extracted-val" id="val-pain-score">4 / 5</span>
              </div>
            </div>

            <div class="extracted-item">
              <span class="extracted-label">Willingness to Pay (WTP)</span>
              <input type="text" class="form-input" id="field-wtp" value="$150 / month">
            </div>
          </div>

          <div class="extracted-item">
            <span class="extracted-label">[WEDGE RESONANCE] Feature that solved the headache</span>
            <input type="text" class="form-input" id="field-wedge-resonance">
          </div>

          <div class="extracted-item">
            <span class="extracted-label">[DISCARDED] Features they confirmed they do NOT want</span>
            <input type="text" class="form-input" id="field-discarded">
          </div>

          <div class="extracted-item">
            <span class="extracted-label">Verbatim Customer Quote</span>
            <input type="text" class="form-input" id="field-quotes">
          </div>

          <div class="form-group" style="margin-top: 0.5rem;">
            <label class="form-label" for="field-next-stage">Advance Lead Stage</label>
            <select class="form-select" id="field-next-stage">
              <option value="call_completed">Call Completed / Evaluated</option>
              <option value="validated" selected>Target Validated (Design Partner Alpha)</option>
              <option value="disqualified">Cohort Disqualified</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm" id="btn-cancel-modal">Cancel</button>
      <button class="btn btn-primary btn-sm" id="btn-save-notes">Save Notes & Recalculate Scorecard</button>
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
      rawBox.value = `Spoke with agency managing partner for 17 minutes. She stated that aggregating client performance CSVs is an agony every single Friday afternoon. Her account directors lose 8 hours.
She reacted strongly to our 1-click white-label summary export. Did not care about custom dashboards or webhook sync.
She stated: "If this eliminates the Friday reporting bottleneck, paying $250 a month is an immediate no-brainer."`;
    }
  });

  dialogEl.querySelector('#btn-sample-cto')?.addEventListener('click', () => {
    const rawBox = dialogEl.querySelector('#call-raw-text');
    if (rawBox) {
      rawBox.value = `VP of Engineering was polite but already committed to existing internal bash scripts and GitHub Actions runners.
Pain intensity is low. Said budget is frozen for new developer infrastructure tools this quarter.
Said: "It is an interesting wedge, but our current workflow is already acceptable enough that switching creates friction."`;
    }
  });

  // Run analyzer
  dialogEl.querySelector('#btn-run-analyzer')?.addEventListener('click', async () => {
    const rawText = dialogEl.querySelector('#call-raw-text')?.value?.trim();
    if (!rawText) return;

    const btn = dialogEl.querySelector('#btn-run-analyzer');
    if (btn) btn.innerHTML = `<span>Processing Signals...</span>`;

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
      if (btn) btn.innerHTML = `<span>Extract Quantified Signals &rarr;</span>`;
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
      if (titleEl) titleEl.textContent = `Discovery Call Notes: ${lead.name} (${lead.company})`;
      
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
