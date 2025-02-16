import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const client = await pool.connect()
    try {
      // Verifica se o usuário já existe
      const userExists = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      )

      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'Usuário já cadastrado' })
      }

      // Criptografa a senha e insere no banco
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(password, salt)

      await client.query(
        'INSERT INTO users (username, password) VALUES ($1, $2)',
        [username, hashedPassword]
      )

      return res.status(201).json({ message: 'Usuário criado com sucesso!' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const client = await pool.connect()
    try {
      // Busca o usuário no banco
      const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      const user = result.rows[0]

      // Verifica se a senha está correta
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' })
      }

      // Verifica se a variável de ambiente está definida
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        throw new Error('JWT_SECRET não definido no .env')
      }

      // Gera o token JWT
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: '1h'
      })

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        token,
        user: { id: user.id, username: user.username }
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Erro no login', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}
