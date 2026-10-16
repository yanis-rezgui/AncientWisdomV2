


import User from "../models/user.model.js";
import Figure from "../models/historicalFigure.model.js";
import HistoricalEra from "../models/historicalEra.model.js";
import Event from "../models/event.model.js";
import Quote from "../models/quote.model.js";
import Article from "../models/Learn/article.model.js";
import Book from "../models/Learn/book.model.js";
import Movie from "../models/Learn/movie.model.js";
import Frame from "../models/Learn/frame.model.js";
import Tips from "../models/Learn/tips.model.js";
import Settings from "../models/settings.model.js";

import Notification from "../models/notification.model.js";
import SavedItem from "../models/savedItem.model.js";

import Quiz from "../models/quiz.model.js";
import QuizQuestion from "../models/quizQuestion.model.js";
import QuizAttempt from "../models/quizAttempt.js";

import Game from "../models/Games/game.model.js";
import GameSession from "../models/Games/gameSession.model.js";

import FigureChallenge from "../models/Games/figureChallenge.model.js";
import LandmarkChallenge from "../models/Games/landmarkChallenge.model.js";
import LocationChallenge from "../models/Games/locationChallenge.model.js";
import MemoryChallenge from "../models/Games/memoryChallenge.model.js";
import WordChallenge from "../models/Games/wordChallenge.model.js";
// ============================================================
// HELPERS
// ============================================================

const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const getMonthStart = (date) =>
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const safePercentage = (numerator, denominator) =>
    denominator > 0
        ? Math.round((numerator / denominator) * 10000) / 100
        : 0;

const getStatusCounts = async (Model, statuses) => {
    const results = await Promise.all(
        statuses.map(async (status) => ({
            status,
            count: await Model.countDocuments({ status }),
        }))
    );

    return Object.fromEntries(
        results.map(({ status, count }) => [status, count])
    );
};

const getMonthlyUserRegistrations = async (months = 12) => {
    const now = new Date();

    const startDate = getMonthStart(
        new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - months + 1,
            1
        ))
    );

    const results = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m",
                        date: "$createdAt",
                        timezone: "UTC",
                    },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const countsByMonth = new Map(
        results.map((item) => [item._id, item.count])
    );

    return Array.from({ length: months }, (_, index) => {
        const date = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth() - months + 1 + index,
            1
        ));

        const month = date.toISOString().slice(0, 7);

        return {
            month,
            count: countsByMonth.get(month) ?? 0,
        };
    });
};

const getRecentContent = async () => {
    const sources = [
        { Model: Figure, type: "figure" },
        { Model: HistoricalEra, type: "era" },
        { Model: Event, type: "event" },
        { Model: Quote, type: "quote" },
        { Model: Article, type: "article" },
        { Model: Book, type: "book" },
        { Model: Movie, type: "movie" },
        { Model: Frame, type: "frame" },
        { Model: Quiz, type: "quiz" },
        { Model: QuizQuestion, type: "quizQuestion" },
        { Model: Game, type: "game" },
        { Model: FigureChallenge, type: "figureChallenge" },
        { Model: LandmarkChallenge, type: "landmarkChallenge" },
        { Model: LocationChallenge, type: "locationChallenge" },
        { Model: MemoryChallenge, type: "memoryChallenge" },
        { Model: WordChallenge, type: "wordChallenge" },
    ];

    const groups = await Promise.all(
        sources.map(async ({ Model, type }) => {
            const documents = await Model.find()
                .sort({ createdAt: -1 })
                .limit(3)
                .select("name title text questionText createdAt status")
                .lean();

            return documents.map((document) => ({
                id: document._id,
                type,
                title:
                    document.title ??
                    document.name ??
                    document.text ??
                    document.questionText ??
                    "Untitled",
                status: document.status ?? null,
                createdAt: document.createdAt,
            }));
        })
    );

    return groups
        .flat()
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 10);
};

// ============================================================
// MAIN DASHBOARD
// ============================================================

