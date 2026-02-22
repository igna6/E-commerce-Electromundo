import { Router } from 'express'
import * as ordersController from '../controllers/orders.controller.ts'

const router = Router()

router.post('/', ordersController.create)
router.get('/:id', ordersController.getById)

export default router
