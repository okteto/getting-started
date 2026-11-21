class MongoClient {
  static insertedMovies = [];
  static updates = [];

  constructor(url, options) {
    this.url = url;
    this.options = options;
  }

  on(_event, _callback) {
    return;
  }

  db(_database) {
    return {
      collection: (collection) => ({
        find: () => ({
          sort: () => ({
            toArray: () => new Promise((resolve, reject) => {
              if (collection === 'movies') {
                resolve([{ _id: 1, original_title: 'The Podfather', favorite: true }]);
              } else {
                reject('unknown collection');
              }
            })
          })
        }),
        findOneAndUpdate: (filter, update) => {
          MongoClient.updates.push({ filter, update });
          // Only the movie with the id 1 exists
          return Promise.resolve(filter._id === 1 ? { _id: 1, original_title: 'The Podfather', ...update.$set } : null);
        },
        insertMany: (docs) => {
          if (collection === 'movies') MongoClient.insertedMovies = docs;
          return Promise.resolve();
        }
      })
    };
  }

  static get mock() {
    return {
      insertedMovies: MongoClient.insertedMovies,
      updates: MongoClient.updates,
    }
  }
}

module.exports = { MongoClient };
