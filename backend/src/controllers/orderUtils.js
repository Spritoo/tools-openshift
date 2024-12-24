import Order from '../models/Order.js'
import logger from '../utils/logger.js' // Assuming you have a logger utility

export async function updateOrderStatus(order, status) {
    try {
        order.status = status
        await order.save() // Save the updated order to the database
    } catch (err) {
        logger.error(`Failed to update order status: ${err}`)
        throw new Error('Failed to update order status')
    }
}

export async function deleteOrder(orderId) {
    try {
        const order = await Order.findById(orderId)

        if (!order) {
            throw new Error('Order not found')
        }

        if (order.status !== 'pending') {
            throw new Error(
                'Cannot delete order with status other than pending',
            )
        }

        await Order.deleteOne(orderId)
        return order
    } catch (err) {
        logger.error(`Failed to delete order: ${err}`)
        throw new Error('Failed to delete order')
    }
}

export async function removeDriverFromOrder(orderId) {
    try {
        const order = await Order.findById(orderId)

        if (!order) {
            throw new Error('Order not found')
        }

        order.driverId = null
        await order.save()
        return order
    } catch (err) {
        logger.error(`Failed to remove driver from order: ${err}`)
        throw new Error('Failed to remove driver from order')
    }
}
