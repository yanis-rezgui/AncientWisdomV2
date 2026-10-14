import mongoose from "mongoose";
import LocationChallenge from "../../models/Games/locationChallenge.model.js";
import Game from "../../models/Games/game.model.js";
import GameSession from "../../models/Games/gameSession.model.js";

/* =========================
   CONSTANTS
========================= */

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const GAME_TYPE = "where-in-history";
const CHALLENGE_TYPE = "LocationChallenge";

// Champs qui trahissent la réponse : jamais envoyés avant que le joueur ait répondu.
// (coordinates donnerait directement la position, title/slug nomment souvent le lieu)
const HIDDEN_PUBLIC_FIELDS =
    "-answer -coordinates -hint -explanation -title -slug";

// Précision attendue selon la difficulté :
// - perfectKm : en dessous, 100 % des points
// - maxKm     : au-dessus, 0 point
// Entre les deux, la précision décroît progressivement (courbe quadratique).
const SCORING = {
    Easy: { perfectKm: 50, maxKm: 2000 },
    Medium: { perfectKm: 25, maxKm: 1000 },
    Hard: { perfectKm: 10, maxKm: 500 },
};

// Un indice divise les points par deux.
const HINT_MULTIPLIER = 0.5;

// Une réponse est considérée "correcte" (✓ dans le récapitulatif)
// à partir de 50 % de précision ; les points restent proportionnels.
const CORRECT_ACCURACY_THRESHOLD = 0.5;

const EARTH_RADIUS_KM = 6371;

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
   GEO & SCORING HELPERS
========================= */

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Distance en km entre deux points (formule de Haversine).
const haversineKm = (lat1, lon1, lat2, lon2) => {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
};

// Leaflet permet de faire défiler la carte au-delà de ±180° : on ramène dans [-180, 180).
const normalizeLongitude = (longitude) =>
    ((((longitude + 180) % 360) + 360) % 360) - 180;

// Retourne un ratio entre 0 et 1.
const computeAccuracy = (distanceKm, difficulty) => {
    const { perfectKm, maxKm } = SCORING[difficulty] ?? SCORING.Easy;

    if (distanceKm <= perfectKm) return 1;
    if (distanceKm >= maxKm) return 0;

    const t = (distanceKm - perfectKm) / (maxKm - perfectKm);

    return (1 - t) ** 2;
};

const roundTo = (value, decimals = 1) => {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
};

/* =========================
   SAFE SERIALIZERS
========================= */

// Ne contient rien qui puisse trahir la réponse : ni coordonnées, ni nom du lieu.
// Le centre de la carte n'est volontairement pas fourni (il serait égal à la réponse) :
// le client doit démarrer sur une vue du monde.
const getSafeChallenge = (challenge, hintsUsed = 0) => ({
    _id: challenge._id,
    question: challenge.question,
    mapZoom: challenge.mapZoom,
    difficulty: challenge.difficulty,
    points: challenge.points,
    hasHint: Boolean(challenge.hint),
    // Le hint n'est renvoyé que s'il a déjà été révélé (utile à la reprise de session)
    hint: hintsUsed > 0 && challenge.hint ? challenge.hint : null,
});

// userAnswer (Mixed) contient la réponse du joueur ET la bonne position, figées
// au moment de la réponse. userAnswer / correctAnswer restent des chaînes dans la
// sortie pour rester compatibles avec le composant GameResults partagé.
const getGuess = (answer) =>
    answer.userAnswer && typeof answer.userAnswer === "object"
        ? answer.userAnswer
        : null;

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
        const guess = getGuess(answer);

        return {
            challenge: answer.challenge,
            challengeType: answer.challengeType,
            answered: Boolean(guess),
            userAnswer: guess ? `${guess.distanceKm} km away` : "",
            guess: guess
                ? { latitude: guess.latitude, longitude: guess.longitude }
                : null,
            // La bonne position n'est révélée qu'une fois la question répondue
            correctLocation: guess
                ? {
                      latitude: guess.correctLatitude,
                      longitude: guess.correctLongitude,
                  }
                : null,
            distanceKm: guess ? guess.distanceKm : null,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            hintsUsed: answer.hintsUsed,
            timeSpent: answer.timeSpent,
            answeredAt: guess ? answer.answeredAt : undefined,
            correctAnswer:
                session.status !== "in_progress" || guess
                    ? answer.correctAnswer
                    : undefined,
        };
    }),
});

