import { loginModel } from "../models/loginModel.js";

export class loginController {
    static async view(req, res) {
        res.status(200).sendFile(`${process.cwd()}/src/views/login.html`)
    }

    static async login(req, res) {
        const login = await loginModel.login({userData: req.body})
        if (login.status === 200) {
            if (login.content[0].sessionId) 
                res.append('Set-Cookie', `session=${login.content[0].sessionId}`)
        } 
        
        res.status(login.status).json(login.content)
    }
    
    static async logout(req, res) {
        const login = await loginModel.logout({cookie: req.headers.cookie})
        try {
            console.log(login.status)
            res.status(login.status).clearCookie('session').send()
        } catch (e) {
            console.log(e)
        }
    }
}