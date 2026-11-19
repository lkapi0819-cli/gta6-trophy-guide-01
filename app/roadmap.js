// Leonida Legend — the seven-stage Roadmap to the Platinum, rendered as a
// connected timeline. Each stage block names the trophies that belong to it
// (taken from the trophy data itself, so the roadmap can be checked against
// the official list) and shows live earned progress for that stage.

export const ROADMAP_STAGES = [
  { n: 1, name: 'Story Campaign', tip: 'Play the campaign in order; bank the named-mission and chapter trophies and learn the map.' },
  { n: 2, name: 'Strangers & Side Missions', tip: 'Finish every contact strand to its final mission — each finale is a trophy, and eight strands earn silver.' },
  { n: 3, name: 'Collectibles & Exploration', tip: 'Sweep Leonida region by region: cards, spots, vehicles, areas and garages all live on the same road trips.' },
  { n: 4, name: 'Activities & Challenges', tip: 'Ranges, races, stunts and challenges — short repeatable wins, best done while the patterns are fresh.' },
  { n: 5, name: 'Crime, Combat & Money', tip: 'Robberies, heists and the money systems: stage a getaway vehicle first, every single time.' },
  { n: 6, name: 'Partner Co-op', tip: 'Two trophies need your partner present for the whole sequence — plan them in one session together.' },
  { n: 7, name: 'Final Clean-up & 100%', tip: 'The one-time moments, the 100% completion push, and then the platinum itself.' },
];

export function trophiesInStage(trophies, stageNumber) {
  return trophies.filter((t) => t.stage === stageNumber);
}

export function stageProgress(trophies, earned, stageNumber) {
  const list = trophiesInStage(trophies, stageNumber);
  const got = list.filter((t) => earned.has(t.id)).length;
  return { got, total: list.length, names: list.map((t) => t.name) };
}

function timelineElement(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderRoadmapTimeline(container, trophies, earned) {
  container.replaceChildren();
  container.classList.add('roadmap-timeline');
  for (const stage of ROADMAP_STAGES) {
    const progress = stageProgress(trophies, earned, stage.n);
    const block = timelineElement('article', 'stage-block');

    const head = timelineElement('div', 'stage-head');
    head.append(timelineElement('span', 'stage-dot', String(stage.n)));
    head.append(timelineElement('h3', null, `Stage ${stage.n} — ${stage.name}`));
    head.append(timelineElement('span', 'stage-progress',
      `${progress.got} / ${progress.total} earned`));
    block.append(head);

    block.append(timelineElement('p', 'stage-tip', stage.tip));
    block.append(timelineElement('p', 'stage-trophies',
      `Trophies: ${progress.names.join(' · ')}`));

    const bar = timelineElement('div', 'stage-bar');
    const fill = timelineElement('div', 'stage-bar-fill');
    fill.style.width = `${progress.total ? (progress.got / progress.total) * 100 : 0}%`;
    bar.append(fill);
    block.append(bar);

    container.append(block);
  }
}
