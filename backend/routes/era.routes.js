import { Router } from "express";
import { getEra, getEras, getErasOptions } from "../controllers/era.controller.js";


const eraRouter = new Router();

eraRouter.get('/', getEras);

eraRouter.get('/options', getErasOptions);

eraRouter.get('/:id', getEra);

export default eraRouter;

