import { AuthService } from "../services/auth.service.js";
import { config } from "../config/index.js";

export class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await AuthService.validateUser(username, password);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = AuthService.generateToken(user);

      res.cookie(config.jwt.cookieName, token, AuthService.setCookieOptions());

      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static logout(req, res) {
    res.clearCookie(config.jwt.cookieName);
    return res.status(200).json({ message: "Logout successful" });
  }
}
