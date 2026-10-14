import { Router } from "express";
import { getGame, getGames } from "../../controllers/Games/games.controller.js";


const gamesRouter = new Router();

gamesRouter.get('/', getGames);

gamesRouter.get('/:id', getGame);

export default gamesRouter;