/* =========================
   PUBLIC — CHALLENGES
========================= */

// GET /api/v1/where-in-history
// Pas de recherche textuelle : title / answer permettraient de deviner le lieu.
export const getLocationChallenges = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, difficulty } = req.query;

        const currentPage = Math.max(1, Number(page) || 1);
        const perPage = Math.min(50, Math.max(1, Number(limit) || 10));

        const filter = { status: "published" };

        if (DIFFICULTIES.includes(difficulty)) {
            filter.difficulty = difficulty;
        }

        const [challenges, total] = await Promise.all([
            LocationChallenge.find(filter)
                .select(HIDDEN_PUBLIC_FIELDS)
                .sort({ createdAt: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .lean(),
            LocationChallenge.countDocuments(filter),
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

// GET /api/v1/where-in-history/:id
export const getLocationChallenge = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return fail(res, 400, "Invalid location challenge ID.");
        }

        const challenge = await LocationChallenge.findOne({
            _id: id,
            status: "published",
        }).select(HIDDEN_PUBLIC_FIELDS);

        if (!challenge) {
            return fail(res, 404, "Location challenge not found.");
        }

        return res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — START
========================= */

// POST /api/v1/where-in-history/start
export const startLocationChallengeGame = async (req, res, next) => {
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
            gameType: GAME_TYPE,
            status: "published",
        });

        if (!game) {
            return fail(res, 404, "Where in History game not found.");
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

            const foundChallenges = await LocationChallenge.find({
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
            await LocationChallenge.countDocuments(challengeFilter);

        if (availableCount === 0) {
            return fail(
                res,
                404,
                "No published location challenges are available."
            );
        }

        // Ne jamais demander plus de questions qu'il n'en existe.
        const sampleSize = Math.min(count, availableCount);

        const availableChallenges = await LocationChallenge.aggregate([
            { $match: challengeFilter },
            { $sample: { size: sampleSize } },
        ]);

        const answers = availableChallenges.map((challenge) => ({
            challenge: challenge._id,
            challengeType: CHALLENGE_TYPE,
            // null = pas encore répondu (rempli à la réponse avec la position choisie)
            userAnswer: null,
            correctAnswer: challenge.answer,
            isCorrect: false,
            pointsEarned: 0,
            hintsUsed: 0,
            timeSpent: 0,
        }));

        // Score maximum = somme des points de chaque défi
        const maxScore = availableChallenges.reduce(
            (total, challenge) => total + (challenge.points ?? 0),
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

        // Ne pas passer getSafeChallenge directement à .map() :
        // l'index serait interprété comme hintsUsed.
        const challenges = availableChallenges.map((challenge) =>
            getSafeChallenge(challenge)
        );

        return res.status(201).json({
            success: true,
            message: "Where in History game started successfully.",
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

// POST /api/v1/where-in-history/sessions/:sessionId/hint
export const revealLocationHint = async (req, res, next) => {
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

        if (session.gameType !== GAME_TYPE || session.status !== "in_progress") {
            return fail(res, 409, "This game session is not active.");
        }

        const sessionAnswer = session.answers.find(
            (answer) => answer.challenge.toString() === challengeId
        );

        if (!sessionAnswer) {
            return fail(res, 404, "Challenge not found in this session.");
        }

        if (getGuess(sessionAnswer)) {
            return fail(res, 409, "You have already answered this challenge.");
        }

        const challenge = await LocationChallenge.findOne({
            _id: challengeId,
            status: "published",
        }).select("hint");

        if (!challenge) {
            return fail(res, 404, "Location challenge not found.");
        }

        if (!challenge.hint) {
            return fail(res, 404, "No hint is available for this challenge.");
        }

        // Idempotent : redemander le hint ne coûte pas plus cher.
        if (sessionAnswer.hintsUsed < 1) {
            sessionAnswer.hintsUsed = 1;
            await session.save();
        }

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

// POST /api/v1/where-in-history/sessions/:sessionId/answer
// body: { challengeId, latitude, longitude, timeSpent? }
// La distance et le score sont calculés uniquement côté serveur.
export const submitLocationAnswer = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { sessionId } = req.params;
        const { challengeId, latitude, longitude, timeSpent = 0 } = req.body;

        if (!userId) {
            return fail(res, 401, "Authentication required.");
        }

        if (!isValidId(sessionId) || !isValidId(challengeId)) {
            return fail(res, 400, "Invalid session or challenge ID.");
        }

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return fail(res, 400, "latitude and longitude must be numbers.");
        }

        if (latitude < -90 || latitude > 90) {
            return fail(res, 400, "latitude must be between -90 and 90.");
        }

        const guessLatitude = latitude;
        const guessLongitude = normalizeLongitude(longitude);

        const parsedTimeSpent = Number(timeSpent);

        if (!Number.isFinite(parsedTimeSpent) || parsedTimeSpent < 0) {
            return fail(res, 400, "timeSpent must be a non-negative number.");
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

        if (getGuess(sessionAnswer)) {
            return fail(res, 409, "You have already answered this challenge.");
        }

        const challenge = await LocationChallenge.findOne({
            _id: challengeId,
            status: "published",
        }).select("answer coordinates explanation difficulty points");

        if (!challenge) {
            return fail(res, 404, "Location challenge not found.");
        }

        const { latitude: correctLatitude, longitude: correctLongitude } =
            challenge.coordinates;

        const distanceKm = roundTo(
            haversineKm(
                guessLatitude,
                guessLongitude,
                correctLatitude,
                correctLongitude
            ),
            1
        );

        const accuracy = computeAccuracy(distanceKm, challenge.difficulty);
        const hintUsed = sessionAnswer.hintsUsed > 0;

        const pointsEarned = Math.round(
            challenge.points * accuracy * (hintUsed ? HINT_MULTIPLIER : 1)
        );

        const isCorrect = accuracy >= CORRECT_ACCURACY_THRESHOLD;

        // Position du joueur + bonne position figées dans la session
        sessionAnswer.userAnswer = {
            latitude: guessLatitude,
            longitude: guessLongitude,
            distanceKm,
            correctLatitude,
            correctLongitude,
        };
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
            (item) => getGuess(item) && !item.isCorrect
        ).length;

        await session.save();

        return res.status(200).json({
            success: true,
            data: {
                challengeId,
                userLocation: {
                    latitude: guessLatitude,
                    longitude: guessLongitude,
                },
                correctLocation: {
                    latitude: correctLatitude,
                    longitude: correctLongitude,
                },
                correctAnswer: challenge.answer,
                distanceKm,
                accuracy: Math.round(accuracy * 100),
                isCorrect,
                pointsEarned,
                maxPoints: challenge.points,
                hintUsed,
                score: session.score,
                maxScore: session.maxScore,
                explanation: challenge.explanation,
            },
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — SUBMIT
========================= */

// POST /api/v1/where-in-history/sessions/:sessionId/submit
export const submitLocationChallengeGame = async (req, res, next) => {
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
            return fail(res, 400, "This is not a location game session.");
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

        session.status = "completed";
        session.completedAt = new Date();
        session.durationSeconds = getSessionDuration(session);

        await session.save();

        return res.status(200).json({
            success: true,
            message: "Where in History game completed successfully.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   GAMEPLAY — ABANDON
========================= */

// POST /api/v1/where-in-history/sessions/:sessionId/abandon
export const abandonLocationChallengeGame = async (req, res, next) => {
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
            message: "Where in History game session abandoned.",
            data: getSafeSession(session),
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   HISTORY
========================= */

// GET /api/v1/where-in-history/sessions/me
export const getMyLocationChallengeSessions = async (req, res, next) => {
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

// GET /api/v1/where-in-history/sessions/:sessionId
export const getLocationChallengeSession = async (req, res, next) => {
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