// API Client for Quick ICP
export const api = {
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
  }
};
