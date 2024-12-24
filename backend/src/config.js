import dotenv from 'dotenv'

dotenv.config()

const { env } = process

export const port = Number(env.PORT) || 3000
export const mongodb_uri =
    env.MONGODB_URI || 'mongodb://localhost:27017/delivery-app'

export const jwt_secret = env.JWT_SECRET || 'some_secret_key'
export const jwt_expiry_time = env.JWT_EXPIRY_TIME || '1h'

export const bcrypt_salt_rounds = 10
