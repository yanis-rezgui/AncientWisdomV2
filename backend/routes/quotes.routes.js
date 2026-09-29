import { Router } from "express";
import { getQuote, getQuotes } from "../controllers/quotes.controller.js";


const quotesRouter = new Router();

quotesRouter.get('/', getQuotes);

quotesRouter.get('/:id', getQuote);

export default quotesRouter;