# Email Builder: notes for AI assistants

Read this first. It holds the decisions and rules that came out of building this tool, so you do not have to rediscover them.

## Finding your way around
The top of `index.html` has a file map, and the start of the script has a script map listing every section by name. Search for the capitalized heading (for example `RISK-FREE ASSESSMENT EMAIL` or `NARRATIVE REPORT PARSER`) to jump to it. Keep both maps current when you add or rename a section.

## What this is
A staff tool for Exponential Potential Mathnasium centers (MEV in East Vancouver, WL in West Linn). Staff upload PDF reports exported from Radius, the tool reads them, and it drafts a parent email.

- Email types: Progress Update, Risk-Free Assessment (RFA), Student of the Month (hand-entered, Nominated or Winner), Exit Summary (hidden behind a feature flag), and sibling versions of the PDF-based ones.
- One static file: `index.html` (HTML, CSS and JavaScript together). No backend, no build step.
- PDFs are read in the browser with pdf.js from a CDN. Nothing is uploaded anywhere.
- Hosted on GitHub Pages from the `main` branch.

## Rules that must not be broken
1. **Never commit student data.** This repo is public. No PDFs, no student or parent names, no screenshots of real reports. Use "Student A" style names in comments and tests. `.gitignore` blocks PDFs, but check anyway.
2. **Bump `APP_VERSION`** near the bug-report code at the bottom of `index.html` on every change. Format `YYYY.MM.DD-a`, then `-b`, and so on. Staff and bug reports show it, so it is how we know which version someone is running.
3. **Never paste code into GitHub's web editor.** It has corrupted this file before. Upload the whole file instead, or use git.
4. **Wait for the green check** on the Pages build before uploading again. Back-to-back uploads cancel each other.
5. **Keep it simple.** The owner wants a clear, low-clutter design. Do not add options or screens unless asked.
6. The bug-report URL and token near `APP_VERSION` point at the owner's Apps Script. Leave them alone. The Apps Script for bug reports lives outside this repo.

## Voice (parent-facing text)
- Warm, positive and direct. One Mathnasium voice for every center. No per-center wording.
- No "This is ___ with Mathnasium" opener. Every email ends with `Best,` and the sender's first name. The rest of the signature comes from the staff member's email app when they paste.
- Avoid em dashes, "pinpoint", and AI-sounding words (for example "genuinely", "honestly", "straightforward").
- Short, natural sentences. Concise beats thorough.
- The expected first-assessment score range is 40-70%. Score wording changes by score: under 40 reads as "tells us exactly where to begin", over 70 as "a really strong start", otherwise "a great starting point".

## Email rules
- **Order of assessments in an email:** Numerical Fluency Add/Sub, Numerical Fluency Mult/Div, Computation, the grade-level assessment, then Extensions. Done by `assessmentOrderRank`, whatever order the PDFs came in.
- Computation is for 5th to 7th grade and comes after the four basic operations are mastered. Source: Assessment Selection Guide v19 (Mathnasium).
- Both centers send the Assessment Report and the Learning Plan as standard.
- Progress Updates go out after the student finishes their Learning Plan and is reassessed (same at both centers).
- The "day at Mathnasium" / Program Overview line was removed on purpose. Do not bring it back.
- Learning Plan topics are a bulleted list, not a paragraph.
- The Numerical Fluency checkup has no overall percentage, only tiers (Mastery, Competency, Awareness, No Knowledge). In RFA emails it reads "showed mastery in 7 of 9 skill areas" (`tierSummary`, `scoreClause`). Any add-on with neither a score nor tiers is left out of the email.

## How PDFs are read
Radius exports several layouts. Each has its own parser. Look for these functions in `index.html`:
- `parseChart`: percentage-bar charts (Assessment Charts and Comparison Charts).
- `parseNarrativeReport`: the narrative Assessment and Mastery reports. Combined reports carry several score cards, read by `parseTwoCardScores`, `parseAssessmentSkillsNames` and `parseCardColumns`.
- `parseLearningPlanReport`: Learning Plan reports (pixel-position based). It fills the Learning Plan topics field.
- Numerical Fluency checkup parsers.

Known limits:
- A combined report that already has Initial vs Recent comparisons only gives combined totals. Per-card initial scores are graphics and cannot be read, so those scores are not split.
- A category whose total is a sum of a base level and its Extension (Geometry, for example) cannot be assigned to one assessment, so its topics stay with the main assessment.
- Radius prints only about 3 example topics per category on a 0% report, so topic lookup tables are partial. The category totals in `ASSESSMENT_TOPIC_REFERENCE` are exact.

