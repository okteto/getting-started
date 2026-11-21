import React from 'react';

import { render } from '@testing-library/react';

import { Item } from './Item';

const props = {
  // A sample of a movie
  title: 'The Podfather',
  score: 9.2,
  backdrop: 'https://movies.example.com/posters/the-podfather.jpg',
};

describe('Item', () => {
  it('should render without crashing', () => {
    const { container } = render(<Item {...props} />);

    expect(container.firstChild).not.toBeNull();
  });

  it('should render the info', () => {
    const { getByText } = render(<Item {...props} />);

    expect(getByText('The Podfather')).toBeVisible();
    expect(getByText('9.2 / 10')).toBeVisible();
  });

  it('should render the star of the movie', () => {
    const { getByRole } = render(<Item {...props} favorite />);

    expect(getByRole('button', { name: 'Remove The Podfather from favorites' })).toBeVisible();
  });

  it('should render the backdrop', () => {
    const { getByTestId } = render(<Item {...props} />);

    expect(getByTestId('item-container')).toHaveStyle('background-image: url(https://movies.example.com/posters/the-podfather.jpg);');
  });
});
