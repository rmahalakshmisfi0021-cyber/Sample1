import { test, expect, seedTasks, isoDate } from './helpers';

/**
 * Walks the app through every key screen/state and writes a clean, labeled
 * full-page screenshot into reports/screenshots/ for the final report gallery.
 * These are documentation shots, not assertions about behaviour.
 */

const SEED = [
  { title: 'Write API documentation', description: 'Document every endpoint, request body and response shape.', priority: 'medium', dueDate: isoDate(3), status: 'todo' },
  { title: 'Fix login redirect bug', description: 'User session is lost right after successful authentication.', priority: 'high', dueDate: isoDate(1), status: 'in-progress' },
  { title: 'Refactor auth middleware', description: 'Extract token parsing into a small helper and add tests.', priority: 'low', dueDate: isoDate(6), status: 'todo' },
  { title: 'Upgrade dependencies', description: 'Bump all packages and verify the production build passes.', priority: 'low', dueDate: isoDate(-4), status: 'done' },
  { title: 'Overdue invoice follow-up', description: 'Chase the outstanding invoice from last quarter.', priority: 'high', dueDate: isoDate(-6), status: 'todo' },
];

test.describe('Screenshot gallery', () => {
  test('dashboard — populated, with stats and overdue work', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await page.screenshot({ path: 'reports/screenshots/gallery-01-dashboard.png', fullPage: true });
  });

  test('dashboard — empty state', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/');
    await page.screenshot({ path: 'reports/screenshots/gallery-02-dashboard-empty.png', fullPage: true });
  });

  test('tasks list — all cards with badges', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/tasks');
    await page.screenshot({ path: 'reports/screenshots/gallery-03-tasks-list.png', fullPage: true });
  });

  test('new task form — blank', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/tasks');
    await page.getByRole('button', { name: '+ New task' }).click();
    await page.screenshot({ path: 'reports/screenshots/gallery-04-new-task-form.png', fullPage: true });
  });

  test('new task form — validation errors shown', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/tasks');
    await page.getByRole('button', { name: '+ New task' }).click();
    await page.getByRole('button', { name: 'Create task' }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
    await page.screenshot({ path: 'reports/screenshots/gallery-05-validation-errors.png', fullPage: true });
  });

  test('task details — populated', async ({ page }) => {
    const [first] = await seedTasks(page, SEED);
    await page.goto(`/tasks/${first.id}`);
    await page.screenshot({ path: 'reports/screenshots/gallery-06-task-details.png', fullPage: true });
  });

  test('task details — edit mode', async ({ page }) => {
    const [first] = await seedTasks(page, SEED);
    await page.goto(`/tasks/${first.id}`);
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit task' })).toBeVisible();
    await page.screenshot({ path: 'reports/screenshots/gallery-07-task-edit.png', fullPage: true });
  });

  test('tasks list — filtered to In Progress', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/tasks');
    await page.getByRole('group', { name: 'Filter by status' }).getByRole('button', { name: 'In Progress' }).click();
    await page.screenshot({ path: 'reports/screenshots/gallery-08-filter-in-progress.png', fullPage: true });
  });

  test('tasks list — search with no results', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/tasks');
    await page.getByLabel('Search tasks').fill('nothing matches this');
    await page.screenshot({ path: 'reports/screenshots/gallery-09-search-no-results.png', fullPage: true });
  });

  test('task not found state', async ({ page }) => {
    await seedTasks(page, SEED);
    await page.goto('/tasks/missing-id');
    await expect(page.getByRole('heading', { name: 'Task not found' })).toBeVisible();
    await page.screenshot({ path: 'reports/screenshots/gallery-10-task-not-found.png', fullPage: true });
  });

  test('mobile viewport — dashboard and tasks', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedTasks(page, SEED);

    await page.goto('/');
    await page.screenshot({ path: 'reports/screenshots/gallery-11-mobile-dashboard.png', fullPage: true });

    await page.goto('/tasks');
    await page.screenshot({ path: 'reports/screenshots/gallery-12-mobile-tasks.png', fullPage: true });
  });
});