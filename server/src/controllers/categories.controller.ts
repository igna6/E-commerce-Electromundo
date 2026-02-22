import { Request, Response, NextFunction } from 'express'
import { createCategorySchema, idParamSchema, updateCategorySchema } from '../validators/category.ts'
import * as categoriesService from '../services/categories.service.ts'

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoriesService.listCategories()
    res.json({ data: categories })
  } catch (error) {
    next(error)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const category = await categoriesService.getCategoryById(id)
    res.json({ data: category })
  } catch (error) {
    next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createCategorySchema.parse(req.body)
    const category = await categoriesService.createCategory(validatedData)
    res.status(201).json({ data: category })
  } catch (error) {
    next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const validatedData = updateCategorySchema.parse(req.body)
    const category = await categoriesService.updateCategory(id, validatedData)
    res.json({ data: category })
  } catch (error) {
    next(error)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    await categoriesService.deleteCategory(id)
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    next(error)
  }
}
