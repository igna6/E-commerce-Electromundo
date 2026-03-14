import { Request, Response, NextFunction } from 'express'
import * as adminOrdersService from '../../services/admin/orders.service.ts'
import { idParamSchema, orderListQuerySchema } from '../../validators/common.ts'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = orderListQuerySchema.parse(req.query)
    const result = await adminOrdersService.listOrders(query)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const order = await adminOrdersService.getOrderById(id)
    res.json({ data: order })
  } catch (error) {
    next(error)
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const order = await adminOrdersService.updateOrderStatus(id, req.body.status)
    res.json({ data: order })
  } catch (error) {
    next(error)
  }
}
