import { Router } from "express";



import {
    addMemoryChallenge,
    updateMemoryChallenge,
    deleteMemoryChallenge,
    MAX_CARDS,
} from "../../controllers/AdminGames/memoryChallenge.admin.controller.js";
import multer from "multer";
import { getMemoryChallenge, getMemoryChallenges } from "../../controllers/AdminGames/gameChallenges.admin.read.controller.js";

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

router.get("/", getMemoryChallenges);
router.get("/:id", getMemoryChallenge);
router.post("/", upload.array("cardImages", MAX_CARDS), addMemoryChallenge);
router.put("/:id", upload.array("cardImages", MAX_CARDS), updateMemoryChallenge);
router.delete("/:id", deleteMemoryChallenge);

export default router;
