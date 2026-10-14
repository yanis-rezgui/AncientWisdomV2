import mongoose from "mongoose";
import LandmarkChallenge from "../../models/Games/landmarkChallenge.model.js";
import Game from "../../models/Games/game.model.js";
import GameSession from "../../models/Games/gameSession.model.js";

/* =========================
   HELPERS
========================= */

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const GAME_TYPE = "name-the-landmark";
const CHALLENGE_TYPE = "LandmarkChallenge";
const POINTS_PER_QUESTION = 100;

// Champs qui trahissent la réponse : jamais envoyés avant que le joueur ait répondu.
const HIDDEN_PUBLIC_FIELDS =
    "-answer -hint -explanation -title -slug -location -civilization -tags";

const normalizeAnswer = (answer = "") =>
    answer
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, "")
        .trim();

const getUserId = (req) => req.user?._id || req.user?.id;

const isValidId = (id) => mongoose.isValidObjectId(id);

const fail = (res, status, message) =>
    res.status(status).json({ success: false, message });

const getSessionDuration = (session) =>
    Math.max(
        0,
        Math.floor(
            (Date.now() - new Date(session.startedAt).getTime()) / 1000
        )
    );

const isSessionOwner = (session, userId) =>
    session.user.toString() === userId.toString();

const loadOwnedSession = async (res, sessionId, userId) => {
    const session = await GameSession.findById(sessionId);

    if (!session) {
        fail(res, 404, "Game session not found.");
        return null;
    }

    if (!isSessionOwner(session, userId)) {
        fail(res, 403, "You cannot access this game session.");
        return null;
    }

    return session;
};

// Ne contient rien qui puisse trahir la réponse.
const getSafeChallenge = (challenge, hintsUsed = 0) => ({
    _id: challenge._id,
    image: challenge.image,
    options: challenge.options,
    difficulty: challenge.difficulty,
    hasHint: Boolean(challenge.hint),
    // Le hint n'est renvoyé que s'il a déjà été révélé (utile à la reprise de session)
    hint: hintsUsed > 0 && challenge.hint ? challenge.hint : null,
});

// Ne révèle la réponse qu'après une réponse soumise ou une fin de session.
const getSafeSession = (session) => ({
    _id: session._id,
    game: session.game,
    gameTitle: session.gameTitle,
    gameType: session.gameType,
    difficulty: session.difficulty,
    score: session.score,
    maxScore: session.maxScore,
    totalQuestions: session.totalQuestions,
    correctAnswers: session.correctAnswers,
    incorrectAnswers: session.incorrectAnswers,
    status: session.status,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    durationSeconds: session.durationSeconds,
    answers: session.answers.map((answer) => ({
        challenge: answer.challenge,
        challengeType: answer.challengeType,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        hintsUsed: answer.hintsUsed,
        timeSpent: answer.timeSpent,
        answeredAt: answer.answeredAt,
        correctAnswer:
            session.status !== "in_progress" || answer.userAnswer
                ? answer.correctAnswer
                : undefined,
    })),
});

/* =========================
   PUBLIC — CHALLENGES
========================= */

