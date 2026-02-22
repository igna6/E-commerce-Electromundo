import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import * as authController from '../controllers/auth.controller.ts'

const router = Router()

router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.get('/me', authenticateToken, authController.me)

export default router
