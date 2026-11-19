// Leonida Legend — tracker engine for the GTA VI trophy guide.
// Progress storage (localStorage), trophy-point maths, filtering, spoiler
// protection and the per-trophy effort estimate. Pure helpers plus the two
// file actions (export / import) the tracker buttons call.

export const PROGRESS_STORAGE_KEY = 'leonida-legend-progress-v1';
export const TROPHY_POINTS = { bronze: 15, silver: 30, gold: 90, platinum: 300 };
export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
export const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online / Co-op',
  platinum: 'Platinum',
};

export function loadEarnedIds(storageKey = PROGRESS_STORAGE_KEY) {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (Array.isArray(raw)) return new Set(raw.filter((x) => Number.isInteger(x)));
  } catch { /* a corrupt saved value simply starts the tracker fresh */ }
  return new Set();
}

export function saveEarnedIds(earned, storageKey = PROGRESS_STORAGE_KEY) {
  localStorage.setItem(storageKey, JSON.stringify([...earned]));
}

export function computeTrophyPoints(trophies, earned) {
  let points = 0;
  for (const t of trophies) {
    if (earned.has(t.id)) points += TROPHY_POINTS[t.grade] ?? 0;
  }
  return points;
}

export function computeGradeBreakdown(trophies, earned) {
  return GRADE_ORDER.map((grade) => {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => earned.has(t.id)).length;
    return { grade, got, total: all.length };
  });
}

// An effort label derived only from the trophy's own official target,
// kind and missable flag — a guide estimate, never an official figure.
export function effortLabelFor(trophy) {
  if (trophy.missable) return 'One moment';
  if (trophy.kind === 'story') return 'Campaign';
  if (trophy.kind === 'collectibles') return 'Checklist';
  if (trophy.kind === 'platinum') return 'Full completion';
  if (trophy.kind === 'online') return 'Co-op session';
  const target = trophy.target ?? '';
  if (/250|100 locations|\$250,000|500/.test(target)) return 'Long grind';
  if (/42|50 challenges/.test(target)) return 'Skill grind';
  return 'Standard';
}

export function filterTrophies(trophies, filters) {
  return trophies.filter((t) => {
    if (filters.kind === 'missable') { if (!t.missable) return false; }
    else if (filters.kind !== 'all' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.hideEarned && filters.earned.has(t.id)) return false;
    if (filters.query) {
      const haystack = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!haystack.includes(filters.query.toLowerCase())) return false;
    }
    return true;
  });
}

// Spoiler protection: an unearned story trophy is masked until it is earned.
export function applySpoilerProtection(trophy, spoilerOn, earned) {
  return Boolean(spoilerOn && trophy.kind === 'story' && !earned.has(trophy.id));
}

export function exportProgressFile(earned) {
  const payload = JSON.stringify(
    { game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) },
    null,
    2,
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'leonida-legend-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parseImportedProgress(text, validIds) {
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) return null;
  return new Set(ids.filter((x) => Number.isInteger(x) && validIds.has(x)));
}

export async function importProgressFile(file, validIds) {
  if (!file) return null;
  return parseImportedProgress(await file.text(), validIds);
}
