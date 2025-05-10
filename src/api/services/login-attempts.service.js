import NodeCache from "node-cache";
import { config } from "../../config/index.js";

class LoginAttemptsService {
  cache = new NodeCache();

  /**
   * Records a failed login attempt for a username
   * @param {string} username - The username that failed to login
   * @returns {number} The number of failed attempts
   */
  recordFailedAttempt(username) {
    const key = `login_attempts_${username}`;
    const attempts = this.cache.get(key) || 0;
    const newAttempts = attempts + 1;

    this.cache.set(key, newAttempts, config.loginAttempts.blockDuration);

    return newAttempts;
  }

  /**
   * Checks if a username is blocked from logging in
   * @param {string} username - The username to check
   * @returns {boolean} Whether the username is blocked
   */
  isBlocked(username) {
    const key = `login_attempts_${username}`;
    const attempts = this.cache.get(key) || 0;
    return attempts >= config.loginAttempts.maxAttempts;
  }

  /**
   * Gets the remaining time in seconds until the block is lifted
   * @param {string} username - The username to check
   * @returns {number} Time remaining in seconds, or 0 if not blocked
   */
  getBlockTimeRemaining(username) {
    const key = `login_attempts_${username}`;
    const ttl = this.cache.getTtl(key);

    console.log("ttl", ttl);

    if (!ttl) return 0;

    const now = Date.now();
    const remainingMs = ttl - now;
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  /**
   * Resets the failed attempts counter for a username
   * @param {string} username - The username to reset
   */
  resetAttempts(username) {
    const key = `login_attempts_${username}`;
    this.cache.del(key);
  }
}

export const loginAttemptsService = new LoginAttemptsService();
