import { Router } from "express";
import { getTips, updateTips } from "../controllers/tips.controller.js";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";



const tipsRouter = new Router();

tipsRouter.get('/', getTips);

tipsRouter.put('/', authorize, isAdmin, updateTips);

export default tipsRouter;