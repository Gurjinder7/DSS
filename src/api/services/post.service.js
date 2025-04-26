import { postRepository } from "../repositories/post.repository.js";

/**
 * Service handling post-related operations including creating, reading,
 * updating, and deleting posts.
 */
class PostService {
  /**
   * Creates a new post.
   * @param {Object} params - The post creation parameters
   * @param {string} params.title - The title of the post
   * @param {string} params.content - The content of the post
   * @param {string} params.userId - The ID of the user creating the post
   * @returns {Promise<Object>} The created post object
   */
  async createPost({ title, content, userId }) {
    const post = await postRepository.create({
      title,
      content,
      userId,
    });

    return post;
  }

  /**
   * Gets all posts.
   * @returns {Promise<Array>} Array of all posts
   */
  async getAllPosts() {
    const posts = await postRepository.findAll();
    return posts;
  }

  /**
   * Gets a post by its ID.
   * @param {string} postId - The ID of the post to retrieve
   * @returns {Promise<Object|null>} The post object if found, null otherwise
   */
  async getPostById(postId) {
    const post = await postRepository.findById(postId);
    return post;
  }

  /**
   * Gets all posts by a specific user.
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} Array of posts by the user
   */
  async getPostsByUser(userId) {
    const posts = await postRepository.findByUserId(userId);
    return posts;
  }

  /**
   * Updates a post.
   * @param {string} postId - The ID of the post to update
   * @param {Object} params - The update parameters
   * @param {string} [params.title] - The new title of the post
   * @param {string} [params.content] - The new content of the post
   * @returns {Promise<Object|null>} The updated post object if found, null otherwise
   */
  async updatePost(postId, { title, content }) {
    const post = await postRepository.update(postId, {
      title,
      content,
    });

    return post;
  }

  /**
   * Deletes a post.
   * @param {string} postId - The ID of the post to delete
   * @returns {Promise<Object|null>} The deleted post object if found, null otherwise
   */
  async deletePost(postId) {
    const post = await postRepository.delete(postId);
    return post;
  }
}

export const postService = new PostService();
