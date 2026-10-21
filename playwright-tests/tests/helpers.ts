import { test as base, expect, type Page } from '@playwright/test';

export type TaskSeed = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status?: 'todo' | 'in-progress' | 'done';
};

const STORAGE_KEY = 'task-manager.tasks';

/** Builds a Task record shaped exactly like the one TaskContext.addTask() creates. */
export function makeTask(seed: TaskSeed, index = 0) {
  return {
    id: `seed-${index}-${seed.title.replace(/\W+/g, '-').toLowerCase()}`,
    title: seed.title,
    description: seed.description,
    priority: seed.priority,
    dueDate: seed.dueDate,
    status: seed.status ?? 'todo',
    createdAt: new Date(Date.UTC(2026, 0, 1 + index, 9, 0, 0)).toISOString(),
  };
}

/** Seeds localStorage before the app boots, so no UI clicking is needed. */
export async function seedTasks(page: Page, seeds: TaskSeed[]) {
  const tasks = seeds.map(makeTask);
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value as string),
    [STORAGE_KEY, JSON.stringify(tasks)] as const,
  );
  return tasks;
}

export async function readTasks(page: Page) {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? '[]'), STORAGE_KEY);
}

export const isoDate = (daysFromToday: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Screenshot helper that always writes into reports/screenshots. */
export async function shoot(page: Page, name: string) {
  await page.screenshot({
    path: `reports/screenshots/${name}.png`,
    fullPage: true,
  });
}

export const test = base;
export { expect };