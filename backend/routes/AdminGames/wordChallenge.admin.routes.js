import { Router } from "express";



import {
    addWordChallenge,
    updateWordChallenge,
    deleteWordChallenge,
} from "../../controllers/AdminGames/wordChallenge.admin.controller.js";
import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";
import { getWordChallenge, getWordChallenges } from "../../controllers/AdminGames/gameChallenges.admin.read.controller.js";

const router = Router();



router.get("/", getWordChallenges);
router.get("/:id", getWordChallenge);
router.post("/", authorize, isAdmin, addWordChallenge);
router.put("/:id", authorize, isAdmin, updateWordChallenge);
router.delete("/:id", authorize, isAdmin, deleteWordChallenge);

export default router;
