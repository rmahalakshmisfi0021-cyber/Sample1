import { test } from '@playwright/test';

test ('Navigation', async ({ page }) => {
    await page.goto('https://staging.sfcodestudio.com/');
    await page.click('//span[text()="Sign in with Microsoft"]');
       await page.waitForTimeout(3000);
 
  //Enter the mail id
   
  await page.locator('//input[@class="form-control ltr_override input ext-input text-box ext-text-box"]').fill('mahalakshmi.ramalingam@syncfusion.com');
     await page.waitForTimeout(2000);

  //Click on the next button
  await page.locator('//input[@class="win-button button_primary high-contrast-overrides button ext-button primary ext-primary"]').click();
      await page.waitForTimeout(3000);

  //Enter the password
  await page.locator('//input[@placeholder="Password"]').fill('lr2004@Maha');
     await page.waitForTimeout(2000);

  //Click the Sign in button
  await page.click('//button[text()="Sign in"]');
    await page.waitForTimeout(3000);
  
  //Click on the yes button 
   await page.locator('//button[contains(text(),"Yes")]').click();
});

test ('Navigation to Dashvboard', async ({ page }) => {
    await page.goto('https://staging.sfcodestudio.com/dashboard');
    await page.click ('//span[@title="Dashboard"]');
    });