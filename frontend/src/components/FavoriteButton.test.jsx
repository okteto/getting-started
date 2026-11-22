import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { FavoriteButton } from './FavoriteButton';

describe('FavoriteButton', () => {
  it('should offer to add a movie to the favorites', () => {
    const { getByRole } = render(<FavoriteButton title="Kube" favorite={false} />);

    expect(getByRole('button', { name: 'Add Kube to favorites' })).toHaveAttribute('data-favorite', 'false');
  });

  it('should offer to remove a favorite', () => {
    const { getByRole } = render(<FavoriteButton title="Kube" favorite />);

    expect(getByRole('button', { name: 'Remove Kube from favorites' })).toHaveAttribute('data-favorite', 'true');
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    const { getByRole } = render(<FavoriteButton title="Kube" favorite={false} onClick={onClick} />);

    fireEvent.click(getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
