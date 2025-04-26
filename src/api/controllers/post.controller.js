import { postService } from "../services/post.service.js";

/**
 * Controller handling post-related operations
 * @class PostController
 */
class PostController {
  /**
   * Creates a new post
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @param {Object} req.body - Request body
   * @param {string} req.body.title - Post title
   * @param {string} req.body.content - Post content
   * @returns {Promise<import('express').Response>} Response object with the created post
   */
  async createPost(req, res) {
    try {
      const { title, content } = req.body;
      const userId = req.user.id; // From auth middleware

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      const post = await postService.createPost({
        title,
        content,
        userId,
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error("Create post error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Gets all posts
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<import('express').Response>} Response object with all posts
   */
  async getAllPosts(req, res) {
    try {
      const posts = await postService.getAllPosts();
      return res.status(200).json(posts);
    } catch (error) {
      console.error("Get all posts error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Gets a post by ID
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<import('express').Response>} Response object with the requested post
   */
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await postService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (error) {
      console.error("Get post by id error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Gets all posts by a specific user
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<import('express').Response>} Response object with the user's posts
   */
  async getPostsByUser(req, res) {
    try {
      const { userId } = req.params;
      const posts = await postService.getPostsByUser(userId);
      return res.status(200).json(posts);
    } catch (error) {
      console.error("Get posts by user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Updates a post
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @param {Object} req.body - Request body
   * @param {string} [req.body.title] - Updated post title
   * @param {string} [req.body.content] - Updated post content
   * @returns {Promise<import('express').Response>} Response object with the updated post
   */
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user.id; // From auth middleware

      const post = await postService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (!title && !content) {
        return res.status(400).json({ message: "Title or content is required" });
      }

      const updatedPost = await postService.updatePost(id, {
        title,
        content,
      });

      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Update post error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Deletes a post
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<import('express').Response>} Response object with deletion status
   */
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // From auth middleware

      const post = await postService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.user_id !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await postService.deletePost(id);
      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export const postController = new PostController();
