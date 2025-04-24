import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkAuthenticated, authenticateToken } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const view = (name) => {
  return (req, res) => {
    const viewPath = path.join(__dirname, `${name}.html`);
    res.sendFile(viewPath);
  };
};

const router = express.Router();

router.get("/", authenticateToken, view("index"));
router.get("/login", checkAuthenticated, view("login"));
router.get("/register", checkAuthenticated, view("register"));
router.get("/posts", view("posts"));
router.get("/my-posts", view("my-posts"));

export default router;
