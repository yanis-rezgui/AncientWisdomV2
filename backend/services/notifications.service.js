import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

import { getIo } from "../socket/socket.js";


export const notifyAdmins = async ({
  title,
  message,
  type,
}) => {
  try {
    // Récupérer les administrateurs
    const admins = await User.find({ role: "ADMIN" })
      .select("_id")
      .lean();

    if (admins.length === 0) {
      return [];
    }

    // Créer une notification pour chaque administrateur
    const notifications = await Notification.insertMany(
      admins.map((admin) => ({
        title,
        message,
        type,
        recipient: admin._id,
      }))
    );

    // Émettre les notifications en temps réel
    const io = getIo();

    notifications.forEach((notification) => {
      io.to("admins").emit("notification:new", notification);
    });

    return notifications;
  } catch (error) {
    console.error("Error notifying admins:", error);
    throw error;
  }
};

export const notifyUser = async ({
  userId,
  title,
  message,
  type,
}) => {
  try {
    // Créer la notification pour l'utilisateur concerné
    const notification = await Notification.create({
      title,
      message,
      type,
      recipient: userId,
    });

    // Envoyer la notification à ses sockets connectés
    const io = getIo();

    io.to(`user:${userId.toString()}`).emit(
      "notification:new",
      notification
    );

    return notification;
  } catch (error) {
    console.error("Error notifying user:", error);
    throw error;
  }
};