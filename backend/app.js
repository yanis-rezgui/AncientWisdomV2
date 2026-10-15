import express from "express"
import helmet from "helmet"
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import cors from "cors"
import quotesRouter from "./routes/quotes.routes.js";
import eraRouter from "./routes/era.routes.js";
import figuresRouter from "./routes/figures.routes.js";
import eventRouter from "./routes/event.routes.js";
import authRouter from "./routes/auth.routes.js";
import savedItemsRouter from "./routes/savedItems.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import quizAttemptRouter from "./routes/quizAttempt.routes.js";
import quizAdminRouter from "./routes/quiz.admin.routes.js";
import quizQuestionAdminRouter from "./routes/quizQuestion.admin.routes.js";
import tipsRouter from "./routes/tips.routes.js";
import bookRouter from "./routes/book.routes.js";
import frameRouter from "./routes/frame.routes.js";
import movieRouter from "./routes/movie.routes.js";
import articleRouter from "./routes/article.routes.js";
import usersRouter from "./routes/users.routes.js";
import figureChallengesRouter from "./routes/Games/figureChallenges.routes.js";
import gamesRouter from "./routes/Games/games.routes.js";

import landmarkChallengesRouter from "./routes/Games/landmarkChallenge.routes.js";
import wordChallengesRouter from "./routes/Games/wordChallenge.routes.js";
import memoryChallengesRouter from "./routes/Games/memoryChallenge.routes.js";
import locationChallengesRouter from "./routes/Games/locationChallenge.routes.js";
import figureChallengeAdminRoutes from "./routes/AdminGames/figureChallenge.admin.routes.js"
import landmarkChallengeAdminRoutes from "./routes/AdminGames/landmarkChallenge.admin.routes.js"
import locationChallengeAdminRoutes from "./routes/AdminGames/locationChallenge.admin.routes.js"
import memoryChallengeAdminRoutes from "./routes/AdminGames/memoryChallenge.admin.routes.js"
import wordChallengeAdminRoutes from "./routes/AdminGames/wordChallenge.admin.routes.js"
import settingsRouter from "./routes/settings.routes.js";
import seedSettings from "./database/insertData.js";
import {createServer} from "http"
import { initializeSocket } from "./socket/socket.js";
import notificationRouter from "./routes/notification.routes.js";


const app = express();

const server = createServer(app)

initializeSocket(server);

app.use(helmet());

app.use(cors({
    origin : [
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials : true
}));

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use('/api/v1/quotes', quotesRouter);
app.use('/api/v1/era', eraRouter);
app.use('/api/v1/figure', figuresRouter);
app.use('/api/v1/event', eventRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/saved-items', savedItemsRouter);
app.use("/api/v1/quizzes", quizRouter);
app.use("/api/v1/quiz-attempts", quizAttemptRouter);
app.use("/api/v1/admin/quizzes", quizAdminRouter);
app.use("/api/v1/admin/quiz-questions", quizQuestionAdminRouter);
app.use("/api/v1/tips", tipsRouter);
app.use("/api/v1/books", bookRouter);
app.use('/api/v1/frames', frameRouter);
app.use("/api/v1/movies", movieRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/users', usersRouter);
app.use("/api/v1/figure-challenges", figureChallengesRouter);
app.use('/api/v1/games', gamesRouter);
app.use(
    "/api/v1/landmark-challenges",
    landmarkChallengesRouter
);

app.use("/api/v1/settings", settingsRouter);

app.use('/api/v1/word-scramble', wordChallengesRouter);

app.use("/api/v1/history-memory", memoryChallengesRouter)
app.use("/api/v1/where-in-history", locationChallengesRouter)
app.use("/api/v1/admin/figure-challenges", figureChallengeAdminRoutes);
app.use("/api/v1/admin/landmark-challenges", landmarkChallengeAdminRoutes);
app.use("/api/v1/admin/location-challenges", locationChallengeAdminRoutes);
app.use("/api/v1/admin/memory-challenges", memoryChallengeAdminRoutes);
app.use("/api/v1/admin/word-challenges", wordChallengeAdminRoutes);

app.use("/api/v1/notifications", notificationRouter);

app.use(errorMiddleware);

const startServer = async() => {

    try{

        console.log("Trying connecting to database : ");
        await connectToDatabase();
        //await seedSettings();
        server.listen(PORT, ()=>{
            console.log(`App running on : http://localhost:${PORT}`);
        });
    }catch(err){
        console.error(err);
    }
}

startServer();