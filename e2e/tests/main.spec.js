import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // The page title
  await expect(page).toHaveTitle('Kube Movies');
});

test('matches screenshot', async ({ page }) => {
  await page.goto('/');

  // The header and the hero match the screenshot. The lists of movies are
  // not part of it: they change when you move a movie to the favorites.
  await expect(page.locator('.Hero')).toHaveScreenshot('hero.png');
});
