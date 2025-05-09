import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userRepository } from "../repositories/user.repository.js";

import dotenv from "dotenv";

dotenv.config();

const env = (key) => process.env[key];

passport.use(
  new GoogleStrategy(
    {
      clientID: env("GOOGLE_CLIENT_ID"),
      clientSecret: env("GOOGLE_CLIENT_SECRET"),
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },

    async (request, accessToken, refreshToken, profile, done) => {
      // console.log(profile)
      // console.log(request)
      // console.log(response)

      const username = `${profile._json.given_name}7`;

      const exist = await userRepository.findByUsername(username);
      if (!exist) {
        await userRepository.create({
          username,
          password: "googleUser",
          email: profile._json.email,
          name: profile._json.name,
        });
      }

      const user = await userRepository.findByUsername(username);
      if (!user) {
        return null;
      }

      return done(null, user);
    }
  )
);

// function to serialize a user/profile object into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// function to deserialize a user/profile object into the session
passport.deserializeUser((user, done) => {
  done(null, user);
});
