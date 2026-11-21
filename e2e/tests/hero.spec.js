import { test, expect } from '@playwright/test';

test('displays the hero', async ({ page }) => {
  await page.goto('/');

  // Hero content
  await expect(page.getByText('Movies from the Kubernetes World')).toBeVisible();
  await expect(page.getByText(
    "Okteto originals about what every cluster has lived through. Click the star of a movie to add it to your favorites."
  )).toBeVisible();
});
