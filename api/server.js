const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

// The driver connects on the first query, and reconnects if MongoDB restarts.
const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});
const db = client.db(process.env.MONGODB_DATABASE);

async function find(collection) {
  try {
    return await db.collection(collection).find().toArray();
  } catch (err) {
    console.log(`failed to query ${collection}: ${err}`);
    return [];
  }
}

app.get("/api/healthz", (req, res) => {
  res.sendStatus(200);
});

app.get("/api/movies", async (req, res) => {
  console.log(`GET /api/movies`);
  res.json(await find("movies"));
});

app.get("/api/watching", async (req, res) => {
  console.log(`GET /api/watching`);
  res.json(await find("watching"));
});

app.get("/api", (req, res) => {
  res.sendStatus(418);
});

// Express 5 passes listen errors, such as a port in use, to the callback.
app.listen(8080, (err) => {
  if (err) {
    throw err;
  }
  console.log("Server running on port 8080.");
});
