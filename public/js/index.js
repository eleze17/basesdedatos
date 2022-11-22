const socket = io();

// update-chat
const formChat = document.getElementById('form-post')
formChat.addEventListener('submit', e => {
    e.preventDefault()


    const post = {
        mail: document.getElementById('post-mail').value,
        nombre: document.getElementById('post-nombre').value,
        apellido: document.getElementById('post-apellido').value,
        edad: document.getElementById('post-edad').value,
        alias: document.getElementById('post-alias').value,
        avatar: document.getElementById('post-avatar').value,
        text: document.getElementById('post-text').value
            }
    
    socket.emit('update-post', post);
     document.getElementById('post-mail').value = ''
     document.getElementById('post-nombre').value= ''
     document.getElementById('post-apellido').value= ''
     document.getElementById('post-edad').value= ''
     document.getElementById('post-alias').value= ''
     document.getElementById('post-avatar').value= ''
     document.getElementById('post-text').value= ''
       
})

// render-chat
socket.on('post', manejarEventoPost);
async function manejarEventoPost(post) {
    console.log(post)

    const recursoRemoto = await fetch('../hbs/post.hbs')
    const textoPlantilla = await recursoRemoto.text()
    const functionTemplate = Handlebars.compile(textoPlantilla)

    const html = functionTemplate({ post })
    document.getElementById('post').innerHTML = html
}






