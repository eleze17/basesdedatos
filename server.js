import express  from 'express'
import { createServer } from 'http'
import { Server}  from 'socket.io'
import {faker} from '@faker-js/faker' 
import { Contenedor } from './src/clase-contenedor.js'
import { normalize, denormalize, schema }  from 'normalizr'
import util from 'util'

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer);
const contenedor = new Contenedor('./src/posteos.txt')



const Autores = {
    email: '',
    nombre: '',
    apellido:'',
    edad:0,
    alias:'',
    avatar:''
  };
const autores = new schema.Entity('autores',
{autores:Autores},
{ idAttribute: 'email', fallbackStrategy: (key) => ({ email: key, name: 'Unknown' }) }
)
const post = new schema.Entity('post');


//  original 
const posteosjson = await contenedor.getAll()
function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true))
  }
  console.log('Objeto original')
  print(posteosjson)

//Normalizado  
const posteosNorm = new schema.Entity('posteosNorm', {
    usuarios:autores,
    posteos: [ post ]
})


console.log('--------Normalizar objeto----------')
const normalizedData = normalize(posteosjson, posteosNorm)
print(normalizedData)

// Desnormalizar objeto
console.log('--------Desnormalizar objeto----------')
const denormalizedData = denormalize(normalizedData.result, posteosNorm, normalizedData.entities)
print(denormalizedData)


console.log(`Longitud objeto original: ${JSON.stringify(posteosjson).length}`)
console.log(`Longitud objeto normalizado: ${JSON.stringify(normalizedData).length}`)
console.log(`Longitud objeto desnormalizado: ${JSON.stringify(denormalizedData).length}`)


io.on('connection', async socket => {
    console.log('Nuevo usuario conectado!');
  
    socket.emit('post', await contenedor.getAll());
    socket.on('update-post', async e => {
        await contenedor.save(e)
        io.sockets.emit('chat', await contenedor.getAll());
    })


});




app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
const productos = []
let htmlencabezado = `<h2>Tabla productos </h2> 
<table> <tr> <th>Nombre</th> <th>Precio</th> <th>Imagen</th></tr>`
let htmlcontenido = ''
let htmlenfin =  `</table>`


app.get('/api/productos-test',(req,res) => {
    for(let i = 0;i<5;i++){
     let nombre =  faker.commerce.product()
     let precio =   faker.commerce.price() 
     let imagen =   faker.image.abstract()  
        
     let producto = {
        "nombre":nombre,
        "precio":precio,
        "imagen":imagen
     } 
     productos.push(producto)
     }

     productos.map((p) =>{
        


htmlcontenido += ` <tr> <td>${p.nombre}</td> <td>${p.precio}</td> <td>${p.imagen}</td> </tr> `
 
}
     )
    res.send(htmlencabezado + htmlcontenido + htmlenfin )
    
})

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
