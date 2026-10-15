import { Router } from "express";



import {
    addLandmarkChallenge,
    updateLandmarkChallenge,
    deleteLandmarkChallenge,
} from "../../controllers/AdminGames/landmarkChallenge.admin.controller.js";
import multer from "multer";
import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";
import { getLandmarkChallenge, getLandmarkChallenges } from "../../controllers/AdminGames/gameChallenges.admin.read.controller.js";

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

router.get("/", getLandmarkChallenges);
router.get("/:id", getLandmarkChallenge);
router.post("/",authorize, isAdmin, upload.single("image"), addLandmarkChallenge);
router.put("/:id", authorize, isAdmin, upload.single("image"), updateLandmarkChallenge);
router.delete("/:id", authorize, isAdmin, deleteLandmarkChallenge);

export default router;
