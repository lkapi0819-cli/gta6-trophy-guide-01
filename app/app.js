// Leonida Legend — GTA VI trophy guide & tracker.
// Offline single-page app: loads only data/trophies.json, stores progress in
// localStorage, and renders the guide, roadmap, missable warnings and filters.
const KEY = 'leonida-legend-progress-v1';
const POINTS = { bronze: 15, silver: 30, gold: 90, platinum: 300 };
const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online / Co-op',
  platinum: 'Platinum',
};
const STAGES = [
  { n: 1, name: 'Story Campaign', tip: 'Play the campaign in order; bank the named-mission and chapter trophies and learn the map.' },
  { n: 2, name: 'Strangers & Side Missions', tip: 'Finish every contact strand to its final mission — each finale is a trophy, and eight strands earn silver.' },
  { n: 3, name: 'Collectibles & Exploration', tip: 'Sweep Leonida region by region: cards, spots, vehicles, areas and garages all live on the same road trips.' },
  { n: 4, name: 'Activities & Challenges', tip: 'Ranges, races, stunts and challenges — short repeatable wins, best done while the patterns are fresh.' },
  { n: 5, name: 'Crime, Combat & Money', tip: 'Robberies, heists and the money systems: stage a getaway vehicle first, every single time.' },
  { n: 6, name: 'Partner Co-op', tip: 'Two trophies need your partner present for the whole sequence — plan them in one session together.' },
  { n: 7, name: 'Final Clean-up & 100%', tip: 'The one-time moments, the 100% completion push, and then the platinum itself.' },
];

const params = new URLSearchParams(location.search);
const state = {
  kind: params.get('filter') || 'all',
  grade: params.get('grade') || 'all',
  q: params.get('q') || '',
  spoiler: params.get('spoiler') === '1',
  hideEarned: false,
};
let earned = new Set();
try {
  const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  if (Array.isArray(raw)) earned = new Set(raw.filter((x) => Number.isInteger(x)));
} catch { earned = new Set(); }

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

const els = {
  cards: document.getElementById('cards'),
  empty: document.getElementById('empty'),
  search: document.getElementById('search'),
  grade: document.getElementById('grade-filter'),
  spoiler: document.getElementById('spoiler-toggle'),
  hideEarned: document.getElementById('hide-earned-toggle'),
  resultCount: document.getElementById('result-count'),
  stageGrid: document.getElementById('stage-grid'),
  missableList: document.getElementById('missable-list'),
};

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderDashboard() {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('stat-earned').textContent = `${done} / ${total}`;
  document.getElementById('stat-percent').textContent = `${Math.round((done / total) * 100)}%`;
  let points = 0;
  for (const id of earned) { const t = byId.get(id); if (t) points += POINTS[t.grade] ?? 0; }
  document.getElementById('stat-points').textContent = String(points);
  document.getElementById('bar-fill').style.width = `${(done / total) * 100}%`;
  const wrap = document.getElementById('stat-grades');
  wrap.replaceChildren();
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const all = trophies.filter((t) => t.grade === g);
    const got = all.filter((t) => earned.has(t.id)).length;
    wrap.append(el('span', 'grade-pill', `${g[0].toUpperCase() + g.slice(1)}: ${got} / ${all.length}`));
  }
}

function renderRoadmap() {
  els.stageGrid.replaceChildren();
  for (const s of STAGES) {
    const list = trophies.filter((t) => t.stage === s.n);
    const got = list.filter((t) => earned.has(t.id)).length;
    const box = el('article', 'stage');
    box.append(el('h3', null, `Stage ${s.n} — ${s.name}`));
    box.append(el('p', null, s.tip));
    box.append(el('span', 'stage-progress', `${got} / ${list.length} earned · ${list.length} trophies`));
    els.stageGrid.append(box);
  }
}

