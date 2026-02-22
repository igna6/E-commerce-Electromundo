import { Request, Response, NextFunction } from 'express'
import { createOrderSchema } from '../validators/order.ts'
import * as ordersService from '../services/orders.service.ts'
import { BadRequestError } from '../utils/errors.ts'

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createOrderSchema.parse(req.body)
    const order = await ordersService.createOrder(validatedData)
    res.status(201).json({ data: order })
  } catch (error) {
    next(error)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id as string)
    if (isNaN(id)) {
      throw new BadRequestError('Invalid order ID')
    }
    const order = await ordersService.getOrderById(id)
    res.json({ data: order })
  } catch (error) {
    next(error)
  }
}
