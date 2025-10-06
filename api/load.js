const MongoClient = require("mongodb").MongoClient;

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/?authSource=admin`;

const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});

async function insert(collection, dataPath) {
  const data = require(dataPath);
  const documents = data.results.map(doc => ({
    ...doc,
    _id: doc.id
  }));
  
  try {
    await collection.insertMany(documents, { ordered: false });
    console.log(`Inserted ${documents.length} documents into ${collection.collectionName}`);
  } catch (err) {
    if (err.code === 11000) {
      console.log(`Documents already exist in ${collection.collectionName}, skipping duplicates`);
    } else {
      throw err;
    }
  }
}

async function loadWithRetry() {
  let retryCount = 0;
  const maxRetries = 10;
  
  while (retryCount < maxRetries) {
    try {
      console.log('Connecting to MongoDB...');
      await client.connect();
      console.log('Connected successfully to MongoDB');

      // Create the database explicitly by creating a collection
      console.log(`Creating database: ${process.env.MONGODB_DATABASE}`);
      const db = client.db(process.env.MONGODB_DATABASE);
      
      // Ensure the database exists by creating collections
      console.log('Creating collections...');
      await db.createCollection('movies');
      await db.createCollection('watching');
      
      console.log('Loading data...');
      
      // Insert data into collections
      await insert(db.collection('movies'), "./data/movies.json");
      await insert(db.collection('watching'), "./data/watching.json");
      
      console.log('All data loaded successfully');
      process.exit(0);
      
    } catch (err) {
      retryCount++;
      console.error(`Error (attempt ${retryCount}/${maxRetries}): ${err.message}`);
      
      if (retryCount >= maxRetries) {
        console.error('Max retries reached, exiting...');
        process.exit(1);
      }
      
      console.log('Retrying in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Only run if this file is executed directly (not in tests)
if (require.main === module) {
  loadWithRetry();
}
