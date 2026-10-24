// ==========================================================
// GAMIFICATION STORE: LEVELS, XP, QUESTS & BADGES
// ==========================================================

const STORAGE_KEY = 'quick_icp_founder_gamification';

const DEFAULT_STATE = {
  xp: 120,
  streak: 2,
  lastActiveDate: new Date().toISOString().split('T')[0],
  callsLogged: 2,
  signalsCaptured: 7,
  completedQuests: ['quest_mom_test_intro'],
  badges: ['badge_first_touch', 'badge_curiosity_open']
};

export const LEVELS = [
  { level: 1, title: 'Code Slinger', minXp: 0, maxXp: 150, desc: 'Tempted to pitch features rather than listening.' },
  { level: 2, title: 'Curious Explorer', minXp: 150, maxXp: 350, desc: 'Asks open questions and maps the customer workflow.' },
  { level: 3, title: 'Pain Detective', minXp: 350, maxXp: 650, desc: 'Uncovers ugly manual workarounds and emotional agony.' },
  { level: 4, title: 'Wedge Validator', minXp: 650, maxXp: 1000, desc: 'Tests isolated 1-feature solutions against budgets.' },
  { level: 5, title: 'ICP Master', minXp: 1000, maxXp: 2000, desc: 'Predictable, repeatable pull from paying customers.' }
];

export const QUESTS = [
  {
    id: 'quest_mom_test_intro',
    title: 'The Mom Test Rule',
    desc: 'Conduct a 10-minute discovery conversation without pitching your solution once.',
    xp: 50,
    icon: '🎯'
  },
  {
    id: 'quest_workaround_hunt',
    title: 'Workaround Hunter',
    desc: 'Uncover the specific hack, Excel sheet, or competitor they pay for or endure today.',
    xp: 50,
    icon: '🔍'
  },
  {
    id: 'quest_bloat_slayer',
    title: 'Bloat Slayer',
    desc: 'Identify at least 1 feature the customer explicitly confirms they do NOT care about.',
    xp: 50,
    icon: '✂️'
  },
  {
    id: 'quest_quote_catcher',
    title: 'Verbatim Gold',
    desc: 'Log an exact word-for-word quote describing their daily operational agony.',
    xp: 40,
    icon: '💬'
  },
  {
    id: 'quest_price_anchor',
    title: 'Dollar Anchor',
    desc: 'Find what budget or past payment they already committed to this problem space.',
    xp: 75,
    icon: '💰'
  },
  {
    id: 'quest_practice_run',
    title: 'Simulator Novice',
    desc: 'Complete an interactive practice conversation with a virtual prospect persona.',
    xp: 50,
    icon: '🕹️'
  }
];

export const BADGES = [
  {
    id: 'badge_first_touch',
    title: 'First Curiosity Touch',
    desc: 'Replaced a cold sales pitch with a peer question.',
    icon: '⚡'
  },
  {
    id: 'badge_curiosity_open',
    title: 'Zero-Pitch Novice',
    desc: 'Held back the feature list for 5+ minutes.',
    icon: '🛡️'
  },
  {
    id: 'badge_workaround_master',
    title: 'Excel Sleuth',
    desc: 'Found an ugly internal sheet holding a company together.',
    icon: '📊'
  },
  {
    id: 'badge_bloat_slayer',
    title: 'Feature Pruner',
    desc: 'Saved 2 weeks of engineering by discarding unwanted bloat.',
    icon: '✂️'
  },
  {
    id: 'badge_wtp_unlocked',
    title: 'Willingness Unlocked',
    desc: 'Prospect offered dollars or requested early design partner alpha.',
    icon: '💎'
  }
];

export function getGamificationState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveGamificationState(DEFAULT_STATE);
      return DEFAULT_STATE;
    }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveGamificationState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification state', e);
  }
}

export function getCurrentLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function addXp(points, reason = '') {
  const state = getGamificationState();
  const oldLevel = getCurrentLevel(state.xp);
  state.xp += points;
  const newLevel = getCurrentLevel(state.xp);
  const leveledUp = newLevel.level > oldLevel.level;

  saveGamificationState(state);

  return {
    oldXp: state.xp - points,
    newXp: state.xp,
    gained: points,
    reason,
    oldLevel,
    newLevel,
    leveledUp
  };
}

export function markQuestCompleted(questId) {
  const state = getGamificationState();
  if (!state.completedQuests.includes(questId)) {
    state.completedQuests.push(questId);
    const quest = QUESTS.find(q => q.id === questId);
    const xpBonus = quest ? quest.xp : 50;
    state.xp += xpBonus;
    saveGamificationState(state);
    return { completed: true, quest, xpBonus };
  }
  return { completed: false };
}

export function awardBadge(badgeId) {
  const state = getGamificationState();
  if (!state.badges.includes(badgeId)) {
    state.badges.push(badgeId);
    saveGamificationState(state);
    return BADGES.find(b => b.id === badgeId);
  }
  return null;
}
