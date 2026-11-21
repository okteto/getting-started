import { test, expect } from '@playwright/test';

test('displays the hero', async ({ page }) => {
  await page.goto('/');

  // Hero content
  await expect(page.getByText('Rollback to the Future')).toBeVisible();
  await expect(page.getByText(
    "A bad release sends production back to 1.21. Only one rollback can save the future."
  )).toBeVisible();

  // Click the play button
  await page.getByRole('link', { name: 'Play' }).click();
  expect(page.url()).toMatch(/#$/); // TODO

  // Click the list button
  await page.getByRole('link', { name: 'My List' }).click();
  expect(page.url()).toMatch(/#$/); // TODO
});
