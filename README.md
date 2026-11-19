# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/lkapi0819-cli/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/lkapi0819-cli/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI PlayStation 5 trophies** — 1 platinum, 2 gold, 6 silver and 46 bronze. Every trophy carries its official name, description and grade, plus an original guide written for this page: what to do, the efficient method, the common pitfall, and a numbered step list. The seven trophies that hang on one-time moments are flagged **missable**, with keep-a-manual-save advice in their guides.

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
