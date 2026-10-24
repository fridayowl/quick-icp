import { api } from './api.js';
import { renderIcpLab } from './icp-lab.js';
import { renderKanban } from './kanban.js';
import { renderInbox } from './inbox.js';
import { renderDispatcher } from './dispatcher.js';
import { renderProductCatalog } from './product-catalog.js';
import { setupOnboardingWizard } from './onboarding-wizard.js';
import { setupCallNotesModal } from './call-analyzer.js';

// Application State
const state = {
  product: { features: [] },
  icps: [],
  leads: [],
  inboxes: [],
  templates: [],
  activeTab: 'icp-lab',
  selectedLeadId: null,
  activeIcpFilter: null,
  callNotesModal: null,
  onboardingWizard: null
};

// Initialization
async function init() {
  setupTabs();
  setupAddIcpModal();
  setupAddLeadModal();
  setupAddInboxModal();

  // Setup Call Notes Modal
  const callNotesDialog = document.getElementById('call-notes-modal');
  if (callNotesDialog) {
    state.callNotesModal = setupCallNotesModal(callNotesDialog, state.leads, async () => {
      await refreshData();
      showToast('Discovery call notes logged. Validation scorecard updated.');
    });
  }

  // Setup Twenty CRM Onboarding Wizard Modal
  const onboardingDialog = document.getElementById('product-onboarding-modal');
  if (onboardingDialog) {
    state.onboardingWizard = setupOnboardingWizard(onboardingDialog, state.product, state.icps, async () => {
      await refreshData();
      showToast('Product and features registered. Discovery engine ready.');
    });
  }

  await refreshData();

  // Re-bind wizard if product was refreshed
  if (onboardingDialog) {
    state.onboardingWizard = setupOnboardingWizard(onboardingDialog, state.product, state.icps, async () => {
      await refreshData();
      showToast('Product and features registered. Discovery engine ready.');
    });
  }
}

// Data Refresh
async function refreshData() {
  try {
    const [product, icps, leads, inboxes, templates] = await Promise.all([
      api.getProduct(),
      api.getICPs(),
      api.getLeads(),
      api.getInboxes(),
      api.getTemplates()
    ]);

    state.product = product || { features: [] };
    state.icps = icps;
    state.leads = leads;
    state.inboxes = inboxes;
    state.templates = templates;

    updateHeaderStats();
    populateProductFeatureDropdown();
    renderCurrentTab();
  } catch (err) {
    console.error('Failed to load Quick ICP data:', err);
  }
}

// Update Top Stats Strip
function updateHeaderStats() {
  const totalContacted = state.leads.length;
  const inConversation = state.leads.filter(l => ['in_conversation', 'call_scheduled', 'call_completed', 'validated'].includes(l.stage)).length;
  const callsBooked = state.leads.filter(l => ['call_scheduled', 'call_completed', 'validated'].includes(l.stage)).length;
  
  // Find top ICP
  let topIcp = null;
  let maxScore = -1;
  state.icps.forEach(i => {
    if (i.metrics && i.metrics.validationScore > maxScore) {
      maxScore = i.metrics.validationScore;
      topIcp = i;
    }
  });

  const activeIcpsEl = document.getElementById('stat-active-icps');
  if (activeIcpsEl) activeIcpsEl.textContent = state.icps.length;

  const contactedEl = document.getElementById('stat-contacted');
  if (contactedEl) contactedEl.textContent = totalContacted;

  const inConversationEl = document.getElementById('stat-in-conversation');
  if (inConversationEl) inConversationEl.textContent = inConversation;

  const callsBookedEl = document.getElementById('stat-calls-booked');
  if (callsBookedEl) callsBookedEl.textContent = callsBooked;
  
  const topIcpEl = document.getElementById('header-top-icp');
  if (topIcpEl) {
    topIcpEl.textContent = topIcp ? `${topIcp.name} [${maxScore}% CONFIRMED]` : 'Evaluating...';
  }

  // Update tab badges
  const inboxBadge = document.getElementById('badge-inbox-count');
  if (inboxBadge) {
    const unreadCount = state.leads.filter(l => l.stage === 'in_conversation').length;
    inboxBadge.textContent = unreadCount;
  }
}

// Tab Switching
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.dataset.tab;
      state.activeTab = targetTab;

      document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.remove('active');
      });

      const activeView = document.getElementById(`view-${targetTab}`);
      if (activeView) activeView.classList.add('active');

      renderCurrentTab();
    });
  });
}

