import { Router } from "express";
import { getEvent, getEvents } from "../controllers/event.controller.js";


const eventRouter = new Router();

eventRouter.get("/", getEvents);

eventRouter.get('/:id', getEvent);

export default eventRouter;