export class OrderDTO {
    constructor(order) {
        this.id = order._id
        this.sellerId = order.sellerId
        this.status = order.status
        this.pickupLocation = order.pickupLocation
        this.destination = order.destination
        this.deliveryTime = order.deliveryTime
        this.receiverPhone = order.receiverPhone
    }
}

export class DetailedOrderDTO extends OrderDTO {
    constructor(order) {
        super(order)

        this.driverId = order.driverId
        this.items = order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            weight: item.weight,
        }))
        this.totalWeight = order.totalWeight
        this.createdAt = order.createdAt
        this.updatedAt = order.updatedAt
    }
}
