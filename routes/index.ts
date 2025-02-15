import express from 'express'
import authRoutes from './authRoutes.js'
import cartRoutes from './cartRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/cart', cartRoutes)

export default router
