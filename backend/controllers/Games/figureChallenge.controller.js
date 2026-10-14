import mongoose from "mongoose";
import FigureChallenge from "../../models/Games/figureChallenge.model.js";
import Game from "../../models/Games/game.model.js";
import GameSession from "../../models/Games/gameSession.model.js";

/* =========================
   HELPERS
========================= */

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const normalizeAnswer = (answer = "") =>
    answer
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, "")
        .trim();

const escapeRegex = (value = "") =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getUserId = (req) => req.user?._id || req.user?.id;

const isValidId = (id) => mongoose.isValidObjectId(id);

const fail = (res, status, message) =>
    res.status(status).json({ success: false, message });

const getSessionDuration = (session) =>
    Math.max(
        0,
        Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000)
    );

const isSessionOwner = (session, userId) =>
    session.user.toString() === userId.toString();

// Charge la session et vérifie qu'elle appartient bien à l'utilisateur.
// Retourne null (après avoir envoyé la réponse d'erreur) si ce n'est pas le cas.
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

// Ne renvoie que les indices déjà révélés — jamais la réponse.
const getSafeChallenge = (challenge, revealed = 1) => {
    const totalClues = challenge.clues?.length ?? 0;
    const cluesRevealed = Math.min(Math.max(1, revealed), totalClues);

    return {
        _id: challenge._id,
        title: challenge.title,
        slug: challenge.slug,
        image: challenge.image,
        difficulty: challenge.difficulty,
        tags: challenge.tags,
        clues: (challenge.clues ?? []).slice(0, cluesRevealed),
        cluesRevealed,
        totalClues,
    };
};

