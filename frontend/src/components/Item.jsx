import React from "react";

import { FavoriteButton } from "./FavoriteButton";

export function Item({ title, score, backdrop, favorite, onToggleFavorite }) {
  return (
    <div className="Item">
      <div
        className="ItemContainer"
        style={{ backgroundImage: `url(${backdrop})` }}
        data-testid="item-container"
      >
        <div className="overlay">
          <div className="title">{title}</div>
          <div className="rating">{score} / 10</div>
        </div>
        <FavoriteButton title={title} favorite={favorite} onClick={onToggleFavorite} />
      </div>
    </div>
  );
}
