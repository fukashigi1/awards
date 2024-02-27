import { Router } from 'express'
import { editorController } from '../controllers/editorController.js'

export const editorRouter = Router()

editorRouter.get('/', editorController.view)
editorRouter.get('/questions', editorController.obtainQuestions)
editorRouter.post('/', editorController.saveQuestions)