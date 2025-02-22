import { Request, Response } from 'express'
import pool from '../config/db.js'

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.user?.id

  if (!userId) {
    return res.status(400).json({ message: 'ID de usuário não encontrado' })
  }

  try {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id, username FROM users WHERE id = $1',
        [userId]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      return res.status(200).json({
        message: 'Usuário encontrado com sucesso',
        user: result.rows[0]
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}
