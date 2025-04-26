import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireAuth, requireNoAuth } from "./middlewares/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const view = (name) => {
  return (req, res) => {
    const viewPath = path.join(__dirname, "pages", `${name}.html`);
    res.sendFile(viewPath);
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
