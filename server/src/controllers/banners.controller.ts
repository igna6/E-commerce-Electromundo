import type { Request, Response, NextFunction } from 'express'
import * as bannersService from '../services/banners.service.ts'
import { idParamSchema, createBannerSchema, updateBannerSchema } from '../validators/banner.ts'

export async function listActive(req: Request, res: Response, next: NextFunction) {
  try {
    const banners = await bannersService.listActiveBanners()
    res.json({ data: banners })
  } catch (error) {
    next(error)
  }
}

export async function listAll(req: Request, res: Response, next: NextFunction) {
  try {
    const banners = await bannersService.listAllBanners()
    res.json({ data: banners })
  } catch (error) {
    next(error)
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const banner = await bannersService.getBannerById(id)
    res.json({ data: banner })
  } catch (error) {
    next(error)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = createBannerSchema.parse(req.body)
    const banner = await bannersService.createBanner(validatedData)
    res.status(201).json({ data: banner })
  } catch (error) {
    next(error)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    const validatedData = updateBannerSchema.parse(req.body)
    const banner = await bannersService.updateBanner(id, validatedData)
    res.json({ data: banner })
  } catch (error) {
    next(error)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params)
    await bannersService.deleteBanner(id)
    res.json({ message: 'Banner deleted successfully' })
  } catch (error) {
    next(error)
  }
}