## Workspace: sign-in, settings and email templates
Each center signs in with its own password. Its settings and email templates live in a Google Sheet behind an Apps Script web app (`WORKSPACE_URL` constant). The script lives outside this repo.
- The page POSTs `text/plain` JSON `{action, center, password, ...}`. Actions: `login`, `saveSettings`, `saveTemplate`, `deleteTemplate`, `reorder`, `changePassword`, and `createCenter` (needs a setup code). Replies are `{ok:true, ...}` or `{ok:false, error}`.
- New centers start with the shared standard templates and a starting password. They must choose their own password on first sign-in. Five wrong tries locks a center for 15 minutes.
- The signed-in center and password are remembered in `localStorage` (`emailBuilderLogin.v1`). Passwords and the setup code are never in this repo.
- Signed in, the Settings button opens a side panel (center settings, template list with up/down/edit/hide/delete, change password). The old per-device Settings window only appears when the page is offline or `WORKSPACE_URL` is empty.
- Templates mode: staff pick a template, the page builds a form from every `{blank}` in it, and Generate fills the email box. `{sender}` and `{center}` fill in automatically. Unfilled blanks show as `[FILL IN: name]`. Pronoun blanks (`{he/she}`, `{his/her}`, `{him/her}`) come from one pronoun picker.
- Template HTML is cleaned to simple formatting on the server and again in the page (`clientSanitize`).
- Templates hold no student data. Never put real student or parent details in a template.
- If the workspace cannot be reached, "Continue without signing in" falls back to the settings saved on the device. The PDF email builders never depend on the workspace.
- Student of the Month nominations are separate (see below) and use their own password.

## Settings and centers (device settings, used when offline)
- Settings are saved in the browser (`localStorage`, key `emailBuilderSettings.v1`), per device.
- `settings.centers` holds each center's short name, full name, and default checkboxes (scheduling, Learning Plan, homework). MEV and WL are the seeded defaults.
- `CENTER_INFO` is rebuilt from settings and read by the email generators. The center is chosen in Settings. A hidden radio group `name="emailCenter"` still carries the active center, because many functions read it. Do not remove it without updating them.
- A link ending in `?center=MEV` (or `?center=WL`) opens on that center and remembers it, even if the browser lost its saved settings. Brand-new devices start on MEV. Bug reports include a `storage` diagnostic (can the browser save, what center was saved).
- The only place the full center name shows up in an email is the drop-in line when scheduling is off.

## Student of the Month nominations
Staff submit nominations in a Google Form. In SotM mode the page loads them, runs a raffle wheel and fills the email fields.
- Data comes from an Apps Script web app bound to the form's response sheet (`SOTM_URL` constant). The script lives outside this repo. The page POSTs `text/plain` JSON: `{action:'list'|'clear', password, month:'YYYY-MM'}`. Replies are `{ok:true, rows:[...]}` or `{ok:false, error}`. A CSV upload is the fallback.
- The password is a Script Property in the owner's script. It is typed into the page and kept in `sessionStorage` only. Never put it, or any student name, in this repo.
- Loaded rows and winners live in memory and `sessionStorage`. "Clear from this page" wipes them. "Delete this month's submissions" removes them from the sheet and form (needs password and typing DELETE).
- One raffle entry per nominated student. Winners use the Winner template, everyone else the Nominated template. The winner count defaults to 3 (an assumption, editable on the page).
- Parent name and pronoun are not on the form, so they stay manual.
- Student of the Month is a per-center setting (`sotm` on each center in Settings). MEV has it on, WL off, and new centers start off. When off, the mode button is hidden.

## Bug reports
"Report a problem" posts JSON to a Google Apps Script web app, which emails the owner the description, center, screenshot (html2canvas, loaded on demand), uploaded PDFs and diagnostics. It uses `mode: 'no-cors'`, so the page cannot read the reply. If no URL is set, it downloads a report file instead.

## Testing
No test framework. Two kinds of checks:
1. `node tests/smoke.mjs` runs with no PDFs: page loads, Settings works, no errors. Run this before every upload. See `tests/README.md` for setup.
2. For anything that touches PDF reading or email wording, run real reports through the page with `tests/e2e.mjs` (helper: `openApp`, `analyze`) and compare the email text before and after your change. Keep test PDFs in `tests/pdfs/` on your own computer only. They are git-ignored.

Always check that unrelated emails did not change. Most regressions in this project were a fix for one report layout quietly changing another.

## Open items
- Two main-level assessments in one baked-comparison report (for example Level 6 and Level 7) are scored together. Waiting on the center director's decision to run them as separate reports.
- Computation ordering is built to the rules above but has not been tested with a real Computation report.
- Test on iPad: PDF upload and the formatting toolbar on the email box.
- Optional: split `index.html` into a few files to reduce merge conflicts.
