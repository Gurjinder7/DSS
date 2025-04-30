import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireAuth, requireNoAuth } from "./middlewares/auth.js";
import { config } from "../config/index.js";
import crypto from "node:crypto";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const view = (name) => {
  return (req, res) => {
    const viewPath = path.join(__dirname, "pages", `${name}.html`);

    const csrfToken = generateCSRFToken();

    res.cookie("XSRF-TOKEN", csrfToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
    });

    const html = fs.readFileSync(viewPath, "utf8");
    const updatedHtml = html.replace("{{CSRF_TOKEN}}", csrfToken);

    res.send(updatedHtml);
  };
};

const router = express.Router();

// Public pages
router.get("/login", requireNoAuth, view("login"));
router.get("/register", requireNoAuth, view("register"));

// Private pages
router.get("/", requireAuth, view("index"));
router.get("/posts", requireAuth, view("posts"));
router.get("/my-posts", requireAuth, view("my-posts"));

export default router;
