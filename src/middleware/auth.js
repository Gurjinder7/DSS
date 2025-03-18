import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const token = req.cookies[config.jwt.cookieName];

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const verified = jwt.verify(token, config.jwt.secret);
    req.user = verified;
    next();
  } catch (err) {
    res.clearCookie(config.jwt.cookieName);
    return res.redirect("/login");
  }
};

export const checkAuthenticated = (req, res, next) => {
  const token = req.cookies[config.jwt.cookieName];

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, config.jwt.secret);
    return res.redirect("/");
  } catch (err) {
    res.clearCookie(config.jwt.cookieName);
    return next();
  }
};
