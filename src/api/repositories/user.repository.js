import { db } from "../../db/index.js";

class UserRepository {
  async create({ username, email, name, password }) {
    const query = {
      text: `
        INSERT INTO USERS (username, email, name, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, name, created_at
      `,
      values: [username, email, name, password],
    };

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        if (error.constraint === "users_username_key") {
          throw new Error("Username already exists");
        }
        if (error.constraint === "users_email_key") {
          throw new Error("Email already exists");
        }
      }
      throw error;
    }
  }

  async findByUsername(username) {
    const query = {
      text: `
        SELECT id, username, password
        FROM USERS
        WHERE username = $1
      `,
      values: [username],
    };

    const result = await db.query(query);
    return result.rows[0] || null;
  }
}

export const userRepository = new UserRepository();
