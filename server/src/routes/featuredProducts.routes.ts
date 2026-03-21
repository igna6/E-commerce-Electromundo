import { Router } from 'express'
import * as featuredProductsController from '../controllers/featuredProducts.controller.ts'

const router = Router()

// Public: list featured products by section
router.get('/', featuredProductsController.listBySection)

export default router
