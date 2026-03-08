import { Router } from 'express'
import * as bannersController from '../controllers/banners.controller.ts'

const router = Router()

// Public: only active banners
router.get('/', bannersController.listActive)

export default router
