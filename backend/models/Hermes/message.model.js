
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 4000
        },
        sources: [
            {
                type: {
                    type: String,
                    enum: ["figure", "era", "event", "article"],
                    required: true
                },
                refId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                _id: false
            }
        ],
        tokens: {
            type: Number,
            min: 0
        },
        error: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Récupérer les messages d'une conversation dans l'ordre chronologique inverse
messageSchema.index({ conversation: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
