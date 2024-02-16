import { loginModel } from "../models/loginModel.js";
export class loginController {
    static async view(req, res) {
        res.status(200).sendFile(`${process.cwd()}/src/views/login.html`)
    }

    static async login(req, res) {
        const login = await loginModel.login({userData: req.body})
        res.status(login.status).json(login.content)
    }
}