import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const usersFilePath = path.join(__dirname, 'users.json')

const ensureUsersFileExists = () => {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, '[]', 'utf-8')
  }
}

const readUsers = (): User[] => {
  ensureUsersFileExists()
  const data = fs.readFileSync(usersFilePath, 'utf-8')
  return JSON.parse(data)
}

const writeUsers = (users: User[]) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8')
}

interface User {
  id: string
  username: string
  password: string
}

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, password }: { username: string; password: string } =
    req.body

  try {
    const users = readUsers()

    if (users.find((user) => user.username === username)) {
      return res.status(400).json({ message: 'Usuário já cadastrado' })
    }

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser: User = { id: uuidv4(), username, password: hashedPassword }
    users.push(newUser)
    writeUsers(users)

    return res.status(201).json({ message: 'Usuário criado com sucesso!' })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password }: { username: string; password: string } =
    req.body

  try {
    const users = readUsers()
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
      user: { id: user.id, username: user.username }
    })
  } catch (error) {
    console.error('Erro no login', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}
