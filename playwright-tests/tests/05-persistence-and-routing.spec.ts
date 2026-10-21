import { test, expect, seedTasks, isoDate, shoot, readTasks } from './helpers';

test.describe('Persistence', () => {
  test('tasks survive a full page reload', async ({ page }) => {
    await seedTasks(page, [
      { title: 'Persisted task', description: 'This must survive a reload', priority: 'high', dueDate: isoDate(3) },
    ]);

    await page.goto('/tasks');
    await expect(page.getByRole('link', { name: 'Persisted task' })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('link', { name: 'Persisted task' })).toBeVisible();
    await expect(page.locator('article.task')).toHaveCount(1);
  });

  test('a task created in the UI is still present after navigating away and back', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/tasks');

    await page.getByRole('button', { name: '+ New task' }).click();
    await page.getByLabel('Title').fill('Round trip task');
    await page.getByLabel('Description').fill('Should persist across route changes.');
    await page.getByLabel('Priority').selectOption('medium');
    await page.getByLabel('Due date').fill(isoDate(2));
    await page.getByRole('button', { name: 'Create task' }).click();

    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page.getByRole('link', { name: 'Round trip task' })).toBeVisible();

    await page.getByRole('link', { name: 'Tasks' }).click();
    await expect(page.getByRole('link', { name: 'Round trip task' })).toBeVisible();
  });

  test('corrupt localStorage falls back to an empty task list instead of crashing', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('task-manager.tasks', '{ not valid json'));
    await page.goto('/tasks');

    await expect(page.getByText('No tasks found.')).toBeVisible();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page.getByText('No open tasks.')).toBeVisible();
  });

  test('a non-array value in localStorage is ignored safely', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('task-manager.tasks', '{"nope": true}'));
    await page.goto('/tasks');

    await expect(page.getByText('No tasks found.')).toBeVisible();
    expect(await readTasks(page)).toBeTruthy();
  });
});

test.describe('Navigation and Routing', () => {
  test('navigates between Dashboard and Tasks via the header', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/');

    await page.getByRole('navigation').getByRole('link', { name: 'Tasks' }).click();
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();

    await page.getByRole('navigation').getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(new RegExp('/$'));
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('marks the active nav link', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/tasks');

    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Tasks' })).toHaveClass(/active/);
    await expect(nav.getByRole('link', { name: 'Dashboard' })).not.toHaveClass(/active/);
  });

  test('redirects an unknown route back to the dashboard', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/this-route-does-not-exist');

    await expect(page).toHaveURL(new RegExp('/$'));
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('shows "Task not found" for a missing task id', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/tasks/does-not-exist');

    await expect(page.getByRole('heading', { name: 'Task not found' })).toBeVisible();
    await page.getByRole('link', { name: '← Back to tasks' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await shoot(page, '11-task-not-found');
  });

  test('deep links directly to a task details page', async ({ page }) => {
    const [task] = await seedTasks(page, [
      { title: 'Deep linked task', description: 'Reached via direct URL entry', priority: 'high', dueDate: isoDate(2) },
    ]);

    await page.goto(`/tasks/${task.id}`);

    await expect(page.getByRole('heading', { name: 'Deep linked task' })).toBeVisible();
    await expect(page.getByRole('link', { name: '← Back to tasks' })).toBeVisible();
    await shoot(page, '12-task-details');
  });
});