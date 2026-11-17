import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import config from '../playwright.config';

const suiteDir = dirname(new URL(import.meta.url).pathname);

test.describe('playwright config', () => {
  test('webServer cwd points to an app directory that exists in the repository', () => {
    const cwd = resolve(suiteDir, '..', config.webServer!.cwd);
    expect(existsSync(cwd)).toBe(true);
  });
});

test.use({ baseURL: 'http://127.0.0.1/' });
