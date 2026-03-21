import type { Request, Response, NextFunction } from 'express'
import * as featuredProductsService from '../services/featuredProducts.service.ts'
import {
  idParamSchema,
  sectionQuerySchema,
  createFeaturedProductSchema,
  updateFeaturedProductSchema,
} from '../validators/featuredProduct.ts'

export async function listBySection(req: Request, res: Response, next: NextFunction) {
  try {
    const { section } = sectionQuerySchema.parse(req.query)
    const items = await featuredProductsService.listBySection(section)
    res.json({ data: items })
  } catch (error) {
    next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createFeaturedProductSchema.parse(req.body)
    const item = await featuredProductsService.create(data)
    res.status(201).json({ data: item })
  } catch (error) {
    next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const data = updateFeaturedProductSchema.parse(req.body)
    const item = await featuredProductsService.update(id, data)
    res.json({ data: item })
  } catch (error) {
    next(error)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    await featuredProductsService.remove(id)
    res.json({ message: 'Featured product removed successfully' })
  } catch (error) {
    next(error)
  }
}
