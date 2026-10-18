import mongoose from "mongoose";
import HelpArticle from "../../models/Help/helpArticle.model.js";
import HelpCategory from "../../models/Help/helpCategory.model.js";

// GET /api/v1/help/categories
// Public: return published categories
export const getPublicHelpCategories = async (req, res) => {
  try {
    const categories = await HelpCategory.find({ isPublished: true })
      .sort({ order: 1, name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("getPublicHelpCategories:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve help categories.",
    });
  }
};

// GET /api/v1/help/categories/admin
// Admin: return all categories, including unpublished ones
export const getAdminHelpCategories = async (req, res) => {
  try {
    const categories = await HelpCategory.find()
      .sort({ order: 1, name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("getAdminHelpCategories:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve help categories.",
    });
  }
};

// GET /api/v1/help/categories/:slug
export const getHelpCategoryBySlug = async (req, res) => {
  try {
    const category = await HelpCategory.findOne({
      slug: req.params.slug.toLowerCase(),
      isPublished: true,
    }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Help category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("getHelpCategoryBySlug:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the help category.",
    });
  }
};

// POST /api/v1/help/categories
export const createHelpCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, order, isPublished } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and description are required.",
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingCategory = await HelpCategory.findOne({
      slug: normalizedSlug,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists.",
      });
    }

    const category = await HelpCategory.create({
      name: name.trim(),
      slug: normalizedSlug,
      description: description.trim(),
      ...(typeof icon === "string" && { icon: icon.trim() }),
      ...(order !== undefined && { order }),
      ...(typeof isPublished === "boolean" && { isPublished }),
    });

    return res.status(201).json({
      success: true,
      message: "Help category created successfully.",
      data: category,
    });
  } catch (error) {
    console.error("createHelpCategory:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create the help category.",
    });
  }
};

// PATCH /api/v1/help/categories/:id
export const updateHelpCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const allowedFields = [
      "name",
      "slug",
      "description",
      "icon",
      "order",
      "isPublished",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    for (const field of ["name", "slug", "description", "icon"]) {
      if (field in updates) {
        if (
          typeof updates[field] !== "string" ||
          !updates[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string.`,
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    if ("slug" in updates) {
      updates.slug = updates.slug.toLowerCase();
    }

    if ("order" in updates) {
      if (!Number.isFinite(updates.order)) {
        return res.status(400).json({
          success: false,
          message: "Order must be a valid number.",
        });
      }
    }

    if (
      "isPublished" in updates &&
      typeof updates.isPublished !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "isPublished must be a boolean.",
      });
    }

    const category = await HelpCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Help category not found.",
      });
    }

    Object.assign(category, updates);
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Help category updated successfully.",
      data: category,
    });
  } catch (error) {
    console.error("updateHelpCategory:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this slug already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update the help category.",
    });
  }
};

// DELETE /api/v1/help/categories/:id
export const deleteHelpCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const category = await HelpCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Help category not found.",
      });
    }

    const articleExists = await HelpArticle.exists({
      category: category._id,
    });

    if (articleExists) {
      return res.status(409).json({
        success: false,
        message:
          "This category contains help articles. Reassign or delete them before deleting the category.",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Help category deleted successfully.",
    });
  } catch (error) {
    console.error("deleteHelpCategory:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the help category.",
    });
  }
};