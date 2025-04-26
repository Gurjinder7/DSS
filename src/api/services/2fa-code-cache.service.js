import NodeCache from "node-cache";

class TwoFactorCodeCacheService {
  cache = new NodeCache();
  expiresIn = 5 * 60; // 5 minutes in seconds

  /**
   * Generates a random 6-digit code
   * @returns {string} 6-digit code
   */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Stores a 2FA code for a user
   * @param {string} userId - The ID of the user
   * @param {string} code - The 2FA code to store
   * @returns {string} The stored code
   */
  storeCode(userId) {
    const code = this.generateCode();
    const key = `2fa_${userId}`;
    this.cache.set(key, code, this.expiresIn);
    return code;
  }

  /**
   * Validates a 2FA code for a user
   * @param {string} userId - The ID of the user
   * @param {string} code - The code to validate
   * @returns {boolean} Whether the code is valid
   */
  validateCode(userId, code) {
    const key = `2fa_${userId}`;
    const storedCode = this.cache.get(key);
    return storedCode === code;
  }

  /**
   * Deletes a 2FA code for a user
   * @param {string} userId - The ID of the user
   */
  deleteCode(userId) {
    const key = `2fa_${userId}`;
    this.cache.del(key);
  }
}

export const twoFactorCodeCache = new TwoFactorCodeCacheService(); 