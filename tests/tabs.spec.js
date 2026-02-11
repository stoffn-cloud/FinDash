import { test, expect } from '@playwright/test';

test('Dashboard loads and all tabs are clickable', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Wacht op de loading state
  await page.waitForTimeout(1000);

  // Check of de titel er is
  await expect(page.locator('h1')).toContainText('Quantum Alpha Portfolio');

  // Check "Dashboard" tab (default)
  await expect(page.locator('button[data-state="active"]')).toContainText('Dashboard');

  // Check of content geladen is (bv. Totaal Vermogen)
  await expect(page.locator('text=Totaal Vermogen')).toBeVisible();

  // Test alle tabs
  const tabs = ['ASSET CLASSES', 'HISTORY', 'MARKETS', 'CALENDAR', 'SANDBOX', 'MATH'];

  for (const tab of tabs) {
    console.log(`Testing tab: ${tab}`);
    await page.click(`text=${tab}`);
    await page.waitForTimeout(300); // Kleine delay voor animatie
    await expect(page.locator('button[data-state="active"]')).toContainText(tab, { ignoreCase: true });

    // Check of er geen error boundary zichtbaar is
    await expect(page.locator('text=Er is iets misgegaan')).not.toBeVisible();
  }
});
