import { Request, Response, NextFunction } from 'express'
import { createProductSchema, idParamSchema, updateProductSchema } from '../validators/product.ts'
import { productListQuerySchema } from '../validators/common.ts'
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
    const query = productListQuerySchema.parse(req.query)
    const result = await productsService.listProducts(query)
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
