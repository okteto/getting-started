import React, { useEffect, useState } from 'react';

import { UserProfile } from './UserProfile';

import { Hero } from './Hero';
import { TitleList } from './TitleList';

import userAvatarImage from '../assets/images/user.jpg';

import './style.css';

const session = {
  name: 'Cindy',
  avatar: userAvatarImage
};

function App() {
  const [movies, setMovies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [fixHeader, setFixHeader] = useState(false);

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(result => {
        setMovies(result);
        setLoaded(true);
      });

    const onScroll = () => setFixHeader(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Move a movie between the favorites and the rest of the movies
  const toggleFavorite = (movie) => {
    fetch(`/api/movies/${movie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite: !movie.favorite })
    })
      .then(res => res.json())
      .then(updated => {
        setMovies(current => current.map(item => (item.id === updated.id ? updated : item)));
      });
  };

  return (
    <div className="App">
      <header className={`Header ${fixHeader ? 'fixed' : ''}`}>
        <div className="content">
          <div className="logo">Kube Movies</div>
          <UserProfile user={session} />
        </div>
      </header>
      <Hero />
      <TitleList
        title={`${session.name}'s Favorites`}
        titles={movies.filter(movie => movie.favorite)}
        loaded={loaded}
        empty="No favorites yet. Click the star of a movie to add it."
        onToggleFavorite={toggleFavorite}
      />
      <TitleList
        title="Movies"
        titles={movies.filter(movie => !movie.favorite)}
        loaded={loaded}
        empty="Every movie is a favorite."
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default App;
