// models/helpCategory.model.js

import mongoose from "mongoose";

const helpCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    icon: {
      type: String,
      default: "circle-help",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

helpCategorySchema.index({ isPublished: 1, order: 1 });



const HelpCategory = mongoose.model("HelpCategory", helpCategorySchema);

export default HelpCategory