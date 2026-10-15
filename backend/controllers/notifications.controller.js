import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res, next) => {
  try {
    const { read, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    // Adapter userId au champ réellement défini dans ton JWT
    // et dans ton middleware d'authentification.
    const userId = req.user._id;

    const filter = {
      recipient: userId,
    };

    if (read === "true" || read === "false") {
      filter.read = read === "true";
    }

    const skip = (currentPage - 1) * pageLimit;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(pageLimit)
        .lean(),

      Notification.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Notifications récupérées avec succès",
      data: notifications,
      pagination: {
        page: currentPage,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Identifiant de notification invalide",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipient: req.user._id,
      },
      {
        $set: { read: true },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marquée comme lue",
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Toutes les notifications ont été marquées comme lues",
      data: {
        updatedCount: result.modifiedCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getNotificationsStats = async (req, res, next) => {
  try {
    const recipient = req.user._id;

    const [total, unread, read] = await Promise.all([
      Notification.countDocuments({ recipient }),
      Notification.countDocuments({ recipient, read: false }),
      Notification.countDocuments({ recipient, read: true }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Statistiques des notifications récupérées avec succès",
      data: {
        total,
        unread,
        read,
      },
    });
  } catch (err) {
    next(err);
  }
};