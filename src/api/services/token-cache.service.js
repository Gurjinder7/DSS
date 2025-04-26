import NodeCache from "node-cache";
import { config } from "../../config/index.js";

class TokenCacheService {
  cache = new NodeCache();
  expiresIn = {
    access: config.jwt.access.expiresIn * 1000,
    refresh: config.jwt.refresh.expiresIn * 1000,
  };

  /**
   * Adds a token to the cache for a specific user
   * @param {string} userId - The ID of the user
   * @param {string} token - The token to cache
   * @param {('access'|'refresh')} type - The type of token (access or refresh)
   */
  addToken(userId, token, type) {
    const key = `${type}_token_${userId}`;
    const ttl = this.expiresIn[type];

    this.cache.set(key, token, ttl);
  }

  /**
   * Checks if a token is valid by comparing it with the cached token
   * @param {string} userId - The ID of the user
   * @param {string} token - The token to validate
   * @param {('access'|'refresh')} type - The type of token (access or refresh)
   * @returns {boolean} True if token matches cached token, false otherwise
   */
  isTokenValid(userId, token, type) {
    const key = `${type}_token_${userId}`;
    const cachedToken = this.cache.get(key);
    return cachedToken === token;
  }

  /**
   * Deletes a token from the cache for a specific user
   * @param {string} userId - The ID of the user
   * @param {('access'|'refresh')} type - The type of token (access or refresh)
   */
  deleteToken(userId, type) {
    const key = `${type}_token_${userId}`;
    this.cache.del(key);
  }
}

export const tokenCache = new TokenCacheService();
