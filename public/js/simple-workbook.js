// ==========================================================================
// SIMPLE FOUNDER WORKBOOK: 3 STEPS TO YOUR FIRST 5 CONVERSATIONS
// ==========================================================================
import { api } from './api.js';

export function renderSimpleWorkbook(container, state, onSwitchToPro, onRefresh) {
  let activeStep = 1;

  // Local form state seeded from app state
  const form = {
    productName: state.product?.name || '',
    productDesc: state.product?.tagline || state.product?.description || '',
    features: state.product?.features?.map(f => f.name) || [
      'Core problem solver',
      'Automated workflow / sync',
      'Simple dashboard / export'
    ],
    audience1: state.icps?.[0]?.name || '',
    pain1: state.icps?.[0]?.problemHypothesis || '',
    wedge1: state.icps?.[0]?.wedgeFeature || '',
    audience2: state.icps?.[1]?.name || '',
    pain2: state.icps?.[1]?.problemHypothesis || '',
    wedge2: state.icps?.[1]?.wedgeFeature || '',
    simpleContacts: state.leads?.slice(0, 5).map(l => ({
      name: l.name,
      company: l.company,
      channel: l.email || 'LinkedIn',
      status: l.stage
    })) || [
      { name: '', company: '', channel: 'LinkedIn', status: 'not_contacted' }
    ]
  };

  // If user already has product and ICPs, jump directly to Step 3 (Action Plan)
  if (state.product?.name && state.icps?.length > 0) {
    activeStep = 3;
  }

  function render() {
    container.innerHTML = `
      <div class="simple-workbook-wrap">
        
        <!-- Friendly Hero -->
        <div class="workbook-hero-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
            <div>
              <span class="workbook-hero-tag">FOUNDER STARTING POINT // ZERO JARGON</span>
              <h1 class="workbook-hero-title">Find the first 5 people who want your product.</h1>
            </div>
            <div>
              <button class="btn btn-secondary btn-sm" id="btn-toggle-pro-mode" style="font-family: var(--font-mono); font-size: 0.75rem;">
                ⚙ Switch to Pro Mode
              </button>
            </div>
          </div>
          <p class="workbook-hero-desc">
            You don't need sales textbooks or complicated pipelines. Just answer 3 basic questions to get your 1-sentence pitch, a ready-to-send message, and 5 people to contact.
          </p>
        </div>

        <!-- 3-Step Navigation Tabs -->
        <div class="simple-step-tabs">
          <button class="simple-step-indicator ${activeStep === 1 ? 'active' : ''}" data-step="1">
            <span class="simple-step-num">STEP 01</span>
            <span class="simple-step-label">1. What Did You Build?</span>
          </button>
          <button class="simple-step-indicator ${activeStep === 2 ? 'active' : ''}" data-step="2">
            <span class="simple-step-num">STEP 02</span>
            <span class="simple-step-label">2. Who Needs It Most?</span>
          </button>
          <button class="simple-step-indicator ${activeStep === 3 ? 'active' : ''}" data-step="3">
            <span class="simple-step-num">STEP 03</span>
            <span class="simple-step-label">3. Your Action Plan</span>
          </button>
        </div>

        <!-- Active Step Card -->
        <div class="simple-card-panel">
          ${renderCurrentStep()}
        </div>

      </div>
    `;

    bindEvents();
  }

  function renderCurrentStep() {
    if (activeStep === 1) {
      return `
        <div class="simple-card-header">
          <span class="simple-card-step-kicker">STEP 01 OF 03 // YOUR PRODUCT</span>
          <h2 class="simple-card-title">Tell us what you built in plain English.</h2>
          <p class="simple-card-sub">Pretend you are explaining your product to a friend over coffee. No buzzwords like "paradigm-shifting AI platform".</p>
        </div>

        <div class="easy-field-group">
          <label class="easy-label" for="inp-product-name">
            <span>Product Name</span>
            <span class="easy-label-hint">What do you call it?</span>
          </label>
          <input type="text" class="easy-input" id="inp-product-name" placeholder="e.g. DocuSync or FeedbackPulse" value="${escapeHtml(form.productName)}">
        </div>

        <div class="easy-field-group">
          <label class="easy-label" for="inp-product-desc">
            <span>What does it do? (In 1 sentence)</span>
            <span class="easy-label-hint">One clear sentence</span>
          </label>
          <textarea class="easy-textarea" id="inp-product-desc" rows="2" placeholder="e.g. It turns raw customer feedback from Discord and Slack into organized tickets in 1 click.">${escapeHtml(form.productDesc)}</textarea>
        </div>

        <div class="easy-field-group">
          <label class="easy-label">
            <span>What are 2 or 3 specific things it can do?</span>
            <span class="easy-label-hint">Features / capabilities</span>
          </label>
          <div class="easy-feature-list" id="simple-feature-list">
            ${form.features.map((feat, idx) => `
              <div class="easy-feature-row">
                <input type="text" class="easy-input feature-input" data-idx="${idx}" placeholder="e.g. One-click PDF export" value="${escapeHtml(feat)}">
                ${form.features.length > 1 ? `<button class="easy-btn-remove btn-remove-feat" data-idx="${idx}" title="Remove">&times;</button>` : ''}
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-add-feature-row" style="align-self: flex-start; margin-top: 0.5rem;">
            + Add Another Feature
          </button>
        </div>

        <div class="simple-card-footer">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">STEP 1 OF 3</span>
          <button class="btn btn-primary" id="btn-step1-next">
            Next: Who Needs This? &rarr;
          </button>
        </div>
      `;
    }

    if (activeStep === 2) {
      return `
        <div class="simple-card-header">
          <span class="simple-card-step-kicker">STEP 02 OF 03 // TARGET AUDIENCES</span>
          <h2 class="simple-card-title">Who is suffering from this headache today?</h2>
          <p class="simple-card-sub">An "Ideal Customer" is just someone who is wasting time or money doing this manually. Let's pick 2 different groups to test.</p>
        </div>

        <!-- Audience 1 -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-default); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--accent-terracotta);">
            [GROUP A] YOUR FIRST GUESS
          </div>

          <div class="easy-field-group">
            <label class="easy-label" for="inp-audience-1">Who are they?</label>
            <input type="text" class="easy-input" id="inp-audience-1" placeholder="e.g. Product Managers at startups (20–100 people)" value="${escapeHtml(form.audience1)}">
          </div>

          <div class="easy-field-group">
            <label class="easy-label" for="inp-pain-1">What are they annoyed by right now?</label>
            <input type="text" class="easy-input" id="inp-pain-1" placeholder="e.g. Manually copy-pasting customer bug reports from Slack into Jira every Friday" value="${escapeHtml(form.pain1)}">
          </div>

          <div class="easy-field-group">
            <label class="easy-label" for="inp-wedge-1">Which ONE feature from your list will solve that?</label>
            <input type="text" class="easy-input" id="inp-wedge-1" placeholder="e.g. 1-click Slack-to-Jira sync" value="${escapeHtml(form.wedge1 || form.features[0] || '')}">
          </div>
        </div>

        <!-- Audience 2 -->
        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-default); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">
            [GROUP B] YOUR SECOND GUESS (FOR CONTRAST)
          </div>

          <div class="easy-field-group">
            <label class="easy-label" for="inp-audience-2">Who are they?</label>
            <input type="text" class="easy-input" id="inp-audience-2" placeholder="e.g. Freelance Web Designers / Solo Agency Owners" value="${escapeHtml(form.audience2)}">
          </div>

          <div class="easy-field-group">
            <label class="easy-label" for="inp-pain-2">What is their main daily friction?</label>
            <input type="text" class="easy-input" id="inp-pain-2" placeholder="e.g. Clients messaging them on WhatsApp and losing track of revision requests" value="${escapeHtml(form.pain2)}">
          </div>

          <div class="easy-field-group">
            <label class="easy-label" for="inp-wedge-2">Which ONE feature solves that?</label>
            <input type="text" class="easy-input" id="inp-wedge-2" placeholder="e.g. Client Feedback Portal" value="${escapeHtml(form.wedge2 || form.features[1] || '')}">
          </div>
        </div>

        <div class="simple-card-footer">
          <button class="btn btn-secondary" id="btn-step2-prev">
            &larr; Back
          </button>
          <button class="btn btn-primary" id="btn-step2-next">
            Generate My Action Plan &rarr;
          </button>
        </div>
      `;
    }

    if (activeStep === 3) {
      const prodName = form.productName || 'Your Product';
      const targetAudience = form.audience1 || 'Product Managers';
      const targetPain = form.pain1 || 'wasting 4 hours a week on manual copy-pasting';
      const wedgeFeature = form.wedge1 || form.features[0] || '1-click automated sync';

      const pitch = `We help ${targetAudience} eliminate ${targetPain} using ${wedgeFeature}.`;

      const emailSubject = `Quick question about ${targetPain.split(' ')[0] || 'workflow'} at {{company}}`;
      const emailBody = `Hi {{firstName}},

