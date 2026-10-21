import { test, expect, seedTasks, isoDate, shoot } from './helpers';

test.describe('Dashboard View', () => {
  test('renders zero-state cleanly when no tasks exist', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('No open tasks.')).toBeVisible();

    // Check stats are all 0
    const statCards = page.locator('.stats .stat strong');
    await expect(statCards).toHaveText(['0', '0', '0', '0', '0']);

    // Check progress bar is 0%
    const progress = page.getByRole('progressbar');
    await expect(progress).toHaveAttribute('aria-valuenow', '0');

    await shoot(page, '01-dashboard-empty');
  });

  test('calculates totals, status counts, overdue, and completion % accurately', async ({ page }) => {
    await seedTasks(page, [
      { title: 'Task Todo 1', description: 'Description long enough', priority: 'high', dueDate: isoDate(2), status: 'todo' },
      { title: 'Task InProg 1', description: 'Description long enough', priority: 'medium', dueDate: isoDate(5), status: 'in-progress' },
      { title: 'Task Done 1', description: 'Description long enough', priority: 'low', dueDate: isoDate(-1), status: 'done' },
      { title: 'Task Overdue 1', description: 'Description long enough', priority: 'high', dueDate: isoDate(-3), status: 'todo' },
    ]);

    await page.goto('/');

    // 4 total: 2 todo, 1 in-progress, 1 done, 1 overdue (Task Overdue 1 is todo + past)
    // Completion: 1 / 4 = 25%
    await expect(page.locator('.stat').filter({ hasText: 'Total' }).locator('strong')).toHaveText('4');
    await expect(page.locator('.stat').filter({ hasText: 'To Do' }).locator('strong')).toHaveText('2');
    await expect(page.locator('.stat').filter({ hasText: 'In Progress' }).locator('strong')).toHaveText('1');
    await expect(page.locator('.stat').filter({ hasText: 'Done' }).locator('strong')).toHaveText('1');
    await expect(page.locator('.stat').filter({ hasText: 'Overdue' }).locator('strong')).toHaveText('1');

    await expect(page.getByRole('heading', { name: 'Completion — 25%' })).toBeVisible();
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');

    // Upcoming list excludes done tasks and sorts by dueDate ascending
    const upcomingItems = page.locator('.list li a');
    await expect(upcomingItems).toHaveCount(3);
    await expect(upcomingItems.first()).toHaveText('Task Overdue 1');

    await shoot(page, '02-dashboard-populated');
  });

  test('navigates from upcoming task to its details page', async ({ page }) => {
    const [first] = await seedTasks(page, [
      { title: 'Clickable upcoming item', description: 'A sufficiently long description', priority: 'high', dueDate: isoDate(1) },
    ]);

    await page.goto('/');
    await page.getByRole('link', { name: 'Clickable upcoming item' }).click();

    await expect(page).toHaveURL(new RegExp(`/tasks/${first.id}$`));
    await expect(page.getByRole('heading', { name: 'Clickable upcoming item' })).toBeVisible();
  });
});