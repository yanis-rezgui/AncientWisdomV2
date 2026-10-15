import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";

import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  getNotificationsStats,
} from "../controllers/notifications.controller.js";

const notificationRouter = Router();

// Toutes les routes nécessitent une authentification.
notificationRouter.use(authorize);

notificationRouter.get("/", getAllNotifications);
notificationRouter.get("/stats", getNotificationsStats);
notificationRouter.patch("/read-all", markAllAsRead);
notificationRouter.patch("/:id/read", markAsRead);

export default notificationRouter;