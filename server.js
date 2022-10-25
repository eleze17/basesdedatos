import express  from 'express'
const app = express()
import { createServer } from 'http'
import { Server}  from 'socket.io'

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

import ClienteSql from './sql.js'
import { config } from './config/sqlite3.js'
const sql = new ClienteSql(config)

const productos = []

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');
    await sql.crearTabla()
    console.log("tabla creada")

    socket.emit('productos', productos);
    socket.on('update-productos', e => {
        productos.push(e)
        io.sockets.emit('productos', productos);
    })

    socket.emit('chat', await sql.listarMensajes());
    socket.on('update-chat', async e => {
        await sql.insertarMensajes(e)
        io.sockets.emit('chat', await sql.listarMensajes());
    })


});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
