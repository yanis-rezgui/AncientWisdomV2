import mongoose from "mongoose";

import User from "../models/user.model.js";
import SavedItem from "../models/savedItem.model.js";
import QuizAttempt from "../models/quizAttempt.js";
import GameSession from "../models/Games/gameSession.model.js";

// ============================================================
// HELPERS
// ============================================================

const safePercentage = (numerator, denominator) =>
    denominator > 0
        ? Math.round((numerator / denominator) * 10000) / 100
        : 0;

const round = (value, digits = 2) =>
    Math.round((value ?? 0) * 10 ** digits) / 10 ** digits;

const toStatusMap = (rows) =>
    Object.fromEntries(rows.map((row) => [row._id, row.count]));

const countByStatus = (Model, user) =>
    Model.aggregate([
        { $match: { user } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

const gameTitle = (game) => game?.title ?? game?.name ?? "Game";

// ============================================================
// GET MY PROFILE STATS
// GET /api/v1/users/me/stats   (route protégée)
// ============================================================

export const getMyProfileStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id ?? req.user.id);

        const [
            user,
            quizStatusRows,
            gameStatusRows,
            quizAggregate,
            gameAggregate,
            totalFavorites,
            favoritesByType,
            bestQuizzes,
            bestGames,
            recentQuizzes,
            recentGames,
        ] = await Promise.all([
            User.findById(userId)
                .select("firstName lastName email role createdAt")
                .lean(),

            countByStatus(QuizAttempt, userId),
            countByStatus(GameSession, userId),

            // Quiz terminés : moyenne, meilleur score, temps total
            QuizAttempt.aggregate([
                { $match: { user: userId, status: "completed" } },
                {
                    $group: {
                        _id: null,
                        completed: { $sum: 1 },
                        averagePercentage: { $avg: "$percentage" },
                        bestPercentage: { $max: "$percentage" },
                        totalTimeSeconds: { $sum: "$durationSeconds" },
                    },
                },
            ]),

            // Parties terminées : score, précision, points
            GameSession.aggregate([
                { $match: { user: userId, status: "completed" } },
                {
                    $group: {
                        _id: null,
                        played: { $sum: 1 },
                        averageScore: { $avg: "$score" },
                        bestScore: { $max: "$score" },
                        totalPoints: { $sum: "$score" },
                        correctAnswers: { $sum: "$correctAnswers" },
                        incorrectAnswers: { $sum: "$incorrectAnswers" },
                    },
                },
            ]),

            SavedItem.countDocuments({ user: userId }),

            SavedItem.aggregate([
                { $match: { user: userId } },
                { $group: { _id: "$itemType", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),

            // Meilleurs scores quiz
            QuizAttempt.find({ user: userId, status: "completed" })
                .sort({ percentage: -1, score: -1 })
                .limit(5)
                .select("quizTitle score maxScore percentage completedAt")
                .lean(),

            // Meilleurs scores jeux
            GameSession.find({ user: userId, status: "completed" })
                .sort({ score: -1 })
                .limit(5)
                .select("game score correctAnswers incorrectAnswers totalQuestions completedAt")
                .populate({ path: "game", select: "title name gameType", strictPopulate: false })
                .lean(),

            // Dernières activités
            QuizAttempt.find({ user: userId })
                .sort({ startedAt: -1 })
                .limit(5)
                .select("quizTitle status percentage score maxScore startedAt completedAt")
                .lean(),

            GameSession.find({ user: userId })
                .sort({ startedAt: -1 })
                .limit(5)
                .select("game status score correctAnswers incorrectAnswers startedAt completedAt")
                .populate({ path: "game", select: "title name gameType", strictPopulate: false })
                .lean(),
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const quizStatus = toStatusMap(quizStatusRows);
        const gameStatus = toStatusMap(gameStatusRows);

        const quizStats = quizAggregate[0] ?? {};
        const gameStats = gameAggregate[0] ?? {};

        const quizzesCompleted = quizStats.completed ?? 0;
        const gamesPlayed = gameStats.played ?? 0;
        const correct = gameStats.correctAnswers ?? 0;
        const incorrect = gameStats.incorrectAnswers ?? 0;

        // Dernières activités : quiz + jeux fusionnés, triés par date
        const recentActivity = [
            ...recentQuizzes.map((attempt) => ({
                id: attempt._id,
                kind: "quiz",
                title: attempt.quizTitle ?? "Quiz",
                status: attempt.status,
                score: attempt.score,
                maxScore: attempt.maxScore,
                percentage: attempt.percentage,
                date: attempt.completedAt ?? attempt.startedAt,
            })),
            ...recentGames.map((session) => ({
                id: session._id,
                kind: "game",
                title: gameTitle(session.game),
                status: session.status,
                score: session.score,
                maxScore: null,
                percentage: safePercentage(
                    session.correctAnswers ?? 0,
                    (session.correctAnswers ?? 0) + (session.incorrectAnswers ?? 0)
                ),
                date: session.completedAt ?? session.startedAt,
            })),
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8);

        return res.status(200).json({
            success: true,

            data: {
                profile: {
                    ...user,
                    memberSince: user.createdAt,
                },

                // Bloc "statistiques personnelles" en haut du profil
                stats: {
                    quizzesCompleted,
                    gamesPlayed,
                    favorites: totalFavorites,
                },

                // Section "Learning activity"
                learning: {
                    quizzes: {
                        completed: quizzesCompleted,
                        inProgress: quizStatus.in_progress ?? 0,
                        abandoned: quizStatus.abandoned ?? 0,
                        averagePercentage: round(quizStats.averagePercentage),
                        bestPercentage: round(quizStats.bestPercentage),
                        totalTimeSeconds: Math.round(quizStats.totalTimeSeconds ?? 0),
                    },

                    games: {
                        played: gamesPlayed,
                        inProgress: gameStatus.in_progress ?? 0,
                        abandoned: gameStatus.abandoned ?? 0,
                        accuracy: safePercentage(correct, correct + incorrect),
                        averageScore: round(gameStats.averageScore),
                        bestScore: gameStats.bestScore ?? 0,
                        totalPoints: gameStats.totalPoints ?? 0,
                        correctAnswers: correct,
                        incorrectAnswers: incorrect,

                        // Défis réussis = parties terminées
                        challengesCompleted: gamesPlayed,
                    },

                    bestScores: {
                        quizzes: bestQuizzes.map((attempt) => ({
                            id: attempt._id,
                            title: attempt.quizTitle ?? "Quiz",
                            score: attempt.score,
                            maxScore: attempt.maxScore,
                            percentage: attempt.percentage,
                            date: attempt.completedAt,
                        })),

                        games: bestGames.map((session) => ({
                            id: session._id,
                            title: gameTitle(session.game),
                            score: session.score,
                            accuracy: safePercentage(
                                session.correctAnswers ?? 0,
                                (session.correctAnswers ?? 0) + (session.incorrectAnswers ?? 0)
                            ),
                            date: session.completedAt,
                        })),
                    },

                    recentActivity,
                },

                favoritesByType,
            },
        });
    } catch (error) {
        console.error("Profile stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve profile statistics.",
        });
    }
};