
import "../services/passport.service.js";
import { authService } from "../services/auth.service.js";
import { tokenCache } from "../services/token-cache.service.js";
import { tokenService } from "../services/token.service.js";

class OauthController {

    async googleLoginCallback(req, res) {
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
    }
}

export const oauthController = new OauthController()