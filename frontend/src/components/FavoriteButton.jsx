import React from "react";

// The star of a movie: it adds the movie to the favorites, or removes it from them.
export function FavoriteButton({ title, favorite, onClick }) {
  const label = favorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`;
  return (
    <button
      type="button"
      className="FavoriteButton"
      data-favorite={favorite ? 'true' : 'false'}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" />
      </svg>
    </button>
  );
}
