import { test, expect, seedTasks, isoDate, shoot, readTasks } from './helpers';

/** Fills the inline "New task" form on the Tasks page. */
async function fillNewTaskForm(page: import('@playwright/test').Page, data: { title: string; description: string; priority: string; dueDate: string }) {
  await page.getByLabel('Title').fill(data.title);
  await page.getByLabel('Description').fill(data.description);
  await page.getByLabel('Priority').selectOption(data.priority);
  await page.getByLabel('Due date').fill(data.dueDate);
}

test.describe('Task CRUD', () => {
  test('creates a new task and it appears in the list + localStorage', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/tasks');

    await page.getByRole('button', { name: '+ New task' }).click();
    await expect(page.getByRole('heading', { name: 'New task' })).toBeVisible();

    const dueDate = isoDate(3);
    await fillNewTaskForm(page, {
      title: 'Prepare sprint demo',
      description: 'Build and rehearse the demo deck for the sprint review meeting.',
      priority: 'high',
      dueDate,
    });
    await shoot(page, '03-new-task-form-filled');

    await page.getByRole('button', { name: 'Create task' }).click();

    // Form closes, task card is visible
    await expect(page.getByRole('heading', { name: 'New task' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Prepare sprint demo' })).toBeVisible();

    // Badge reflects high priority and default To Do status
    const card = page.locator('article.task', { hasText: 'Prepare sprint demo' });
    await expect(card.locator('.badge.p-high')).toHaveText('High');
    await expect(card.locator('.badge.s-todo')).toHaveText('To Do');

    // Persisted to storage with todo status + createdAt timestamp
    const stored = await readTasks(page);
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      title: 'Prepare sprint demo',
      priority: 'high',
      dueDate,
      status: 'todo',
    });
    expect(stored[0].id).toBeTruthy();
    expect(stored[0].createdAt).toBeTruthy();

    await shoot(page, '04-task-created-list');
  });

  test('cancelling the new task form does not create a task', async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/tasks');

    await page.getByRole('button', { name: '+ New task' }).click();
    await fillNewTaskForm(page, {
      title: 'Should never exist',
      description: 'This entry must never be persisted to storage.',
      priority: 'low',
      dueDate: isoDate(2),
    });
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('heading', { name: 'New task' })).toBeHidden();
    await expect(page.getByText('No tasks found.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);
  });

  test('edits a task from the details page and persists changes', async ({ page }) => {
    const [task] = await seedTasks(page, [
      { title: 'Original title', description: 'Original description that is long', priority: 'low', dueDate: isoDate(10) },
    ]);

    await page.goto(`/tasks/${task.id}`);
    await expect(page.getByRole('heading', { name: 'Original title' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit task' })).toBeVisible();

    await page.getByLabel('Title').fill('Updated title');
    await page.getByLabel('Description').fill('Updated description that is definitely long enough.');
    await page.getByLabel('Priority').selectOption('medium');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByRole('heading', { name: 'Updated title' })).toBeVisible();
    await expect(page.locator('.badge.p-medium')).toHaveText('Medium');

    const stored = await readTasks(page);
    expect(stored[0]).toMatchObject({ title: 'Updated title', priority: 'medium' });
  });

  test('editing allows a past due date (requireFutureDate is off on edit)', async ({ page }) => {
    const [task] = await seedTasks(page, [
      { title: 'Task to backdate', description: 'A description that is long enough', priority: 'low', dueDate: isoDate(5) },
    ]);

    await page.goto(`/tasks/${task.id}`);
    await page.getByRole('button', { name: 'Edit' }).click();

    const past = isoDate(-2);
    await page.getByLabel('Due date').fill(past);
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect(page.getByText('Due date cannot be in the past.')).toBeHidden();
    const stored = await readTasks(page);
    expect(stored[0].dueDate).toBe(past);
  });

  test('deletes a task from the list after confirming the dialog', async ({ page }) => {
    await seedTasks(page, [
      { title: 'Keep this task', description: 'Description long enough here', priority: 'low', dueDate: isoDate(4) },
      { title: 'Delete this task', description: 'Description long enough here', priority: 'low', dueDate: isoDate(6) },
    ]);

    await page.goto('/tasks');
    const card = page.locator('article.task', { hasText: 'Delete this task' });

    page.once('dialog', (d) => d.accept());
    await card.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('link', { name: 'Delete this task' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Keep this task' })).toBeVisible();

    const stored = await readTasks(page);
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Keep this task');

    await shoot(page, '05-task-after-delete');
  });

  test('dismissing the delete dialog keeps the task', async ({ page }) => {
    await seedTasks(page, [
      { title: 'Protected task', description: 'Description long enough here', priority: 'low', dueDate: isoDate(4) },
    ]);

    await page.goto('/tasks');
    page.once('dialog', (d) => d.dismiss());
    await page.locator('article.task').getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('link', { name: 'Protected task' })).toBeVisible();
    expect(await readTasks(page)).toHaveLength(1);
  });

  test('deletes a task from the details page and redirects to the list', async ({ page }) => {
    const [task] = await seedTasks(page, [
      { title: 'Delete from details', description: 'Description long enough here', priority: 'high', dueDate: isoDate(1) },
    ]);

    await page.goto(`/tasks/${task.id}`);
    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByText('No tasks found.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);
  });
});