function renderMissables() {
  els.missableList.replaceChildren();
  for (const t of trophies.filter((t) => t.missable)) {
    const li = el('li', null, `${t.name} — ${t.description} Keep a manual save first.`);
    els.missableList.append(li);
  }
}

function matches(t) {
  if (state.kind === 'missable') { if (!t.missable) return false; }
  else if (state.kind !== 'all' && t.kind !== state.kind) return false;
  if (state.grade !== 'all' && t.grade !== state.grade) return false;
  if (state.hideEarned && earned.has(t.id)) return false;
  if (state.q) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(state.q.toLowerCase())) return false;
  }
  return true;
}

function renderCards() {
  els.cards.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown += 1;
    const isEarned = earned.has(t.id);
    const hiddenStory = state.spoiler && t.kind === 'story' && !isEarned;
    const card = el('article', `card${isEarned ? ' earned' : ''}`);

    const top = el('div', 'card-top');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save(); renderAll();
    });
    top.append(box);
    const titleWrap = el('div');
    titleWrap.append(el('h3', hiddenStory ? 'hidden-story' : null,
      hiddenStory ? 'Hidden story trophy — earn it to reveal' : t.name));
    const badges = el('div', 'badges');
    badges.append(el('span', `badge ${t.grade}`, t.grade));
    badges.append(el('span', 'badge kind', KIND_LABELS[t.kind] ?? t.kind));
    if (t.missable) badges.append(el('span', 'badge missable', 'Missable'));
    if (isEarned) badges.append(el('span', 'badge done', 'Earned'));
    if (t.target) badges.append(el('span', 'badge target', `Target: ${t.target}`));
    badges.append(el('span', 'badge stage', `Roadmap stage ${t.stage}`));
    titleWrap.append(badges);
    top.append(titleWrap);
    card.append(top);

    if (hiddenStory) {
      card.append(el('p', 'hidden-story', 'Hidden story trophy — earn it to reveal its official name and description.'));
    } else {
      const off = el('p', 'official');
      const strong = el('strong', null, 'Official: ');
      off.append(strong, document.createTextNode(t.description));
      card.append(off);
      card.append(el('p', 'guide', t.guide));
      const steps = el('ol', 'steps');
      for (const s of t.steps ?? []) steps.append(el('li', null, s));
      card.append(steps);
      card.append(el('p', 'sources', `Sources: ${(t.sources ?? []).join(' · ')}`));
    }
    els.cards.append(card);
  }
  els.empty.hidden = shown !== 0;
  els.resultCount.textContent = `Showing ${shown} of ${trophies.length} trophies · ${trophies.length - earned.size} still to earn`;
  document.title = `Leonida Legend — ${earned.size}/55 trophies earned`;
}

function renderAll() { renderDashboard(); renderRoadmap(); renderCards(); }

// Controls wiring.
els.search.value = state.q;
els.grade.value = state.grade;
els.spoiler.checked = state.spoiler;
els.search.addEventListener('input', () => { state.q = els.search.value; renderCards(); });
els.grade.addEventListener('change', () => { state.grade = els.grade.value; renderCards(); });
els.spoiler.addEventListener('change', () => { state.spoiler = els.spoiler.checked; renderCards(); });
els.hideEarned.addEventListener('change', () => { state.hideEarned = els.hideEarned.checked; renderCards(); });
document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
  if (chip.dataset.kind === state.kind) {
    document.querySelectorAll('#kind-chips .chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
  }
  chip.addEventListener('click', () => {
    document.querySelectorAll('#kind-chips .chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    state.kind = chip.dataset.kind;
    renderCards();
  });
});
document.getElementById('export-btn').addEventListener('click', () => {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  a.download = 'leonida-legend-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (Array.isArray(ids)) {
      earned = new Set(ids.filter((x) => Number.isInteger(x) && byId.has(x)));
      save(); renderAll();
    }
  } catch { /* ignore malformed import files */ }
  e.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  earned = new Set();
  save(); renderAll();
});

renderMissables();
renderAll();
