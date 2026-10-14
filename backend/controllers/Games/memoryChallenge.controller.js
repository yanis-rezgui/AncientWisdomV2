import mongoose from "mongoose";
import MemoryChallenge from "../../models/Games/memoryChallenge.model.js";
import Game from "../../models/Games/game.model.js";
import GameSession from "../../models/Games/gameSession.model.js";

/* =========================
   CONSTANTS
========================= */

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const PAIR_TYPES = [
    "figure-portrait",
    "landmark-name",
    "event-date",
    "civilization-artifact",
    "custom",
];

const GAME_TYPE = "history-memory";
const CHALLENGE_TYPE = "MemoryChallenge";

// Barème d'un plateau (une "question" = un plateau complet de cartes) :
// 10 points par paire, -2 points par erreur, avec un plancher de 2 points par paire.
const POINTS_PER_PAIR = 10;
const MISMATCH_PENALTY = 2;
const MIN_POINTS_PER_PAIR = 2;

// Les cartes (contenu + pairId) ne sont JAMAIS envoyées avant d'être retournées :
// le pairId révélerait toutes les paires d'un seul coup.
const HIDDEN_PUBLIC_FIELDS = "-cards -explanation";

/* =========================
   GENERIC HELPERS
========================= */

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

/* =========================
   SHUFFLE (déterministe)
========================= */

const hashSeed = (seed) => {
    let h = 1779033703 ^ seed.length;

    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }

    return h >>> 0;
};

// Même seed = même ordre. Permet de reconstruire la disposition des cartes
// à chaque requête sans la stocker, et de reprendre une session à l'identique.
const seededShuffle = (items, seed) => {
    let a = hashSeed(seed);

    const rand = () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const result = [...items];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};

// order[position] = index de la carte dans challenge.cards
const getBoardOrder = (challenge, sessionId) =>
    seededShuffle(
        challenge.cards.map((_, index) => index),
        `${sessionId}:${challenge._id}`
    );

/* =========================
   BOARD STATE
   (stocké dans sessionAnswer.userAnswer, champ Mixed)
========================= */

const createInitialState = () => ({
    matchedPositions: [],
    flippedPosition: null,
    moves: 0,
    mismatches: 0,
    firstFlipAt: null,
    completed: false,
});

const getBoardState = (sessionAnswer) => {
    const stored = sessionAnswer.userAnswer;

    return stored && typeof stored === "object"
        ? { ...createInitialState(), ...stored }
        : createInitialState();
};

const computeBoardPoints = (pairCount, mismatches) =>
    Math.max(
        pairCount * MIN_POINTS_PER_PAIR,
        pairCount * POINTS_PER_PAIR - mismatches * MISMATCH_PENALTY
    );

/* =========================
   SAFE SERIALIZERS
========================= */

// Une carte révélée. Le pairId n'est inclus que si la paire est trouvée.
const getSafeCard = (card, { includePairId = false } = {}) => ({
    contentType: card.contentType,
    text: card.text,
    image: card.image?.url ? { url: card.image.url } : null,
    ...(includePairId ? { pairId: card.pairId } : {}),
});

// Plateau envoyé au joueur : uniquement le nombre de cartes et l'état courant.
// En cas de reprise, on renvoie le contenu des cartes déjà trouvées / retournées.
const getSafeChallenge = (challenge, state, sessionId) => {
    const order = getBoardOrder(challenge, sessionId);

    const matched = state.matchedPositions.map((position) => ({
        position,
        card: getSafeCard(challenge.cards[order[position]], {
            includePairId: true,
        }),
    }));

    const flipped =
        state.flippedPosition !== null
            ? {
                  position: state.flippedPosition,
                  card: getSafeCard(challenge.cards[order[state.flippedPosition]]),
              }
            : null;

    return {
        _id: challenge._id,
        title: challenge.title,
        pairType: challenge.pairType,
        difficulty: challenge.difficulty,
        cardCount: challenge.cards.length,
        board: {
            matched,
            flipped,
            moves: state.moves,
            mismatches: state.mismatches,
            completed: state.completed,
        },
    };
};

// Format compatible avec le composant GameResults partagé :
// userAnswer / correctAnswer sont des chaînes (jamais d'objets).
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
    answers: session.answers.map((answer) => {
        const state = getBoardState(answer);
        const revealed = session.status !== "in_progress" || state.completed;

        return {
            challenge: answer.challenge,
            challengeType: answer.challengeType,
            userAnswer: state.completed ? `${state.moves} moves` : "",
            completed: state.completed,
            moves: state.moves,
            mismatches: state.mismatches,
            matchedPairs: Math.floor(state.matchedPositions.length / 2),
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            hintsUsed: 0,
            timeSpent: answer.timeSpent,
            answeredAt: state.completed ? answer.answeredAt : undefined,
            correctAnswer: revealed ? answer.correctAnswer : undefined,
        };
    }),
});

