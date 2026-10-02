import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    itemType: {
        type: String,
        enum: ["Quote", "Figure", "Event"],
        required: true
    },

    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "itemType"
    }

}, {
    timestamps: true
});

savedItemSchema.index(
    { user: 1, itemType: 1, item: 1 },
    { unique: true }
);

const SavedItem = mongoose.model("SavedItem", savedItemSchema);

export default SavedItem;