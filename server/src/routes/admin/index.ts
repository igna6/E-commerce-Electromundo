import { Router } from 'express'
import ordersRouter from './orders'
import statsRouter from './stats'

const router = Router()

router.use('/orders', ordersRouter)
router.use('/stats', statsRouter)

export default router