/* =========================
   PUBLIC — CHALLENGES
========================= */

// GET /api/v1/history-memory-challenges
export const getMemoryChallenges = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, difficulty, pairType } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(50, Math.max(1, Number(limit) || 10));

        const filter = { status: "published" };

        if (DIFFICULTIES.includes(difficulty)) {
            filter.difficulty = difficulty;
        }

        if (PAIR_TYPES.includes(pairType)) {
            filter.pairType = pairType;
        }

        const [challenges, total] = await Promise.all([
            MemoryChallenge.find(filter)
                .select(HIDDEN_PUBLIC_FIELDS)
                .sort({ createdAt: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .lean(),
            MemoryChallenge.countDocuments(filter),
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

// GET /api/v1/history-memory-challenges/:id
export const getMemoryChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return fail(res, 400, "Invalid memory challenge ID.");
        }

        const challenge = await MemoryChallenge.findOne({
            _id: id,
            status: "published",
        }).select(HIDDEN_PUBLIC_FIELDS);

        if (!challenge) {
            return fail(res, 404, "Memory challenge not found.");
        }

        return res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — START
========================= */

// POST /api/v1/history-memory-challenges/start
// questionCount = nombre de plateaux à jouer.
export const startMemoryChallengeGame = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        const { gameId, difficulty, pairType, questionCount = 3 } = req.body;

        if (!gameId || !isValidId(gameId)) {
            return fail(res, 400, "A valid gameId is required.");
        }

        if (difficulty && !DIFFICULTIES.includes(difficulty)) {
            return fail(res, 400, "difficulty must be Easy, Medium or Hard.");
        }

        if (pairType && !PAIR_TYPES.includes(pairType)) {
            return fail(res, 400, "Invalid pairType.");
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
            return fail(res, 404, "History Memory game not found.");
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

            const foundChallenges = await MemoryChallenge.find({
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
                    const challenge = byId.get(answer.challenge.toString());

                    return challenge
                        ? getSafeChallenge(
                              challenge,
                              getBoardState(answer),
                              existingSession._id
                          )
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

        if (pairType) {
            challengeFilter.pairType = pairType;
        }

        const availableCount =
            await MemoryChallenge.countDocuments(challengeFilter);

        if (availableCount === 0) {
            return fail(res, 404, "No published memory challenges are available.");
        }

        // Ne jamais demander plus de plateaux qu'il n'en existe.
        const sampleSize = Math.min(count, availableCount);

        const availableChallenges = await MemoryChallenge.aggregate([
            { $match: challengeFilter },
            { $sample: { size: sampleSize } },
        ]);

        const answers = availableChallenges.map((challenge) => ({
            challenge: challenge._id,
            challengeType: CHALLENGE_TYPE,
            userAnswer: createInitialState(),
            // Le titre sert de "bonne réponse" affichée dans le récapitulatif ;
            // il n'est exposé qu'une fois le plateau terminé ou la session close.
            correctAnswer: challenge.title,
            isCorrect: false,
            pointsEarned: 0,
            hintsUsed: 0,
            timeSpent: 0,
        }));

        // Score maximum = tous les plateaux terminés sans aucune erreur
        const maxScore = availableChallenges.reduce(
            (total, challenge) =>
                total + (challenge.cards.length / 2) * POINTS_PER_PAIR,
            0
        );

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

        const challenges = availableChallenges.map((challenge) =>
            getSafeChallenge(challenge, createInitialState(), session._id)
        );

        return res.status(201).json({
            success: true,
            message: "History Memory game started successfully.",
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
   GAMEPLAY — FLIP A CARD
========================= */

// POST /api/v1/history-memory-challenges/sessions/:sessionId/flip
// body: { challengeId, position }
//
// Le serveur garde l'état du plateau : premier appel = première carte retournée,
// deuxième appel = seconde carte, et la paire est validée côté serveur.
export const flipMemoryCard = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;
        const { challengeId, position } = req.body;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId) || !isValidId(challengeId)) {
            return fail(res, 400, "Invalid session or challenge ID.");
        }

        const cardPosition = Number(position);

        if (!Number.isInteger(cardPosition) || cardPosition < 0) {
            return fail(res, 400, "position must be a non-negative integer.");
        }

        const session = await loadOwnedSession(res, sessionId, userId);
        if (!session) return;

        if (session.gameType !== GAME_TYPE || session.status !== "in_progress") {
            return fail(res, 409, "This game session is not active.");
        }

        const sessionAnswer = session.answers.find(
            (item) => item.challenge.toString() === challengeId
        );

        if (!sessionAnswer) {
            return fail(res, 404, "Challenge not found in this session.");
        }

        const state = getBoardState(sessionAnswer);

        if (state.completed) {
            return fail(res, 409, "This board is already completed.");
        }

        const challenge = await MemoryChallenge.findOne({
            _id: challengeId,
            status: "published",
        }).select("title cards explanation");

        if (!challenge) {
            return fail(res, 404, "Memory challenge not found.");
        }

        if (cardPosition >= challenge.cards.length) {
            return fail(res, 400, "position is out of range.");
        }

        if (state.matchedPositions.includes(cardPosition)) {
            return fail(res, 409, "This card is already matched.");
        }

        if (state.flippedPosition === cardPosition) {
            return fail(res, 409, "This card is already flipped.");
        }

        const order = getBoardOrder(challenge, session._id);
        const card = challenge.cards[order[cardPosition]];

        /* ----- Première carte ----- */

        if (state.flippedPosition === null) {
            sessionAnswer.userAnswer = {
                ...state,
                flippedPosition: cardPosition,
                firstFlipAt: state.firstFlipAt ?? Date.now(),
            };

            await session.save();

            return res.status(200).json({
                success: true,
                data: {
                    challengeId,
                    phase: "first",
                    flipped: [{ position: cardPosition, card: getSafeCard(card) }],
                    isMatch: null,
                    matchedPositions: state.matchedPositions,
                    moves: state.moves,
                    mismatches: state.mismatches,
                    completed: false,
                    score: session.score,
                    maxScore: session.maxScore,
                },
            });
        }

        /* ----- Seconde carte : on valide la paire ----- */

        const firstPosition = state.flippedPosition;
        const firstCard = challenge.cards[order[firstPosition]];

        const isMatch = firstCard.pairId === card.pairId;

        const nextState = {
            ...state,
            flippedPosition: null,
            moves: state.moves + 1,
            mismatches: state.mismatches + (isMatch ? 0 : 1),
            matchedPositions: isMatch
                ? [...state.matchedPositions, firstPosition, cardPosition]
                : state.matchedPositions,
        };

        const completed =
            nextState.matchedPositions.length === challenge.cards.length;

        let pointsEarned = 0;

        if (completed) {
            const pairCount = challenge.cards.length / 2;
            pointsEarned = computeBoardPoints(pairCount, nextState.mismatches);

            nextState.completed = true;

            sessionAnswer.isCorrect = true;
            sessionAnswer.pointsEarned = pointsEarned;
            sessionAnswer.correctAnswer = challenge.title;
            sessionAnswer.timeSpent = Math.max(
                0,
                Math.round(
                    (Date.now() - (state.firstFlipAt ?? Date.now())) / 1000
                )
            );
            sessionAnswer.answeredAt = new Date();
        }

        sessionAnswer.userAnswer = nextState;

        session.score = session.answers.reduce(
            (total, item) => total + (item.pointsEarned ?? 0),
            0
        );
        session.correctAnswers = session.answers.filter(
            (item) => item.isCorrect
        ).length;

        await session.save();

        return res.status(200).json({
            success: true,
            data: {
                challengeId,
                phase: "second",
                flipped: [
                    {
                        position: firstPosition,
                        card: getSafeCard(firstCard, { includePairId: isMatch }),
                    },
                    {
                        position: cardPosition,
                        card: getSafeCard(card, { includePairId: isMatch }),
                    },
                ],
                isMatch,
                matchedPositions: nextState.matchedPositions,
                moves: nextState.moves,
                mismatches: nextState.mismatches,
                completed,
                pointsEarned,
                score: session.score,
                maxScore: session.maxScore,
                ...(completed
                    ? {
                          correctAnswer: challenge.title,
                          explanation: challenge.explanation,
                      }
                    : {}),
            },
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — SUBMIT
========================= */

// POST /api/v1/history-memory-challenges/sessions/:sessionId/submit
export const submitMemoryChallengeGame = async (req, res, next) => {
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

        if (session.gameType !== GAME_TYPE) {
            return fail(res, 400, "This is not a memory game session.");
        }

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

        session.correctAnswers = session.answers.filter(
            (item) => item.isCorrect
        ).length;
        // Un plateau non terminé compte comme raté.
        session.incorrectAnswers = session.answers.filter(
            (item) => !item.isCorrect
        ).length;

        session.status = "completed";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "History Memory game completed successfully.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — ABANDON
========================= */

// POST /api/v1/history-memory-challenges/sessions/:sessionId/abandon
export const abandonMemoryChallengeGame = async (req, res, next) => {
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

        if (session.gameType !== GAME_TYPE || session.status !== "in_progress") {
            return fail(res, 409, "This game session is not active.");
        }

        session.status = "abandoned";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "History Memory game session abandoned.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   HISTORY
========================= */

// GET /api/v1/history-memory-challenges/sessions/me
export const getMyMemoryChallengeSessions = async (req, res, next) => {
    try {
        const userId = getUserId(req);

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const filter = { user: userId, gameType: GAME_TYPE };

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

// GET /api/v1/history-memory-challenges/sessions/:sessionId
export const getMemoryChallengeSession = async (req, res, next) => {
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