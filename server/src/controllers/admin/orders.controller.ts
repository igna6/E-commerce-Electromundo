import { Request, Response, NextFunction } from 'express'
import * as adminOrdersService from '../../services/admin/orders.service.ts'
import { idParamSchema } from '../../validators/common.ts'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const status = req.query.status as string | undefined

    const result = await adminOrdersService.listOrders({ page, limit, status })
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
