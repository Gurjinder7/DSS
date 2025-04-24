import pkg from "pg";
import { config } from "../../config/index.js";

const { Client } = pkg;

const client = new Client({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

export const up = async () => {
  try {
    await client.connect();

    // Enable UUID extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create USERS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS USERS (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(15) UNIQUE NOT NULL CHECK (char_length(username) > 0 AND char_length(username) <= 20),
        email VARCHAR(50) UNIQUE NOT NULL CHECK (char_length(email) > 0 AND char_length(email) <= 50),
        name VARCHAR(30) NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 30),
        password VARCHAR(255) NOT NULL CHECK (char_length(password) > 0 AND char_length(password) <= 255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("Users table created");

    // Create POSTS table
    await client.query(`
      CREATE TABLE IF NOT EXISTS POSTS (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL CHECK(char_length(title) > 0),
        content TEXT NOT NULL CHECK(char_length(content) > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        user_id UUID NOT NULL,
        likes INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    console.log("Posts table created");
  } catch (error) {
    console.error("Error in tables creation migration:", error);
    throw error;
  } finally {
    await client.end();
  }
};
