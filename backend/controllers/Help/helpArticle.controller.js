import mongoose from "mongoose";
import HelpArticle from "../../models/Help/helpArticle.model.js";
import HelpCategory from "../../models/Help/helpCategory.model.js";

const CATEGORY_POPULATE = {
  path: "category",
  select: "name slug description icon",
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (query) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(query.limit, 10) || 10)
  );

  return { page, limit, skip: (page - 1) * limit };
};

const validateArticlePayload = (body, { partial = false } = {}) => {
  const stringFields = ["title", "slug", "excerpt"];

  for (const field of stringFields) {
    if (!partial || body[field] !== undefined) {
      if (
        typeof body[field] !== "string" ||
        !body[field].trim()
      ) {
        return `${field} must be a non-empty string.`;
      }
    }
  }

  if (
    body.sections !== undefined &&
    (!Array.isArray(body.sections) ||
      body.sections.some(
        (section) =>
          !section ||
          typeof section.content !== "string" ||
          !section.content.trim() ||
          (section.heading !== undefined &&
            typeof section.heading !== "string") ||
          (section.order !== undefined &&
            !Number.isFinite(section.order))
      ))
  ) {
    return "Sections must be an array of valid sections.";
  }

  if (
    body.tags !== undefined &&
    (!Array.isArray(body.tags) ||
      body.tags.some((tag) => typeof tag !== "string"))
  ) {
    return "Tags must be an array of strings.";
  }

  if (
    body.articleType !== undefined &&
    !["guide", "faq", "troubleshooting"].includes(body.articleType)
  ) {
    return "Invalid articleType.";
  }

  for (const field of ["isFeatured", "isPublished"]) {
    if (
      body[field] !== undefined &&
      typeof body[field] !== "boolean"
    ) {
      return `${field} must be a boolean.`;
    }
  }

  if (
    body.order !== undefined &&
    !Number.isFinite(body.order)
  ) {
    return "Order must be a valid number.";
  }

  return null;
};

const normalizeArticleFields = (body) => {
  const data = {};

  for (const field of [
    "title",
    "slug",
    "excerpt",
    "category",
    "sections",
    "tags",
    "articleType",
    "isFeatured",
    "isPublished",
    "order",
  ]) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  for (const field of ["title", "slug", "excerpt"]) {
    if (typeof data[field] === "string") {
      data[field] = data[field].trim();
    }
  }

  if (typeof data.slug === "string") {
    data.slug = data.slug.toLowerCase();
  }

  if (Array.isArray(data.tags)) {
    data.tags = [
      ...new Set(data.tags.map((tag) => tag.trim()).filter(Boolean)),
    ];
  }

  if (Array.isArray(data.sections)) {
    data.sections = data.sections.map((section, index) => ({
      heading: section.heading?.trim() || undefined,
      content: section.content.trim(),
      order: section.order ?? index,
    }));
  }

  return data;
};

const validateCategory = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    return { error: "Invalid category ID." };
  }

  const category = await HelpCategory.findById(categoryId);

  if (!category) {
    return { error: "Help category not found." };
  }

  return { category };
};

// GET /api/v1/help/articles
// Public: published articles only
export const getPublicHelpArticles = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, category, type, featured } = req.query;

    const filter = { isPublished: true };

    if (category) {
      let categoryDocument;

      if (mongoose.isValidObjectId(category)) {
        categoryDocument = await HelpCategory.findOne({
          _id: category,
          isPublished: true,
        }).select("_id");
      } else {
        categoryDocument = await HelpCategory.findOne({
          slug: String(category).toLowerCase(),
          isPublished: true,
        }).select("_id");
      }

      if (!categoryDocument) {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        });
      }

      filter.category = categoryDocument._id;
    }

    if (type !== undefined) {
      if (!["guide", "faq", "troubleshooting"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid article type.",
        });
      }

      filter.articleType = type;
    }

    if (featured !== undefined) {
      if (!["true", "false"].includes(featured)) {
        return res.status(400).json({
          success: false,
          message: "featured must be true or false.",
        });
      }

      if (featured === "true") {
        filter.isFeatured = true;
      }
    }

    if (search && String(search).trim()) {
      const regex = new RegExp(
        escapeRegex(String(search).trim().slice(0, 100)),
        "i"
      );

      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { tags: regex },
        { "sections.heading": regex },
        { "sections.content": regex },
      ];
    }

    const [articles, total] = await Promise.all([
      HelpArticle.find(filter)
        .populate(CATEGORY_POPULATE)
        .sort({ isFeatured: -1, order: 1, publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      HelpArticle.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getPublicHelpArticles:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve help articles.",
    });
  }
};

