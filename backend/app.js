import express from "express"
import helmet from "helmet"
import errorMiddleware from "./middlewares/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import cors from "cors"
import seedDatabase from "./database/insertData.js";
import quotesRouter from "./routes/quotes.routes.js";
import eraRouter from "./routes/era.routes.js";
import figuresRouter from "./routes/figures.routes.js";
import eventRouter from "./routes/event.routes.js";


const app = express();

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

app.use(errorMiddleware);

const startServer = async() => {

    try{

        console.log("Trying connecting to database : ");
        await connectToDatabase();
        //await seedDatabase();
        app.listen(PORT, ()=>{
            console.log(`App running on : http://localhost:${PORT}`);
        });
    }catch(err){
        console.error(err);
    }
}

startServer();