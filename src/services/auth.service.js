import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { tokenCache } from "./token-cache.service.js";

export class AuthService {
  static async validateUser(username, password) {
    const user = config.users.find((u) => u.username === username);
    if (!user) {
      return null;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
    };
  }

  static generateTokens(user) {
    // Remove any existing tokens for this user
    tokenCache.removeUserTokens(user.id);

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, type: "access" },
      config.jwt.accessToken.secret,
      { expiresIn: config.jwt.accessToken.expiresIn }
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: "refresh" },
      config.jwt.refreshToken.secret,
      { expiresIn: config.jwt.refreshToken.expiresIn }
    );

    // Store new tokens in cache
    tokenCache.addTokens(user.id, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token) {
    try {
      // First check if token exists in cache
      if (!tokenCache.isTokenValid(token, false)) {
        return null;
      }

      const decoded = jwt.verify(token, config.jwt.accessToken.secret);
      // Verify that this is an access token
      if (decoded.type !== "access") {
        return null;
      }
      return decoded;
    } catch (err) {
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      // First check if token exists in cache
      if (!tokenCache.isTokenValid(token, true)) {
        return null;
      }

      const decoded = jwt.verify(token, config.jwt.refreshToken.secret);
      // Verify that this is a refresh token
      if (decoded.type !== "refresh") {
        return null;
      }
      return decoded;
    } catch (err) {
      return null;
    }
  }

  static generateAccessTokenFromRefreshToken(refreshToken) {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) return null;

    const user = config.users.find((u) => u.id === payload.id);
    if (!user) return null;

    // Generate both new access and refresh tokens
    return this.generateTokens(user);
  }

  static getCookieOptions(isRefreshToken = false) {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: isRefreshToken ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 24 hours or 1 hour
    };
  }

  static invalidateUserTokens(userId) {
    return tokenCache.removeUserTokens(userId);
  }
}
