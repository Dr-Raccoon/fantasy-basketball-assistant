# Fantasy Basketball Assistant — Draft Assistant (Static Web App)

A no-backend, browser-only app suitable for GitHub Pages. Upload your CSV player database, draft players to teams, see team totals, and compare H2H by category values.

## Features
- CSV upload (PapaParse) with column mapping UI (raw stats + per-category values supported)
- Draft flow: search → pick → assign to any of 12 teams
- Teams overview: per-category **value sums** and **raw stat sums**, plus total value
- Compare view: pick **My Team** vs **Opponent**; opponent’s cells highlight **green** if they’re ahead, **red** if behind
- Local persistence (localStorage). No server.

## League assumptions
- H2H 9-cat (PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TOV)
- 12 teams, 13 roster slots (display only for now)

## How to publish with GitHub Pages
1. Create a public repo (or use your existing one).
2. Upload all files/folders from this ZIP.
3. Commit and push to `main`.
4. In repo **Settings → Pages**, set: `Deploy from a branch → main → /(root)`.
5. Open the site URL GitHub provides (e.g. `https://<user>.github.io/fantasy-basketball-assistant/`).

## How to use
1. Open the site → **Upload / Map** tab → upload your CSV (or *Load sample*).
2. Map your columns (Name, optional Team/Positions; choose stat+value columns for the 9 cats) → **Save Mapping & Load Players**.
3. **Draft** tab → search → **Draft → Team**.
4. **Teams** tab → see totals; **Compare** tab → pick your team vs opponent.

> All data stays in your browser (localStorage). Use “Reset all” on the Upload tab to start over.
