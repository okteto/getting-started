const { MongoClient } = require("mongodb");

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});

// Make the movies of the database match the catalog in ./data/movies.json:
// add the new ones, update the ones that changed, and delete the rest.
// A movie that is already in the database keeps its favorite flag, so a new
// deployment doesn't reset the favorites.
async function sync(collection, data) {
  const { results } = require(data);
  const operations = results.flatMap(({ favorite, ...movie }) => [
    {
      updateOne: {
        filter: { _id: movie.id },
        update: { $set: movie, $setOnInsert: { favorite } },
        upsert: true,
      },
    },
    {
      // Movies stored before the favorites existed get the flag of the catalog
      updateOne: {
        filter: { _id: movie.id, favorite: { $exists: false } },
        update: { $set: { favorite } },
      },
    },
  ]);
  await collection.bulkWrite(operations);
  await collection.deleteMany({ _id: { $nin: results.map(({ id }) => id) } });
}

// If MongoDB isn't ready yet, the load fails and Kubernetes restarts the seed Job.
async function load() {
  const db = client.db(process.env.MONGODB_DATABASE);
  await sync(db.collection('movies'), "./data/movies.json");
}

load()
  .then(() => {
    console.log('all loaded');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`fail to load: ${err}`);
    process.exit(1);
  });
