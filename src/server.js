import express from 'express'
const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 5555

//Middlewares
app.use((req, res, next) => {
    next()
})
app.use(express.urlencoded({ extended: false }));

app.use(express.json())

app.use(express.static('public'));

//IMPORT RUTAS
import {mainRouter} from './routes/mainRouter.js'
import {registerRouter} from './routes/registerRouter.js'
import { loginRouter } from './routes/loginRouter.js'

//RUTAS
app.get('/', (req, res) => { // INDEX
    res.status(200).sendFile(`${process.cwd()}/src/views/index.html`)
})

app.use('/main', mainRouter) // MAIN
app.use('/register', registerRouter) // REGISTER
app.use('/login', loginRouter) // LOGIN

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

//Escucha
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})