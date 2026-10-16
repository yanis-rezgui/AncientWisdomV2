import {Router} from "express"
import { getUser, signIn, signOut, signUp, updateMyInfo, updateMyPassword } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { getMyProfileStats } from "../controllers/profile.stats.controller.js";


const authRouter = new Router();

authRouter.post("/sign-in", signIn);

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-out', signOut);

authRouter.get('/user', authorize, getUser);

authRouter.get('/me/stats', authorize, getMyProfileStats);

authRouter.put('/update/info', authorize, updateMyInfo);

authRouter.put('/update/password', authorize, updateMyPassword);

export default authRouter;