import express from "express";


import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";
import { createHelpCategory, deleteHelpCategory, getAdminHelpCategories, getHelpCategoryBySlug, getPublicHelpCategories, updateHelpCategory } from "../../controllers/Help/helpCategory.controller.js";



const helpCategory = express.Router();

// Admin routes first
helpCategory.get("/admin", authorize, isAdmin, getAdminHelpCategories);

helpCategory.post("/", authorize, isAdmin, createHelpCategory);

helpCategory.patch("/:id", authorize, isAdmin, updateHelpCategory);

helpCategory.delete("/:id", authorize, isAdmin, deleteHelpCategory);

// Public routes
helpCategory.get("/", getPublicHelpCategories);
helpCategory.get("/:slug", getHelpCategoryBySlug);

export default helpCategory;