# HOGMANAY '26 — The Big Night

A premium black-and-gold, mobile-first family party site for **Thursday 31 December 2026, starting at 8:30 pm and running into the early morning**.

## Experience

- Black-and-gold invitation-style hero, gold disco-ball artwork, soft canvas fireworks and live countdown to UK midnight
- Schedule, venue and travel information, food, dress guidance, FAQs and optional organiser contact
- **The Big Fat Hogmanay Quiz:** 27 multiple-choice questions across New Year, general knowledge and pop culture; choose a category or a mixed round; optional 15-second speed round; scoring, streak bonuses and a local-device leaderboard
- **Nine-dart challenge:** Tap the dartboard to aim and throw, with authentic singles/doubles/trebles/bull scoring, 9-dart rounds, keyboard support and a local personal best
- **Virtual beer pong:** six clickable cups with ball-flight animation, drag-to-aim, throw tally and personal best
- **Reflex Royale**, **Would You Rather?** and **Party Dare Generator**
- Responsive layouts, keyboard-accessible controls and reduced-motion support

The website is built with static HTML, CSS and vanilla JavaScript. No backend, build step, API key or npm installation needed.

## Change the family details

Edit [details.js](details.js) on GitHub:

- `startTime` — currently **8:30 pm until the early hours**
- `venueName` and `venueDescription` — set to the supplied venue address; `mapUrl` is unset until a confirmed map link is available
- `food` — party snacks and nibbles, not a sit-down meal; `dress`, `travel`, `stay` — helpful practical information
- `timeline` — event timings
- `faqs` — frequently asked questions
- `contactDescription` and `contactEmail` — optional contact

Edit [quiz.js](quiz.js) to change the quiz questions and correct answers. Each question includes `cat`, `q`, four `a` options, the correct answer's zero-based index `c`, and explanatory `why`.

## Publish using GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Choose **Deploy from a branch**, branch **main**, folder **/(root)** and save.
3. Once GitHub Pages publishes, the expected site URL is **https://deanderson96.github.io/hogmanay2026/**.

Changes may take a short time to appear after commits. If the old site is still visible, reload without cache.

**Privacy:** GitHub Pages is public. Do not publish private residential addresses, telephone numbers or sensitive family details unless you're comfortable making them public. The quiz leaderboard and best scores for darts and beer pong use local browser storage **only**; they are not shared between relatives on different phones.

## Project files

| File | Purpose |
|---|---|
| `index.html` | Section structure and interactive controls |
| `styles.css` | New party design, responsive layouts, motion and game presentation |
| `details.js` | Editable family information and itinerary |
| `app.js` | Dynamic details, FAQ and countdown |
| `effects.js` | Ambient fireworks and scroll-reveal effects |
| `quiz.js` | Quiz questions, answers, timer, scoring and local leaderboard |
| `pong.js` | Click/touch beer pong, ball animations and score |
| `darts.js` | Interactive nine-dart target game, realistic segment scoring and local best |
| `family-games.js` | Reaction timer, dilemma voting and party dares |

**Please note:** An exact venue address is currently included in the public repository and published page. Change or remove it in `details.js` if you need to limit that information to family only.

No external JavaScript packages are required. Web fonts are optional and fall back to system fonts when unavailable.
