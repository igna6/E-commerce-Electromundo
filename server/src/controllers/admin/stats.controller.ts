import { Request, Response, NextFunction } from 'express'
import * as statsService from '../../services/admin/stats.service.ts'

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await statsService.getDashboardStats()
    res.json({ data: stats })
  } catch (error) {
    next(error)
  }
}
