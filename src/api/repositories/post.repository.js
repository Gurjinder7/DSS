import { db } from "../../db/index.js";

/**
 * Repository class for handling post-related database operations.
 */
class PostRepository {
  /**
   * Creates a new post in the database.
   * @param {Object} params - The post creation parameters
   * @param {string} params.title - The title of the post
   * @param {string} params.content - The content of the post
   * @param {string} params.userId - The ID of the user who created the post
   * @returns {Promise<Object>} The created post object
   */
  async create({ title, content, userId }) {
    const query = {
      text: `
        INSERT INTO POSTS (title, content, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, title, content, user_id, created_at, likes
      `,
      values: [title, content, userId],
    };

    const result = await db.query(query);
    return result.rows[0];
  }

  /**
   * Finds a post by its ID.
   * @param {string} id - The ID of the post to find
   * @returns {Promise<Object|null>} The post object if found, null otherwise
   */
  async findById(id) {
    const query = {
      text: `
        SELECT p.*, u.username, u.name
        FROM POSTS p
        JOIN USERS u ON p.user_id = u.id
        WHERE p.id = $1
      `,
      values: [id],
    };

    const result = await db.query(query);
    return result.rows[0] || null;
  }

  /**
   * Gets all posts.
   * @returns {Promise<Array>} An array of post objects
   */
  async findAll() {
    const query = {
      text: `
        SELECT p.*, u.username, u.name
        FROM POSTS p
        JOIN USERS u ON p.user_id = u.id
        ORDER BY p.created_at DESC
      `,
    };

    const result = await db.query(query);
    return result.rows;
  }

  /**
   * Updates a post by its ID.
   * @param {string} id - The ID of the post to update
   * @param {Object} params - The update parameters
   * @param {string} [params.title] - The new title of the post
   * @param {string} [params.content] - The new content of the post
   * @returns {Promise<Object|null>} The updated post object if found, null otherwise
   */
  async update(id, { title, content }) {
    const updates = [];
    const values = [id];
    let paramCount = 2;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(content);
      paramCount++;
    }

    if (updates.length === 0) {
      return null;
    }

    const query = {
      text: `
        UPDATE POSTS
        SET ${updates.join(", ")}
        WHERE id = $1
        RETURNING id, title, content, user_id, created_at, likes
      `,
      values,
    };

    const result = await db.query(query);
    return result.rows[0] || null;
  }

  /**
   * Deletes a post by its ID.
   * @param {string} id - The ID of the post to delete
   * @returns {Promise<Object|null>} The deleted post object if found, null otherwise
   */
  async delete(id) {
    const query = {
      text: `
        DELETE FROM POSTS
        WHERE id = $1
        RETURNING id, title, content, user_id, created_at, likes
      `,
      values: [id],
    };

    const result = await db.query(query);
    return result.rows[0] || null;
  }

  /**
   * Gets all posts by a specific user.
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} An array of post objects
   */
  async findByUserId(userId) {
    const query = {
      text: `
        SELECT p.*, u.username, u.name
        FROM POSTS p
        JOIN USERS u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
      `,
      values: [userId],
    };

    const result = await db.query(query);
    return result.rows;
  }
}

export const postRepository = new PostRepository();
