import { Router } from "express";
import { mainController } from "../controllers/mainController.js";

export const mainRouter = Router()

mainRouter.get('/', mainController.view)