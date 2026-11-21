const { MongoClient } = require("mongodb");

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});

// Insert the movies that aren't in the database yet. The movies that are
// already there keep their data, so a new deployment doesn't reset the favorites.
async function insert(collection, data) {
  const { results } = require(data);
  const docs = results.map((doc) => ({ ...doc, _id: doc.id }));
  try {
    await collection.insertMany(docs, { ordered: false });
  } catch (err) {
    // Ignore duplicate key errors when the data is already loaded
    if (err.code !== 11000) {
      throw err;
    }
  }
}

// If MongoDB isn't ready yet, the load fails and Kubernetes restarts the seed Job.
async function load() {
  const db = client.db(process.env.MONGODB_DATABASE);
  await insert(db.collection('movies'), "./data/movies.json");
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
