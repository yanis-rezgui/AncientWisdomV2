// models/helpArticle.model.js

import mongoose from "mongoose";

const helpArticleSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const helpArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpCategory",
      required: true,
      index: true,
    },

    sections: {
      type: [helpArticleSectionSchema],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    articleType: {
      type: String,
      enum: ["guide", "faq", "troubleshooting"],
      default: "guide",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

helpArticleSchema.index({
  isPublished: 1,
  category: 1,
  order: 1,
});

helpArticleSchema.index({
  title: "text",
  excerpt: "text",
  tags: "text",
});



const HelpArticle = mongoose.model("HelpArticle", helpArticleSchema)

export default HelpArticle;
