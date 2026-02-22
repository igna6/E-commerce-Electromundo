import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.ts'
import * as productsController from '../controllers/products.controller.ts'

const router = Router()

router.get('/:id', productsController.getById)
router.get('/', productsController.list)
router.post('/', authenticateToken, requireAdmin, productsController.create)
router.put('/:id', authenticateToken, requireAdmin, productsController.update)
router.delete('/:id', authenticateToken, requireAdmin, productsController.remove)

export default router
