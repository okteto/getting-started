const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

// The driver connects on the first query, and reconnects if MongoDB restarts.
const client = new MongoClient(url, {
  connectTimeoutMS: 1000,
  socketTimeoutMS: 1000,
});
const movies = client.db(process.env.MONGODB_DATABASE).collection("movies");

app.get("/api/healthz", (req, res) => {
  res.sendStatus(200);
});

// Every movie, with its favorite flag.
app.get("/api/movies", async (req, res) => {
  console.log(`GET /api/movies`);
  try {
    res.json(await movies.find().sort({ _id: 1 }).toArray());
  } catch (err) {
    console.log(`failed to query movies: ${err}`);
    res.json([]);
  }
});

// Add a movie to the favorites, or remove it from them: {"favorite": true}
app.put("/api/movies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const favorite = req.body?.favorite;
  console.log(`PUT /api/movies/${id} favorite=${favorite}`);
  if (typeof favorite !== "boolean") {
    return res.status(400).json({ error: "favorite must be true or false" });
  }
  try {
    const movie = await movies.findOneAndUpdate(
      { _id: id },
      { $set: { favorite } },
      { returnDocument: "after" },
    );
    if (!movie) {
      return res.sendStatus(404);
    }
    res.json(movie);
  } catch (err) {
    console.log(`failed to update movie ${id}: ${err}`);
    res.sendStatus(500);
  }
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
