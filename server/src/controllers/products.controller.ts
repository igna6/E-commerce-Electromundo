import { Request, Response, NextFunction } from 'express'
import { createProductSchema, idParamSchema, updateProductSchema } from '../validators/product.ts'
import * as productsService from '../services/products.service.ts'

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const product = await productsService.getProductById(id)
    res.json({ data: product })
  } catch (error) {
    next(error)
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12))
    const search = req.query.search as string
    const category = req.query.category ? parseInt(req.query.category as string) : undefined
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined
    const sortBy = (req.query.sortBy as string) || 'newest'
    const inStock = req.query.inStock === 'true'

    const result = await productsService.listProducts({
      page, limit, search, category, minPrice, maxPrice, sortBy, inStock,
    })

    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createProductSchema.parse(req.body)
    const product = await productsService.createProduct(validatedData)
    res.status(201).json({ data: product })
  } catch (error) {
    next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const validatedData = updateProductSchema.parse(req.body)
    const product = await productsService.updateProduct(id, validatedData)
    res.json({ data: product })
  } catch (error) {
    next(error)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    await productsService.deleteProduct(id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    next(error)
  }
}
