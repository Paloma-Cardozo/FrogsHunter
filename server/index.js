import express from "express";
import knex from "knex";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../app")));

const db = knex({
  client: "sqlite3",
  connection: { filename: path.join(__dirname, "database.db") },
  useNullAsDefault: true,
});

app.get("/cards", async (request, response) => {
  try {
    const cards = await db("cards").select("*");
    response.status(200).json(cards);
  } catch (error) {
    console.error("Database error:", error.message);
    response
      .status(500)
      .json({ error: "Failed to retrieve cards", details: error.message });
  }
});

app.use((request, response) => {
  response.status(404).json({
    error: "Endpoint not found",
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
});
