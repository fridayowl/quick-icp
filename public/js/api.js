// API Client for Quick ICP
export const api = {
  // Product & Feature Decomposition
  async getProduct() {
    const res = await fetch('/api/product');
    return res.json();
  },

  async updateProduct(data) {
    const res = await fetch('/api/product', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async addProductFeature(data) {
    const res = await fetch('/api/product/features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProductFeature(id, data) {
    const res = await fetch(`/api/product/features/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProductFeature(id) {
    const res = await fetch(`/api/product/features/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async completeOnboarding(data) {
    const res = await fetch('/api/product/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ICP Hypotheses
  async getICPs() {
    const res = await fetch('/api/icps');
    return res.json();
  },

  async createICP(data) {
    const res = await fetch('/api/icps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Leads
  async getLeads(icpId = null) {
    const url = icpId ? `/api/leads?icpId=${icpId}` : '/api/leads';
    const res = await fetch(url);
    return res.json();
  },

  async createLead(data) {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateLeadStage(id, stage, sentiment = null) {
    const res = await fetch(`/api/leads/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, sentiment })
    });
    return res.json();
  },

  async addThreadMessage(leadId, messageData) {
    const res = await fetch(`/api/leads/${leadId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    return res.json();
  },

  async saveCallNotes(leadId, callNotesData) {
    const res = await fetch(`/api/leads/${leadId}/call-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(callNotesData)
    });
    return res.json();
  },

  async analyzeCallText(rawText, icpId) {
    const res = await fetch('/api/calls/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, icpId })
    });
    return res.json();
  },

  async getInboxes() {
    const res = await fetch('/api/inboxes');
    return res.json();
  },

  async simulateReply(leadId, replyText = '', sentiment = '') {
    const res = await fetch('/api/simulate-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, replyText, sentiment })
    });
    return res.json();
  },

  async getTemplates() {
    const res = await fetch('/api/templates');
    return res.json();
  }
};
