import dotenv from "dotenv";

dotenv.config();

const env = (key) => process.env[key];

export const config = {
  jwt: {
    secret: env("JWT_SECRET"),
    cookieName: env("JWT_COOKIE_NAME"),
    expiresIn: env("JWT_EXPIRES_IN"),
  },
  users: [
    {
      id: 1,
      username: "admin",
      password: "$2b$10$r.g1mBEjNEu3vnFdFCLJPu6BGE6WVh4t7gPgaaxaSkE.j3dHPeZmC",
    },
  ],
};
