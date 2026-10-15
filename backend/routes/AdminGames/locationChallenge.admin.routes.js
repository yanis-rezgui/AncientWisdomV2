import { Router } from "express";



import {
    addLocationChallenge,
    updateLocationChallenge,
    deleteLocationChallenge,
} from "../../controllers/AdminGames/locationChallenge.admin.controller.js";
import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";
import { getLocationChallenge, getLocationChallenges } from "../../controllers/AdminGames/gameChallenges.admin.read.controller.js";

const router = Router();


router.get("/", getLocationChallenges);
router.get("/:id", getLocationChallenge);
router.post("/",authorize, isAdmin, addLocationChallenge);
router.put("/:id", authorize, isAdmin, updateLocationChallenge);
router.delete("/:id", authorize, isAdmin, deleteLocationChallenge);

export default router;
