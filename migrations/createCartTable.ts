import pool from '../config/db.js'

export const createCartTable = async () => {
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        dish_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        descricao TEXT NOT NULL,
        porcao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        foto TEXT NOT NULL
      )
    `)
    console.log('Tabela do carrinho criado com sucesso!')
  } catch (error) {
    console.error('Erro ao criar a tabela do carrinho:', error)
  } finally {
    client.release()
  }
}
