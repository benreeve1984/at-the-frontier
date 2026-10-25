# At The Frontier

A weekly series for the DNA team. Each session takes one AI capability and works out the current Pareto frontier of quality against cost, using benchmarks other people have run.

Live site: https://benreeve1984.github.io/at-the-frontier/

## Sessions

1. [Document extraction](doc-extraction/) (October 2026)
2. [Web search and research](web-research/) (October 2026)

## How it is built

Static HTML, CSS and JavaScript. No build step for the site itself.

- `assets/js/deck.js` is a small slide engine. Keys: arrows or space to move, `O` overview, `N` notes, `F` full screen.
- `assets/js/pareto.js` draws the interactive Pareto charts (D3).
- Each session folder has its slides (`index.html`), demos, research files and a generated `data.js`.

To rebuild the document extraction data after editing the research files:

```bash
python3 scripts/build_pareto.py && python3 scripts/build_data.py
```

To rebuild the web search and research data:

```bash
python3 scripts/build_web_data.py
```

To preview locally:

```bash
python3 -m http.server 8765
```

Prices and scores are snapshots from the date on each session. Third-party images are credited on the slides where they appear.