// La bonne réponse n'est révélée qu'une fois la figure répondue
// ou la session terminée / abandonnée.
const getSafeSession = (session) => ({
    _id: session._id,
    game: session.game,
    gameTitle: session.gameTitle,
    gameType: session.gameType,
    score: session.score,
    maxScore: session.maxScore,
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

// GET /api/v1/figure-challenges
export const getFigureChallenges = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = "", difficulty, tags } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(50, Math.max(1, Number(limit) || 10));

        const filter = { status: "published" };

        if (DIFFICULTIES.includes(difficulty)) {
            filter.difficulty = difficulty;
        }

        const searchTerm = String(search).trim();

        if (searchTerm) {
            const regex = { $regex: escapeRegex(searchTerm), $options: "i" };
            filter.$or = [{ title: regex }, { tags: regex }];
        }

        if (tags) {
            const tagList = Array.isArray(tags)
                ? tags
                : String(tags)
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean);

            if (tagList.length) {
                filter.tags = { $in: tagList };
            }
        }

        const [challenges, total] = await Promise.all([
            FigureChallenge.find(filter)
                .select("-answer -acceptedAnswers -clues")
                .sort({ createdAt: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .lean(),
            FigureChallenge.countDocuments(filter),
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

// GET /api/v1/figure-challenges/:id
export const getFigureChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return fail(res, 400, "Invalid figure challenge ID.");
        }

        const challenge = await FigureChallenge.findOne({
            _id: id,
            status: "published",
        }).select("-answer -acceptedAnswers -clues");

        if (!challenge) {
            return fail(res, 404, "Figure challenge not found.");
        }

        return res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY
========================= */

// POST /api/v1/figure-challenges/start
export const startFigureChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        const { gameId, difficulty, questionCount = 5 } = req.body;

        if (!gameId || !isValidId(gameId)) {
            return fail(res, 400, "A valid gameId is required.");
        }

        if (difficulty && !DIFFICULTIES.includes(difficulty)) {
            return fail(res, 400, "difficulty must be Easy, Medium or Hard.");
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
            gameType: "guess-the-figure",
            status: "published",
        });

        if (!game) {
            return fail(res, 404, "Guess the Figure game not found.");
        }

        // Reprise d'une session en cours
        const existingSession = await GameSession.findOne({
            user: userId,
            game: game._id,
            status: "in_progress",
        });

        if (existingSession) {
            const ids = existingSession.answers.map((a) => a.challenge);

            const found = await FigureChallenge.find({
                _id: { $in: ids },
            }).lean();

            const byId = new Map(found.map((c) => [c._id.toString(), c]));

            const challenges = existingSession.answers
                .map((a) => {
                    const challenge = byId.get(a.challenge.toString());
                    return challenge
                        ? getSafeChallenge(challenge, a.hintsUsed || 1)
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

        const availableChallenges = await FigureChallenge.aggregate([
            { $match: challengeFilter },
            { $sample: { size: count } },
        ]);

        if (!availableChallenges.length) {
            return fail(res, 404, "No published figure challenges are available.");
        }

        const answers = availableChallenges.map((challenge) => ({
            challenge: challenge._id,
            challengeType: "FigureChallenge",
            userAnswer: "",
            correctAnswer: challenge.answer,
            isCorrect: false,
            pointsEarned: 0,
            hintsUsed: 1,
            timeSpent: 0,
        }));

        // Score maximum = meilleur barème possible pour chaque figure
        const maxScore = availableChallenges.reduce((total, challenge) => {
            const best = Math.max(
                0,
                ...(challenge.clues ?? []).map((clue) => clue.points ?? 0)
            );
            return total + best;
        }, 0);

        const session = await GameSession.create({
            user: userId,
            game: game._id,
            gameTitle: game.title,
            gameType: "guess-the-figure",
            difficulty: difficulty || game.difficulty,
            answers,
            totalQuestions: availableChallenges.length,
            score: 0,
            maxScore,
            status: "in_progress",
            startedAt: new Date(),
        });

        const challenges = availableChallenges.map((challenge) =>
            getSafeChallenge(challenge, 1)
        );

        return res.status(201).json({
            success: true,
            message: "Guess the Figure game started successfully.",
            data: {
                session: getSafeSession(session),
                challenges,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/v1/figure-challenges/sessions/:sessionId/hint
export const revealFigureHint = async (req, res, next) => {
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

        const session = await loadOwnedSession(res, sessionId, userId);
        if (!session) return;

        if (session.status !== "in_progress") {
            return fail(res, 409, "This game session is no longer active.");
        }

        const answer = session.answers.find(
            (item) => item.challenge.toString() === challengeId
        );

        if (!answer) {
            return fail(res, 404, "Challenge not found in this session.");
        }

        if (answer.userAnswer) {
            return fail(res, 409, "You have already answered this challenge.");
        }

        const challenge = await FigureChallenge.findById(challengeId);

        if (!challenge || challenge.status !== "published") {
            return fail(res, 404, "Figure challenge not found.");
        }

        const nextClueIndex = answer.hintsUsed;

        if (nextClueIndex >= challenge.clues.length) {
            return fail(res, 409, "No more hints are available.");
        }

        const clue = challenge.clues[nextClueIndex];

        answer.hintsUsed += 1;
        await session.save();

        return res.status(200).json({
            success: true,
            data: {
                challengeId,
                clue,
                cluesRevealed: answer.hintsUsed,
                totalClues: challenge.clues.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/v1/figure-challenges/sessions/:sessionId/answer
export const submitFigureAnswer = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;
        const { challengeId, answer: submittedAnswer, timeSpent = 0 } = req.body;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId) || !isValidId(challengeId)) {
            return fail(res, 400, "Invalid session or challenge ID.");
        }

        if (typeof submittedAnswer !== "string" || !submittedAnswer.trim()) {
            return fail(res, 400, "An answer is required.");
        }

        const normalizedSubmittedAnswer = normalizeAnswer(submittedAnswer);

        // Ex: "???" devient "" après normalisation et ne doit jamais matcher
        if (!normalizedSubmittedAnswer) {
            return fail(res, 400, "Please enter a valid answer.");
        }

        const parsedTimeSpent = Number(timeSpent);

        if (!Number.isFinite(parsedTimeSpent) || parsedTimeSpent < 0) {
            return fail(res, 400, "timeSpent must be a non-negative number.");
        }

        const session = await loadOwnedSession(res, sessionId, userId);
        if (!session) return;

        if (session.status !== "in_progress") {
            return fail(res, 409, "This game session is no longer active.");
        }

        const sessionAnswer = session.answers.find(
            (item) => item.challenge.toString() === challengeId
        );

        if (!sessionAnswer) {
            return fail(res, 404, "Challenge not found in this session.");
        }

        if (sessionAnswer.userAnswer) {
            return fail(res, 409, "You have already answered this challenge.");
        }

        const challenge = await FigureChallenge.findById(challengeId);

        if (!challenge) {
            return fail(res, 404, "Figure challenge not found.");
        }

        const acceptedAnswers = [
            challenge.answer,
            ...(challenge.acceptedAnswers ?? []),
        ];

        const isCorrect = acceptedAnswers.some(
            (acceptedAnswer) =>
                normalizeAnswer(acceptedAnswer) === normalizedSubmittedAnswer
        );

        // Points = barème de l'indice le plus avancé révélé
        const clueIndex = Math.max(
            0,
            Math.min(sessionAnswer.hintsUsed - 1, challenge.clues.length - 1)
        );

        const pointsAvailable = challenge.clues[clueIndex]?.points ?? 0;
        const pointsEarned = isCorrect ? pointsAvailable : 0;

        sessionAnswer.userAnswer = submittedAnswer.trim();
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
                userAnswer: submittedAnswer.trim(),
                correctAnswer: challenge.answer,
                isCorrect,
                pointsEarned,
                score: session.score,
                maxScore: session.maxScore,
                explanation: challenge.explanation,
                historicalContext: challenge.historicalContext,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/v1/figure-challenges/sessions/:sessionId/submit
export const submitFigureChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId)) {
            return fail(res, 400, "Invalid session ID.");
        }

        const session = await loadOwnedSession(res, sessionId, userId);
        if (!session) return;

        if (session.status === "completed") {
            return res.status(200).json({
                success: true,
                message: "Game session was already completed.",
                data: getSafeSession(session),
            });
        }

        if (session.status !== "in_progress") {
            return fail(res, 409, "This game session cannot be completed.");
        }

        session.status = "completed";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "Guess the Figure game completed successfully.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/v1/figure-challenges/sessions/:sessionId/abandon
export const abandonFigureChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId)) {
            return fail(res, 400, "Invalid session ID.");
        }

        const session = await loadOwnedSession(res, sessionId, userId);
        if (!session) return;

        if (session.status !== "in_progress") {
            return fail(res, 409, "This game session is no longer active.");
        }

        session.status = "abandoned";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "Game session abandoned.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   HISTORY
========================= */

// GET /api/v1/figure-challenges/sessions/me
export const getMyFigureChallengeSessions = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const filter = { user: userId, gameType: "guess-the-figure" };

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

// GET /api/v1/figure-challenges/sessions/:sessionId
export const getFigureChallengeSession = async (req, res, next) => {
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
            gameType: "guess-the-figure",
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