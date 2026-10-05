import { Router } from "express";
import { getSavedEvents, getSavedFigures, getSavedQuotes, toggleItem } from "../controllers/savedItems.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const savedItemsRouter = new Router();


savedItemsRouter.get('/quotes', authorize, getSavedQuotes);

savedItemsRouter.get('/figures', authorize, getSavedFigures);

savedItemsRouter.get('/events', authorize, getSavedEvents);

savedItemsRouter.post('/toggle', authorize, toggleItem);


export default savedItemsRouter;
