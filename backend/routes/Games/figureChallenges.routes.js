import { Router } from "express";

import {
    getFigureChallenges,
    getFigureChallenge,
    startFigureChallengeGame,
    revealFigureHint,
    submitFigureAnswer,
    submitFigureChallengeGame,
    abandonFigureChallengeGame,
    getMyFigureChallengeSessions,
    getFigureChallengeSession,
} from "../../controllers/Games/figureChallenge.controller.js";

import authorize from "../../middlewares/auth.middleware.js";

const figureChallengesRouter = Router();

// Public challenge browsing
figureChallengesRouter.get("/", getFigureChallenges);
figureChallengesRouter.get("/:id", getFigureChallenge);

// Authenticated gameplay
figureChallengesRouter.post(
    "/start",
    authorize,
    startFigureChallengeGame
);

figureChallengesRouter.get(
    "/sessions/me",
    authorize,
    getMyFigureChallengeSessions
);

figureChallengesRouter.get(
    "/sessions/:sessionId",
    authorize,
    getFigureChallengeSession
);

figureChallengesRouter.post(
    "/sessions/:sessionId/hint",
    authorize,
    revealFigureHint
);

figureChallengesRouter.post(
    "/sessions/:sessionId/answer",
    authorize,
    submitFigureAnswer
);

figureChallengesRouter.post(
    "/sessions/:sessionId/submit",
    authorize,
    submitFigureChallengeGame
);

figureChallengesRouter.post(
    "/sessions/:sessionId/abandon",
    authorize,
    abandonFigureChallengeGame
);

export default figureChallengesRouter;