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
router.get('/:userId', getAllItems)
router.get('/:id', getItemFromId)
router.delete('/:userId', deleteAllItems)
router.delete('/:userId/:id', removeItemFromId)

export default router
