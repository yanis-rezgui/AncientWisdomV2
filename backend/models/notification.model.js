import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "NEW_USER",
        "NEW_FIGURE",
        "NEW_EVENT",
        "NEW_ERA",
        "NEW_CHALLENGE",
        "NEW_TESTIMONIAL",
        "CONTENT_DELETED",
        "STATUS_CHANGED",
        "ACHIEVEMENT_UNLOCKED",
        "QUIZ_COMPLETED",
        "ACCOUNT_UPDATED",
        "SECURITY",
      ],
      required: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;