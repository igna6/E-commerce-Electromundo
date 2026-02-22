import { Request, Response, NextFunction } from 'express'
import * as importService from '../../services/admin/importProducts.service.ts'
import { BadRequestError } from '../../utils/errors.ts'

export async function importCSV(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file
    if (!file) {
      throw new BadRequestError('No se proporcionó un archivo')
    }

    const result = await importService.importProducts(file.buffer)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
