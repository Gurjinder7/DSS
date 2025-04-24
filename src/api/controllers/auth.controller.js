import { authService } from "../services/auth.service.js";
import { config } from "../../config/index.js";
import { tokenCache } from "../../services/token-cache.service.js";
import { commonPasswords } from "../../utils/common-passwords.js";

class AuthController {
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

      // This will automatically invalidate any existing tokens
      const { accessToken, refreshToken } = authService.generateTokens(user);

      // Set cookies
      res.cookie(
        config.jwt.accessToken.cookieName,
        accessToken,
        authService.getCookieOptions(false)
      );
      res.cookie(
        config.jwt.refreshToken.cookieName,
        refreshToken,
        authService.getCookieOptions(true)
      );

      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime;

      if (remainingTime > 0) {
        await sleep(remainingTime);
      }

      return res.status(200).json({ message: "Login successful" });
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

  async refresh(req, res) {
    try {
      const refreshToken = req.cookies[config.jwt.refreshToken.cookieName];

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      // Get user ID from refresh token to invalidate old tokens
      const userId = tokenCache.getUserIdFromToken(refreshToken, true);
      if (!userId) {
        res.clearCookie(config.jwt.accessToken.cookieName);
        res.clearCookie(config.jwt.refreshToken.cookieName);
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const tokens =
        authService.generateAccessTokenFromRefreshToken(refreshToken);

      if (!tokens) {
        // Clear cookies and invalidate all tokens for this user
        res.clearCookie(config.jwt.accessToken.cookieName);
        res.clearCookie(config.jwt.refreshToken.cookieName);
        authService.invalidateUserTokens(userId);
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Set both new tokens
      res.cookie(
        config.jwt.accessToken.cookieName,
        tokens.accessToken,
        authService.getCookieOptions(false)
      );
      res.cookie(
        config.jwt.refreshToken.cookieName,
        tokens.refreshToken,
        authService.getCookieOptions(true)
      );

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      console.error("Refresh error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  logout(req, res) {
    const accessToken = req.cookies[config.jwt.accessToken.cookieName];
    if (accessToken) {
      const userId = tokenCache.getUserIdFromToken(accessToken, false);
      if (userId) {
        authService.invalidateUserTokens(userId);
      }
    }

    res.clearCookie(config.jwt.accessToken.cookieName);
    res.clearCookie(config.jwt.refreshToken.cookieName);
    return res.status(200).json({ message: "Logout successful" });
  }

  async register(req, res) {
    try {
      const { username, password, email, name } = req.body;

      // Password validation rules
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
      }

      if (!/[a-z]/.test(password)) {
        return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
      }

      if (!/[0-9]/.test(password)) {
        return res.status(400).json({ message: "Password must contain at least one number" });
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return res.status(400).json({ message: "Password must contain at least one special character" });
      }

      const isCommon = commonPasswords.filter((cPass) => cPass === password);

      if (isCommon.length) {
        return res.status(400).json({ message: "Cannot use common password" });
      }

      const user = await authService.register(username, password, email, name);

      return res.status(200).json({ user });
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
