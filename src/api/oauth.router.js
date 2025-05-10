import express from "express";
import { oauthController } from "./controllers/oauth.controller.js";
import { requireNoAuth } from "./middlewares/auth.js";
import passport from "passport";
import "./services/passport.service.js";

const oauthRouter= express.Router();

oauthRouter.get("/google",passport.authenticate("google", {
            scope: ["email", "profile"],
        }))

oauthRouter.get("/google/callback", requireNoAuth, passport.authenticate("google", {
            access_type: "offline",
            scope: ["email, profile"],
            failureRedirect: "/login",
            session:false
        }), oauthController.googleLoginCallback)


export default oauthRouter;
