import pkg from "pg";
import { config } from "../config/index.js";

const { Pool } = pkg;

export const db = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

// Test the pool by getting a connection
db.connect()
  .then((client) => {
    console.log("Connected to database");
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Error handling for the pool
db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default db;
