import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import roleMiddleware from '../middleware/roleMiddleware.js' // Import role middleware
import { updateOrderStatus, removeDriverFromOrder } from './orderUtils.js'
import Order from '../models/Order.js'
import { DetailedOrderDTO } from '../dto/order.js'
import user from '../models/user.js'

const router = new Router()

router.use(authenticationMiddleware)

// Display assigned orders (Driver only)
router.get('/assigned/:id', roleMiddleware('driver'), async (req, res) => {
    try {
        // Find all orders with the given driverId
        const orders = await Order.find({ driverId: req.params.id })

        // If no orders are found, return an empty array with a 200 OK status
        if (orders.length === 0) {
            return res.status(200).json([]) // Return empty array, not 404
        }

        // Map each order to a DetailedOrderDTO
        const detailedOrders = orders.map(
            (order) => new DetailedOrderDTO(order),
        )

        // Send back the array of detailed orders
        res.status(200).json(detailedOrders)
    } catch (error) {
        // Handle any error that occurs during the process
        res.status(400).json({ message: error.message })
    }
})

// Update status of an order (Driver only)
router.put('/orders/:id', roleMiddleware('driver'), async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            driverId: req.user._id,
        })

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

router.put('/cancel/:id', roleMiddleware('driver'), async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            driverId: req.user._id,
        })

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        await updateOrderStatus(order, 'pending')
        await removeDriverFromOrder(order._id)

        const updatedOrder = await Order.findById(order._id)
        res.status(200).json(new DetailedOrderDTO(updatedOrder))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/drivers', roleMiddleware('driver'), async (req, res) => {
    try {
        const drivers = await user.find({ role: 'driver' })
        res.status(200).json(drivers)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router