export const getAdminDashboard = async (req, res) => {
    try {
        const now = new Date();
        const last7Days = getDateDaysAgo(7);
        const last30Days = getDateDaysAgo(30);
        const last90Days = getDateDaysAgo(90);

        // ----------------------------------------------------
        // 1. COMMUNITY
        // ----------------------------------------------------

        const [
            totalUsers,
            totalAdmins,
            newUsersLast7Days,
            newUsersLast30Days,
            monthlyRegistrations,
            recentUsers,
            quizActiveUserIds,
            gameActiveUserIds,
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({ role: "ADMIN" }),

            User.countDocuments({
                createdAt: { $gte: last7Days },
            }),

            User.countDocuments({
                createdAt: { $gte: last30Days },
            }),

            getMonthlyUserRegistrations(12),

            User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("firstName lastName email role createdAt")
                .lean(),

            QuizAttempt.distinct("user", {
                startedAt: { $gte: last30Days },
            }),

            GameSession.distinct("user", {
                startedAt: { $gte: last30Days },
            }),
        ]);

        const activeLearnerIds = new Set([
            ...quizActiveUserIds.map(String),
            ...gameActiveUserIds.map(String),
        ]);

        // ----------------------------------------------------
        // 2. HISTORICAL CONTENT
        // ----------------------------------------------------

        const [
            figures,
            eras,
            events,
            quotes,
            articles,
            books,
            movies,
            frames,
            tips,
            settings,
            recentFigures,
            recentEvents,
        ] = await Promise.all([
            Figure.countDocuments(),
            HistoricalEra.countDocuments(),
            Event.countDocuments(),
            Quote.countDocuments(),
            Article.countDocuments(),
            Book.countDocuments(),
            Movie.countDocuments(),
            Frame.countDocuments(),
            Tips.countDocuments(),
            Settings.countDocuments(),

            Figure.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name createdAt")
                .lean(),

            Event.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name startDate location createdAt")
                .lean(),
        ]);

        const totalHistoricalContent =
            figures +
            eras +
            events +
            quotes +
            articles +
            books +
            movies +
            frames +
            tips;

        // Frames are split by their actual schema type:
        // Monument, Statue or Map.
        const framesByType = await Frame.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        // ----------------------------------------------------
        // 3. QUIZZES & QUESTIONS
        // ----------------------------------------------------

        const [
            totalQuizzes,
            quizzesByStatus,
            quizzesByDifficulty,
            totalQuestions,
            questionsByStatus,
            questionsByDifficulty,
            quizAttemptsByStatus,
            quizAttemptStats,
            quizAttemptsLast30Days,
        ] = await Promise.all([
            Quiz.countDocuments(),

            getStatusCounts(Quiz, [
                "draft",
                "published",
                "archived",
            ]),

            Quiz.aggregate([
                {
                    $group: {
                        _id: "$difficulty",
                        count: { $sum: 1 },
                    },
                },
            ]),

            QuizQuestion.countDocuments(),

            getStatusCounts(QuizQuestion, [
                "draft",
                "published",
                "archived",
            ]),

            QuizQuestion.aggregate([
                {
                    $group: {
                        _id: "$difficulty",
                        count: { $sum: 1 },
                    },
                },
            ]),

            getStatusCounts(QuizAttempt, [
                "in_progress",
                "completed",
                "abandoned",
            ]),

            QuizAttempt.aggregate([
                {
                    $match: {
                        status: "completed",
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        averagePercentage: {
                            $avg: "$percentage",
                        },
                        averageDurationSeconds: {
                            $avg: "$durationSeconds",
                        },
                        averageScore: {
                            $avg: "$score",
                        },
                        averageMaxScore: {
                            $avg: "$maxScore",
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        averagePercentage: {
                            $round: ["$averagePercentage", 2],
                        },
                        averageDurationSeconds: {
                            $round: ["$averageDurationSeconds", 2],
                        },
                        averageScore: {
                            $round: ["$averageScore", 2],
                        },
                        averageMaxScore: {
                            $round: ["$averageMaxScore", 2],
                        },
                    },
                },
            ]),

            QuizAttempt.countDocuments({
                startedAt: { $gte: last30Days },
            }),
        ]);

        const quizStats = quizAttemptStats[0] ?? {
            total: 0,
            averagePercentage: 0,
            averageDurationSeconds: 0,
            averageScore: 0,
            averageMaxScore: 0,
        };

        const quizCompleted = quizAttemptsByStatus.completed ?? 0;
        const quizAbandoned = quizAttemptsByStatus.abandoned ?? 0;
        const quizInProgress = quizAttemptsByStatus.in_progress ?? 0;

        const quizFinishedCount = quizCompleted + quizAbandoned;

        // ----------------------------------------------------
        // 4. GAMES & CHALLENGES
        // ----------------------------------------------------

        const challengeModels = [
            { Model: FigureChallenge, type: "guess-the-figure" },
            { Model: LandmarkChallenge, type: "name-the-landmark" },
            { Model: LocationChallenge, type: "where-in-history" },
            { Model: MemoryChallenge, type: "history-memory" },
            { Model: WordChallenge, type: "word-scramble" },
        ];

        const [
            totalGames,
            gamesByStatus,
            gamesByType,
            challengeCounts,
            challengeStatuses,
            gameSessionsByStatus,
            gameSessionStats,
            gameSessionsLast30Days,
        ] = await Promise.all([
            Game.countDocuments(),

            getStatusCounts(Game, [
                "draft",
                "published",
                "archived",
            ]),

            Game.aggregate([
                {
                    $group: {
                        _id: "$gameType",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),

            Promise.all(
                challengeModels.map(async ({ Model, type }) => ({
                    type,
                    total: await Model.countDocuments(),
                }))
            ),

            Promise.all(
                challengeModels.map(async ({ Model, type }) => ({
                    type,
                    statuses: await getStatusCounts(Model, [
                        "draft",
                        "published",
                        "archived",
                    ]),
                }))
            ),

            getStatusCounts(GameSession, [
                "in_progress",
                "completed",
                "abandoned",
            ]),

            GameSession.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },

                        averageScore: {
                            $avg: "$score",
                        },

                        averageDurationSeconds: {
                            $avg: {
                                $cond: [
                                    { $gt: ["$durationSeconds", 0] },
                                    "$durationSeconds",
                                    "$duration",
                                ],
                            },
                        },

                        correctAnswers: {
                            $sum: "$correctAnswers",
                        },

                        incorrectAnswers: {
                            $sum: "$incorrectAnswers",
                        },

                        totalQuestions: {
                            $sum: "$totalQuestions",
                        },

                        totalPointsEarned: {
                            $sum: "$score",
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        averageScore: {
                            $round: ["$averageScore", 2],
                        },
                        averageDurationSeconds: {
                            $round: ["$averageDurationSeconds", 2],
                        },
                        correctAnswers: 1,
                        incorrectAnswers: 1,
                        totalQuestions: 1,
                        totalPointsEarned: 1,
                    },
                },
            ]),

            GameSession.countDocuments({
                startedAt: { $gte: last30Days },
            }),
        ]);

        const challengeTotal = challengeCounts.reduce(
            (sum, item) => sum + item.total,
            0
        );

        const gameStats = gameSessionStats[0] ?? {
            total: 0,
            averageScore: 0,
            averageDurationSeconds: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            totalQuestions: 0,
            totalPointsEarned: 0,
        };

        const gameCompleted = gameSessionsByStatus.completed ?? 0;
        const gameAbandoned = gameSessionsByStatus.abandoned ?? 0;
        const gameInProgress = gameSessionsByStatus.in_progress ?? 0;

        const gameFinishedCount = gameCompleted + gameAbandoned;

        // ----------------------------------------------------
        // 5. ENGAGEMENT & NOTIFICATIONS
        // ----------------------------------------------------

        const [
            totalFavorites,
            favoritesByType,
            totalNotifications,
            unreadNotifications,
            recentNotifications,
            newFiguresLast30Days,
            newEventsLast30Days,
            newArticlesLast30Days,
        ] = await Promise.all([
            SavedItem.countDocuments(),

            SavedItem.aggregate([
                {
                    $group: {
                        _id: "$itemType",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]),

            Notification.countDocuments(),

            Notification.countDocuments({
                read: false,
            }),

            Notification.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("title message type read createdAt recipient")
                .populate("recipient", "firstName lastName email")
                .lean(),

            Figure.countDocuments({
                createdAt: { $gte: last30Days },
            }),

            Event.countDocuments({
                createdAt: { $gte: last30Days },
            }),

            Article.countDocuments({
                createdAt: { $gte: last30Days },
            }),
        ]);

        // ----------------------------------------------------
        // 6. RECENT CONTENT
        // ----------------------------------------------------

        const recentContent = await getRecentContent();

        // ----------------------------------------------------
        // 7. RESPONSE
        // ----------------------------------------------------

        return res.status(200).json({
            success: true,

            data: {
                overview: {
                    totalUsers,
                    totalAdmins,
                    totalHistoricalContent,
                    totalQuizzes,
                    totalQuestions,
                    totalGames,
                    totalChallenges: challengeTotal,
                    totalQuizAttempts: quizCompleted +
                        quizInProgress +
                        quizAbandoned,
                    totalGameSessions: gameStats.total,
                    totalFavorites,
                    totalNotifications,
                    unreadNotifications,
                },

                community: {
                    totalUsers,
                    totalAdmins,
                    regularUsers: totalUsers - totalAdmins,
                    newUsersLast7Days,
                    newUsersLast30Days,

                    // Unique users who started a quiz or a game
                    // in the last 30 days.
                    activeLearnersLast30Days: activeLearnerIds.size,

                    monthlyRegistrations,
                    recentUsers,
                },

                content: {
                    total: totalHistoricalContent,

                    breakdown: {
                        figures,
                        eras,
                        events,
                        quotes,
                        articles,
                        books,
                        movies,
                        frames,
                        tips,
                    },

                    framesByType,

                    recentCreations: {
                        figures: recentFigures,
                        events: recentEvents,
                    },

                    createdLast30Days: {
                        figures: newFiguresLast30Days,
                        events: newEventsLast30Days,
                        articles: newArticlesLast30Days,
                    },
                },

                quizzes: {
                    total: totalQuizzes,
                    byStatus: quizzesByStatus,
                    byDifficulty: quizzesByDifficulty,

                    questions: {
                        total: totalQuestions,
                        byStatus: questionsByStatus,
                        byDifficulty: questionsByDifficulty,
                    },

                    attempts: {
                        total: quizCompleted +
                            quizInProgress +
                            quizAbandoned,

                        last30Days: quizAttemptsLast30Days,
                        byStatus: quizAttemptsByStatus,

                        completionRate: safePercentage(
                            quizCompleted,
                            quizFinishedCount
                        ),

                        abandonmentRate: safePercentage(
                            quizAbandoned,
                            quizFinishedCount
                        ),

                        averagePercentage: quizStats.averagePercentage,
                        averageScore: quizStats.averageScore,
                        averageMaxScore: quizStats.averageMaxScore,
                        averageDurationSeconds:
                            quizStats.averageDurationSeconds,
                    },
                },

                games: {
                    total: totalGames,
                    byStatus: gamesByStatus,
                    byType: gamesByType,

                    challenges: {
                        total: challengeTotal,
                        byType: challengeCounts,
                        statuses: challengeStatuses,
                    },

                    sessions: {
                        total: gameStats.total,
                        last30Days: gameSessionsLast30Days,
                        byStatus: gameSessionsByStatus,

                        completionRate: safePercentage(
                            gameCompleted,
                            gameFinishedCount
                        ),

                        abandonmentRate: safePercentage(
                            gameAbandoned,
                            gameFinishedCount
                        ),

                        averageScore: gameStats.averageScore,
                        averageDurationSeconds:
                            gameStats.averageDurationSeconds,

                        correctAnswers: gameStats.correctAnswers,
                        incorrectAnswers: gameStats.incorrectAnswers,
                        totalQuestions: gameStats.totalQuestions,
                        totalPointsEarned: gameStats.totalPointsEarned,

                        answerAccuracy: safePercentage(
                            gameStats.correctAnswers,
                            gameStats.correctAnswers +
                                gameStats.incorrectAnswers
                        ),
                    },
                },

                engagement: {
                    totalFavorites,
                    favoritesByType,

                    notifications: {
                        total: totalNotifications,
                        unread: unreadNotifications,
                        recent: recentNotifications,
                    },
                },

                recentContent,
                generatedAt: now,
            },
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard statistics.",
        });
    }
};
