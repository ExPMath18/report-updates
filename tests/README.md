# Tests

Needs Node 18 or newer.

```
npm install playwright pdfjs-dist@6.2.108
npx playwright install chromium
node tests/smoke.mjs
```

`smoke.mjs` needs no PDFs. It should print PASS on every line. If a line says FAIL, do not upload the change.

## Testing with real reports
Put reports in `tests/pdfs/`. This folder is ignored by git, so the files stay on your computer. Real student reports must never be committed, because this repo is public.

Then write a small script that uses the helpers:

```js
import { openApp, analyze } from './e2e.mjs';
const { page, close } = await openApp();
await analyze(page, ['Student_A_Level_5.pdf']);
await page.evaluate(() => document.querySelector('input[name="emailMode"][value="rfa"]').click());
await page.evaluate(() => generateRfaEmail());   // returns the email text
await close();
```

Run it before and after your change and compare the email text.

Environment variables: `HTML_PATH` (page to test), `PDF_DIR`, `PDFJS_DIR`, `CHROMIUM_PATH`.
