import { Router } from 'express'
import multer from 'multer'
import * as adminOrdersController from '../../controllers/admin/orders.controller.ts'
import * as statsController from '../../controllers/admin/stats.controller.ts'
import * as importProductsController from '../../controllers/admin/importProducts.controller.ts'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos CSV'))
    }
  },
})

const router = Router()

// Orders
router.get('/orders', adminOrdersController.list)
router.get('/orders/:id', adminOrdersController.getById)
router.put('/orders/:id/status', adminOrdersController.updateStatus)

// Stats
router.get('/stats', statsController.getStats)

// Import products
router.post('/products/import', upload.single('file'), importProductsController.importCSV)

export default router
