import React from "react";

import movieBackground from '../assets/images/movie-bg.jpg';

export function Hero() {
  return (
    <div id="hero" className="Hero" style={{ backgroundImage: `url(${movieBackground})` }}>
      <div className="spring" />
      <div className="content">
        <h1>Movies from the Kubernetes World</h1>
        <p>
          Okteto originals about what every cluster has lived through. Click the star of a
          movie to add it to your favorites.
        </p>
      </div>
      <div className="overlay"></div>
    </div>
  );
}
