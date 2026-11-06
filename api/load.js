const MongoClient = require("mongodb").MongoClient;

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});

client.on('connectionClosed', ({ error }) => {
  console.error(`Error connecting, retrying in 300 msec: ${error}`);
  setTimeout(loadWithRetry, 300);
});

// The MongoDB driver v6 doesn't support callbacks: insertMany returns a promise.
async function insert(collection, data) {
  const d = require(data);
  d.results.forEach((doc) => {
    doc._id = doc.id;
  });
  try {
    await collection.insertMany(d.results);
  } catch (err) {
    // Ignore duplicate key errors when the data is already loaded
    if (err.code != 11000) {
      throw err;
    }
  }
}

function loadWithRetry() {
  const db = client.db(process.env.MONGODB_DATABASE);
  const promises = [
    insert(db.collection('movies'), "./data/movies.json"),
    insert(db.collection('watching'), "./data/watching.json"),
  ];

  Promise.all(promises)
  .then(function() {
    console.log('all loaded');
    process.exit(0);
  })
  .catch((err) => {
    console.error(`fail to load: ${err}`);
    process.exit(1);
  });
};

loadWithRetry();
