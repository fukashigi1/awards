import { Router } from "express";
import { loginController } from "../controllers/loginController.js";

export const loginRouter = Router()

loginRouter.get('/', loginController.view)
loginRouter.post('/', loginController.login)
loginRouter.delete('/', loginController.logout)