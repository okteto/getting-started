import React from 'react';

import { render } from '@testing-library/react';

import { UserProfile } from './UserProfile';

const user = {
  name: 'Cindy',
  avatar: 'avatar.jpg'
};

describe('UserProfile', () => {
  it('should render without crashing', () => {
    const { container } = render(<UserProfile user={user} />);

    expect(container.firstChild).not.toBeNull();
  });

  it('should render the user name', () => {
    const { getByText } = render(<UserProfile user={user} />);

    expect(getByText('Cindy')).toBeVisible();
  });

  it('should render the user avatar', () => {
    const { getByAltText } = render(<UserProfile user={user} />);

    expect(getByAltText('profile')).toHaveAttribute('src', 'avatar.jpg');
  });
});
