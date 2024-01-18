const http = require('node:http')

const server = http.createServer((req, res) => {
    console.log('Request Received')
    res.end('Hola mundo')
})

let puerto = 3000;

server.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`)
})