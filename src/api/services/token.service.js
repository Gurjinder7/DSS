import { userRepository } from "../repositories/user.repository.js";
import { config } from "../../config/index.js";
import jwt from "jsonwebtoken";
import { tokenCache } from "./token-cache.service.js";

class TokenService {
  secret = {
    access: config.jwt.access.secret,
    refresh: config.jwt.refresh.secret,
  };
  expiresIn = {
    access: config.jwt.access.expiresIn,
    refresh: config.jwt.refresh.expiresIn,
  };

  /**
   * Generate a JWT token
   * @param {object} user - The user object to include in the token
   * @param {"access"|"refresh"} type - The type of token to generate
   * @returns {string} The generated JWT token
   */
  generateToken(user, type) {
    const secret = this.secret[type];
    const expiresIn = this.expiresIn[type];

    const token = jwt.sign({ user, type }, secret, {
      expiresIn,
    });

    tokenCache.addToken(user.id, token, type);

    return token;
  }

  /**
   * Refresh a JWT token
   * @param {string} refreshToken - The refresh token to refresh
   * @returns {object|null} The new access and refresh tokens or null if invalid
   */
  refreshTokens(refreshToken) {
    const payload = this.verifyToken(refreshToken, "refresh");
    if (!payload) return null;

    const user = userRepository.findByUsername(payload.username);
    if (!user) return null;

    const accessToken = this.generateToken(user, "access");
    const newRefreshToken = this.generateToken(user, "refresh");

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Verify a JWT token
   * @param {string} token - The token to verify
   * @param {"access"|"refresh"} type - The type of token to verify
   * @returns {object|null} The decoded token payload or null if invalid
   */
  verifyToken(token, type, ignoreExpiration = false) {
    const secret = this.secret[type];

    try {
      const decoded = jwt.verify(token, secret, { ignoreExpiration });
      const userId = decoded.user.id;

      if (!ignoreExpiration) {
        const isValid = tokenCache.isTokenValid(userId, token, type);
        if (!isValid) return null;
      }

      return decoded;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * Get cookie options for JWT tokens
   * @param {"access"|"refresh"} type - The type of token (access or refresh)
   * @returns {Object} Cookie configuration object
   * @property {boolean} httpOnly - Prevents client-side access to the cookie
   * @property {boolean} secure - Only sends cookie over HTTPS in production
   * @property {string} sameSite - Controls how the cookie is sent with cross-site requests
   * @property {number} maxAge - Cookie expiration time in seconds
   */
  getCookieOptions(type) {
    const expiresIn = this.expiresIn[type];

    return {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: expiresIn,
    };
  }
}

export const tokenService = new TokenService();
