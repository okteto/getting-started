import { MongoClient } from 'mongodb';

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}.${process.env.OKTETO_NAMESPACE}:27017/${process.env.MONGODB_DATABASE}`;

export const getStoredData = async () => {
  const client = new MongoClient(url);
  
  client.on('error', (error) => {
    console.error(`Error connecting to the database: ${error}`);
  });
  
  const db = client.db(process.env.MONGODB_DATABASE);

  const [movies, watching] = await Promise.all([
    db.collection('movies').find().limit(4).toArray(),
    db.collection('watching').find().limit(4).toArray(),
  ]);

  return { movies, watching };
};