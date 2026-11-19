// Leonida Legend — GTA VI trophy guide & tracker (page controller).
// Offline single-page app: loads only data/trophies.json, keeps progress in
// localStorage via tracker.js, draws the platinum roadmap via roadmap.js,
// and renders featured guides, the missable watchlist and the trophy cards.
import {
  PROGRESS_STORAGE_KEY,
  KIND_LABELS,
  loadEarnedIds,
  saveEarnedIds,
  computeTrophyPoints,
  computeGradeBreakdown,
  effortLabelFor,
  filterTrophies,
  applySpoilerProtection,
  exportProgressFile,
  importProgressFile,
} from './tracker.js';
import { renderRoadmapTimeline } from './roadmap.js';

const FEATURED_GUIDE_IDS = [17, 30, 14]; // The Shootist, Don't Touch My Deck, A Long Road
const TROPHY_DATA_URL = 'data/trophies.json';

const params = new URLSearchParams(location.search);
const state = {
  kind: params.get('filter') || 'all',
  grade: params.get('grade') || 'all',
  q: params.get('q') || '',
  spoiler: params.get('spoiler') === '1',
  hideEarned: false,
};
let earned = loadEarnedIds(PROGRESS_STORAGE_KEY);

const doc = await (await fetch(TROPHY_DATA_URL)).json();
const trophies = doc.trophies;
const trophiesById = new Map(trophies.map((t) => [t.id, t]));

const els = {
  cards: document.getElementById('cards'),
  featured: document.getElementById('featured-cards'),
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
  saveEarnedIds(earned, PROGRESS_STORAGE_KEY);
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function toggleEarned(id, isNowEarned) {
  if (isNowEarned) earned.add(id); else earned.delete(id);
  save();
  renderAll();
}

// One card builder shared by the featured guides and the main list, so a
// featured card can never drift from the card in the full checklist.
function buildTrophyCard(trophy, options = {}) {
  const isEarned = earned.has(trophy.id);
  const masked = applySpoilerProtection(trophy, state.spoiler, earned);
  const card = el('article', `card${isEarned ? ' earned' : ''}`);

  const top = el('div', 'card-top');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => toggleEarned(trophy.id, box.checked));
  top.append(box);

  const titleWrap = el('div');
  titleWrap.append(el('h3', masked ? 'hidden-story' : null,
    masked ? 'Hidden story trophy — earn it to reveal' : trophy.name));
  const badges = el('div', 'badges');
  badges.append(el('span', `badge ${trophy.grade}`, trophy.grade));
  if (options.featured) badges.append(el('span', 'badge featured', 'Featured guide'));
  badges.append(el('span', 'badge kind', KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.missable) badges.append(el('span', 'badge missable', 'Missable'));
  if (isEarned) badges.append(el('span', 'badge done', 'Earned'));
  if (trophy.target) badges.append(el('span', 'badge target', `Target: ${trophy.target}`));
  badges.append(el('span', 'badge effort', `Effort (guide estimate): ${effortLabelFor(trophy)}`));
  badges.append(el('span', 'badge stage', `Roadmap stage ${trophy.stage}`));
  titleWrap.append(badges);
  top.append(titleWrap);
  card.append(top);

  if (masked) {
    card.append(el('p', 'hidden-story',
      'Hidden story trophy — earn it to reveal its official name and description.'));
    return card;
  }
  const official = el('p', 'official');
  official.append(el('strong', null, 'Official: '), document.createTextNode(trophy.description));
  card.append(official);
  card.append(el('p', 'guide', trophy.guide));
  const steps = el('ol', 'steps');
  for (const step of trophy.steps ?? []) steps.append(el('li', null, step));
  card.append(steps);
  card.append(el('p', 'sources', `Sources: ${(trophy.sources ?? []).join(' · ')}`));
  return card;
}

function renderFeaturedGuides() {
  els.featured.replaceChildren();
  for (const id of FEATURED_GUIDE_IDS) {
    const trophy = trophiesById.get(id);
    if (trophy) els.featured.append(buildTrophyCard(trophy, { featured: true }));
  }
}

function renderProgressStrip() {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('stat-earned').textContent = `${done} / ${total} earned`;
  document.getElementById('stat-percent').textContent = `${Math.round((done / total) * 100)}% complete`;
  document.getElementById('stat-points').textContent =
    `${computeTrophyPoints(trophies, earned)} trophy points`;
  document.getElementById('bar-fill').style.width = `${(done / total) * 100}%`;
  const wrap = document.getElementById('stat-grades');
  wrap.replaceChildren();
  for (const row of computeGradeBreakdown(trophies, earned)) {
    wrap.append(el('span', 'grade-pill',
      `${row.grade[0].toUpperCase() + row.grade.slice(1)} ${row.got}/${row.total}`));
  }
}

function renderRoadmap() {
  renderRoadmapTimeline(els.stageGrid, trophies, earned);
}

function renderMissables() {
  els.missableList.replaceChildren();
  for (const t of trophies.filter((t) => t.missable)) {
    els.missableList.append(el('li', null,
      `${t.name} — ${t.description} Keep a manual save first.`));
  }
}

function currentFilters() {
  return {
    kind: state.kind,
    grade: state.grade,
    hideEarned: state.hideEarned,
    query: state.q,
    earned,
  };
}

function renderCards() {
  const visible = filterTrophies(trophies, currentFilters());
  els.cards.replaceChildren();
  for (const trophy of visible) els.cards.append(buildTrophyCard(trophy));
  els.empty.hidden = visible.length !== 0;
  els.resultCount.textContent =
    `Showing ${visible.length} of ${trophies.length} trophies · ${trophies.length - earned.size} still to earn`;
  document.title = `Leonida Legend — ${earned.size}/55 trophies earned`;
}

function renderAll() {
  renderProgressStrip();
  renderFeaturedGuides();
  renderRoadmap();
  renderCards();
}

// Controls wiring.
els.search.value = state.q;
els.grade.value = state.grade;
els.spoiler.checked = state.spoiler;
els.search.addEventListener('input', () => { state.q = els.search.value; renderCards(); });
els.grade.addEventListener('change', () => { state.grade = els.grade.value; renderCards(); });
els.spoiler.addEventListener('change', () => {
  state.spoiler = els.spoiler.checked;
  renderFeaturedGuides();
  renderCards();
});
els.hideEarned.addEventListener('change', () => {
  state.hideEarned = els.hideEarned.checked;
  renderCards();
});
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
document.getElementById('export-btn').addEventListener('click', () => exportProgressFile(earned));
document.getElementById('import-input').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await importProgressFile(file, trophiesById);
    if (imported) {
      earned = imported;
      save();
      renderAll();
    }
  } catch { /* ignore malformed import files */ }
  event.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  earned = new Set();
  save();
  renderAll();
});

renderMissables();
renderAll();
