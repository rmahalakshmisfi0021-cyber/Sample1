import { test, expect, seedTasks, isoDate, shoot } from './helpers';

const SEED = [
  { title: 'Write API documentation', description: 'Document every endpoint and response shape', priority: 'medium', dueDate: isoDate(2), status: 'todo' },
  { title: 'Fix login redirect bug', description: 'Session is lost after successful authentication', priority: 'high', dueDate: isoDate(1), status: 'todo' },
  { title: 'Refactor auth middleware', description: 'Extract token parsing into a helper', priority: 'low', dueDate: isoDate(4), status: 'in-progress' },
  { title: 'Upgrade dependencies', description: 'Bump packages and verify the build passes', priority: 'low', dueDate: isoDate(-2), status: 'done' },
] as const;

test.describe('Filtering and Search', () => {
  test.beforeEach(async ({ page }) => {
    await seedTasks(page, [...SEED]);
    await page.goto('/tasks');
  });

  test('searches by title, case-insensitively', async ({ page }) => {
    await page.getByLabel('Search tasks').fill('REDIRECT');

    await expect(page.locator('article.task')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Fix login redirect bug' })).toBeVisible();
  });

  test('searches by description text', async ({ page }) => {
    await page.getByLabel('Search tasks').fill('middleware');

    await expect(page.locator('article.task')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Refactor auth middleware' })).toBeVisible();
  });

  test('shows empty state when the search matches nothing', async ({ page }) => {
    await page.getByLabel('Search tasks').fill('zzzzzz-no-match');

    await expect(page.getByText('No tasks found.')).toBeVisible();
    await expect(page.locator('article.task')).toHaveCount(0);

    await shoot(page, '08-search-no-results');
  });

  test('filters by each status tab', async ({ page }) => {
    const tabs = page.getByRole('group', { name: 'Filter by status' });

    await tabs.getByRole('button', { name: 'To Do' }).click();
    await expect(page.locator('article.task')).toHaveCount(2);
    await expect(tabs.getByRole('button', { name: 'To Do' })).toHaveAttribute('aria-pressed', 'true');

    await tabs.getByRole('button', { name: 'In Progress' }).click();
    await expect(page.locator('article.task')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Refactor auth middleware' })).toBeVisible();

    await tabs.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('article.task')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Upgrade dependencies' })).toBeVisible();

    await tabs.getByRole('button', { name: 'All' }).click();
    await expect(page.locator('article.task')).toHaveCount(4);
  });

  test('combines search and status filter', async ({ page }) => {
    const tabs = page.getByRole('group', { name: 'Filter by status' });

    await tabs.getByRole('button', { name: 'To Do' }).click();
    await page.getByLabel('Search tasks').fill('api');

    await expect(page.locator('article.task')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Write API documentation' })).toBeVisible();

    await shoot(page, '09-search-with-filter');
  });

  test('clearing the search restores the full filtered list', async ({ page }) => {
    const search = page.getByLabel('Search tasks');
    await search.fill('middleware');
    await expect(page.locator('article.task')).toHaveCount(1);

    await search.fill('');
    await expect(page.locator('article.task')).toHaveCount(4);
  });
});

test.describe('Status Changes', () => {
  test.beforeEach(async ({ page }) => {
    await seedTasks(page, [...SEED]);
    await page.goto('/tasks');
  });

  test('changes a task status from the list inline dropdown', async ({ page }) => {
    await page.getByLabel('Status for Fix login redirect bug').selectOption('done');

    const card = page.locator('article.task', { hasText: 'Fix login redirect bug' });
    await expect(card.locator('.badge.s-done')).toHaveText('Done');

    // The dashboard counters reflect the change
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page.locator('.stat').filter({ hasText: 'Done' }).locator('strong')).toHaveText('2');
    await expect(page.locator('.stat').filter({ hasText: 'To Do' }).locator('strong')).toHaveText('1');

    await shoot(page, '10-status-changed-dashboard');
  });

  test('changes a task status from the details page dropdown', async ({ page }) => {
    const [task] = SEED;
    await page.goto('/tasks');
    await page.getByRole('link', { name: task.title }).click();

    await expect(page.getByRole('heading', { name: task.title })).toBeVisible();
    await page.getByLabel('Status').selectOption('in-progress');

    await expect(page.locator('.badge.s-in-progress')).toHaveText('In Progress');
  });
});