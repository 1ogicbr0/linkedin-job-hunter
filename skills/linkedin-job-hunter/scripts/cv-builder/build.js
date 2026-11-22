// Builds a 1-page A4 CV as DOCX + PDF from a JSON content file (see templates/cv.example.json).
// Usage: node build.js <content.json> <output-dir>
// Writes <output-dir>/<Name>_CV.docx and .pdf, and warns if the PDF runs past 1 page.
// PDF needs Google Chrome or Chromium; set CHROME_PATH if it isn't found automatically.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, BorderStyle, TabStopType,
} = require('docx');

const [, , SRC, OUT] = process.argv;
if (!SRC || !OUT) {
  console.error('Usage: node build.js <content.json> <output-dir>');
  process.exit(1);
}
const cv = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const BASENAME = `${cv.name.trim().replace(/[^\p{L}\p{N}]+/gu, '_')}_CV`;

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p));
}

// ---------- DOCX ----------
const FONT = 'Arial';
const SZ = 18; // 9pt
const RIGHT_TAB = 10506; // A4 width 11906 - 2 x 700 margins

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? SZ, bold: o.bold, italics: o.italics });
const heading = (text) => new Paragraph({
  spacing: { before: 140, after: 60 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: '000000', space: 2 } },
  children: [run(text, { bold: true, size: 23 })],
});
const leftRight = (left, right) => new Paragraph({
  spacing: { before: 80, after: 0 },
  tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
  children: [run(left, { bold: true }), run(`\t${right}`)],
});
const italicLine = (text) => new Paragraph({ spacing: { after: 20 }, children: [run(text, { italics: true })] });
const bullet = (text) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 20 }, children: [run(text)] });

const children = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run(cv.name, { bold: true, size: 32 })] }),
  ...cv.contact.map((c) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [run(c)] })),
  heading('PROFESSIONAL SUMMARY'),
  new Paragraph({ spacing: { after: 20 }, children: [run(cv.summary)] }),
  heading('PROFESSIONAL EXPERIENCE'),
];
for (const j of cv.jobs) {
  children.push(leftRight(j.company, j.right), italicLine(j.title));
  j.bullets.forEach((b) => children.push(bullet(b)));
}
children.push(heading('TECHNICAL SKILLS'));
cv.skills.forEach(([k, v]) => children.push(new Paragraph({ spacing: { after: 20 }, children: [run(`${k} — `, { bold: true }), run(v)] })));
children.push(heading('EDUCATION'));
cv.education.forEach((e) => children.push(leftRight(e.school, e.right), italicLine(e.degree)));
if (cv.projects?.length) {
  children.push(heading('PROJECTS'));
  cv.projects.forEach((p) => children.push(leftRight(p.name, p.year), new Paragraph({ indent: { left: 240 }, children: [run(p.text)] })));
}

const doc = new Document({
  creator: cv.name,
  title: `${cv.name} CV`,
  styles: { default: { document: { run: { font: FONT, size: SZ } } } },
  numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 200 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 620, bottom: 620, left: 700, right: 700 } } },
    children,
  }],
});

// ---------- HTML (printed to PDF) ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const lr = (l, r) => `<p class="lr"><b>${esc(l)}</b><span>${esc(r)}</span></p>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(cv.name)} CV</title><style>
@page{size:A4;margin:9mm 12mm}
body{font-family:Roboto,Arial,Helvetica,sans-serif;font-size:9pt;line-height:1.2;color:#000;margin:0}
h1{font-size:16pt;text-align:center;margin:0 0 2pt}
.c{text-align:center;margin:0 0 2pt}
h2{font-size:11pt;border-bottom:1.5px solid #000;margin:7pt 0 3pt;padding-bottom:1pt}
p{margin:0 0 1.5pt}
.lr{display:flex;justify-content:space-between;margin-top:4pt}
.i{font-style:italic}
ul{margin:1pt 0 0;padding-left:16pt}li{margin:0 0 1pt}
.ind{padding-left:10pt}
</style></head><body>
<h1>${esc(cv.name)}</h1>${cv.contact.map((c) => `<p class="c">${esc(c)}</p>`).join('')}
<h2>PROFESSIONAL SUMMARY</h2><p>${esc(cv.summary)}</p>
<h2>PROFESSIONAL EXPERIENCE</h2>${cv.jobs.map((j) => lr(j.company, j.right) + `<p class="i">${esc(j.title)}</p><ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`).join('')}
<h2>TECHNICAL SKILLS</h2>${cv.skills.map(([k, v]) => `<p><b>${esc(k)} —</b> ${esc(v)}</p>`).join('')}
<h2>EDUCATION</h2>${cv.education.map((e) => lr(e.school, e.right) + `<p class="i">${esc(e.degree)}</p>`).join('')}
${cv.projects?.length ? `<h2>PROJECTS</h2>${cv.projects.map((p) => lr(p.name, p.year) + `<p class="ind">${esc(p.text)}</p>`).join('')}` : ''}
</body></html>`;

Packer.toBuffer(doc).then((buf) => {
  fs.mkdirSync(OUT, { recursive: true });
  const docxPath = path.join(OUT, `${BASENAME}.docx`);
  fs.writeFileSync(docxPath, buf);
  console.log(`DOCX: ${docxPath}`);

  const chrome = findChrome();
  if (!chrome) {
    console.log('PDF skipped: Chrome/Chromium not found. Set CHROME_PATH to build the PDF.');
    return;
  }
  const pdfPath = path.join(OUT, `${BASENAME}.pdf`);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-'));
  const htmlPath = path.join(tmpDir, 'cv.html');
  fs.writeFileSync(htmlPath, html);
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`], { stdio: 'ignore' });
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const counts = [...fs.readFileSync(pdfPath, 'latin1').matchAll(/\/Count (\d+)/g)].map((m) => Number(m[1]));
  const pages = counts.length ? Math.max(...counts) : 0;
  console.log(`PDF:  ${pdfPath} (${pages} page${pages === 1 ? '' : 's'})`);
  if (pages > 1) console.log('WARNING: more than 1 page. Shorten bullets or the summary until it fits.');
});
