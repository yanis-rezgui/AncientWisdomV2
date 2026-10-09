
import { Router } from "express";
import multer from "multer";

import {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook,
} from "../controllers/book.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const bookRouter = Router();

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

// Public routes
bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBook);

// Admin routes
bookRouter.post(
    "/",
    authorize,
    isAdmin,
    upload.single("image"),
    addBook
);

bookRouter.put(
    "/:id",
    authorize,
    isAdmin,
    upload.single("image"),
    updateBook
);

bookRouter.delete(
    "/:id",
    authorize,
    isAdmin,
    deleteBook
);

export default bookRouter;