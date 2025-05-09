import express from "express";
import cookieParser from "cookie-parser";
import { rateLimiter } from "./api/middlewares/rateLimiter.js";
import views from "./views/router.js";
import api from "./api/router.js";
import cors from "cors";
import passport from "passport";
import "./api/services/passport.service.js";
import { authService } from "./api/services/auth.service.js";
import { tokenCache } from "./api/services/token-cache.service.js";
import { tokenService } from "./api/services/token.service.js";
import session from "express-session";
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
			secret: "googleUser", // session secret
			resave: false,
			saveUninitialized: false,
		}),
	);
	app.use(cookieParser());
	app.use(express.static("public"));
	app.use(rateLimiter);
	app.use(passport.initialize());
	app.use(passport.session());

	// Routes
	app.use(views);
	app.use("/api", api);

	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: ["email", "profile"],
		}),
	);

	app.get(
		"/auth/google/callback",
		passport.authenticate("google", {
			access_type: "offline",
			scope: ["email, profile"],
			failureRedirect: "/login",
		}),
		(req, res) => {
			if (!req.user) {
				res.status(400).json({ error: "Authentication failed" });
			}

			const user = req.user;

			const refreshToken = tokenService.generateToken(user, "refresh");
			const accessToken = tokenService.generateToken(user, "access");

			tokenCache.addToken(user.id, accessToken, "access");
			tokenCache.addToken(user.id, refreshToken, "refresh");

			authService.setCookie(res, accessToken, "access");
			authService.setCookie(res, refreshToken, "refresh");

			// res.status(200).json(req.user)

			const data = { id: req.user.id, username: req.user.username };
			const html = `
        <html>
            <body>
                <h1>You are being redirected</h1>
                <p id="id">${data.id}</p>
                <p id="username">${data.username}</p>
                <script src="/js/redirect.js"></script>
            </body>
        </html>
    `;
			res.header("Content-Type", "text/html");
			res.send(html);
		},
	);

	app.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
}

main();
