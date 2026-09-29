import { Router } from "express";
import { getHistoricalFigure, getHistoricalFigures } from "../controllers/historicalFigure.controller.js";



const figuresRouter = new Router();


figuresRouter.get('/', getHistoricalFigures);

figuresRouter.get('/:id', getHistoricalFigure);

export default figuresRouter;