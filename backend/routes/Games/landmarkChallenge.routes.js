
import { Router } from "express";

import {
    getLandmarkChallenges,
    getLandmarkChallenge,
    startLandmarkChallengeGame,
    revealLandmarkHint,
    submitLandmarkAnswer,
    submitLandmarkChallengeGame,
    abandonLandmarkChallengeGame,
    getMyLandmarkChallengeSessions,
    getLandmarkChallengeSession,
} from "../../controllers/Games/landmarkChallenge.controller.js";

import authorize from "../../middlewares/auth.middleware.js";

const landmarkChallengesRouter = Router();

/* =========================
   PUBLIC — CHALLENGES
========================= */

landmarkChallengesRouter.get(
    "/",
    getLandmarkChallenges
);

landmarkChallengesRouter.get(
    "/:id",
    getLandmarkChallenge
);

/* =========================
   AUTHENTICATED — GAMEPLAY
========================= */

landmarkChallengesRouter.post(
    "/start",
    authorize,
    startLandmarkChallengeGame
);

landmarkChallengesRouter.get(
    "/sessions/me",
    authorize,
    getMyLandmarkChallengeSessions
);

landmarkChallengesRouter.get(
    "/sessions/:sessionId",
    authorize,
    getLandmarkChallengeSession
);

landmarkChallengesRouter.post(
    "/sessions/:sessionId/hint",
    authorize,
    revealLandmarkHint
);

landmarkChallengesRouter.post(
    "/sessions/:sessionId/answer",
    authorize,
    submitLandmarkAnswer
);

landmarkChallengesRouter.post(
    "/sessions/:sessionId/submit",
    authorize,
    submitLandmarkChallengeGame
);

landmarkChallengesRouter.post(
    "/sessions/:sessionId/abandon",
    authorize,
    abandonLandmarkChallengeGame
);

export default landmarkChallengesRouter;
