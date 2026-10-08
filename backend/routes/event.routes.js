import { Router } from "express";
import { getEvent, getEvents } from "../controllers/event.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import { addEvent, deleteEvent, updateEvent } from "../controllers/event.admin.controller.js";


const eventRouter = new Router();

eventRouter.get("/", getEvents);

eventRouter.get('/:id', getEvent);

eventRouter.post('/', authorize, isAdmin, addEvent);

eventRouter.put('/:id', authorize, isAdmin, updateEvent);

eventRouter.delete('/:id', authorize, isAdmin, deleteEvent);

export default eventRouter;