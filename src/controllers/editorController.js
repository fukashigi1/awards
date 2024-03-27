import { obtainSessionId } from '../utils/fnUtilsBE.js'
import { editorModel } from "../models/editorModel.js"

export class editorController {
    static async view (req, res) {
        
        const {award_id, award_name} = req.body
        const session_id = obtainSessionId(req.headers.cookie)
        const enterAward = await editorModel.view({awardData: {award_id, award_name, session_id}})

        if (enterAward.status === 200) {
            res.status(200).sendFile(`${process.cwd()}/src/views/editor.html`)
        } else {
            res.status(enterAward.status).redirect(308, '/awards')
        }
    }

    static async obtainQuestions (req, res) {
        const {award_id, award_name} = req.body
        const session_id = obtainSessionId(req.headers.cookie)
        const obtainQuestionsAward = await editorModel.obtainQuestions({awardData: {award_id, award_name, session_id}})

        res.status(obtainQuestionsAward.status).json(obtainQuestionsAward.content)
    }

    static async saveQuestions (req, res) {
        const {award_id, award_name, questions, deleted_questions} = req.body
        const session_id = obtainSessionId(req.headers.cookie)
        const saveQuestionsAward = await editorModel.saveQuestions({awardData: {award_id, award_name, questions, deleted_questions, session_id}})

        res.status(saveQuestionsAward.status).json(saveQuestionsAward.content)

    }
}