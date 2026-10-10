
import { Router } from "express";
import multer from "multer";

import {
    getArticles,
    getArticle,
    getArticleOptions,
    addArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/article.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const articleRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
            "image/avif",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG, AVIF, and WEBP are allowed."
                )
            );
        }
    },
});

// ============================================================
// PUBLIC ROUTES
// ============================================================

articleRouter.get("/", getArticles);

articleRouter.get("/options", getArticleOptions);

articleRouter.get("/:id", getArticle);

// ============================================================
// ADMIN ROUTES
// ============================================================

articleRouter.post(
    "/",
    authorize,
    isAdmin,
    upload.single("image"),
    addArticle
);

articleRouter.put(
    "/:id",
    authorize,
    isAdmin,
    upload.single("image"),
    updateArticle
);

articleRouter.delete(
    "/:id",
    authorize,
    isAdmin,
    deleteArticle
);

export default articleRouter;
