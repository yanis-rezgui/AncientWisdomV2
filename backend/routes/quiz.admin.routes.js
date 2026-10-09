
import { Router } from "express";

import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

import {
    getAdminQuizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
} from "../controllers/quiz.admin.controller.js";

const quizAdminRouter = Router();

quizAdminRouter.use(authorize, isAdmin);

quizAdminRouter.get("/", getAdminQuizzes);
quizAdminRouter.post("/", addQuiz);
quizAdminRouter.put("/:id", updateQuiz);
quizAdminRouter.delete("/:id", deleteQuiz);

export default quizAdminRouter;