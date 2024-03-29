import { registerModel } from "../models/registerModel.js";
import {validateSession} from '../utils/fnUtilsBE.js'

export class registerController {
    static async view(req, res) {
        
        validateSession(req.headers.cookie).then((val) => {
            if (!val) {
                res.status(200).sendFile(`${process.cwd()}/src/views/register.html`)
            } else {
                res.status(401).redirect(308, '/awards')
            }
        })
    }

    static async register(req, res) {
        const register = await registerModel.register({userData: req.body})
        
        res.status(register.status).json(register.msg)
    }
}