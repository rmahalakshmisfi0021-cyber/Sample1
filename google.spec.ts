import { test, expect } from '@playwright/test';
test('Navigate to Google', async ({ page }) => {
    await page.goto('https://www.google.com');
});

test('Search the website', async ({ page }) => {
    await page.goto('https://www.google.com');
    await page.locator('textarea[title="Search"]').fill('https://practicetestautomation.com/practice-test-login/');
    await page.locator('input[name="q"]').press('Enter');
    await expect(page).toHaveTitle(/Practice Test Login/);
});