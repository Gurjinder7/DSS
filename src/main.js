import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { authenticateToken, checkAuthenticated } from "./middleware/auth.js";
import { AuthController } from "./controllers/auth.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static("public"));

  // Public routes
  app.get("/login", checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
  });

  app.get("/register", checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
  });

  // Auth endpoints
  app.post("/api/login", AuthController.login);
  app.post("/api/refresh", AuthController.refresh);
  app.post("/api/logout", authenticateToken, AuthController.logout);

  // Protected routes
  app.get("/", authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
