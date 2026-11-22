import React from "react";

import { Item } from "./Item";
import { Loader } from "./Loader";

export function TitleList({ title, titles = [], loaded, empty, onToggleFavorite }) {
  let content = <Loader />;
  if (loaded) {
    content = titles.length === 0 ? <p className="empty">{empty}</p> : titles.map((movie) => (
      <Item
        key={movie.id}
        title={movie.name || movie.original_title}
        score={movie.vote_average}
        // The posters are static files of the frontend, in public/posters
        backdrop={movie.backdrop_path}
        favorite={Boolean(movie.favorite)}
        onToggleFavorite={() => onToggleFavorite && onToggleFavorite(movie)}
      />
    ));
  }
  return (
    <div className="TitleList">
      <div className="Title">
        <h1>{title}</h1>
        <div className="titles-slider">
          {content}
        </div>
      </div>
    </div>
  );
}