// GET /api/v1/landmark-challenges
// La recherche textuelle (title/location/civilization/tags) est retirée :
// elle permettait de deviner la réponse. Seul le filtre de difficulté reste.
export const getLandmarkChallenges = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, difficulty } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(50, Math.max(1, Number(limit) || 10));

        const filter = { status: "published" };

        if (DIFFICULTIES.includes(difficulty)) {
            filter.difficulty = difficulty;
        }

        const [challenges, total] = await Promise.all([
            LandmarkChallenge.find(filter)
                .select(HIDDEN_PUBLIC_FIELDS)
                .sort({ createdAt: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .lean(),
            LandmarkChallenge.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: challenges,
            pagination: {
                page: currentPage,
                limit: perPage,
                total,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/landmark-challenges/:id
export const getLandmarkChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return fail(res, 400, "Invalid landmark challenge ID.");
        }

        const challenge = await LandmarkChallenge.findOne({
            _id: id,
            status: "published",
        }).select(HIDDEN_PUBLIC_FIELDS);

        if (!challenge) {
            return fail(res, 404, "Landmark challenge not found.");
        }

        return res.status(200).json({
            success: true,
            data: challenge,
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — START
========================= */

// POST /api/v1/landmark-challenges/start
export const startLandmarkChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        const {
            gameId,
            difficulty,
            questionCount = 5,
        } = req.body;

        if (!gameId || !isValidId(gameId)) {
            return fail(res, 400, "A valid gameId is required.");
        }

        if (difficulty && !DIFFICULTIES.includes(difficulty)) {
            return fail(
                res,
                400,
                "difficulty must be Easy, Medium or Hard."
            );
        }

        const count = Number(questionCount);

        if (!Number.isInteger(count) || count < 1 || count > 20) {
            return fail(
                res,
                400,
                "questionCount must be an integer between 1 and 20."
            );
        }

        const game = await Game.findOne({
            _id: gameId,
            gameType: GAME_TYPE,
            status: "published",
        });

        if (!game) {
            return fail(res, 404, "Name the Landmark game not found.");
        }

        // Reprendre une session déjà en cours pour ce jeu.
        const existingSession = await GameSession.findOne({
            user: userId,
            game: game._id,
            status: "in_progress",
        });

        if (existingSession) {
            const challengeIds = existingSession.answers.map(
                (answer) => answer.challenge
            );

            const foundChallenges = await LandmarkChallenge.find({
                _id: { $in: challengeIds },
            }).lean();

            const byId = new Map(
                foundChallenges.map((challenge) => [
                    challenge._id.toString(),
                    challenge,
                ])
            );

            const challenges = existingSession.answers
                .map((answer) => {
                    const challenge = byId.get(
                        answer.challenge.toString()
                    );

                    return challenge
                        ? getSafeChallenge(challenge, answer.hintsUsed)
                        : null;
                })
                .filter(Boolean);

            return res.status(200).json({
                success: true,
                message: "An active game session already exists.",
                data: {
                    session: getSafeSession(existingSession),
                    challenges,
                },
            });
        }

        const challengeFilter = { status: "published" };

        if (difficulty) {
            challengeFilter.difficulty = difficulty;
        }

        const availableCount =
            await LandmarkChallenge.countDocuments(challengeFilter);

        if (availableCount === 0) {
            return fail(
                res,
                404,
                "No published landmark challenges are available."
            );
        }

        // Ne jamais demander plus de questions qu'il n'en existe.
        const sampleSize = Math.min(count, availableCount);

        const availableChallenges = await LandmarkChallenge.aggregate([
            { $match: challengeFilter },
            { $sample: { size: sampleSize } },
        ]);

        const answers = availableChallenges.map((challenge) => ({
            challenge: challenge._id,
            challengeType: CHALLENGE_TYPE,
            userAnswer: "",
            correctAnswer: challenge.answer,
            isCorrect: false,
            pointsEarned: 0,
            hintsUsed: 0,
            timeSpent: 0,
        }));

        const maxScore = availableChallenges.length * POINTS_PER_QUESTION;

        const session = await GameSession.create({
            user: userId,
            game: game._id,
            gameTitle: game.title,
            gameType: GAME_TYPE,
            difficulty: difficulty || game.difficulty,
            answers,
            totalQuestions: availableChallenges.length,
            score: 0,
            maxScore,
            correctAnswers: 0,
            incorrectAnswers: 0,
            status: "in_progress",
            startedAt: new Date(),
        });

        // Attention : ne pas passer getSafeChallenge directement à .map(),
        // l'index serait interprété comme hintsUsed.
        const challenges = availableChallenges.map((challenge) =>
            getSafeChallenge(challenge)
        );

        return res.status(201).json({
            success: true,
            message: "Landmark challenge game started successfully.",
            data: {
                session: getSafeSession(session),
                challenges,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — HINT
========================= */

// POST /api/v1/landmark-challenges/sessions/:sessionId/hint
export const revealLandmarkHint = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;
        const { challengeId } = req.body;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId) || !isValidId(challengeId)) {
            return fail(res, 400, "Invalid session or challenge ID.");
        }

        const session = await loadOwnedSession(
            res,
            sessionId,
            userId
        );

        if (!session) return;

        if (
            session.gameType !== GAME_TYPE ||
            session.status !== "in_progress"
        ) {
            return fail(res, 409, "This game session is not active.");
        }

        const sessionAnswer = session.answers.find(
            (answer) =>
                answer.challenge.toString() === challengeId
        );

        if (!sessionAnswer) {
            return fail(
                res,
                404,
                "Challenge not found in this session."
            );
        }

        if (sessionAnswer.userAnswer) {
            return fail(
                res,
                409,
                "You have already answered this challenge."
            );
        }

        const challenge = await LandmarkChallenge.findOne({
            _id: challengeId,
            status: "published",
        }).select("hint");

        if (!challenge) {
            return fail(res, 404, "Landmark challenge not found.");
        }

        if (!challenge.hint) {
            return fail(res, 404, "No hint is available for this challenge.");
        }

        sessionAnswer.hintsUsed = 1;
        await session.save();

        return res.status(200).json({
            success: true,
            data: {
                challengeId,
                hint: challenge.hint,
                hintsUsed: 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — ANSWER
========================= */

// POST /api/v1/landmark-challenges/sessions/:sessionId/answer
export const submitLandmarkAnswer = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;
        const {
            challengeId,
            answer: submittedAnswer,
            timeSpent = 0,
        } = req.body;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId) || !isValidId(challengeId)) {
            return fail(res, 400, "Invalid session or challenge ID.");
        }

        if (
            typeof submittedAnswer !== "string" ||
            !submittedAnswer.trim()
        ) {
            return fail(res, 400, "An answer is required.");
        }

        const normalizedSubmittedAnswer =
            normalizeAnswer(submittedAnswer);

        if (!normalizedSubmittedAnswer) {
            return fail(res, 400, "Please select a valid answer.");
        }

        const parsedTimeSpent = Number(timeSpent);

        if (
            !Number.isFinite(parsedTimeSpent) ||
            parsedTimeSpent < 0
        ) {
            return fail(
                res,
                400,
                "timeSpent must be a non-negative number."
            );
        }

        const session = await loadOwnedSession(
            res,
            sessionId,
            userId
        );

        if (!session) return;

        if (
            session.gameType !== GAME_TYPE ||
            session.status !== "in_progress"
        ) {
            return fail(res, 409, "This game session is not active.");
        }

        const sessionAnswer = session.answers.find(
            (item) =>
                item.challenge.toString() === challengeId
        );

        if (!sessionAnswer) {
            return fail(
                res,
                404,
                "Challenge not found in this session."
            );
        }

        if (sessionAnswer.userAnswer) {
            return fail(
                res,
                409,
                "You have already answered this challenge."
            );
        }

        const challenge = await LandmarkChallenge.findOne({
            _id: challengeId,
            status: "published",
        }).select("answer options explanation location civilization");

        if (!challenge) {
            return fail(res, 404, "Landmark challenge not found.");
        }

        // Le choix doit faire partie des options envoyées au joueur.
        const selectedOption = challenge.options.find(
            (option) =>
                normalizeAnswer(option) === normalizedSubmittedAnswer
        );

        if (!selectedOption) {
            return fail(
                res,
                400,
                "Your answer must be one of the available options."
            );
        }

        const isCorrect =
            normalizeAnswer(challenge.answer) ===
            normalizedSubmittedAnswer;

        // Barème : 100 points sans hint, 50 points si le hint a été utilisé.
        // Une mauvaise réponse rapporte zéro point.
        const pointsEarned = isCorrect
            ? sessionAnswer.hintsUsed > 0
                ? POINTS_PER_QUESTION / 2
                : POINTS_PER_QUESTION
            : 0;

        sessionAnswer.userAnswer = selectedOption;
        sessionAnswer.correctAnswer = challenge.answer;
        sessionAnswer.isCorrect = isCorrect;
        sessionAnswer.pointsEarned = pointsEarned;
        sessionAnswer.timeSpent = parsedTimeSpent;
        sessionAnswer.answeredAt = new Date();

        session.score = session.answers.reduce(
            (total, item) => total + (item.pointsEarned ?? 0),
            0
        );

        session.correctAnswers = session.answers.filter(
            (item) => item.isCorrect
        ).length;

        session.incorrectAnswers = session.answers.filter(
            (item) => item.userAnswer && !item.isCorrect
        ).length;

        await session.save();

        return res.status(200).json({
            success: true,
            data: {
                challengeId,
                userAnswer: selectedOption,
                correctAnswer: challenge.answer,
                isCorrect,
                pointsEarned,
                score: session.score,
                maxScore: session.maxScore,
                explanation: challenge.explanation,
                location: challenge.location,
                civilization: challenge.civilization,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — SUBMIT
========================= */

// POST /api/v1/landmark-challenges/sessions/:sessionId/submit
export const submitLandmarkChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId)) {
            return fail(res, 400, "Invalid session ID.");
        }

        const session = await loadOwnedSession(
            res,
            sessionId,
            userId
        );

        if (!session) return;

        if (session.gameType !== GAME_TYPE) {
            return fail(res, 400, "This is not a landmark game session.");
        }

        if (session.status === "completed") {
            return res.status(200).json({
                success: true,
                message: "Game session was already completed.",
                data: getSafeSession(session),
            });
        }

        if (session.status !== "in_progress") {
            return fail(
                res,
                409,
                "This game session cannot be completed."
            );
        }

        session.status = "completed";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "Name the Landmark game completed successfully.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — ABANDON
========================= */

// POST /api/v1/landmark-challenges/sessions/:sessionId/abandon
export const abandonLandmarkChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId)) {
            return fail(res, 400, "Invalid session ID.");
        }

        const session = await loadOwnedSession(
            res,
            sessionId,
            userId
        );

        if (!session) return;

        if (
            session.gameType !== GAME_TYPE ||
            session.status !== "in_progress"
        ) {
            return fail(res, 409, "This game session is not active.");
        }

        session.status = "abandoned";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "Landmark game session abandoned.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   HISTORY
========================= */

// GET /api/v1/landmark-challenges/sessions/me
export const getMyLandmarkChallengeSessions = async (
    req,
    res,
    next
) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            50,
            Math.max(1, Number(req.query.limit) || 10)
        );

        const filter = {
            user: userId,
            gameType: GAME_TYPE,
        };

        const [sessions, total] = await Promise.all([
            GameSession.find(filter)
                .sort({ startedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            GameSession.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: sessions.map(getSafeSession),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/v1/landmark-challenges/sessions/:sessionId
export const getLandmarkChallengeSession = async (
    req,
    res,
    next
) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId)) {
            return fail(res, 400, "Invalid session ID.");
        }

        const session = await GameSession.findOne({
            _id: sessionId,
            user: userId,
            gameType: GAME_TYPE,
        });

        if (!session) {
            return fail(res, 404, "Game session not found.");
        }

        return res.status(200).json({
            success: true,
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};