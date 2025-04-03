import { AuthService } from "../services/auth.service.js";
import { config } from "../config/index.js";
import { tokenCache } from "../services/token-cache.service.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await AuthService.validateUser(username, password);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // This will automatically invalidate any existing tokens
      const { accessToken, refreshToken } = AuthService.generateTokens(user);

      // Set cookies
      res.cookie(
        config.jwt.accessToken.cookieName,
        accessToken,
        AuthService.getCookieOptions(false)
      );
      res.cookie(
        config.jwt.refreshToken.cookieName,
        refreshToken,
        AuthService.getCookieOptions(true)
      );

      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async refresh(req, res) {
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
        AuthService.generateAccessTokenFromRefreshToken(refreshToken);

      if (!tokens) {
        // Clear cookies and invalidate all tokens for this user
        res.clearCookie(config.jwt.accessToken.cookieName);
        res.clearCookie(config.jwt.refreshToken.cookieName);
        AuthService.invalidateUserTokens(userId);
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Set both new tokens
      res.cookie(
        config.jwt.accessToken.cookieName,
        tokens.accessToken,
        AuthService.getCookieOptions(false)
      );
      res.cookie(
        config.jwt.refreshToken.cookieName,
        tokens.refreshToken,
        AuthService.getCookieOptions(true)
      );

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      console.error("Refresh error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static logout(req, res) {
    const accessToken = req.cookies[config.jwt.accessToken.cookieName];
    if (accessToken) {
      const userId = tokenCache.getUserIdFromToken(accessToken, false);
      if (userId) {
        AuthService.invalidateUserTokens(userId);
      }
    }

    res.clearCookie(config.jwt.accessToken.cookieName);
    res.clearCookie(config.jwt.refreshToken.cookieName);
    return res.status(200).json({ message: "Logout successful" });
  }
}
