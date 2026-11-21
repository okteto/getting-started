require('./load');

const MongoClient = require('mongodb').MongoClient;

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

const isValidMovie = (movie) => {
  return movie._id && movie.original_title && movie.overview && movie.vote_average && movie.backdrop_path
    && typeof movie.favorite === 'boolean';
}

describe('load.js', () => {
  it('should insert the movies', () => {
    expect(MongoClient.mock.insertedMovies.length).toBeGreaterThan(0);
    expect(MongoClient.mock.insertedMovies.every(isValidMovie)).toBe(true);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should insert favorites and movies that are not favorites', () => {
    expect(MongoClient.mock.insertedMovies.some((movie) => movie.favorite)).toBe(true);
    expect(MongoClient.mock.insertedMovies.some((movie) => !movie.favorite)).toBe(true);
  });
});
