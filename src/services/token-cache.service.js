import NodeCache from "node-cache";

class TokenCacheService {
  constructor() {
    this.cache = new NodeCache();

    // Separate caches for access and refresh tokens
    this.accessTokens = new Set();
    this.refreshTokens = new Set();
  }

  // Add tokens to cache
  addTokens(userId, accessToken, refreshToken) {
    // Store tokens with user association and their respective TTLs
    this.cache.set(`access_${userId}`, accessToken, 60 * 5); // 15 minutes in seconds
    this.cache.set(`refresh_${userId}`, refreshToken, 24 * 60 * 60); // 24 hours in seconds

    // Add to our sets
    this.accessTokens.add(accessToken);
    this.refreshTokens.add(refreshToken);

    // Set up expiry handlers
    this.cache.on("expired", (key, value) => {
      if (key.startsWith("access_")) {
        this.accessTokens.delete(value);
      } else if (key.startsWith("refresh_")) {
        this.refreshTokens.delete(value);
      }
    });

    return true;
  }

  // Validate if a token exists and is valid
  isTokenValid(token, isRefreshToken = false) {
    // Check if token exists in our sets
    if (isRefreshToken) {
      return this.refreshTokens.has(token);
    }
    return this.accessTokens.has(token);
  }

  // Remove tokens for a user (logout or token refresh)
  removeUserTokens(userId) {
    const accessToken = this.cache.get(`access_${userId}`);
    const refreshToken = this.cache.get(`refresh_${userId}`);

    // Remove from sets
    if (accessToken) this.accessTokens.delete(accessToken);
    if (refreshToken) this.refreshTokens.delete(refreshToken);

    // Remove from cache
    this.cache.del(`access_${userId}`);
    this.cache.del(`refresh_${userId}`);

    return true;
  }

  // Get user ID from token
  getUserIdFromToken(token, isRefreshToken = false) {
    const prefix = isRefreshToken ? "refresh_" : "access_";
    const keys = this.cache.keys();

    for (const key of keys) {
      if (key.startsWith(prefix) && this.cache.get(key) === token) {
        return key.replace(prefix, "");
      }
    }
    return null;
  }

  // Clear all tokens (useful for testing or system reset)
  clearAllTokens() {
    this.cache.flushAll();
    this.accessTokens.clear();
    this.refreshTokens.clear();
  }
}

export const tokenCache = new TokenCacheService();