function renderCurrentTab() {
  if (state.activeTab === 'product') {
    const container = document.getElementById('view-product');
    if (container) {
      renderProductCatalog(
        container,
        state.product,
        state.icps,
        refreshData,
        () => state.onboardingWizard?.open()
      );
    }
  } else if (state.activeTab === 'icp-lab') {
    const container = document.getElementById('view-icp-lab');
    if (container) {
      renderIcpLab(container, state.icps, (icpId) => {
        state.activeIcpFilter = icpId;
        switchTab('kanban');
      }, () => {
        populateProductFeatureDropdown();
        document.getElementById('add-icp-modal')?.showModal();
      });
    }
  } else if (state.activeTab === 'kanban') {
    const container = document.getElementById('view-kanban');
    if (container) {
      renderKanban(
        container,
        state.leads,
        state.icps,
        state.activeIcpFilter,
        async (leadId, newStage) => {
          await api.updateLeadStage(leadId, newStage);
          await refreshData();
          showToast(`Lead moved to "${newStage}" stage.`);
        },
        (leadId) => {
          const lead = state.leads.find(l => l.id === leadId);
          if (lead && state.callNotesModal) {
            state.callNotesModal.open(lead);
          }
        },
        (leadId) => {
          state.selectedLeadId = leadId;
          switchTab('inbox');
        },
        async (leadId) => {
          await simulateReplyFlow(leadId);
        },
        () => {
          populateIcpDropdown();
          document.getElementById('add-lead-modal')?.showModal();
        }
      );
    }
  } else if (state.activeTab === 'inbox') {
    const container = document.getElementById('view-inbox');
    if (container) {
      renderInbox(
        container,
        state.leads,
        state.icps,
        state.selectedLeadId,
        (leadId) => {
          state.selectedLeadId = leadId;
          renderCurrentTab();
        },
        async (leadId, replyText) => {
          const lead = state.leads.find(l => l.id === leadId);
          await api.addThreadMessage(leadId, {
            sender: 'outbound',
            from: 'alex@quick-icp.com',
            subject: lead?.threads[0] ? `Re: ${lead.threads[0].subject}` : 'Re: Conversation',
            body: replyText
          });
          await refreshData();
          showToast('Reply dispatched via rotated sender inbox.');
        },
        async (leadId) => {
          await simulateReplyFlow(leadId);
        },
        (leadId) => {
          const lead = state.leads.find(l => l.id === leadId);
          if (lead && state.callNotesModal) {
            state.callNotesModal.open(lead);
          }
        }
      );
    }
  } else if (state.activeTab === 'dispatcher') {
    const container = document.getElementById('view-dispatcher');
    if (container) {
      renderDispatcher(container, state.inboxes, state.templates, state.icps, () => {
        document.getElementById('add-inbox-modal')?.showModal();
      });
    }
  }
}

function switchTab(tabName) {
  state.activeTab = tabName;
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.toggle('active', view.id === `view-${tabName}`);
  });
  renderCurrentTab();
}

// Simulate Reply Helper
async function simulateReplyFlow(leadId) {
  await api.simulateReply(leadId);
  await refreshData();
  state.selectedLeadId = leadId;
  showToast('[AUTOKILL] Inbound reply received. Sequence permanently halted.');
}

// Populate Feature Selector in Add ICP Modal
function populateProductFeatureDropdown() {
  const select = document.getElementById('icp-wedge-feature-select');
  if (!select) return;

  const features = state.product?.features || [];
  select.innerHTML = `
    <option value="">-- Or choose from Product Feature Catalog --</option>
    ${features.map(f => `<option value="${f.id}">${f.name} [${f.category || 'General'}]</option>`).join('')}
  `;
}

