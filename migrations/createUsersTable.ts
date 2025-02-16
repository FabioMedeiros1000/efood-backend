import pool from '../config/db.js'

export const createTable = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `)
    console.log('Tabela de usuários criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar tabela:', error)
  } finally {
    client.release()
  }
}
