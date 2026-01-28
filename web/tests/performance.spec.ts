import { test, expect } from '@playwright/test';

test('measure stats load time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/dashboard');

  // Wait for the "Active Leads" label to ensure page structure is there
  await expect(page.getByText('Leads Actifs')).toBeVisible();

  // Wait for the stats to populate.
  // We use a regex to match 12...450 allowing for any whitespace or no whitespace
  await expect(page.getByText(/12\s*450/)).toBeVisible();

  const endTime = Date.now();
  const duration = endTime - startTime;
  console.log(`\n\n[Performance] Stats Load Time: ${duration}ms\n\n`);
});
