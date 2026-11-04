// Quick check that needs no PDFs: the page loads, Settings works, and nothing throws.
// Run: node tests/smoke.mjs
import { openApp } from './e2e.mjs';
const { page, errors, close } = await openApp();
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'PASS ' : 'FAIL ') + name); if(!ok) failed++; };

const active = () => page.evaluate(() => document.querySelector('input[name=emailCenter]:checked').value);
check('version shows in header', /^v\d{4}\./.test(await page.textContent('#appVersion')));
check('starts on a center', !!(await active()));

await page.click('#setOpen');
check('settings opens', await page.isVisible('#setModal'));
await page.click('#setAdd');
await page.fill('[data-f=label]', 'Test');
await page.fill('[data-f=name]', 'Mathnasium of Test');
await page.click('#setSave');
check('new center becomes active', (await page.textContent('#setOpen')).includes('Test'));

await page.reload();
check('center is remembered after reload', (await page.textContent('#setOpen')).includes('Test'));

await page.click('#setOpen');
await page.mouse.click(5, 5);
check('clicking outside closes settings', !(await page.isVisible('#setModal')));

check('no page errors', errors.length === 0);
if(errors.length) console.log(errors);
await close();
process.exit(failed ? 1 : 0);
