import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const data = JSON.parse(readFileSync('reports/results.json', 'utf8'));

const rows = [];
(function walk(suite, file) {
  const f = suite.file ?? file;
  for (const spec of suite.specs ?? []) {
    const r = spec.tests[0]?.results.at(-1);
    rows.push({
      file: f,
      title: spec.title,
      ok: spec.ok,
      status: r?.status ?? 'unknown',
      ms: r?.duration ?? 0,
      error: r?.error?.message?.split('\n')[0] ?? '',
    });
  }
  for (const s of suite.suites ?? []) walk(s, f);
})({ suites: data.suites });

const groups = new Map();
for (const r of rows) {
  if (!groups.has(r.file)) groups.set(r.file, []);
  groups.get(r.file).push(r);
}

const total = rows.length;
const passed = rows.filter((r) => r.ok).length;
const failed = total - passed;
const secs = (data.stats?.duration ?? 0) / 1000;
const rate = total ? ((passed / total) * 100).toFixed(1) : '0';
const date = new Date(data.stats?.startTime ?? Date.now()).toLocaleString();
const shots = readdirSync('reports/screenshots').filter((f) => f.endsWith('.png')).sort();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const verdict = failed === 0 ? 'PASS' : 'FAIL';

const md = `# TaskFlow Task Manager — Test Report

| | |
|---|---|
| **Verdict** | **${verdict}** |
| Run date | ${date} |
| Browser | Chromium (Desktop Chrome, 1280x800; mobile 390x844 for 1 test) |
| Tests | ${total} total, ${passed} passed, ${failed} failed |
| Pass rate | ${rate}% |
| Duration | ${secs.toFixed(1)}s |
| App under test | \`Task-Manager-for-tasks\` at http://localhost:5173 |

## Results by suite

${[...groups].map(([file, rs]) => `### ${file}\n\n| # | Test | Result | Time |\n|---|---|---|---|\n${rs.map((r, i) => `| ${i + 1} | ${r.title.replace(/\|/g, '\\|')} | ${r.ok ? 'PASS' : 'FAIL'} | ${(r.ms / 1000).toFixed(1)}s |`).join('\n')}`).join('\n\n')}

## Failures

${failed ? rows.filter((r) => !r.ok).map((r) => `- **${r.title}**: ${r.error}`).join('\n') : 'None.'}

## Screenshots

${shots.map((s) => `### ${s.replace('.png', '')}\n\n![${s}](screenshots/${s})`).join('\n\n')}
`;
writeFileSync('reports/TEST-REPORT.md', md);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>TaskFlow Test Report</title>
<style>
body{font:15px/1.5 system-ui,sans-serif;margin:0;background:#f4f5fb;color:#1a1d29}
main{max-width:1100px;margin:0 auto;padding:32px 20px}
.cards{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0}
.card{background:#fff;border:1px solid #e3e5ee;border-radius:10px;padding:14px 18px;min-width:130px}
.card b{display:block;font-size:26px}
.pass{color:#0a7d3b}.fail{color:#c62828}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e3e5ee;margin-bottom:20px}
th,td{text-align:left;padding:7px 10px;border-bottom:1px solid #eef0f6}
.shots{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
.shots figure{margin:0;background:#fff;border:1px solid #e3e5ee;border-radius:10px;padding:10px}
.shots img{width:100%;border-radius:6px}
figcaption{font-size:13px;color:#555;margin-top:6px}
</style></head><body><main>
<h1>TaskFlow Task Manager — Test Report</h1>
<p>${esc(date)} · Chromium · ${secs.toFixed(1)}s · Verdict: <b class="${failed ? 'fail' : 'pass'}">${verdict}</b></p>
<div class="cards">
<div class="card">Total<b>${total}</b></div>
<div class="card">Passed<b class="pass">${passed}</b></div>
<div class="card">Failed<b class="${failed ? 'fail' : ''}">${failed}</b></div>
<div class="card">Pass rate<b>${rate}%</b></div></div>
<h2>Results by suite</h2>
${[...groups].map(([file, rs]) => `<h3>${esc(file)}</h3><table><tr><th>Test</th><th>Result</th><th>Time</th></tr>${rs.map((r) => `<tr><td>${esc(r.title)}</td><td class="${r.ok ? 'pass' : 'fail'}">${r.ok ? 'PASS' : 'FAIL'}</td><td>${(r.ms / 1000).toFixed(1)}s</td></tr>`).join('')}</table>`).join('')}
<h2>Screenshots</h2>
<div class="shots">${shots.map((s) => `<figure><a href="screenshots/${s}"><img src="screenshots/${s}" alt="${s}" loading="lazy"></a><figcaption>${s}</figcaption></figure>`).join('')}</div>
</main></body></html>`;
writeFileSync('reports/TEST-REPORT.html', html);

console.log(`Report written: ${passed}/${total} passed, ${shots.length} screenshots`);
