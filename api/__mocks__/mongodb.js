class MongoClient {
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
          toArray: () => new Promise((resolve, reject) => {
            if (collection === 'movies') {
              resolve([{ title: 'The Matrix' }]);
            } else if (collection === 'watching') {
              resolve([{ title: 'The Godfather' }]);
            } else {
              reject('unknown collection');
            }
          })
        })
      })
    };
  }
}

module.exports = { MongoClient };
