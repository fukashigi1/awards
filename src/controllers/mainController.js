export class mainController {
    static async view(req, res) {
        res.status(200).sendFile(`${process.cwd()}/src/views/main.html`)
    }
}