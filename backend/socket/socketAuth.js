import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = decoded.userId;

    if (!userId) {
      return next(new Error("Unauthorized"));
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);

    next(new Error("Unauthorized"));
  }
};

export default socketAuth;