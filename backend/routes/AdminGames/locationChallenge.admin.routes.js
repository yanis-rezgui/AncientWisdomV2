import { Router } from "express";



import {
    addLocationChallenge,
    updateLocationChallenge,
    deleteLocationChallenge,
} from "../../controllers/AdminGames/locationChallenge.admin.controller.js";
import authorize from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";

const router = Router();



router.post("/",authorize, isAdmin, addLocationChallenge);
router.put("/:id", authorize, isAdmin, updateLocationChallenge);
router.delete("/:id", authorize, isAdmin, deleteLocationChallenge);

export default router;
