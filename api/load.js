const { MongoClient } = require("mongodb");

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});

async function insert(collection, data) {
  const { results } = require(data);
  const docs = results.map((doc) => ({ ...doc, _id: doc.id }));
  try {
    await collection.insertMany(docs);
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
  await Promise.all([
    insert(db.collection('movies'), "./data/movies.json"),
    insert(db.collection('watching'), "./data/watching.json"),
  ]);
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
