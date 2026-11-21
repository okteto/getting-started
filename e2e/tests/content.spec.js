import { test, expect } from '@playwright/test';

import { getStoredData } from '../data/getStoredData';

const section = (page, name) => page.locator('.TitleList', {
  has: page.getByRole('heading', { name })
});

const testItem = async (item, movie) => {
  const { original_title, vote_average } = movie;

  // Hovering over the movie item to make the info visible
  await item.hover();

  // The movie title and rating are visible
  await expect(item.getByText(original_title)).toBeVisible();
  await expect(item.getByText(`${vote_average} / 10`)).toBeVisible();
}

test('displays the favorites section', async ({ page }) => {
  const { favorites } = await getStoredData();

  // Stored data is not empty
  expect(favorites.length).toBeGreaterThan(0);

  await page.goto('/');

  for (const movie of favorites) {
    // There is an item per favorite in the section
    const item = section(page, "Cindy's Favorites").locator('.Item', {
      has: page.getByText(movie.original_title)
    });
    await testItem(item, movie);
    await expect(item.getByRole('button')).toHaveAttribute('data-favorite', 'true');
  }
});

test('displays the movies section', async ({ page }) => {
  const { movies } = await getStoredData();

  // Stored data is not empty
  expect(movies.length).toBeGreaterThan(0);

  await page.goto('/');

  for (const movie of movies) {
    // There is an item per movie in the section
    const item = section(page, 'Movies').locator('.Item', {
      has: page.getByText(movie.original_title)
    });
    await testItem(item, movie);
    await expect(item.getByRole('button')).toHaveAttribute('data-favorite', 'false');
  }
});

test('moves a movie to the favorites and back', async ({ page }) => {
  const [movie] = (await getStoredData()).movies;
  const title = movie.original_title;
  const stored = async () => {
    const { favorites } = await getStoredData();
    return favorites.some(({ _id }) => _id === movie._id);
  };

  await page.goto('/');

  // The star adds the movie to the favorites, in the page and in MongoDB
  await section(page, 'Movies').getByRole('button', { name: `Add ${title} to favorites` }).click();
  await expect(section(page, "Cindy's Favorites").getByText(title)).toBeVisible();
  await expect(section(page, 'Movies').getByText(title)).toHaveCount(0);
  expect(await stored()).toBe(true);

  // The star removes it again, so the test leaves the data as it found it
  await section(page, "Cindy's Favorites").getByRole('button', { name: `Remove ${title} from favorites` }).click();
  await expect(section(page, 'Movies').getByText(title)).toBeVisible();
  expect(await stored()).toBe(false);
});
