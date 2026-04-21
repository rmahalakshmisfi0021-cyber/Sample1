import { test } from '@playwright/test';

test('Login with Valid Username and Password', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Enter username
    await page.locator('//input[@id="username"]').fill('student');
    await page.waitForTimeout(1000);
    
    // Enter password
    await page.locator('//input[@id="password"]').fill('Password123');
    await page.waitForTimeout(1000);
    
    // Click submit button
    await page.click('//button[@id="submit"]');
    await page.waitForTimeout(2000);
});

test('Login with Invalid Username', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Enter invalid username
    await page.locator('//input[@id="username"]').fill('invaliduser');
    await page.waitForTimeout(1000);
    
    // Enter password
    await page.locator('//input[@id="password"]').fill('Password123');
    await page.waitForTimeout(1000);
    
    // Click submit button
    await page.click('//button[@id="submit"]');
    await page.waitForTimeout(2000);
});

test('Login with Invalid Password', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Enter username
    await page.locator('//input[@id="username"]').fill('student');
    await page.waitForTimeout(1000);
    
    // Enter invalid password
    await page.locator('//input[@id="password"]').fill('WrongPassword');
    await page.waitForTimeout(1000);
    
    // Click submit button
    await page.click('//button[@id="submit"]');
    await page.waitForTimeout(2000);
});

test('Login with Empty Username and Password', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Click submit button without entering credentials
    await page.click('//button[@id="submit"]');
    await page.waitForTimeout(2000);
});

test('Navigate to Practice Test Automation - Home', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Click on Home link
    await page.click('//a[text()="Home"]');
    await page.waitForTimeout(2000);
});

test('Navigate to Practice Test Automation - Practice', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Click on Practice link
    await page.click('//a[text()="Practice"]');
    await page.waitForTimeout(2000);
});

test('Navigate to Practice Test Automation - Course', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Click on Course link
    await page.click('//a[text()="Course"]');
    await page.waitForTimeout(2000);
});

test('Navigate to Practice Test Automation - BLOG', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Click on BLOG link
    await page.click('//a[text()="BLOG"]');
    await page.waitForTimeout(2000);
});

test('Navigate to Practice Test Automation - CONTACT', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
    await page.waitForTimeout(2000);
    
    // Click on CONTACT link
    await page.click('//a[text()="CONTACT"]');
    await page.waitForTimeout(2000);
});
