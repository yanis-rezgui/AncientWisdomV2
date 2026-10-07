import { Router } from "express";
import { getQuote, getQuotes } from "../controllers/quotes.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { addQuote, deleteQuote, updateQuote } from "../controllers/quotes.admin.controller.js";
import isAdmin from "../middlewares/admin.middleware.js";


const quotesRouter = new Router();

quotesRouter.get('/', getQuotes);

quotesRouter.get('/:id', getQuote);

quotesRouter.post('/', authorize, isAdmin, addQuote);

quotesRouter.put('/:id', authorize, isAdmin, updateQuote);

quotesRouter.delete('/:id', authorize, isAdmin, deleteQuote);

export default quotesRouter;