Saw you lead ${targetAudience.split(' ')[0] || 'product'} at {{company}}.

Quick question: when ${targetPain}, how are you guys handling that today? Are you doing it manually or did you hack together an internal tool?

Curious how your team approaches it—doing some research in this space.

Best,
[Your Name]`;

      return `
        <div class="simple-card-header">
          <span class="simple-card-step-kicker">STEP 03 OF 03 // YOUR ACTION PLAN</span>
          <h2 class="simple-card-title">Here is your exact playbook for tomorrow morning.</h2>
          <p class="simple-card-sub">No confusion. You now have a clear pitch, a copy-paste message that gets replies, and 5 questions to ask.</p>
        </div>

        <div class="cheat-sheet-grid">
          
          <!-- Block 1: 1-Sentence Pitch -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[01] YOUR 1-SENTENCE CLARITY PITCH</span>
              <button class="cheat-sheet-copy-btn" id="btn-copy-pitch">COPY PITCH</button>
            </div>
            <h3 class="cheat-sheet-headline">${escapeHtml(pitch)}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              Use this when anyone asks "So what does your product do?". Notice how it mentions the pain, not just code.
            </p>
          </div>

          <!-- Block 2: 40-Word Curiosity Email -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[02] THE 40-WORD MESSAGE (SEND TO 5 PEOPLE ON LINKEDIN OR EMAIL)</span>
              <button class="cheat-sheet-copy-btn" id="btn-copy-email">COPY MESSAGE</button>
            </div>
            <div class="cheat-sheet-box">${escapeHtml(emailBody)}</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              <strong>Why this works:</strong> You are NOT asking them to buy, and you are NOT asking for a 15-minute demo. You are asking an authentic question. This gets a 25–40% reply rate.
            </p>
          </div>

          <!-- Block 3: The 5 Golden Call Questions -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[03] WHAT TO ASK WHEN THEY REPLY (THE 15-MIN CALL)</span>
            </div>
            <div class="cheat-sheet-box" style="line-height: 1.8;">
