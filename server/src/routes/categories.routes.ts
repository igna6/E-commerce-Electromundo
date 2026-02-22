import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth.ts'
import * as categoriesController from '../controllers/categories.controller.ts'

const router = Router()

router.get('/', categoriesController.list)
router.get('/:id', categoriesController.getById)
router.post('/', authenticateToken, requireAdmin, categoriesController.create)
router.put('/:id', authenticateToken, requireAdmin, categoriesController.update)
router.delete('/:id', authenticateToken, requireAdmin, categoriesController.remove)

export default router
