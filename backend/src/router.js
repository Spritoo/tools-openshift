import { Router } from 'express'
import authController from './controllers/auth.js'
import userController from './controllers/user.js'
import orderController from './controllers/order.js'
import adminController from './controllers/admin.js'
import courierController from './controllers/courier.js'

const router = new Router()

router.use('/auth', authController)
router.use('/users', userController)
router.use('/orders', orderController)
router.use('/admin', adminController)
router.use('/courier', courierController)

export default router
