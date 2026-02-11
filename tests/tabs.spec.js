import { test, expect } from '@playwright/test';

test('Dashboard loads and all tabs are clickable', async ({ page }) => {
  // 1. Update naar poort 3000 voor Next.js
  await page.goto('http://localhost:3000/');

  await page.waitForTimeout(1000);

  // 2. Controleer of de titel overeenkomt met je nieuwe h1 in de dashboard component
  // Als je h1 nog steeds "Quantum Alpha Portfolio" is, laat dit dan zo staan.
  await expect(page.locator('h1')).toContainText('Quantum Alpha');

  await expect(page.locator('button[data-state="active"]')).toBeVisible();

  // Test alle tabs
  const tabs = ['ASSET CLASSES', 'HISTORY', 'MARKETS', 'CALENDAR', 'SANDBOX', 'MATH'];

  for (const tab of tabs) {
    console.log(`Testing tab: ${tab}`);
    await page.click(`text=${tab}`);
    await page.waitForTimeout(300); 
    
    // Check of de actieve tab inderdaad de tekst bevat (case-insensitive)
    await expect(page.locator('button[data-state="active"]')).getByText(tab, { exact: false });

    await expect(page.locator('text=Er is iets misgegaan')).not.toBeVisible();
  }
});