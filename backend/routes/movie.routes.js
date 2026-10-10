// routes/movie.routes.js

import { Router } from "express";
import multer from "multer";

import {
    getMovies,
    getMovie,
    addMovie,
    updateMovie,
    deleteMovie,
} from "../controllers/movie.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const movieRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid image format. Only JPEG, PNG, WEBP and AVIF are allowed."
                )
            );
        }
    },
});

// Public routes
movieRouter.get("/", getMovies);
movieRouter.get("/:id", getMovie);

// Admin routes
movieRouter.post(
    "/",
    authorize,
    isAdmin,
    upload.single("image"),
    addMovie
);

movieRouter.put(
    "/:id",
    authorize,
    isAdmin,
    upload.single("image"),
    updateMovie
);

movieRouter.delete(
    "/:id",
    authorize,
    isAdmin,
    deleteMovie
);

export default movieRouter;