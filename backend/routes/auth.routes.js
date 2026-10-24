
import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  getUser,
  signIn,
  signOut,
  signUp,
  updateMyInfo,
  updateMyPassword,
} from "../controllers/auth.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import { getMyProfileStats } from "../controllers/profile.stats.controller.js";
import { forgotPassword, resetPassword } from "../controllers/resetPassword.controller.js";

const authRouter = Router();

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many account creation attempts. Please try again later.",
  },
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again in 15 minutes.",
  },
});

authRouter.post("/sign-in", signInLimiter, signIn);
authRouter.post("/sign-up", signUpLimiter, signUp);

// La déconnexion n'a généralement pas besoin du même
// niveau de restriction que la connexion.
authRouter.post("/sign-out", signOut);

authRouter.get("/user", authorize, getUser);
authRouter.get("/me/stats", authorize, getMyProfileStats);

authRouter.put("/update/info", authorize, updateMyInfo);
authRouter.put("/update/password", authorize, updateMyPassword);

authRouter.post("/forgot-password", passwordLimiter, forgotPassword);
authRouter.post("/reset-password", passwordLimiter, resetPassword);



export default authRouter;
