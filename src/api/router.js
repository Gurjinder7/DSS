import express from "express";
import { authController } from "./controllers/auth.controller.js";
import { postController } from "./controllers/post.controller.js";
import { requireAuth, requireNoAuth } from "./middlewares/auth.js";

const router = express.Router();

// Auth routes
router.post("/login", authController.login);
router.post("/verify-2fa", authController.verify2FA);
router.post("/refresh", authController.refresh);
router.post("/logout", requireAuth, authController.logout);
router.post("/register", requireNoAuth, authController.register);

// Post routes
router.post("/posts", requireAuth, postController.createPost);
router.get("/posts", postController.getAllPosts);
router.get("/posts/:id", postController.getPostById);
router.get("/users/:userId/posts", postController.getPostsByUser);
router.put("/posts/:id", requireAuth, postController.updatePost);
router.delete("/posts/:id", requireAuth, postController.deletePost);

export default router;
