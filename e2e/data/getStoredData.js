import { MongoClient } from 'mongodb';

const user = process.env.MONGODB_USERNAME;
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const host = `${process.env.MONGODB_HOST}.${process.env.OKTETO_NAMESPACE}`;
const database = process.env.MONGODB_DATABASE;

const url = `mongodb://${user}:${password}@${host}:27017/${database}`;

// The movies stored in MongoDB, split into the favorites and the rest
export const getStoredData = async () => {
  const client = new MongoClient(url);

  client.on('error', (error) => {
    console.error(`Error connecting to the database: ${error}`);
  });

  try {
    const movies = await client.db(database).collection('movies').find().sort({ _id: 1 }).toArray();
    return {
      favorites: movies.filter((movie) => movie.favorite),
      movies: movies.filter((movie) => !movie.favorite),
    };
  } finally {
    await client.close();
  }
};
