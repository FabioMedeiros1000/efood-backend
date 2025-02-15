import express from 'express'
import {
  addItemToCart,
  getItemFromId,
  removeItemFromId,
  getAllItems,
  deleteAllItems
} from '../controllers/cartController.js'

const router = express.Router()

router.post('/add', addItemToCart)
router.get('/', getAllItems)
router.get('/:id', getItemFromId)
router.delete('/', deleteAllItems)
router.delete('/:id', removeItemFromId)

export default router
