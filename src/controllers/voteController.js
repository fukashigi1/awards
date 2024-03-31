import { obtainSessionId } from '../utils/fnUtilsBE.js'
import { voteModel } from "../models/voteModel.js"


export class voteController {
    static async view (req, res) {
        // lo que se me ocurre ahora es, revisar que el hash existe en la base de datos, si es así dejarlo entrar, cuando entre, llamar a /obtainvote con el hash en cuerpo
        let {hash} = req.params
        
        const verifyHash = await voteModel.view({hash})

        if (verifyHash.status == 200) {
            res.status(200).sendFile(`${process.cwd()}/src/views/vote.html`)
        } else {
            res.status(404).sendFile(`${process.cwd()}/src/views/404.html`)
        }
    }

    static async obtainaward (req, res) {
        let {hash} = req.body
        const bringQuestions = await voteModel.obtainaward({hash})

        res.status(bringQuestions.status).json(bringQuestions.content)

    }
    static async sendResponses (req, res) {
        let {responses, email, id_award} = req.body

        const sendAllResponses = await voteModel.sendResponses({responses, email, id_award})
        
    }
}