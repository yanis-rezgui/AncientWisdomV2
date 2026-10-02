import { Router } from "express";
import { getFiguresOptions, getHistoricalFigure, getHistoricalFigures } from "../controllers/historicalFigure.controller.js";



const figuresRouter = new Router();


figuresRouter.get('/', getHistoricalFigures);

figuresRouter.get('/options', getFiguresOptions);

figuresRouter.get('/:id', getHistoricalFigure);

export default figuresRouter;