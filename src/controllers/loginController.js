import { loginModel } from "../models/loginModel.js";
import {validateSession, obtainSessionId} from '../utils/fnUtilsBE.js'

export class loginController {
    static async view(req, res) {
        validateSession(req.headers.cookie).then((val) => {
            if (!val) {
                res.status(200).sendFile(`${process.cwd()}/src/views/login.html`)
            } else {
                res.status(401).redirect(308, '/awards')
            }
        })
    }

    static async login(req, res) {
        // comprobar si ya existe una session, si existe eliminarla de la base de datos.
        // enviar cookie y si existe una cookie

        // si a hay una session activa de otro correo, eliminarla, de hecho se sobreescribe la cookie, pero no se borra en la base de datos
        const login = await loginModel.login({userData: req.body, cookie: obtainSessionId(req.headers.cookie)}) 
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
            res.status(login.status).clearCookie('session').redirect(303, '/')
        } catch (e) {
            console.log(e)
        }
    }
}