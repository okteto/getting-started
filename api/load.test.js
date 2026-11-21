require('./load');

const MongoClient = require('mongodb').MongoClient;

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

const { results } = require('./data/movies.json');

const isValidMovie = (movie) => {
  return movie.id && movie.original_title && movie.overview && movie.vote_average && movie.backdrop_path;
}

describe('load.js', () => {
  // Two operations per movie: the first one adds or updates it
  const upserts = () => MongoClient.mock.operations.filter((_operation, i) => i % 2 === 0).map(({ updateOne }) => updateOne);

  it('should add or update every movie of the catalog', () => {
    expect(upserts()).toHaveLength(results.length);
    expect(upserts().every(({ upsert, update }) => upsert && isValidMovie(update.$set))).toBe(true);
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  it('should only set the favorite flag of the movies that do not have one', () => {
    expect(upserts().every(({ update }) => !('favorite' in update.$set) && typeof update.$setOnInsert.favorite === 'boolean')).toBe(true);
    expect(upserts().some(({ update }) => update.$setOnInsert.favorite)).toBe(true);
    expect(upserts().some(({ update }) => !update.$setOnInsert.favorite)).toBe(true);
  });

  it('should delete the movies that are not in the catalog', () => {
    expect(MongoClient.mock.deleted).toEqual({ _id: { $nin: results.map(({ id }) => id) } });
  });
});
