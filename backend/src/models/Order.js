import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        driverId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
            },
        ],
        totalWeight: {
            type: Number,
            required: true,
        },
        pickupLocation: {
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        destination: {
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        status: {
            type: String,
            enum: [
                'pending',
                'assigned',
                'accepted',
                'declined',
                'picked up',
                'in transit', //Courier
                'delivered', //Courier
            ],
            default: 'pending',
        },
        deliveryTime: {
            type: String,
            required: true,
        },
        receiverPhone: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }, //show creation and update time that happens on any document.
)

export default mongoose.model('Order', orderSchema)
