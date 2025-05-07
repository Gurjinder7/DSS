import { config } from "../../config/index.js";
import { userRepository } from "../repositories/user.repository.js";
import { passwordService } from "./password.service.js";
import { tokenCache } from "./token-cache.service.js";
import { tokenService } from "./token.service.js";
import { twoFactorCodeCache } from "./2fa-code-cache.service.js";
import { emailService } from "./email.service.js";

/**
 * Service handling authentication-related operations including login, registration,
 * and cookie management for JWT tokens.
 */
class AuthService {
  /**
   * Authenticates a user with their username and password.
   * @param {string} username - The username of the user trying to log in
   * @param {string} password - The plain text password of the user
   * @returns {Promise<Object|null>} The user object if authentication is successful, null otherwise
   */
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    const validPassword = await passwordService.compare(
      password,
      user.password
    );
    if (!validPassword) {
      return null;
    }

    delete user.password;

    return user;
  }

  /**
   * Sets a cookie for a JWT token
   * @param {Object} res - The response object from the controller
   * @param {string} token - The JWT token to set
   * @param {"access"|"refresh"} type - The type of token (access or refresh)
   */
  setCookie(res, token, type) {
    const cookieName = config.jwt[type].cookieName;
    const cookieOptions = tokenService.getCookieOptions(type);
    res.cookie(cookieName, token, cookieOptions);
  }

  /**
   * Clears a cookie for a JWT token
   * @param {Object} res - The response object from the controller
   * @param {"access"|"refresh"} type - The type of token (access or refresh)
   */
  clearCookie(res, type) {
    const cookieName = config.jwt[type].cookieName;
    res.clearCookie(cookieName);
  }

  /**
   * Retrieves a cookie for a JWT token
   * @param {Object} req - The request object from the controller
   * @param {"access"|"refresh"} type - The type of token (access or refresh)
   * @returns {string|null} The value of the cookie or null if it doesn't exist
   */
  getCookie(req, type) {
    const cookieName = config.jwt[type].cookieName;
    return req.cookies[cookieName];
  }

  /**
   * Registers a new user in the system.
   * @param {string} username - The username for the new user
   * @param {string} password - The plain text password that will be hashed
   * @param {string} email - The email address of the new user
   * @param {string} name - The full name of the new user
   * @returns {Promise<Object>} The created user object
   */
  async register(username, password, email, name) {
    const hashedPassword = await passwordService.hash(password);

    const user = await userRepository.create({
      username,
      password: hashedPassword,
      email,
      name,
    });

    return user;
  }

  /**
   * Refreshes the access and refresh tokens for a user
   * @param {string} refreshToken - The current refresh token to validate
   * @returns {{accessToken: string, refreshToken: string}|null} Object containing new tokens if successful, null if refresh token is invalid
   */
  refresh(refreshToken) {
    const decoded = tokenService.verifyToken(refreshToken, "refresh");
    if (!decoded) {
      return null;
    }

    const user = decoded.user;

    tokenCache.deleteToken(user, "refresh");
    tokenCache.deleteToken(user, "access");

    const newAccessToken = tokenService.generateToken(user, "access");
    const newRefreshToken = tokenService.generateToken(user, "refresh");

    tokenCache.addToken(user, newAccessToken, "access");
    tokenCache.addToken(user, newRefreshToken, "refresh");

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Initiates 2FA process for a user
   * @param {Object} user - The user object
   * @returns {Promise<void>}
   */
  async initiate2FA(user) {
    const code = twoFactorCodeCache.storeCode(user.id);
    await emailService.send2FACode(user.email, code);
  }

  /**
   * Verifies 2FA code for a user
   * @param {string} userId - The user ID
   * @param {string} code - The 2FA code to verify
   * @returns {boolean} Whether the code is valid
   */
  verify2FACode(userId, code) {
    const isValid = twoFactorCodeCache.validateCode(userId, code);
    if (isValid) {
      twoFactorCodeCache.deleteCode(userId);
    }
    return isValid;
  }
}

export const authService = new AuthService(userRepository);
