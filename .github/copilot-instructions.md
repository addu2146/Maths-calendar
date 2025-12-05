# Maths Calendar – AI Helper Notes

- **What this is**: Static-ish vanilla JS/HTML/CSS app served from `public/`, with Vercel serverless functions in `api/` for data (`months`) and Gemini AI proxy. No bundler/build step.
- **Run locally**: `npm install` then `npm start` (runs `server.js`, serves `public/`). Directly opening `public/index.html` also works for static use. No tests configured.
- **Deploy shape**: `vercel.json` routes `/api/*` to Node functions and everything else to `/public/*`. `builds` uses `@vercel/static` + `@vercel/node` (runtime pinned to nodejs18.x for fetch). Keep assets in `public/` in sync; `src/` is an older copy not used by Vercel routes.

- **Key front-end files (active)**: `public/js/main.js` (bootstraps Calendar, hooks UI, hydrates from /api/months), `public/js/calendar.js` (UI logic, MCQ flow, progress tracking, animations, Gemini calls), `public/js/data.js` (bundled month data), `public/css/styles.css` (glassmorphism UI, responsive, day-card/MCQ styling), `public/index.html` (entry shell).
- **Serverless/API files**: `api/months.js` serves `{ months, data }` with DEFAULT_DATA; keep in sync with `public/js/data.js` when adding content. `api/gemini.js` proxies Gemini; uses `process.env.GEMINI_API_KEY` (fallback hardcoded demo), `process.env.GEMINI_MODEL` default `gemini-1.5-flash`; returns `{content, live, fallbackReason}` on error.
- **AI UX**: Front-end `askGemini` hits `/api/gemini`; on fallback, UI shows the reason. Keep responses concise/kid-friendly (<150 words). Avoid exposing keys client-side; prefer proxy.
- **MCQ logic**: `calendar.js` renders choices via `_generateChoices`; prefers curated `fact.choices`, otherwise contextual pools (yes/no, true/false, numeric neighbors, shapes/number words/math symbols). Correctness is case-insensitive. Preserve this behavior when editing facts/choices.
- **Data shape**: Each month object has `{ name, math, quote, bg, offset, days, facts: [{ t, q, a, choices? }] }`. Facts in API and public data should match. `offset` is weekday of 1st (0=Sun).
- **Progress/state**: Progress stored in `localStorage` (`mathCalendarProgress`); `_markCompleted` updates streaks and day cards. Avoid breaking keys/structure.
- **Styling patterns**: Uses CSS variables and glassmorphism cards. Empty day slots use `.day-card.empty` (no border/shadow). MCQ buttons styled via `.choice-btn`; confetti/sparkles in `calendar.js`.
- **Animations/Easter eggs**: Background shapes via `spawnShapes`; confetti on correct answers; Konami code toggles party mode. Preserve when refactoring.
- **Error handling**: Front-end falls back to canned responses if API fails; backend returns fallback content with `fallbackReason`. Log/propagate reasons rather than suppressing.

- **When editing**: Prefer `public/` files for live behavior; if updating month data, change both `public/js/data.js` and `api/months.js`. Keep ASCII. No build step—avoid adding tooling unless needed. Update `vercel.json` if routes/runtime change.
- **Quick commands**: `npm start` to serve; `vercel deploy` for hosting (honors `vercel.json`).
I want a fully working maths calender with Proper css layout and formatting .
The emphasis is on the content ! 
i want it correct . all answers ! it should be mathematically correct and professional.