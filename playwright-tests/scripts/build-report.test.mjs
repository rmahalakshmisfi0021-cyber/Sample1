import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const script = '/workspace/Sample1/playwright-tests/scripts/build-report.mjs';

function runInTemp(setup) {
  const dir = mkdtempSync(join(tmpdir(), 'build-report-'));
  try {
    setup(dir);
    return spawnSync(process.execPath, [script], {
      cwd: dir,
      encoding: 'utf8',
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('build-report succeeds when results.json is missing', () => {
  const result = runInTemp((dir) => {
    mkdirSync(join(dir, 'reports', 'screenshots'), { recursive: true });
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Report written: 0\/0 passed, 0 screenshots/);
});

test('build-report succeeds when screenshots directory is missing', () => {
  const result = runInTemp((dir) => {
    mkdirSync(join(dir, 'reports'), { recursive: true });
    writeFileSync(
      join(dir, 'reports', 'results.json'),
      JSON.stringify({ stats: { duration: 0, startTime: '2026-10-21T21:35:55.000Z' }, suites: [] }),
    );
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Report written: 0\/0 passed, 0 screenshots/);
});
