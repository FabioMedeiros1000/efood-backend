import dotenv from 'dotenv'

dotenv.config()
console.log(process.env.DATABASE_URL)

import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para Render
})

export default pool
