import { awardsModel } from "../models/awardsModel.js"
import { obtainSessionId } from '../utils/fnUtilsBE.js'

export class awardsController {
    static async view(req, res) {
        res.status(200).sendFile(`${process.cwd()}/src/views/awards.html`)
    }

    static async obtainAwards(req, res) {
        const cookieSessionId = obtainSessionId(req.headers.cookie)

        const obtainAwards = await awardsModel.obtainAwards({userData: {cookieSessionId}})

        res.status(obtainAwards.status).json(obtainAwards.content)
    }

    static async addAward(req, res) {     
        const award_name = req.body.award_name
        const cookieSessionId = obtainSessionId(req.headers.cookie)

        const addAward = await awardsModel.addAward({awardData: {award_name, cookieSessionId}})
        res.status(addAward.status).json(addAward.content)
    }

    static async removeAward(req, res) {
        res.send("hello")
    }
    
    static async updateAward(req, res) {
        res.send("hello")
    }
}