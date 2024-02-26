import { Router } from 'express'
import { awardsController } from '../controllers/awardsController.js'
import { editorController } from '../controllers/editorController.js'

export const awardsRouter = Router()

awardsRouter.get('/', awardsController.view)
awardsRouter.get('/obtain', awardsController.obtainAwards)
awardsRouter.post('/', awardsController.addAward)
awardsRouter.delete('/', awardsController.removeAward)
awardsRouter.patch('/', awardsController.updateAward)

awardsRouter.get('/editor', editorController.view)
awardsRouter.post('/editor', editorController.saveQuestions)