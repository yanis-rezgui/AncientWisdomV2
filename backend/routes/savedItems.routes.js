import { Router } from "express";
import { getSavedEvents, getSavedFigures, getSavedQuotes, toggleItem } from "../controllers/savedItems.controller.js";


const savedItemsRouter = new Router();


savedItemsRouter.get('/quotes', getSavedQuotes);

savedItemsRouter.get('/figures', getSavedFigures);

savedItemsRouter.get('/events', getSavedEvents);

savedItemsRouter.post('/toggle', toggleItem);


export default savedItemsRouter;
