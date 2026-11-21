import { test, expect } from '@playwright/test';

import { getStoredData } from '../data/getStoredData';

const FAVORITES = "Cindy's Favorites";
const MOVIES = 'Movies';

const section = (page, name) => page.locator('.TitleList', {
  has: page.getByRole('heading', { name })
});

// Every stored movie has an item in its section, with its info and its star
const testSection = async (page, name, movies, favorite) => {
  for (const movie of movies) {
    const item = section(page, name).locator('.Item', {
      has: page.getByText(movie.original_title)
    });

    // Hovering over the movie item to make the info visible
    await item.hover();
    await expect(item.getByText(movie.original_title)).toBeVisible();
    await expect(item.getByText(`${movie.vote_average} / 10`)).toBeVisible();
    await expect(item.getByRole('button')).toHaveAttribute('data-favorite', `${favorite}`);
  }
  await expect(section(page, name).locator('.Item')).toHaveCount(movies.length);
}

test('displays the favorites section', async ({ page }) => {
  const { favorites } = await getStoredData();

  await page.goto('/');

  await testSection(page, FAVORITES, favorites, true);
});

test('displays the movies section', async ({ page }) => {
  const { movies } = await getStoredData();

  await page.goto('/');

  await testSection(page, MOVIES, movies, false);
});

test('moves a movie to the favorites and back', async ({ page }) => {
  const { favorites, movies } = await getStoredData();

  // Stored data is not empty
  expect(favorites.length + movies.length).toBeGreaterThan(0);

  // Any movie works: the test moves it to the other section, and back
  const movie = movies[0] ?? favorites[0];
  const title = movie.original_title;
  const [from, to] = movie.favorite ? [FAVORITES, MOVIES] : [MOVIES, FAVORITES];
  const star = (name) => section(page, name).getByRole('button', { name: new RegExp(`${title} (to|from) favorites`) });
  const storedFavorite = async () => {
    const stored = await getStoredData();
    return stored.favorites.some(({ _id }) => _id === movie._id);
  };

  await page.goto('/');

  // The star moves the movie to the other section, in the page and in MongoDB
  await star(from).click();
  await expect(section(page, to).getByText(title)).toBeVisible();
  await expect(section(page, from).getByText(title)).toHaveCount(0);
  expect(await storedFavorite()).toBe(!movie.favorite);

  // The star moves it back, so the test leaves the data as it found it
  await star(to).click();
  await expect(section(page, from).getByText(title)).toBeVisible();
  expect(await storedFavorite()).toBe(Boolean(movie.favorite));
});
