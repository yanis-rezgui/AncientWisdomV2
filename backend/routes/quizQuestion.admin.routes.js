
import { Router } from "express";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

import {
    addQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
} from "../controllers/quizQuestion.admin.controller.js";

const quizQuestionAdminRouter = Router();

quizQuestionAdminRouter.use(authorize, isAdmin);

quizQuestionAdminRouter.post("/", addQuizQuestion);
quizQuestionAdminRouter.put("/:id", updateQuizQuestion);
quizQuestionAdminRouter.delete("/:id", deleteQuizQuestion);

export default quizQuestionAdminRouter;