import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const scriptPath = path.resolve('/workspace/Sample1/playwright-tests/scripts/build-report.mjs');

function makeWorkspace(results) {
  const dir = mkdtempSync(path.join(tmpdir(), 'build-report-test-'));
  mkdirSync(path.join(dir, 'reports'), { recursive: true });
  writeFileSync(path.join(dir, 'reports', 'results.json'), JSON.stringify(results));
  return dir;
}

test('build-report succeeds when screenshots directory is missing', () => {
  const dir = makeWorkspace({
    suites: [],
    stats: { duration: 0, startTime: '2026-01-01T00:00:00.000Z' },
  });

  execFileSync(process.execPath, [scriptPath], { cwd: dir, stdio: 'pipe' });

  const md = readFileSync(path.join(dir, 'reports', 'TEST-REPORT.md'), 'utf8');
  const html = readFileSync(path.join(dir, 'reports', 'TEST-REPORT.html'), 'utf8');

  assert.match(md, /## Screenshots\n\nNone\./);
  assert.match(html, /<h2>Screenshots<\/h2>/);
});
