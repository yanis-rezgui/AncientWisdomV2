import Router from "express"
import authorize from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import { addUser, deleteUser, getAllUsers, updateUser } from "../controllers/user.controller.js";

const usersRouter = new Router();

usersRouter.get('/', authorize, isAdmin, getAllUsers);

usersRouter.post('/', authorize, isAdmin, addUser);

usersRouter.put('/:id', authorize, isAdmin, updateUser);

usersRouter.delete('/:id', authorize, isAdmin, deleteUser);


export default usersRouter;