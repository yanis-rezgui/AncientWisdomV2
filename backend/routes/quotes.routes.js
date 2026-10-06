import { Router } from "express";
import { getQuote, getQuotes } from "../controllers/quotes.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { addQuote, deleteQuote, updateQuote } from "../controllers/quotes.admin.controller.js";


const quotesRouter = new Router();

quotesRouter.get('/', getQuotes);

quotesRouter.get('/:id', getQuote);

quotesRouter.post('/', authorize, addQuote);

quotesRouter.put('/:id', authorize, updateQuote);

quotesRouter.delete('/:id', authorize, deleteQuote);

export default quotesRouter;