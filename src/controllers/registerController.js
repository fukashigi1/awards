import { registerModel } from "../models/registerModel.js";

export class registerController {
    static async view(req, res) {
        console.log("view")
        res.status(200).sendFile(`${process.cwd()}/src/views/register.html`)
    }

    static async register(req, res) {
        const register = await registerModel.register({userData: req.body})
        if (register.status === 201) {
            //CREATE TOKEN
        }
        res.status(register.status).json(register.msg)
    }
}