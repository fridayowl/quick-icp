import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3030;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Read store
async function readStore() {
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

// Helper: Write store
async function writeStore(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Recalculate metrics for an ICP
function recalculateIcpMetrics(icp, leads) {
  const icpLeads = leads.filter(l => l.icpId === icp.id);
  const contacted = icpLeads.length;
  const replies = icpLeads.filter(l => l.threads && l.threads.some(t => t.sender === 'inbound')).length;
  const callsBooked = icpLeads.filter(l => ['call_scheduled', 'call_completed', 'validated'].includes(l.stage)).length;
  const callsCompleted = icpLeads.filter(l => l.callNotes !== null).length;
  
  const painScores = icpLeads.filter(l => l.callNotes && l.callNotes.painSeverity).map(l => l.callNotes.painSeverity);
  const avgPain = painScores.length > 0 
    ? Number((painScores.reduce((a, b) => a + b, 0) / painScores.length).toFixed(1))
    : 0;
  
  const validatedCount = icpLeads.filter(l => l.stage === 'validated').length;
  const replyRate = contacted > 0 ? Number(((replies / contacted) * 100).toFixed(1)) : 0;
  
  // Validation Score formula (0-100):
  // 30% reply engagement + 30% call conversion + 40% pain intensity & validated outcomes
  let score = 0;
  if (contacted > 0) {
    const replyFactor = Math.min(replyRate / 25, 1) * 30; // 25% reply rate is top tier
    const callFactor = Math.min(callsBooked / 4, 1) * 30; // 4 calls booked is solid
    const painFactor = (avgPain / 5) * 25; // 5/5 pain is ideal
    const validationBonus = Math.min(validatedCount * 7.5, 15);
    score = Math.min(Math.round(replyFactor + callFactor + painFactor + validationBonus), 100);
  }

  icp.metrics = {
    leadsContacted: contacted,
    repliesCount: replies,
    replyRate,
    callsBooked,
    callsCompleted,
    avgPainScore: avgPain,
    validatedCount,
    validationScore: score
  };
  return icp;
}

// ==================== ROUTES ====================

// 1. Get all ICPs with live metrics
app.get('/api/icps', async (req, res) => {
  try {
    const store = await readStore();
    store.icps = store.icps.map(icp => recalculateIcpMetrics(icp, store.leads));
    await writeStore(store);
    res.json(store.icps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create new ICP
app.post('/api/icps', async (req, res) => {
  try {
    const store = await readStore();
    const newIcp = {
      id: 'icp_' + Date.now().toString(36),
      name: req.body.name,
      tier: req.body.tier || 'Tier 2',
      tierColor: req.body.tier === 'Tier 1' ? '#10b981' : req.body.tier === 'Tier 2' ? '#3b82f6' : '#8b5cf6',
      targetRole: req.body.targetRole || '',
      companySize: req.body.companySize || '',
      industry: req.body.industry || '',
      coreProblem: req.body.coreProblem || '',
      currentWorkaround: req.body.currentWorkaround || '',
      productWedge: req.body.productWedge || '',
      discardedFeatures: req.body.discardedFeatures || '',
      validationThreshold: req.body.validationThreshold || '5 calls with pain severity >= 4 and WTP >= $100/mo',
      status: 'Active Testing',
      metrics: {
        leadsContacted: 0,
        repliesCount: 0,
        replyRate: 0,
        callsBooked: 0,
        callsCompleted: 0,
        avgPainScore: 0,
        validatedCount: 0,
        validationScore: 0
      }
    };
    store.icps.unshift(newIcp);
    await writeStore(store);
    res.status(201).json(newIcp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update ICP
app.put('/api/icps/:id', async (req, res) => {
  try {
    const store = await readStore();
    const index = store.icps.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'ICP not found' });
    store.icps[index] = { ...store.icps[index], ...req.body };
    store.icps[index] = recalculateIcpMetrics(store.icps[index], store.leads);
    await writeStore(store);
    res.json(store.icps[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete ICP
app.delete('/api/icps/:id', async (req, res) => {
  try {
    const store = await readStore();
    store.icps = store.icps.filter(i => i.id !== req.params.id);
    // Unlink or delete leads for this ICP
    store.leads = store.leads.filter(l => l.icpId !== req.params.id);
    await writeStore(store);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Leads
app.get('/api/leads', async (req, res) => {
  try {
    const store = await readStore();
    let leads = store.leads;
    if (req.query.icpId) {
      leads = leads.filter(l => l.icpId === req.query.icpId);
    }
    if (req.query.stage) {
      leads = leads.filter(l => l.stage === req.query.stage);
    }
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Create Lead
app.post('/api/leads', async (req, res) => {
  try {
    const store = await readStore();
    const newLead = {
      id: 'lead_' + Date.now().toString(36),
      name: req.body.name,
      title: req.body.title || '',
      company: req.body.company || '',
      email: req.body.email,
      icpId: req.body.icpId,
      stage: req.body.stage || 'contacted',
      inboxId: req.body.inboxId || (store.inboxes[0] ? store.inboxes[0].id : null),
      lastContacted: new Date().toISOString(),
      sentiment: req.body.sentiment || 'Waiting for Reply',
      threads: req.body.firstMessage ? [
        {
          sender: 'outbound',
          from: store.inboxes[0]?.email || 'founder@quick-icp.com',
          subject: req.body.firstMessage.subject || 'Quick inquiry',
          body: req.body.firstMessage.body || '',
          timestamp: new Date().toISOString()
        }
      ] : [],
      callNotes: null
    };

    // Increment inbox sentToday
    if (newLead.inboxId) {
      const inbox = store.inboxes.find(i => i.id === newLead.inboxId);
      if (inbox) inbox.sentToday += 1;
    }

    store.leads.unshift(newLead);
    await writeStore(store);
    res.status(201).json(newLead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Update Lead Stage (Kanban Move)
app.patch('/api/leads/:id/stage', async (req, res) => {
  try {
    const store = await readStore();
    const lead = store.leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    lead.stage = req.body.stage;
    if (req.body.sentiment) lead.sentiment = req.body.sentiment;
    await writeStore(store);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Add message to thread
app.post('/api/leads/:id/threads', async (req, res) => {
  try {
    const store = await readStore();
    const lead = store.leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    
    const message = {
      sender: req.body.sender || 'outbound',
      from: req.body.from,
      subject: req.body.subject,
      body: req.body.body,
      timestamp: new Date().toISOString()
    };
    
    lead.threads.push(message);
    lead.lastContacted = new Date().toISOString();

    // Auto-advance stage if prospect replies
    if (message.sender === 'inbound') {
      if (lead.stage === 'contacted') {
        lead.stage = 'in_conversation';
      }
      lead.sentiment = req.body.sentiment || 'Replied - Active Conversation';
    }

    await writeStore(store);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Save Discovery Call Notes
app.post('/api/leads/:id/call-notes', async (req, res) => {
  try {
    const store = await readStore();
    const lead = store.leads.find(l => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    lead.callNotes = {
      callDate: req.body.callDate || new Date().toISOString().split('T')[0],
      durationMinutes: Number(req.body.durationMinutes) || 15,
      painSeverity: Number(req.body.painSeverity) || 4,
      wedgeResonance: req.body.wedgeResonance || '',
      discardedFeatures: req.body.discardedFeatures || '',
      willingnessToPay: req.body.willingnessToPay || '',
      verbatimQuotes: req.body.verbatimQuotes || '',
      outcome: req.body.outcome || ''
    };

    if (req.body.nextStage) {
      lead.stage = req.body.nextStage;
    } else {
      lead.stage = 'call_completed';
    }

    await writeStore(store);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. AI-Assisted Notes / Transcript Extractor
app.post('/api/calls/analyze', async (req, res) => {
  try {
    const { rawText, icpId } = req.body;
    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const text = rawText.toLowerCase();

    // Smart heuristic analysis
    let painSeverity = 3;
    if (text.includes('hate') || text.includes('nightmare') || text.includes('every single day') || text.includes('killing us') || text.includes('huge pain') || text.includes('bleeding')) {
      painSeverity = 5;
    } else if (text.includes('hours') || text.includes('frustrating') || text.includes('tedious') || text.includes('annoying') || text.includes('error')) {
      painSeverity = 4;
    } else if (text.includes('works okay') || text.includes('fine right now') || text.includes('already have')) {
      painSeverity = 2;
    } else if (text.includes('no need') || text.includes('not a problem') || text.includes('enterprise handles')) {
      painSeverity = 1;
    }

    // Willingness to Pay extraction
    let willingnessToPay = 'Under evaluation';
    if (text.includes('$') || text.includes('pay') || text.includes('budget') || text.includes('card') || text.includes('cost')) {
      if (text.includes('200') || text.includes('300') || text.includes('400') || text.includes('500')) {
        willingnessToPay = '$200 - $400 / month (High Intent)';
      } else if (text.includes('100') || text.includes('150') || text.includes('99')) {
        willingnessToPay = '$100 - $150 / month (Immediate Fit)';
      } else if (text.includes('free') || text.includes('no budget') || text.includes('$0') || text.includes('too expensive')) {
        willingnessToPay = '$0 / No current budget';
      } else {
        willingnessToPay = 'Expressed willingness to pay on launch';
      }
    } else {
      willingnessToPay = painSeverity >= 4 ? '$100 - $200 / month (Estimated from pain)' : 'Unknown / Needs price probe';
    }

    // Extract quote candidate
    const sentences = rawText.split(/[.!?\n]+/).filter(s => s.trim().length > 15);
    const emotionalSentence = sentences.find(s => 
      s.toLowerCase().includes('hate') || 
      s.toLowerCase().includes('frustrat') || 
      s.toLowerCase().includes('hours') || 
      s.toLowerCase().includes('problem') ||
      s.toLowerCase().includes('sheet') ||
      s.toLowerCase().includes('manual')
    ) || sentences[0] || rawText.slice(0, 80);

    const extracted = {
      painSeverity,
      wedgeResonance: painSeverity >= 4 
        ? "Strong positive reaction to automating the primary bottleneck. Asked when they can start testing."
        : "Moderate interest, but hesitant about workflow disruption or integration overhead.",
      discardedFeatures: "Prospect didn't care about full platform dashboards or custom configuration. Strongly preferred a simple, single-click solution.",
      willingnessToPay,
      verbatimQuotes: `"${emotionalSentence.trim().replace(/^["']|["']$/g, '')}"`,
      recommendedDecision: painSeverity >= 4 ? 'Validate ICP & Invite to Alpha Cohort' : 'Flag as Low Priority or Revise Wedge'
    };

    res.json(extracted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Multi-Inbox Management
app.get('/api/inboxes', async (req, res) => {
  try {
    const store = await readStore();
    res.json(store.inboxes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inboxes', async (req, res) => {
  try {
    const store = await readStore();
    const newInbox = {
      id: 'inbox_' + Date.now().toString(36),
      email: req.body.email,
      provider: req.body.provider || 'Google Workspace',
      dailyLimit: Number(req.body.dailyLimit) || 30,
      sentToday: 0,
      healthScore: 100,
      status: 'Optimal',
      warmupMode: req.body.warmupMode || 'Active',
      rotationWeight: 1.0
    };
    store.inboxes.push(newInbox);
    await writeStore(store);
    res.status(201).json(newInbox);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Simulate Incoming Reply (Live Demo Feature for Founder)
app.post('/api/simulate-reply', async (req, res) => {
  try {
    const store = await readStore();
    const { leadId, replyText, sentiment } = req.body;
    const lead = store.leads.find(l => l.id === leadId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const replyMsg = {
      sender: 'inbound',
      from: lead.email,
      subject: lead.threads.length > 0 ? `Re: ${lead.threads[0].subject}` : 'Re: Quick inquiry',
      body: replyText || "Hey Alex, saw your note. This is actually a big problem for our team right now. Let's set up 15 minutes to talk.",
      timestamp: new Date().toISOString()
    };

    lead.threads.push(replyMsg);
    lead.stage = 'in_conversation';
    lead.sentiment = sentiment || 'Replied - High Interest';
    lead.lastContacted = new Date().toISOString();

    await writeStore(store);
    res.json({
      success: true,
      message: 'Inbound reply simulated. Sequence automatically terminated. Lead moved to "In Conversation".',
      lead
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Templates & Sequence
app.get('/api/templates', async (req, res) => {
  try {
    const store = await readStore();
    res.json(store.templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/templates', async (req, res) => {
  try {
    const store = await readStore();
    const newTpl = {
      id: 'tpl_' + Date.now().toString(36),
      icpId: req.body.icpId,
      touch: Number(req.body.touch) || 1,
      subject: req.body.subject,
      body: req.body.body,
      delayDays: Number(req.body.delayDays) || 0
    };
    store.templates.push(newTpl);
    await writeStore(store);
    res.status(201).json(newTpl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Quick ICP engine running on http://localhost:${PORT}`);
});
