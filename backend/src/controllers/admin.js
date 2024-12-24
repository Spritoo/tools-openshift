import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import roleMiddleware from '../middleware/roleMiddleware.js' // Import role middleware
import { updateOrderStatus } from './orderUtils.js'
import Order from '../models/Order.js'
import user from '../models/user.js'
import { DetailedUserDTO } from '../dto/user.js'

import { DetailedOrderDTO } from '../dto/order.js'

const router = new Router()

router.use(authenticationMiddleware)

// Display all orders (Admin only)
router.get('/all', roleMiddleware('admin'), async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders.map((order) => new DetailedOrderDTO(order)))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Update Status of Orders (Admin)
router.put('/orders/:id', roleMiddleware('admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        const { status } = req.body
        if (!status) {
            return res.status(400).json({ message: 'Status is required' })
        }

        await updateOrderStatus(order, status)

        const updatedOrder = await Order.findById(order._id)
        res.status(200).json(new DetailedOrderDTO(updatedOrder))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete Specific Order (Admin only)
router.delete('/orders/:id', roleMiddleware('admin'), async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id)
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Assigning orders to drivers (Admin only)
router.put('/orders/assign/:id', roleMiddleware('admin'), async (req, res) => {
    try {
        const { driverId } = req.body
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { driverId, status: 'pending' },
            { new: true },
        )
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(200).json(new DetailedOrderDTO(updatedOrder))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Display all drivers (Admin only)
router.get('/drivers', roleMiddleware('admin'), async (req, res) => {
    try {
        // Find users where role is 'driver'
        const drivers = await user.find({ role: 'driver' })
        res.status(200).json(drivers.map((user) => new DetailedUserDTO(user)))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// Display a specific order (Admin only)
router.get('/orders/:id', roleMiddleware('admin'), async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            sellerId: req.user._id,
        })

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        res.status(200).json(new DetailedOrderDTO(order))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
export default router
