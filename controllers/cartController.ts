import { Request, Response } from 'express'

type CartProps = {
  id: string
  nome: string
}

let cartItems: CartProps[] = []

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id, nome }: { id: string; nome: string } = req.body

  try {
    const itemExist = cartItems.find((item) => item.id === id)

    if (itemExist) {
      return res.status(400).json({ message: 'Esse item já está no carrinho' })
    }

    cartItems.push({ id, nome })
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
  const id = req.params.id

  try {
    const item = cartItems.find((item) => item.id === id)

    if (!item) {
      return res
        .status(400)
        .json({ message: 'O item não está presente no carrinho' })
    }

    return res.status(200).json({ message: 'Item obtido com sucesso', item })
  } catch (error) {
    console.error('Erro ao obter item do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const removeItemFromId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id

  try {
    const itemExist = cartItems.find((item) => item.id === id)

    if (!itemExist) {
      return res
        .status(400)
        .json({ message: 'Item não encontrado no carrinho' })
    }

    cartItems = cartItems.filter((item) => item.id !== id)

    return res.status(200).json({
      message: 'Item removido do carrinho com sucesso',
      cartItems
    })
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const getAllItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return res
      .status(200)
      .json({ message: 'Itens obtidos com sucesso', cartItems })
  } catch (error) {
    console.error('Erro ao obter itens do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}

export const deleteAllItems = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    cartItems = []
    return res
      .status(200)
      .json({ message: 'Itens deletados com sucesso', cartItems })
  } catch (error) {
    console.error('Erro ao deletar itens do carrinho:', error)
    return res.status(500).json({ message: 'Erro interno no servidor' })
  }
}
