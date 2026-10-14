import { Router } from "express";

import {
    getLocationChallenges,
    getLocationChallenge,
    startLocationChallengeGame,
    revealLocationHint,
    submitLocationAnswer,
    submitLocationChallengeGame,
    abandonLocationChallengeGame,
    getMyLocationChallengeSessions,
    getLocationChallengeSession,
} from "../../controllers/Games/locationChallenge.controller.js";

import authorize from "../../middlewares/auth.middleware.js";

const locationChallengesRouter = Router();

/* =========================
   PUBLIC — CHALLENGES
========================= */

locationChallengesRouter.get("/", getLocationChallenges);

locationChallengesRouter.get("/:id", getLocationChallenge);

/* =========================
   AUTHENTICATED — GAMEPLAY
========================= */

locationChallengesRouter.post("/start", authorize, startLocationChallengeGame);

locationChallengesRouter.get(
    "/sessions/me",
    authorize,
    getMyLocationChallengeSessions
);

locationChallengesRouter.get(
    "/sessions/:sessionId",
    authorize,
    getLocationChallengeSession
);

locationChallengesRouter.post(
    "/sessions/:sessionId/hint",
    authorize,
    revealLocationHint
);

locationChallengesRouter.post(
    "/sessions/:sessionId/answer",
    authorize,
    submitLocationAnswer
);

locationChallengesRouter.post(
    "/sessions/:sessionId/submit",
    authorize,
    submitLocationChallengeGame
);

locationChallengesRouter.post(
    "/sessions/:sessionId/abandon",
    authorize,
    abandonLocationChallengeGame
);

export default locationChallengesRouter;