1. "Walk me through the last time [Problem] happened at your company?"
2. "How did you solve it? (What tools or spreadsheets did you use?)"
3. "What did that cost your team in wasted hours or money?"
4. "Have you tried paying for other tools before? Why didn't they work?"
5. "If we had this fixed by next Monday, would you be open to testing it?"</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              <strong>Rule:</strong> Keep your laptop closed. Never show a demo on Call 1. Just listen.
            </p>
          </div>

          <!-- Block 4: Your 5 People Checklist -->
          <div class="cheat-sheet-block">
            <div class="cheat-sheet-tag">
              <span>[04] YOUR FIRST 5 TARGET CONTACTS</span>
              <button class="btn btn-secondary btn-sm" id="btn-add-contact-row" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">+ Add Person</button>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 0.5rem;">
              Find 5 real people on LinkedIn who match: <strong>${escapeHtml(targetAudience)}</strong>. Put their names here and message them tomorrow.
            </p>
            <table class="simple-contacts-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>COMPANY</th>
                  <th>WHERE TO MESSAGE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody id="simple-contacts-tbody">
                ${form.simpleContacts.map((c, idx) => `
                  <tr>
                    <td><input type="text" class="easy-input contact-inp-name" data-idx="${idx}" placeholder="e.g. Sarah Miller" value="${escapeHtml(c.name || '')}" style="padding: 0.4rem 0.6rem; font-size: 0.85rem; width: 100%;"></td>
                    <td><input type="text" class="easy-input contact-inp-comp" data-idx="${idx}" placeholder="e.g. Acme FinTech" value="${escapeHtml(c.company || '')}" style="padding: 0.4rem 0.6rem; font-size: 0.85rem; width: 100%;"></td>
                    <td><input type="text" class="easy-input contact-inp-chan" data-idx="${idx}" placeholder="LinkedIn / Email" value="${escapeHtml(c.channel || 'LinkedIn')}" style="padding: 0.4rem 0.6rem; font-size: 0.85rem; width: 100%;"></td>
                    <td>
                      <select class="form-select contact-inp-stat" data-idx="${idx}" style="padding: 0.4rem; font-size: 0.8rem; font-family: var(--font-mono);">
                        <option value="not_contacted" ${c.status === 'not_contacted' ? 'selected' : ''}>[ ] Ready to Message</option>
                        <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>[>] Sent Message</option>
                        <option value="in_conversation" ${c.status === 'in_conversation' ? 'selected' : ''}>[!] They Replied!</option>
                        <option value="call_scheduled" ${c.status === 'call_scheduled' ? 'selected' : ''}>[★] Call Booked</option>
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <div class="simple-card-footer">
          <button class="btn btn-secondary" id="btn-step3-edit">
            &larr; Edit Details
          </button>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-primary" id="btn-save-workbook">
              Save My Discovery Plan
            </button>
            <button class="btn btn-secondary" id="btn-goto-pro">
              Open Full Pipeline (Pro Mode) &rarr;
            </button>
          </div>
        </div>
      `;
    }
  }

  function bindEvents() {
    // Mode switch button
    container.querySelector('#btn-toggle-pro-mode')?.addEventListener('click', onSwitchToPro);
    container.querySelector('#btn-goto-pro')?.addEventListener('click', onSwitchToPro);

    // Step navigation tabs
    container.querySelectorAll('.simple-step-indicator').forEach(tab => {
      tab.addEventListener('click', () => {
        saveCurrentInput();
        activeStep = parseInt(tab.dataset.step, 10);
        render();
      });
    });

    // Step 1: Add / Remove Features
    container.querySelector('#btn-add-feature-row')?.addEventListener('click', () => {
      saveCurrentInput();
      form.features.push('');
      render();
    });

    container.querySelectorAll('.btn-remove-feat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        saveCurrentInput();
        form.features.splice(idx, 1);
        render();
      });
    });

    // Step 1 Next
    container.querySelector('#btn-step1-next')?.addEventListener('click', () => {
      saveCurrentInput();
      if (!form.productName.trim()) {
        alert('Please enter your product name first.');
        return;
      }
      activeStep = 2;
      render();
    });

    // Step 2 Back & Next
    container.querySelector('#btn-step2-prev')?.addEventListener('click', () => {
      saveCurrentInput();
      activeStep = 1;
      render();
    });

    container.querySelector('#btn-step2-next')?.addEventListener('click', () => {
      saveCurrentInput();
      if (!form.audience1.trim()) {
        alert('Please enter at least one target audience in Group A.');
        return;
      }
      activeStep = 3;
      render();
    });

    // Step 3 Actions
    container.querySelector('#btn-step3-edit')?.addEventListener('click', () => {
      activeStep = 1;
      render();
    });

    // Copy Pitch
    container.querySelector('#btn-copy-pitch')?.addEventListener('click', (e) => {
      const pitch = `We help ${form.audience1 || 'customers'} eliminate ${form.pain1 || 'friction'} using ${form.wedge1 || form.features[0] || 'our product'}.`;
      navigator.clipboard.writeText(pitch).then(() => {
        e.target.textContent = 'COPIED!';
        setTimeout(() => { e.target.textContent = 'COPY PITCH'; }, 1800);
      });
    });

    // Copy Email
    container.querySelector('#btn-copy-email')?.addEventListener('click', (e) => {
      const targetAudience = form.audience1 || 'our target market';
      const targetPain = form.pain1 || 'workflow friction';
      const emailBody = `Hi {{firstName}},

Saw you lead ${targetAudience.split(' ')[0] || 'your team'} at {{company}}.

Quick question: when ${targetPain}, how are you guys handling that today? Are you doing it manually or did you hack together an internal tool?

Curious how your team approaches it—doing some research in this space.

Best,
[Your Name]`;
      navigator.clipboard.writeText(emailBody).then(() => {
        e.target.textContent = 'COPIED!';
        setTimeout(() => { e.target.textContent = 'COPY MESSAGE'; }, 1800);
      });
    });

    // Add Contact Row
    container.querySelector('#btn-add-contact-row')?.addEventListener('click', () => {
      saveCurrentInput();
      form.simpleContacts.push({ name: '', company: '', channel: 'LinkedIn', status: 'not_contacted' });
      render();
    });

    // Save Workbook to Backend
    container.querySelector('#btn-save-workbook')?.addEventListener('click', async () => {
      saveCurrentInput();
      await syncToBackend();
      alert('Your discovery plan has been saved! You are ready to reach out to your 5 people.');
      render();
    });
  }

  function saveCurrentInput() {
    // Step 1
    const nameInp = container.querySelector('#inp-product-name');
    if (nameInp) form.productName = nameInp.value.trim();

    const descInp = container.querySelector('#inp-product-desc');
    if (descInp) form.productDesc = descInp.value.trim();

    const featInputs = container.querySelectorAll('.feature-input');
    if (featInputs.length > 0) {
      form.features = Array.from(featInputs).map(inp => inp.value.trim()).filter(Boolean);
    }

    // Step 2
    const a1Inp = container.querySelector('#inp-audience-1');
    if (a1Inp) form.audience1 = a1Inp.value.trim();

    const p1Inp = container.querySelector('#inp-pain-1');
    if (p1Inp) form.pain1 = p1Inp.value.trim();

    const w1Inp = container.querySelector('#inp-wedge-1');
    if (w1Inp) form.wedge1 = w1Inp.value.trim();

    const a2Inp = container.querySelector('#inp-audience-2');
    if (a2Inp) form.audience2 = a2Inp.value.trim();

    const p2Inp = container.querySelector('#inp-pain-2');
    if (p2Inp) form.pain2 = p2Inp.value.trim();

    const w2Inp = container.querySelector('#inp-wedge-2');
    if (w2Inp) form.wedge2 = w2Inp.value.trim();

    // Step 3 Contacts
    const nameInps = container.querySelectorAll('.contact-inp-name');
    const compInps = container.querySelectorAll('.contact-inp-comp');
    const chanInps = container.querySelectorAll('.contact-inp-chan');
    const statInps = container.querySelectorAll('.contact-inp-stat');

    if (nameInps.length > 0) {
      form.simpleContacts = Array.from(nameInps).map((inp, idx) => ({
        name: inp.value.trim(),
        company: compInps[idx]?.value.trim() || '',
        channel: chanInps[idx]?.value.trim() || 'LinkedIn',
        status: statInps[idx]?.value || 'not_contacted'
      }));
    }
  }

  async function syncToBackend() {
    const payload = {
      product: {
        name: form.productName,
        tagline: form.productDesc,
        description: form.productDesc,
        category: 'Software',
        features: form.features.map((f, i) => ({
          name: f,
          category: 'Core',
          complexity: 'Medium',
          status: 'Shipped',
          description: f
        }))
      },
      cohorts: [
        {
          name: form.audience1 || 'Audience A',
          tier: 'Tier 1',
          role: form.audience1,
          industry: 'Software / Services',
          problem: form.pain1 || 'Operational friction',
          workaround: 'Manual work',
          wedgeFeature: form.wedge1 || form.features[0] || 'Core feature',
          discardedFeatures: form.features.slice(1).join(', ')
        }
      ]
    };

    if (form.audience2) {
      payload.cohorts.push({
        name: form.audience2,
        tier: 'Tier 2',
        role: form.audience2,
        industry: 'Software / Services',
        problem: form.pain2 || 'Operational friction',
        workaround: 'Manual work',
        wedgeFeature: form.wedge2 || form.features[1] || 'Secondary feature',
        discardedFeatures: form.features.filter(f => f !== form.wedge2).join(', ')
      });
    }

    try {
      await api.submitExercise(payload);

      // Save contacts as leads if any have names
      const validContacts = form.simpleContacts.filter(c => c.name);
      for (const contact of validContacts) {
        await api.addLead({
          name: contact.name,
          title: form.audience1,
          company: contact.company || 'Prospective Company',
          email: `${contact.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          icpId: 'icp_cohort_1',
          stage: contact.status || 'contacted'
        });
      }

      await onRefresh();
    } catch (err) {
      console.error('Failed to sync workbook:', err);
    }
  }

  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}
