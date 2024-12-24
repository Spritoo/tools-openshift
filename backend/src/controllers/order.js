import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import roleMiddleware from '../middleware/roleMiddleware.js' // Import role middleware
import Order from '../models/Order.js'
import { OrderDTO, DetailedOrderDTO } from '../dto/order.js'
import logger from '../utils/logger.js'

const router = new Router()

router.use(authenticationMiddleware)

// User Creating Order
router.post('/create', roleMiddleware('seller'), async (req, res) => {
    try {
        const {
            pickupLocation,
            destination,
            items,
            totalWeight,
            deliveryTime,
            receiverPhone,
        } = req.body

        if (!deliveryTime || !receiverPhone) {
            return res.status(400).json({
                message: 'Delivery time and receiver phone are required.',
            })
        }

        const newOrder = new Order({
            sellerId: req.user._id,
            driverId: null,
            items,
            totalWeight,
            pickupLocation,
            destination,
            status: 'pending',
            deliveryTime,
            receiverPhone,
        })

        logger.info('Request body:', JSON.stringify(req.body, null, 2))
        const savedOrder = await newOrder.save()

        logger.info('Saved order:', savedOrder)
        res.status(201).json(new DetailedOrderDTO(savedOrder))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Display Orders for Logged In User (Seller Only)
router.get('/all', roleMiddleware('seller'), async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.user._id })
        res.status(200).json(orders.map((order) => new OrderDTO(order)))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Display Specific Order by ID (Seller Only)
router.get('/:id', roleMiddleware('seller'), async (req, res) => {
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

// Cancel Specific Order in Pending State (Seller Only)
router.delete('/:id', roleMiddleware('seller'), async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            sellerId: req.user._id,
        })

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                message: 'Cannot delete order with status other than pending',
            })
        }

        await Order.deleteOne({ _id: req.params.id })
        res.status(200).json(new DetailedOrderDTO(order))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router
