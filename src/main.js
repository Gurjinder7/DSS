import express from "express";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./api/middlewares/rateLimiter.js";
import views from "./views/router.js";
import api from "./api/router.js";
import cors from "cors";
import passport from "passport";
import "./api/services/passport.service.js"
import { authService } from "./api/services/auth.service.js";
import { tokenCache } from './api/services/token-cache.service.js'
import { tokenService } from "./api/services/token.service.js"
import session from "express-session"
// Store request counts per IP
const requestCounts = {};

async function main() {
  const app = express();

  app.use(cors());

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      secret: 'googleUser', // session secret
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(cookieParser());
  app.use(express.static("public"));
  app.use(rateLimiter);
  app.use(passport.initialize());
  app.use(passport.session())

  // Routes
  app.use(views);
  app.use("/api", api);

  app.get('/auth/google',
    passport.authenticate
    ("google", {
      scope: ["email","profile"]
    })
  )

  app.get("/auth/google/callback",
    passport.authenticate("google", { 
        access_type: "offline",
        scope: ["email, profile"],
        failureRedirect:'/login',
      
    }),
    (req, res) => {
      console.log('YOOOO')
      // console.log('REQ', req)
      if(!req.user) {
        res.status(400).json({error: "Authentication failed"})
      }

      let user = req.user
      // console.log(accessToken)

         const refreshToken = tokenService.generateToken(user, "refresh");
          const accessToken = tokenService.generateToken(user, "access");
      
      tokenCache.addToken(user.id, accessToken, "access");
      tokenCache.addToken(user.id, refreshToken, "refresh");

      authService.setCookie(res, accessToken, "access");
      authService.setCookie(res, refreshToken, "refresh");

      res.status(200).json(req.user)
    }
  )

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main();
