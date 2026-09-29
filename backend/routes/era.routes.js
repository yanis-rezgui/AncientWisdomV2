import { Router } from "express";
import { getEra, getEras } from "../controllers/era.controller.js";


const eraRouter = new Router();

eraRouter.get('/', getEras);

eraRouter.get('/:id', getEra);

export default eraRouter;

