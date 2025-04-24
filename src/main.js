import express from "express";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./middleware/rateLimiter.js";
import views from "./views/router.js";
import api from "./api/router.js";

// Store request counts per IP
const requestCounts = {};

async function main() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static("public"));
  app.use(rateLimiter);

  // Routes
  app.use(views);
  app.use("/api", api);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
