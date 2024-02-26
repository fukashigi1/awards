import { obtainSessionId } from '../utils/fnUtilsBE.js'
import { editorModel } from "../models/editorModel.js"

export class editorController {
    static async view(req, res) {
        const {award_id, award_name} = req.query
        const session_id = obtainSessionId(req.headers.cookie)
        const enterAward = await editorModel.view({awardData: {award_id, award_name, session_id}})

        res.status(200).sendFile(`${process.cwd()}/src/views/editor.html`)
    }

    static async saveQuestions(req, res) {

    }
}