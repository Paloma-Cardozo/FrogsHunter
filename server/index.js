import express from "express";
import knex from "knex";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("../app"));

const dbPath = path.join(__dirname, 'database.db');
console.log('Using database at:', dbPath);

const db = knex({
  client: "sqlite3",
  connection: { filename: "./database.db" },
  useNullAsDefault: true,
});

app.get("/cards", async function (request, response) {
  const cards = await db("cards").select("*");
  
  response.json(cards);
});

// Start the server on port 3000 on your local machine
const server = app.listen(3000, function () {
  console.log("App running on http://localhost:3000. Type Ctrl+C to stop.");
});

// Show errors when the server fails to start
server.on("error", function (error) {
  console.error("Server error:", error.message);
});
