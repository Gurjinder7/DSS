import { authService } from "../services/auth.service.js";
import { tokenCache } from "../services/token-cache.service.js";
import { commonPasswords } from "../../utils/common-passwords.js";
import { tokenService } from "../services/token.service.js";
import { sleep } from "../../utils/sleep.js";

/**
 * Controller handling authentication-related operations
 * @class AuthController
 */
class AuthController {
  /**
   * Handles user login
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @param {Object} req.body - Request body
   * @param {string} req.body.username - User's username
   * @param {string} req.body.password - User's password
   * @returns {Promise<import('express').Response>} Response object with login status
   */
  async login(req, res) {
    const startTime = Date.now();
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await authService.login(username, password);

      if (!user) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 3000 - elapsedTime;

        if (remainingTime > 0) {
          await sleep(remainingTime);
        }

        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const refreshToken = tokenService.generateToken(user, "refresh");
      const accessToken = tokenService.generateToken(user, "access");

      authService.setCookie(res, accessToken, "access");
      authService.setCookie(res, refreshToken, "refresh");

      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime;

      if (remainingTime > 0) {
        await sleep(remainingTime);
      }

      return res.status(200).json(user);
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Refreshes user's authentication tokens
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {Promise<import('express').Response>} Response object with refresh status
   */
  async refresh(req, res) {
    try {
      const refreshToken = authService.getCookie(req, "refresh");

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      const tokens = authService.refresh(refreshToken);
      if (!tokens) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      authService.setCookie(res, tokens.accessToken, "access");
      authService.setCookie(res, tokens.refreshToken, "refresh");

      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.error("Refresh error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Handles user logout by clearing tokens and cookies
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {import('express').Response} Response object with logout status
   */
  logout(req, res) {
    const accessToken = authService.getCookie(req, "access");
    authService.clearCookie(res, "access");
    authService.clearCookie(res, "refresh");

    if (!accessToken) {
      return res.status(200).json({ message: "success" });
    }

    const decoded = tokenService.verifyToken(accessToken, "access", true);
    if (!decoded) {
      return res.status(200).json({ message: "success" });
    }

    const userId = decoded.user.id;

    tokenCache.deleteToken(userId, "access");
    tokenCache.deleteToken(userId, "refresh");

    return res.redirect("/login");
  }

  /**
   * Handles new user registration
   * @async
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @param {Object} req.body - Request body
   * @param {string} req.body.username - User's username
   * @param {string} req.body.password - User's password
   * @param {string} req.body.email - User's email
   * @param {string} req.body.name - User's name
   * @returns {Promise<import('express').Response>} Response object with registration status
   * @throws {Error} When username or email already exists
   */
  async register(req, res) {
    try {
      const { username, password, email, name } = req.body;

      // Password validation rules
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
      }

      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter",
        });
      }

      if (!/[a-z]/.test(password)) {
        return res.status(400).json({
          message: "Password must contain at least one lowercase letter",
        });
      }

      if (!/[0-9]/.test(password)) {
        return res
          .status(400)
          .json({ message: "Password must contain at least one number" });
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return res.status(400).json({
          message: "Password must contain at least one special character",
        });
      }

      const isCommon = commonPasswords.filter((cPass) => cPass === password);

      if (isCommon.length) {
        return res.status(400).json({ message: "Cannot use common password" });
      }

      await authService.register(username, password, email, name);

      return res.status(201).json({ message: "success" });
    } catch (e) {
      if (
        e.message === "Username already exists" ||
        e.message === "Email already exists"
      ) {
        return res.status(400).json({ message: e.message });
      }

      console.log(e);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export const authController = new AuthController();
