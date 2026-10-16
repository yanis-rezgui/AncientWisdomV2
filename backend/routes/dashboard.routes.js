
import Router from "express";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

import {
    getAdminDashboard,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get(
    "/",
    authorize,
    isAdmin,
    getAdminDashboard
);

export default dashboardRouter;
