import express from "express";
import { authController } from "./controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticateToken, authController.logout);
router.post("/register", authController.register);

export default router;
