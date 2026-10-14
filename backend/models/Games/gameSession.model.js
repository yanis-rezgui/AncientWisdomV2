import mongoose from "mongoose";

const sessionAnswerSchema = new mongoose.Schema(
    {
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        challengeType: {
            type: String,
            enum: [
                "FigureChallenge",
                "LandmarkChallenge",
                "LocationChallenge",
                "MemoryChallenge",
                "WordChallenge",
            ],
            required: true,
        },

        userAnswer: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },

        isCorrect: {
            type: Boolean,
            default: false,
        },

        pointsEarned: {
            type: Number,
            min: 0,
            default: 0,
        },

        hintsUsed: {
            type: Number,
            min: 0,
            default: 0,
        },

        timeSpent: {
            type: Number,
            min: 0,
            default: 0,
        },

        answeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const gameSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: true,
            index: true,
        },

       status: {
    type: String,
    enum: ["in_progress", "completed", "abandoned"],
    default: "in_progress",
    index: true,
},
gameTitle: { type: String, default: "" },
gameType: { type: String, default: "" },
durationSeconds: { type: Number, min: 0, default: 0 },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        score: {
            type: Number,
            min: 0,
            default: 0,
        },

        maxScore: {
            type: Number,
            min: 0,
            default: 0,
        },

        correctAnswers: {
            type: Number,
            min: 0,
            default: 0,
        },

        incorrectAnswers: {
            type: Number,
            min: 0,
            default: 0,
        },

        totalQuestions: {
            type: Number,
            min: 0,
            default: 0,
        },

        answers: {
            type: [sessionAnswerSchema],
            default: [],
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        duration: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index utile pour consulter l'historique d'un utilisateur.
gameSessionSchema.index({
    user: 1,
    createdAt: -1,
});

// Index utile pour calculer les statistiques d'un jeu.
gameSessionSchema.index({
    game: 1,
    status: 1,
});

const GameSession = mongoose.model(
    "GameSession",
    gameSessionSchema
);

export default GameSession;
