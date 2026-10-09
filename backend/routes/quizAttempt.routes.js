import { Router } from "express";

import {
    saveQuizAnswer,
    submitQuiz,
    getMyQuizAttempts,
    getQuizAttempt,
    abandonQuizAttempt
} from "../controllers/quiz.controller.js";

import authorize from "../middlewares/auth.middleware.js";


const quizAttemptRouter = Router();

// Declare /me before /:id
quizAttemptRouter.get("/me", authorize, getMyQuizAttempts);

quizAttemptRouter.get("/:id", authorize, getQuizAttempt);

quizAttemptRouter.post("/:id/answer", authorize, saveQuizAnswer);

quizAttemptRouter.post("/:id/submit", authorize, submitQuiz);

quizAttemptRouter.post("/:id/abandon", authorize, abandonQuizAttempt);

export default quizAttemptRouter;