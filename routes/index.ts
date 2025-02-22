import express from 'express'
import authRoutes from './authRoutes.js'
import cartRoutes from './cartRoutes.js'
import userRoutes from './userRoutes.js'

import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/cart', cartRoutes)
router.use('/user', userRoutes)

export default router
