import React from 'react';

import { act, fireEvent, render, within } from '@testing-library/react';

import App from './App';

const movies = [
  { id: 1, original_title: 'The Podfather', vote_average: 9.2, favorite: true },
  { id: 2, original_title: 'OOMKilled', vote_average: 7.4, favorite: false },
];

const originalFetch = global.fetch;
const mockFetch = vi.fn((endpoint, options) => Promise.resolve({
  json: () => Promise.resolve(options?.method === 'PUT'
    ? { ...movies.find(({ id }) => endpoint === `/api/movies/${id}`), ...JSON.parse(options.body) }
    : movies),
}));

const section = (container, title) => within(
  [...container.querySelectorAll('.TitleList')].find((list) => within(list).queryByRole('heading', { name: title }))
);

describe('App', () => {
  beforeAll(() => {
    global.fetch = mockFetch
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should render without crashing', async () => {
    const { container } = await act(() => render(<App />));

    expect(container.firstChild).not.toBeNull();
  });

  it('should render the header', async () => {
    const { container, getByText, queryByRole } = await act(() => render(<App />));

    expect(container.querySelector('.logo')).toBeVisible();
    expect(queryByRole('list')).not.toBeInTheDocument();
    expect(getByText('Cindy')).toBeVisible();
  });

  it('should fetch the movies', async () => {
    await act(() => render(<App />));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/movies');
  });

  it('should render the favorites and the movies', async () => {
    const { container, findByText } = await act(() => render(<App />));

    await findByText('The Podfather');

    expect(section(container, "Cindy's Favorites").getByText('The Podfather')).toBeVisible();
    expect(section(container, "Cindy's Favorites").getByText('9.2 / 10')).toBeVisible();

    expect(section(container, 'Movies').getByText('OOMKilled')).toBeVisible();
    expect(section(container, 'Movies').getByText('7.4 / 10')).toBeVisible();
  });

  it('should move a movie to the favorites', async () => {
    const { container, findByText, getByRole } = await act(() => render(<App />));

    await findByText('OOMKilled');
    await act(() => fireEvent.click(getByRole('button', { name: 'Add OOMKilled to favorites' })));

    expect(global.fetch).toHaveBeenLastCalledWith('/api/movies/2', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ favorite: true }),
    }));
    expect(section(container, "Cindy's Favorites").getByText('OOMKilled')).toBeVisible();
    expect(section(container, 'Movies').getByText('Every movie is a favorite.')).toBeVisible();
  });
});
