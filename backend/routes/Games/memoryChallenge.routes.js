import { Router } from "express";

import {
    getMemoryChallenges,
    getMemoryChallenge,
    startMemoryChallengeGame,
    flipMemoryCard,
    submitMemoryChallengeGame,
    abandonMemoryChallengeGame,
    getMyMemoryChallengeSessions,
    getMemoryChallengeSession,
} from "../../controllers/Games/memoryChallenge.controller.js";

import authorize from "../../middlewares/auth.middleware.js";

const memoryChallengesRouter = Router();

/* =========================
   PUBLIC — CHALLENGES
========================= */

memoryChallengesRouter.get("/", getMemoryChallenges);

memoryChallengesRouter.get("/:id", getMemoryChallenge);

/* =========================
   AUTHENTICATED — GAMEPLAY
========================= */

memoryChallengesRouter.post("/start", authorize, startMemoryChallengeGame);

memoryChallengesRouter.get(
    "/sessions/me",
    authorize,
    getMyMemoryChallengeSessions
);

memoryChallengesRouter.get(
    "/sessions/:sessionId",
    authorize,
    getMemoryChallengeSession
);

memoryChallengesRouter.post(
    "/sessions/:sessionId/flip",
    authorize,
    flipMemoryCard
);

memoryChallengesRouter.post(
    "/sessions/:sessionId/submit",
    authorize,
    submitMemoryChallengeGame
);

memoryChallengesRouter.post(
    "/sessions/:sessionId/abandon",
    authorize,
    abandonMemoryChallengeGame
);

export default memoryChallengesRouter;