import { Router } from "express";
import { registerController } from "../controllers/registerController.js";

export const registerRouter = Router()


registerRouter.get('/', registerController.view)
registerRouter.post('/', registerController.register)