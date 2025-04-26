import dotenv from "dotenv";

dotenv.config();

const env = (key) => process.env[key];

export const config = {
  env: env("NODE_ENV"),
  password: {
    pepper: env("PASSWORD_PEPPER"),
  },
  jwt: {
    access: {
      secret: env("JWT_ACCESS_SECRET"),
      expiresIn: 300 * 1000, // 5 minutes in milliseconds
      cookieName: "access_token",
    },
    refresh: {
      secret: env("JWT_REFRESH_SECRET"),
      expiresIn: 86400 * 1000, // 24 hours in milliseconds
      cookieName: "refresh_token",
    },
  },
  db: {
    user: env("DB_USER"),
    host: env("DB_HOST"),
    database: env("DB_DATABASE"),
    password: env("DB_PASSWORD"),
    port: env("DB_PORT"),
  },
};
