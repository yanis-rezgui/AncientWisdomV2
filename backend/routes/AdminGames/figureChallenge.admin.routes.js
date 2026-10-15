import { Router } from "express";

// ⚠️ À adapter : tes middlewares d'authentification / d'upload


import {
    addFigureChallenge,
    updateFigureChallenge,
    deleteFigureChallenge,
} from "../../controllers/AdminGames/figureChallenge.admin.controller.js";
import multer from "multer";
import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";
import { getFigureChallenge, getFigureChallenges } from "../../controllers/AdminGames/gameChallenges.admin.read.controller.js";

const router = Router();

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


router.get("/", getFigureChallenges);
router.get("/:id", getFigureChallenge);
router.post("/",authorize, isAdmin, upload.single("image"), addFigureChallenge);
router.put("/:id", authorize, isAdmin, upload.single("image"), updateFigureChallenge);
router.delete("/:id", authorize, isAdmin, deleteFigureChallenge);

export default router;
