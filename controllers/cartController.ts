import { Request, Response } from 'express'
import pool from '../config/db.js'

interface DishProps {
  foto: string
  preco: number
  id: string
  nome: string
  descricao: string
  porcao: string
}

interface CartItemProps extends DishProps {
  userId: string
}

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, id, nome, descricao, porcao, preco, foto }: CartItemProps =
    req.body

  try {
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND dish_id = $2',
      [userId, id]
    )

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Esse item já está no carrinho' })
    }

    await pool.query(
      'INSERT INTO cart_items (user_id, dish_id, nome, descricao, porcao, preco, foto) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, id, nome, descricao, porcao, preco, foto]
    )

    return res
      .status(201)
      .json({ message: 'Item adicionado ao carrinho com sucesso' })
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const getItemFromId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.params.userId
  const dishId = req.params.dishId

  try {
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND dish_id = $2',
      [userId, dishId]
    )

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: 'O item não está presente no carrinho' })
    }

    return res
      .status(200)
      .json({ message: 'Item obtido com sucesso', item: result.rows[0] })
  } catch (error) {
    console.error('Erro ao obter item do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const removeItemFromId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.params.userId
  const id = req.params.id

  try {
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND id = $2',
      [userId, id]
    )

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ message: 'Item não encontrado no carrinho' })
    }

    await pool.query('DELETE FROM cart_items WHERE user_id = $1 AND id = $2', [
      userId,
      id
    ])

    return res
      .status(200)
      .json({ message: 'Item removido do carrinho com sucesso' })
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const getAllItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.params.userId

  try {
    const result = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1',
      [userId]
    )

    return res
      .status(200)
      .json({ message: 'Itens obtidos com sucesso', items: result.rows })
  } catch (error) {
    console.error('Erro ao obter itens do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const deleteAllItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.params.userId

  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId])

    return res
      .status(200)
      .json({ message: 'Todos os itens foram deletados com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar itens do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}
