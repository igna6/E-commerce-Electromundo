import { Request, Response, NextFunction } from 'express'
import { createOrderSchema } from '../validators/order.ts'
import { idParamSchema } from '../validators/common.ts'
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
    const { id } = idParamSchema.parse(req.params)
    const token = req.query.token as string | undefined
    if (!token) {
      throw new BadRequestError('Order access token is required')
    }
    const order = await ordersService.getOrderById(id, token)
    res.json({ data: order })
  } catch (error) {
    next(error)
  }
}
