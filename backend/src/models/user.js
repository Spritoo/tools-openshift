import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['seller', 'driver', 'admin'],
            default: 'seller',
        },
    },
    {
        timestamps: true,
    },
)

export default mongoose.model('user', UserSchema)
