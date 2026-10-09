import { Router } from "express";
import multer from "multer";

import {
    getFrames,
    getFrame,
    addFrame,
    updateFrame,
    deleteFrame,
} from "../controllers/frame.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const frameRouter = Router();

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

// Configure image uploads
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
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
frameRouter.get("/", getFrames);
frameRouter.get("/:id", getFrame);

// Admin routes
frameRouter.post(
    "/",
    authorize,
    isAdmin,
    upload.single("image"),
    addFrame
);

frameRouter.put(
    "/:id",
    authorize,
    isAdmin,
    upload.single("image"),
    updateFrame
);

frameRouter.delete(
    "/:id",
    authorize,
    isAdmin,
    deleteFrame
);

export default frameRouter;

