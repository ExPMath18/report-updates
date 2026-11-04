// Shared helpers for the browser tests. Needs: npm i playwright pdfjs-dist@6.2.108
// Env vars (all optional):
//   HTML_PATH  path to the page to test      (default ../index.html)
//   PDF_DIR    folder holding test PDFs      (default ./pdfs, never commit this folder)
//   PDFJS_DIR  folder holding pdf.mjs and pdf.worker.mjs (default node_modules/pdfjs-dist/build)
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = process.env.HTML_PATH || path.join(here, '..', 'index.html');
export const PDF_DIR = process.env.PDF_DIR || path.join(here, 'pdfs');
const PDFJS_DIR = process.env.PDFJS_DIR || path.join(here, '..', 'node_modules', 'pdfjs-dist', 'build');

export async function openApp(){
  const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];
    let f = url === '/' ? HTML_PATH : path.join(PDFJS_DIR, url);
    if(!fs.existsSync(f)){ res.writeHead(404); return res.end(); }
    res.writeHead(200, {'content-type': f.endsWith('.html') ? 'text/html' : 'text/javascript'});
    res.end(fs.readFileSync(f));
  });
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // The page loads pdf.js from a CDN. Swap in the local copy so tests work offline.
  await page.route('https://cdnjs.cloudflare.com/**', route => {
    if(route.request().url().includes('pdf.min.js')){
      return route.fulfill({contentType: 'text/javascript', body: `
        window.__pdfReady = import('http://localhost:${port}/pdf.mjs').then(m => { m.GlobalWorkerOptions.workerSrc = 'http://localhost:${port}/pdf.worker.mjs'; return m; });
        window.pdfjsLib = { GlobalWorkerOptions: {}, getDocument: src => ({ promise: window.__pdfReady.then(m => m.getDocument(src).promise) }) };`});
    }
    return route.fulfill({status: 200, body: ''});
  });
  await page.goto(`http://localhost:${port}/`);
  return { page, errors, close: async () => { await browser.close(); server.close(); } };
}

// Uploads PDFs (file names inside PDF_DIR), clicks Analyze, waits for the summary.
export async function analyze(page, files){
  await page.setInputFiles('#fileAll', files.map(f => path.join(PDF_DIR, f)));
  await page.evaluate(() => document.getElementById('parseBtn').click());
  await page.waitForFunction(() => !!document.querySelector('.sort-summary'), {timeout: 60000});
  await page.waitForTimeout(500);
}
