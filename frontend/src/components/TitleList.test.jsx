import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { TitleList } from './TitleList';

const props = {
  loaded: true,
  title: 'Movies list',
  empty: 'No movies',
  titles: [
    {
      id: 1,
      name: 'The Podfather',
      vote_average: 9.2,
      favorite: true,
    },
    {
      id: 2,
      original_title: 'OOMKilled',
      vote_average: 9.3,
    }
  ],
};

describe('TitleList', () => {
  it('should render without crashing', () => {
    const { container } = render(<TitleList {...props} />);

    expect(container.firstChild).not.toBeNull();
  });

  it('should render the title', () => {
    const { getByText } = render(<TitleList {...props} />);

    expect(getByText('Movies list')).toBeVisible();
  });

  it('should render the titles', () => {
    const { getByText, queryByTestId } = render(<TitleList {...props} />);

    expect(queryByTestId('loader')).not.toBeInTheDocument();

    expect(getByText('The Podfather')).toBeVisible();
    expect(getByText('9.2 / 10')).toBeVisible();

    expect(getByText('OOMKilled')).toBeVisible();
    expect(getByText('9.3 / 10')).toBeVisible();
  });

  it('should render the loader', () => {
    const { getByTestId } = render(<TitleList {...props} loaded={false} />);

    expect(getByTestId('loader')).toBeVisible();
  });

  it('should render the empty message', () => {
    const { getByText } = render(<TitleList {...props} titles={[]} />);

    expect(getByText('No movies')).toBeVisible();
  });

  it('should toggle the favorite of a movie', () => {
    const onToggleFavorite = vi.fn();
    const { getByRole } = render(<TitleList {...props} onToggleFavorite={onToggleFavorite} />);

    fireEvent.click(getByRole('button', { name: 'Remove The Podfather from favorites' }));

    expect(onToggleFavorite).toHaveBeenCalledWith(props.titles[0]);
  });
});
