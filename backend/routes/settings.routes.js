
import { Router } from "express";
import {
    getSettings,
    updateSettings,
} from "../controllers/settings.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const settingsRouter = Router();

// Lecture publique
settingsRouter.get("/", getSettings);

// Modification réservée à l'administrateur
settingsRouter.put("/", authorize, isAdmin, updateSettings);

export default settingsRouter;
