import { tokenService } from "../../api/services/token.service.js";
import { config } from "../../config/index.js";
import dotenv from "dotenv";
import { authService } from "../services/auth.service.js";

dotenv.config();

export const requireAuth = async (req, res, next) => {
  const accessToken = req.cookies[config.jwt.access.cookieName];
  const refreshToken = req.cookies[config.jwt.refresh.cookieName];

  // If no access token and no refresh token exist, return unauthorized
  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // If access token exists, verify it
  if (accessToken) {
    const decoded = tokenService.verifyToken(accessToken, "access");
    if (decoded) {
      const user = decoded.user;
      req.user = user;
      return next();
    }
  }

  // If access token is invalid or doesn't exist, try to refresh tokens
  if (refreshToken) {
    const decoded = tokenService.verifyToken(refreshToken, "refresh");
    if (decoded) {
      const user = decoded.user;
      req.user = user;

      const tokens = authService.refresh(refreshToken);
      if (tokens) {
        authService.setCookie(res, tokens.accessToken, "access");
        authService.setCookie(res, tokens.refreshToken, "refresh");
        return next();
      }
    }
  }

  res.clearCookie(config.jwt.access.cookieName);
  res.clearCookie(config.jwt.refresh.cookieName);
  return res.status(401).json({ message: "Unauthorized" });
};

export const requireNoAuth = (req, res, next) => {
  const accessToken = req.cookies[config.jwt.access.cookieName];

  if (accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