// Modal: Add New ICP Hypothesis
function setupAddIcpModal() {
  const modal = document.getElementById('add-icp-modal');
  if (!modal) return;

  modal.querySelector('#modal-close-icp')?.addEventListener('click', () => modal.close());
  modal.querySelector('#btn-cancel-icp')?.addEventListener('click', () => modal.close());

  // Link feature dropdown to wedge and auto-calculate discarded features
  const featureSelect = modal.querySelector('#icp-wedge-feature-select');
  const wedgeInput = modal.querySelector('#icp-wedge-input');
  const discardedInput = modal.querySelector('#icp-discarded-input');

  featureSelect?.addEventListener('change', (e) => {
    const featId = e.target.value;
    if (!featId) return;

    const chosen = state.product.features.find(f => f.id === featId);
    if (chosen) {
      wedgeInput.value = chosen.name;

      // Other features become discarded bloat
      const otherFeatures = state.product.features
        .filter(f => f.id !== featId)
        .map(f => f.name);
      
      discardedInput.value = otherFeatures.join(', ');
    }
  });

  modal.querySelector('#btn-submit-icp')?.addEventListener('click', async () => {
    const name = modal.querySelector('#icp-name-input')?.value?.trim();
    const tier = modal.querySelector('#icp-tier-select')?.value;
    const targetRole = modal.querySelector('#icp-role-input')?.value?.trim();
    const industry = modal.querySelector('#icp-industry-input')?.value?.trim();
    const coreProblem = modal.querySelector('#icp-problem-input')?.value?.trim();
    const currentWorkaround = modal.querySelector('#icp-workaround-input')?.value?.trim();
    const productWedge = modal.querySelector('#icp-wedge-input')?.value?.trim();
    const discardedFeatures = modal.querySelector('#icp-discarded-input')?.value?.trim();

    if (!name || !targetRole || !coreProblem || !productWedge) {
      alert('Please fill out Name, Target Role, Operational Pain, and The 1-Feature Wedge.');
      return;
    }

    const createdIcp = await api.createICP({
      name,
      tier,
      targetRole,
      industry,
      companySize: '10 - 50 employees',
      coreProblem,
      currentWorkaround,
      productWedge,
      discardedFeatures,
      validationThreshold: '5 discovery calls with high urgency'
    });

    // If selected from catalog, update feature wedge mapping
    const featId = featureSelect?.value;
    if (featId && createdIcp && createdIcp.id) {
      const feat = state.product.features.find(f => f.id === featId);
      if (feat) {
        const updatedWedges = Array.from(new Set([...(feat.isWedgeFor || []), createdIcp.id]));
        await api.updateProductFeature(featId, { isWedgeFor: updatedWedges });
      }
    }

    modal.close();
    await refreshData();
    showToast(`New ICP Hypothesis "${name}" enrolled in lab.`);
  });
}

// Modal: Add Lead
function setupAddLeadModal() {
  const modal = document.getElementById('add-lead-modal');
  if (!modal) return;

  modal.querySelector('#modal-close-lead')?.addEventListener('click', () => modal.close());
  modal.querySelector('#btn-cancel-lead')?.addEventListener('click', () => modal.close());

  modal.querySelector('#btn-submit-lead')?.addEventListener('click', async () => {
    const name = modal.querySelector('#lead-name-input')?.value?.trim();
    const title = modal.querySelector('#lead-title-input')?.value?.trim();
    const company = modal.querySelector('#lead-company-input')?.value?.trim();
    const email = modal.querySelector('#lead-email-input')?.value?.trim();
    const icpId = modal.querySelector('#lead-icp-select')?.value;
    const firstTouch = modal.querySelector('#lead-touch-input')?.value?.trim();

    if (!name || !email || !icpId) {
      alert('Name, Email, and ICP assignment are required.');
      return;
    }

    await api.createLead({
      name,
      title,
      company,
      email,
      icpId,
      firstTouch
    });

    modal.close();
    await refreshData();
    showToast(`Lead "${name}" enrolled in discovery dispatch.`);
  });
}

function populateIcpDropdown() {
  const select = document.getElementById('lead-icp-select');
  if (select) {
    select.innerHTML = state.icps.map(i => `<option value="${i.id}">${i.name} [${i.tier}]</option>`).join('');
  }
}

// Modal: Connect Inbox
function setupAddInboxModal() {
  const modal = document.getElementById('add-inbox-modal');
  if (!modal) return;

  modal.querySelector('#modal-close-inbox')?.addEventListener('click', () => modal.close());
  modal.querySelector('#btn-cancel-inbox')?.addEventListener('click', () => modal.close());

  modal.querySelector('#btn-submit-inbox')?.addEventListener('click', async () => {
    const email = modal.querySelector('#inbox-email-input')?.value?.trim();
    const provider = modal.querySelector('#inbox-provider-select')?.value;
    const dailyLimit = Number(modal.querySelector('#inbox-limit-input')?.value) || 30;

    if (!email) {
      alert('Email address is required.');
      return;
    }

    const res = await fetch('/api/inboxes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, provider, dailyLimit })
    });
    await res.json();

    modal.close();
    await refreshData();
    showToast(`Sender domain "${email}" connected to rotation pool.`);
  });
}

// Toast notification helper (Swiss Brutalist Ledger)
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-surface);
      color: var(--text-primary);
      padding: 0.85rem 1.25rem;
      border: 1px solid var(--border-strong);
      border-left: 3px solid var(--terracotta);
      box-shadow: 4px 4px 0px #000000;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 600;
      z-index: 9999;
      transform: translateY(12px);
      opacity: 0;
      transition: all 0.15s cubic-bezier(0.2, 0, 0, 1);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(12px)';
    toast.style.opacity = '0';
  }, 4000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
