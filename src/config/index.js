import dotenv from "dotenv";

dotenv.config();

const env = (key) => process.env[key];

export const config = {
  jwt: {
    accessToken: {
      secret: env("JWT_ACCESS_SECRET"),
      expiresIn: "5m",
      cookieName: "access_token",
    },
    refreshToken: {
      secret: env("JWT_REFRESH_SECRET"),
      expiresIn: "1d",
      cookieName: "refresh_token",
    },
  },
  users: [
    {
      id: 1,
      username: "admin",
      password: "$2b$10$r.g1mBEjNEu3vnFdFCLJPu6BGE6WVh4t7gPgaaxaSkE.j3dHPeZmC",
    },
  ],
};
