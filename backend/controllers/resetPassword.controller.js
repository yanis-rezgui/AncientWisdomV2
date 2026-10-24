
import crypto from "crypto";
import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import sendEmail from "../services/sendEmail.js";
import { CLIENT_URL } from "../config/env.js";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const genericMessage =
  "If an account with that email exists, a password reset link has been sent.";

// ============================================================
// FORGOT PASSWORD
// POST /api/v1/auth/forgot-password
// ============================================================

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (
      typeof email !== "string" ||
      email.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Prevent email enumeration.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    // Generate a cryptographically secure token.
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the SHA-256 hash in the database.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes.
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = resetExpires;

    await user.save();

    // CLIENT_URL must point to the frontend application.
    const resetUrl =
      `${CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password | Ancient Wisdom",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #292722;">
            <h2 style="color: #292722;">Reset Your Password</h2>

            <p>Hello ${escapeHtml(user.firstName)},</p>

            <p>
              We received a request to reset the password
              associated with your Ancient Wisdom account.
            </p>

            <p>
              Click the button below to choose a new password.
              This link will expire in 15 minutes.
            </p>

            <p style="margin: 32px 0;">
              <a
                href="${resetUrl}"
                style="background-color: #292722; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; display: inline-block;"
              >
                Reset My Password
              </a>
            </p>

            <p>
              If the button does not work, copy and paste
              this URL into your browser:
            </p>

            <p style="word-break: break-all;">
              ${resetUrl}
            </p>

            <p>
              If you did not request a password reset,
              you can safely ignore this email.
              Your password will remain unchanged.
            </p>

            <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 28px 0;" />

            <p style="font-size: 12px; color: #777777;">
              Ancient Wisdom — Discover the stories that shaped history.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // Remove the token if the email could not be sent.
      await User.updateOne(
        { _id: user._id },
        {
          $unset: {
            passwordResetToken: 1,
            passwordResetExpires: 1,
          },
        }
      );

      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// RESET PASSWORD
// POST /api/v1/auth/reset-password
// ============================================================

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password1, password2 } = req.body;

    if (
      typeof token !== "string" ||
      !token ||
      typeof password1 !== "string" ||
      typeof password2 !== "string" ||
      !password1 ||
      !password2
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password1 !== password2) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (!passwordRegex.test(password1)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      });
    }

    // Hash the token received from the frontend.
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find a user with a matching, non-expired token.
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    // Hash the new password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password1, salt);

    // Atomically update the password and invalidate the token.
    const result = await User.updateOne(
      {
        _id: user._id,
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          passwordResetToken: 1,
          passwordResetExpires: 1,
        },
      }
    );

    if (result.modifiedCount !== 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Escape user-provided content before inserting it into HTML.
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
