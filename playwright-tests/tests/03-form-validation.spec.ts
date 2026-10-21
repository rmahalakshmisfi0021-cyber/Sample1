import { test, expect, seedTasks, isoDate, shoot, readTasks } from './helpers';

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await seedTasks(page, []);
    await page.goto('/tasks');
    await page.getByRole('button', { name: '+ New task' }).click();
  });

  test('blocks submit and shows all errors when form is empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByRole('alert')).toHaveText([
      'Title is required.',
      'Description is required.',
      'Select a priority.',
      'Due date is required.',
    ]);
    await expect(page.getByLabel('Title')).toHaveAttribute('aria-invalid', 'true');
    expect(await readTasks(page)).toHaveLength(0);

    await shoot(page, '06-validation-all-errors');
  });

  test('enforces minimum title length of 3 characters', async ({ page }) => {
    await page.getByLabel('Title').fill('ab');
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Title must be at least 3 characters.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New task' })).toBeVisible();
  });

  test('accepts a title of exactly 3 characters', async ({ page }) => {
    await page.getByLabel('Title').fill('abc');
    await page.getByLabel('Description').fill('A description of sufficient length.');
    await page.getByLabel('Priority').selectOption('low');
    await page.getByLabel('Due date').fill(isoDate(1));
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByRole('heading', { name: 'New task' })).toBeHidden();
    expect((await readTasks(page))[0].title).toBe('abc');
  });

  test('enforces maximum title length of 80 characters', async ({ page }) => {
    await page.getByLabel('Title').fill('x'.repeat(81));
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Title must be 80 characters or fewer.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);
  });

  test('enforces minimum description length of 10 characters', async ({ page }) => {
    await page.getByLabel('Title').fill('Valid title');
    await page.getByLabel('Description').fill('too short');
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Description must be at least 10 characters.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);
  });

  test('enforces maximum description length of 500 characters', async ({ page }) => {
    await page.getByLabel('Title').fill('Valid title');
    await page.getByLabel('Description').fill('y'.repeat(501));
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Description must be 500 characters or fewer.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);
  });

  test('requires an explicit priority selection', async ({ page }) => {
    await page.getByLabel('Title').fill('Valid title');
    await page.getByLabel('Description').fill('A description of sufficient length.');
    await page.getByLabel('Due date').fill(isoDate(1));
    // priority left as "Select…"
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Select a priority.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);
  });

  test('rejects a past due date when creating a task', async ({ page }) => {
    await page.getByLabel('Title').fill('Valid title');
    await page.getByLabel('Description').fill('A description of sufficient length.');
    await page.getByLabel('Priority').selectOption('medium');
    await page.getByLabel('Due date').fill(isoDate(-1));
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByText('Due date cannot be in the past.')).toBeVisible();
    expect(await readTasks(page)).toHaveLength(0);

    await shoot(page, '07-validation-past-due-date');
  });

  test('accepts today as a due date when creating', async ({ page }) => {
    await page.getByLabel('Title').fill('Due today');
    await page.getByLabel('Description').fill('A description of sufficient length.');
    await page.getByLabel('Priority').selectOption('medium');
    await page.getByLabel('Due date').fill(isoDate(0));
    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page.getByRole('heading', { name: 'New task' })).toBeHidden();
    expect((await readTasks(page))[0].dueDate).toBe(isoDate(0));
  });

  test('clears a field error as soon as the field becomes valid', async ({ page }) => {
    await page.getByLabel('Title').fill('ab');
    await page.getByRole('button', { name: 'Create task' }).click();
    await expect(page.getByText('Title must be at least 3 characters.')).toBeVisible();

    await page.getByLabel('Title').fill('abc');
    await expect(page.getByText('Title must be at least 3 characters.')).toBeHidden();
  });
});