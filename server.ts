import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import { createTable } from './migrations/createUsersTable.js'

createTable()

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', routes)

const port = process.env.PORT || 5001

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
