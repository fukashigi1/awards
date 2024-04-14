import { Router } from "express";
import { voteController } from '../controllers/voteController.js'

export const voteRouter = Router()

voteRouter.get('/:hash', voteController.view)
voteRouter.get('/obtainaward/:hash', voteController.obtainaward)
voteRouter.post('/', voteController.sendResponses)