// GET /api/v1/help/articles/admin
// Admin: all articles, including drafts
export const getAdminHelpArticles = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, category, type, published } = req.query;

    const filter = {};

    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }

      filter.category = category;
    }

    if (type !== undefined) {
      if (!["guide", "faq", "troubleshooting"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid article type.",
        });
      }

      filter.articleType = type;
    }

    if (published !== undefined) {
      if (!["true", "false"].includes(published)) {
        return res.status(400).json({
          success: false,
          message: "published must be true or false.",
        });
      }

      filter.isPublished = published === "true";
    }

    if (search && String(search).trim()) {
      const regex = new RegExp(
        escapeRegex(String(search).trim().slice(0, 100)),
        "i"
      );

      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { tags: regex },
      ];
    }

    const [articles, total] = await Promise.all([
      HelpArticle.find(filter)
        .populate(CATEGORY_POPULATE)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      HelpArticle.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getAdminHelpArticles:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin help articles.",
    });
  }
};

// GET /api/v1/help/articles/:slug
// Public: published article only
export const getPublicHelpArticleBySlug = async (req, res) => {
  try {
    const article = await HelpArticle.findOne({
      slug: req.params.slug.toLowerCase(),
      isPublished: true,
    })
      .populate(CATEGORY_POPULATE)
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Help article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("getPublicHelpArticleBySlug:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the help article.",
    });
  }
};

// GET /api/v1/help/articles/admin/:id
// Admin: retrieve a draft or published article by ID
export const getAdminHelpArticleById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await HelpArticle.findById(req.params.id)
      .populate(CATEGORY_POPULATE);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Help article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("getAdminHelpArticleById:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the help article.",
    });
  }
};

// POST /api/v1/help/articles
export const createHelpArticle = async (req, res) => {
  try {
    const validationError = validateArticlePayload(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const data = normalizeArticleFields(req.body);
    const categoryResult = await validateCategory(data.category);

    if (categoryResult.error) {
      return res.status(400).json({
        success: false,
        message: categoryResult.error,
      });
    }

    const existingArticle = await HelpArticle.findOne({
      slug: data.slug,
    });

    if (existingArticle) {
      return res.status(409).json({
        success: false,
        message: "An article with this slug already exists.",
      });
    }

    if (data.isPublished === true) {
      data.publishedAt = new Date();
    } else {
      data.publishedAt = null;
    }

    const article = await HelpArticle.create(data);
    await article.populate(CATEGORY_POPULATE);

    return res.status(201).json({
      success: true,
      message: "Help article created successfully.",
      data: article,
    });
  } catch (error) {
    console.error("createHelpArticle:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An article with this slug already exists.",
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
      message: "Failed to create the help article.",
    });
  }
};

// PATCH /api/v1/help/articles/:id
export const updateHelpArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const validationError = validateArticlePayload(req.body, {
      partial: true,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const article = await HelpArticle.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Help article not found.",
      });
    }

    const updates = normalizeArticleFields(req.body);

    if (updates.category !== undefined) {
      const categoryResult = await validateCategory(updates.category);

      if (categoryResult.error) {
        return res.status(400).json({
          success: false,
          message: categoryResult.error,
        });
      }
    }

    if (updates.slug !== undefined) {
      const duplicate = await HelpArticle.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "An article with this slug already exists.",
        });
      }
    }

    const wasPublished = article.isPublished;

    Object.assign(article, updates);

    if (article.isPublished) {
      if (!wasPublished || !article.publishedAt) {
        article.publishedAt = new Date();
      }
    } else {
      article.publishedAt = null;
    }

    await article.save();
    await article.populate(CATEGORY_POPULATE);

    return res.status(200).json({
      success: true,
      message: "Help article updated successfully.",
      data: article,
    });
  } catch (error) {
    console.error("updateHelpArticle:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An article with this slug already exists.",
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
      message: "Failed to update the help article.",
    });
  }
};

// PATCH /api/v1/help/articles/:id/publish
export const publishHelpArticle = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await HelpArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Help article not found.",
      });
    }

    if (!article.isPublished) {
      article.isPublished = true;
      article.publishedAt = new Date();
      await article.save();
    }

    return res.status(200).json({
      success: true,
      message: "Help article published successfully.",
      data: article,
    });
  } catch (error) {
    console.error("publishHelpArticle:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to publish the help article.",
    });
  }
};

// PATCH /api/v1/help/articles/:id/unpublish
export const unpublishHelpArticle = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await HelpArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Help article not found.",
      });
    }

    article.isPublished = false;
    article.publishedAt = null;

    await article.save();

    return res.status(200).json({
      success: true,
      message: "Help article unpublished successfully.",
      data: article,
    });
  } catch (error) {
    console.error("unpublishHelpArticle:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unpublish the help article.",
    });
  }
};

// DELETE /api/v1/help/articles/:id
export const deleteHelpArticle = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID.",
      });
    }

    const article = await HelpArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Help article not found.",
      });
    }

    await article.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Help article deleted successfully.",
    });
  } catch (error) {
    console.error("deleteHelpArticle:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the help article.",
    });
  }
};