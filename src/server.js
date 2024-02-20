import express from 'express'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
import {validateSession} from './utils/fnUtilsBE.js'

dotenv.config({ path: 'config.env' });

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
export let connection;

try {
    connection = await mysql.createConnection(config)
} catch (e) {
    console.log(e)
}


const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 5555

//Middlewares
app.use((req, res, next) => {
    // validation here
    next()
})

var validationWare = function(req, res, next) {
    validateSession(req.headers.cookie).then((val) => {
        if (!val) {
            res.status(401).redirect(308, '/login')
        } 
    })
    next();
};

app.use(express.urlencoded({ extended: false }));

app.use(express.json())

app.use(express.static('public'));

//IMPORT RUTAS
import {mainRouter} from './routes/mainRouter.js'
import {registerRouter} from './routes/registerRouter.js'
import { loginRouter } from './routes/loginRouter.js'
//RUTAS
app.get('/', (req, res) => { // INDEX
    return res.status(200).sendFile(`${process.cwd()}/src/views/index.html`)

})

app.use('/main', validationWare, mainRouter) // MAIN
app.use('/register', registerRouter) // REGISTER
app.use('/login', loginRouter) // LOGIN

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

//Escucha
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})