import { Router } from 'express'
import ordersRouter from './orders'
import statsRouter from './stats'
import importProductsRouter from './importProducts'

const router = Router()

router.use('/orders', ordersRouter)
router.use('/stats', statsRouter)
router.use('/products', importProductsRouter)

export default router
