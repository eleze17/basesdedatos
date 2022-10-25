import knexLib from 'knex'

class ClienteSql {
  constructor(config) {
    this.knex = knexLib(config)
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('mensajes')
      .finally(() => {
        return this.knex.schema.createTable('mensajes', table => {
          table.increments('id').primary();
          table.string('detalle', 2000);
        })
      })
  }

  insertarMensajes(mensaje) {
    return this.knex('mensajes').insert(mensaje)
  }

  listarMensajes() {
    return this.knex('mensajes').select('*')
  }

  borrarMensajePorId(id) {
    return this.knex.from('mensajes').where('id', id).del()
  }


  close() {
    this.knex.destroy();
  }
}

export default ClienteSql