import { config } from "../../config/index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Service class for handling password hashing and comparison operations
 * using a combination of HMAC-SHA512 with a pepper and bcrypt.
 */
class PasswordService {
  pepper = config.password.pepper;
  saltRounds = 14;

  /**
   * Creates an HMAC-SHA512 hash of the password using the pepper.
   * @private
   * @param {string} password - The plain text password to hash
   * @returns {Buffer} The HMAC-SHA512
   */
  hmacSha512(password) {
    const result = crypto
      .createHmac("sha512", this.pepper)
      .update(password)
      .digest();

    return result;
  }

  /**
   * Hashes a password using HMAC-SHA512 and bcrypt.
   * First creates an HMAC-SHA512 hash with the pepper, then applies bcrypt.
   * @param {string} password - The plain text password to hash
   * @returns {Promise<string>} A promise that resolves to the final bcrypt hash
   */
  async hash(password) {
    const hmac = this.hmacSha512(password);
    const hash = await bcrypt.hash(hmac, this.saltRounds);

    return hash;
  }

  /**
   * Compares a plain text password with a stored hash.
   * @param {string} password - The plain text password to verify
   * @param {string} hash - The stored hash to compare against
   * @returns {Promise<boolean>} A promise that resolves to true if the password matches, false otherwise
   */
  async compare(password, hash) {
    const hmac = this.hmacSha512(password);
    const result = await bcrypt.compare(hmac, hash);

    return result;
  }
}

export const passwordService = new PasswordService();
