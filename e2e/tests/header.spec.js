import { test, expect } from '@playwright/test';

test('displays the header', async ({ page }) => {
  await page.goto('/');

  // Logo
  await expect(page.locator('.logo')).toBeVisible();

  // Profile
  await expect(page.getByText('Cindy', { exact: true })).toBeVisible();
  const avatar = page.getByAltText('profile');
  await expect(avatar).toHaveAttribute('src', /.+/);
});
