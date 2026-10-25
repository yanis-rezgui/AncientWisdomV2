
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            default: "New conversation",
            trim: true,
            maxlength: 100
        },
        lastMessageAt: {
            type: Date,
            default: Date.now
        },
        messagesCount: {
            type: Number,
            default: 0,
            min: 0
        },
        summary: {
            type: String,
            default: "",
            trim: true
        },
        isArchived: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Récupérer les conversations d'un utilisateur, les plus récentes d'abord
conversationSchema.index({ user: 1, lastMessageAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
