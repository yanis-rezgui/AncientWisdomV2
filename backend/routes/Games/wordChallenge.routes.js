import { Router } from "express";

import {
    getWordChallenges,
    getWordChallenge,
    startWordChallengeGame,
    revealWordHint,
    submitWordAnswer,
    submitWordChallengeGame,
    abandonWordChallengeGame,
    getMyWordChallengeSessions,
    getWordChallengeSession,
} from "../../controllers/Games/wordChallenge.controller.js";

import authorize from "../../middlewares/auth.middleware.js";

const wordChallengesRouter = Router();

/* =========================
   PUBLIC — CHALLENGES
========================= */

wordChallengesRouter.get("/", getWordChallenges);

wordChallengesRouter.get("/:id", getWordChallenge);

/* =========================
   AUTHENTICATED — GAMEPLAY
========================= */

wordChallengesRouter.post("/start", authorize, startWordChallengeGame);

wordChallengesRouter.get(
    "/sessions/me",
    authorize,
    getMyWordChallengeSessions
);

wordChallengesRouter.get(
    "/sessions/:sessionId",
    authorize,
    getWordChallengeSession
);

wordChallengesRouter.post(
    "/sessions/:sessionId/hint",
    authorize,
    revealWordHint
);

wordChallengesRouter.post(
    "/sessions/:sessionId/answer",
    authorize,
    submitWordAnswer
);

wordChallengesRouter.post(
    "/sessions/:sessionId/submit",
    authorize,
    submitWordChallengeGame
);

wordChallengesRouter.post(
    "/sessions/:sessionId/abandon",
    authorize,
    abandonWordChallengeGame
);

export default wordChallengesRouter;