import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config() // Carrega as variáveis do .env

const app = express()

app.use(cors())
app.use(express.json())

interface User {
  id: string
  username: string
  password: string
}

const users: User[] = []

app.post('/signup', async (req: Request, res: Response): Promise<Response> => {
  // Altere aqui para 'Promise<Response>'
  const { username, password }: { username: string; password: string } =
    req.body

  try {
    const userExists = users.find((user) => user.username === username)
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser: User = { id: uuidv4(), username, password: hashedPassword }
    users.push(newUser)

    return res.status(201).json({ message: 'Usuário criado com sucesso!' })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
})

app.post('/login', async (req: Request, res: Response): Promise<Response> => {
  const { username, password }: { username: string; password: string } =
    req.body

  try {
    const user = users.find((user) => user.username === username)

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    })

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Erro no login', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
})

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
