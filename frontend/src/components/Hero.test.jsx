import React from 'react';

import { render } from '@testing-library/react';

import { Hero } from './Hero';

// jsdom resolves relative URLs in styles, so the mock returns an absolute one
vi.mock('../assets/images/movie-bg.jpg', () => ({ default: 'https://movies.example.com/assets/movie-bg.jpg' }));

describe('Hero', () => {
  it('should render without crashing', () => {
    const { container } = render(<Hero />);

    expect(container.firstChild).not.toBeNull();
  });
  
  it('should render the content', () => {
    const { getByRole, getByText } = render(<Hero />);

    expect(getByRole('heading', { name: 'Movies from the Kubernetes World' })).toBeVisible();
    expect(getByText(/Okteto originals about what every cluster has lived through/)).toBeVisible();
  });

  it('should render the backdrop', () => {
    const { container } = render(<Hero />);

    expect(container.firstChild).toHaveStyle('background-image: url(https://movies.example.com/assets/movie-bg.jpg);');
  });
});
