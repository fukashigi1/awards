import { Router } from "express";
import { loginController } from "../controllers/loginController.js";

export const loginRouter = Router()

loginRouter.get('/', loginController.view)