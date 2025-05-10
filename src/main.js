import express from "express";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./api/middlewares/rateLimiter.js";
import views from "./views/router.js";
import api from "./api/router.js";
import oauthApi from './api/oauth.router.js'
import cors from "cors";
import passport from "passport";


// Store request counts per IP
const requestCounts = {};

async function main() {
	const app = express();

	app.use(cors());

	// Middleware
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use(cookieParser());
	app.use(express.static("public"));
	app.use(rateLimiter);
	app.use(passport.initialize());

	// Routes
	app.use(views);
	app.use("/api", api);
  	app.use("/auth", oauthApi)

	app.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
}

main();
