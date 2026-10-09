
import { Router } from "express";

import {
    getQuizzes,
    getQuiz,
    startQuiz
} from "../controllers/quiz.controller.js";

import authorize from "../middlewares/auth.middleware.js";


const quizRouter = Router();

quizRouter.get("/", getQuizzes);
quizRouter.get("/:id", getQuiz);

quizRouter.post("/:id/start", authorize, startQuiz);

export default quizRouter;

