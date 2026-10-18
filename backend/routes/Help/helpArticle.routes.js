import express from "express";

import {
  getPublicHelpArticles,
  getAdminHelpArticles,
  getPublicHelpArticleBySlug,
  getAdminHelpArticleById,
  createHelpArticle,
  updateHelpArticle,
  publishHelpArticle,
  unpublishHelpArticle,
  deleteHelpArticle,
} from "../../controllers/Help/helpArticle.controller.js";


import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";

const helpArticleRouter = express.Router();

// Admin routes first
helpArticleRouter.get("/admin", authorize, isAdmin, getAdminHelpArticles);
helpArticleRouter.get("/admin/:id", authorize, isAdmin, getAdminHelpArticleById);

// Public routes afterwards
helpArticleRouter.get("/", getPublicHelpArticles);
helpArticleRouter.get("/:slug", getPublicHelpArticleBySlug);

helpArticleRouter.post("/", authorize, isAdmin, createHelpArticle);
helpArticleRouter.patch("/:id", authorize, isAdmin, updateHelpArticle);

helpArticleRouter.patch(
  "/:id/publish",
  authorize,
  isAdmin,
  publishHelpArticle
);

helpArticleRouter.patch(
  "/:id/unpublish",
  authorize,
  isAdmin,
  unpublishHelpArticle
);

helpArticleRouter.delete("/:id", authorize, isAdmin, deleteHelpArticle);

export default helpArticleRouter ;