
import mongoose from "mongoose";

const tipItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must contain at least 3 characters"],
            maxlength: [150, "Title cannot exceed 150 characters"],
        },

        why: {
            type: String,
            required: [true, "Why is required"],
            trim: true,
            minlength: [1, "Why is required"],
            maxlength: [2000, "Why cannot exceed 2000 characters"],
        },

        how: {
            type: String,
            required: [true, "How is required"],
            trim: true,
            minlength: [1, "How is required"],
            maxlength: [3000, "How cannot exceed 3000 characters"],
        },
    },
    { _id: true }
);

const tipsSchema = new mongoose.Schema(
    {
        introduction: {
            type: String,
            required: [true, "Introduction is required"],
            trim: true,
            minlength: [1, "Introduction is required"],
            maxlength: [3000, "Introduction cannot exceed 3000 characters"],
        },

        tips: {
            type: [tipItemSchema],
            required: true,
            validate: {
                validator: (tips) => tips.length > 0,
                message: "At least one tip is required",
            },
        },

        conclusion: {
            type: String,
            required: [true, "Conclusion is required"],
            trim: true,
            minlength: [1, "Conclusion is required"],
            maxlength: [3000, "Conclusion cannot exceed 3000 characters"],
        },
    },
    { timestamps: true }
);

const Tips = mongoose.model("Tips", tipsSchema);

export default Tips;