import { db } from "../../db/index.js";

/**
 * Repository class for handling user-related database operations.
 */
class UserRepository {
  /**
   * Creates a new user in the database.
   * @param {Object} params - The user creation parameters
   * @param {string} params.username - The username of the user
   * @param {string} params.email - The email address of the user
   * @param {string} params.name - The full name of the user
   * @param {string} params.password - The hashed password of the user
   * @returns {Promise<Object>} The created user object with id, username, email, name, and created_at
   * @throws {Error} When username or email already exists
   */
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

  /**
   * Finds a user by their username.
   * @param {string} username - The username to search for
   * @returns {Promise<Object|null>} The user object with id, username, and password if found, null otherwise
   */
  async findByUsername(username) {
    const query = {
      text: `
        SELECT id, username, password, email, name, created_at
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
