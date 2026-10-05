import {Router} from "express"
import { getUser, signIn, signOut, signUp } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const authRouter = new Router();

authRouter.post("/sign-in", signIn);

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-out', signOut);

authRouter.get('/user', authorize, getUser);

export default authRouter;