export class loginController {
    static async view(req, res) {
        res.status(200).sendFile(`${process.cwd()}/src/views/login.html`)
    }
}