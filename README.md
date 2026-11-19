# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/lkapi0819-cli/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/lkapi0819-cli/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI PlayStation 5 trophies** — 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy carries its official name, description and grade, plus an original guide written for this page: what to do, the efficient method, the common pitfall, and a numbered step list. The seven trophies that hang on one-time moments are flagged **missable**, with keep-a-manual-save advice in their guides.

## What's inside

- **Featured guides, up front** — the three trophies players ask about first are shown in full on the home view, no clicks needed: **The Shootist** (gold in all 42 Shooting Range challenges), **Don't Touch My Deck** (complete 3 Collectible Card sets) and **A Long Road** (attain 100% completion). They are rendered from the same data as the checklist, so they can never drift from it.
- **Roadmap to the Platinum — 7 stages**: 1 Story Campaign · 2 Strangers & Side Missions · 3 Collectibles & Exploration · 4 Activities & Challenges · 5 Crime, Combat & Money · 6 Partner Co-op · 7 Final Clean-up & 100%. The roadmap is a connected timeline; every stage block names the actual trophies in that stage and shows live earned progress for it.
- **Tracker** — a checkbox on every card, progress saved in `localStorage`, a one-line progress strip (earned count, percentage, trophy points, per-grade breakdown), export/import of progress as a JSON file, and a reset button.
- **Every card is complete** — official name, description and grade, an original guide, a numbered step list, an effort estimate derived from the trophy's own target (Campaign / Checklist / Long grind / One moment…), its roadmap stage, and its cited sources.
- **Missable watchlist** — 7 one-time trophies (ids 37, 44, 45, 47, 48, 49, 50) flagged on their cards and listed up front with keep-a-manual-save advice; the story guides name the exact mission or chapter where the missable-adjacent moments live.
- **Search, filters and spoiler protection** — full-text search, kind and grade filters, and a toggle that hides unearned story trophies until they are earned.

- **Source layout** — `app/app.js` is the page controller (featured guides, card rendering, controls), `app/tracker.js` holds the tracker engine (progress storage, trophy points, filtering, spoiler protection, effort estimates, export/import) and `app/roadmap.js` renders the seven-stage roadmap timeline from the trophy data.

## Features

- **Full guide for all 55 trophies** — original text for every trophy, with sources cited on every card.
- **Seven-stage Roadmap to the Platinum** — story first, then strangers, collectibles, activities, crime & money, partner co-op, and the final 100% clean-up, each stage with live earned progress.
- **Missable watchlist** — the 7 one-time trophies listed up front with save advice.
- **Progress tracker** — tick trophies off and progress persists in `localStorage`; export it to a JSON file and import it back on another browser, or reset it.
- **Progress dashboard** — earned count, percentage, trophy points (bronze 15 / silver 30 / gold 90 / platinum 300) and a per-grade breakdown.
- **Search & filters** — full-text search over names, descriptions and guides; filter by kind (Story, Missable, Collectibles, Activities, Online / Co-op, Platinum) and by grade.
- **Spoiler protection** — hide the names and descriptions of unearned story trophies until you earn them.
- **Fully offline** — static files only; the app loads nothing from the network.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. (`node serve.ts --port <n>` serves on another port.) To build the submission dossier instead:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data & sources

`app/data/trophies.json` holds the trophies. Names, descriptions and grades are the official PlayStation trophy list for Grand Theft Auto VI, as published; the two public listings consulted — Exophase and PSNProfiles — agree on all 55 names, descriptions and grades. All guide text is original to this repository and cites those sources beside each trophy. No game artwork, logos or assets are used.

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=nhastfac&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
