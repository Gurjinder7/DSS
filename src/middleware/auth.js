import { AuthService } from "../services/auth.service.js";
import { config } from "../config/index.js";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies[config.jwt.accessToken.cookieName];

  // If no access token exists, redirect to login
  if (!accessToken) {
    return res.redirect("/login");
  }

  // Verify access token
  const user = AuthService.verifyAccessToken(accessToken);
  if (user) {
    req.user = user;
    return next();
  }

  // If access token is invalid, redirect to login
  res.clearCookie(config.jwt.accessToken.cookieName);
  res.clearCookie(config.jwt.refreshToken.cookieName);
  return res.redirect("/login");
};

export const checkAuthenticated = (req, res, next) => {
  const accessToken = req.cookies[config.jwt.accessToken.cookieName];
  const refreshToken = req.cookies[config.jwt.refreshToken.cookieName];

  // If no tokens exist, allow access to login page
  if (!accessToken && !refreshToken) {
    return next();
  }

  // Check if either token is valid
  const accessTokenValid = AuthService.verifyAccessToken(accessToken);
  const refreshTokenValid =
    refreshToken && AuthService.verifyRefreshToken(refreshToken);

  if (accessTokenValid || refreshTokenValid) {
    return res.redirect("/");
  }

  // If both tokens are invalid, clear them
  res.clearCookie(config.jwt.accessToken.cookieName);
  res.clearCookie(config.jwt.refreshToken.cookieName);
  return next();
};
