
import express from "express";

import {
    getHomePage,
    updateHomePage,
} from "../controllers/homePage.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";



const homePageRouter = express.Router();

// Public: retrieve homepage content
homePageRouter.get("/", getHomePage);

// Admin only: update homepage content
homePageRouter.put("/", authorize, isAdmin, updateHomePage);

export default homePageRouter;
