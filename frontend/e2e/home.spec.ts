import { test, expect } from '@playwright/test';

test('home page loads and shows BatterySwap PH', async ({ page, baseURL }) => {
  await page.goto('/');
  // There are multiple occurrences (header/footer); assert that at least one is visible
  await expect(page.locator('text=BatterySwap PH').first()).toBeVisible();
});
