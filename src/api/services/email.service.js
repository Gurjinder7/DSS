import nodemailer from "nodemailer";
import { config } from "../../config/index.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
      },
    });
  }

  /**
   * Sends a 2FA verification code via email
   * @param {string} to - Recipient email address
   * @param {string} code - The 2FA verification code
   * @returns {Promise<void>}
   */
  async send2FACode(to, code) {
    const mailOptions = {
      from: config.smtp.user,
      to,
      subject: "Auto Geek 2FA Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Here is your 2FA verification code:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #333; background: #f5f5f5; padding: 10px; text-align: center;">${code}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
