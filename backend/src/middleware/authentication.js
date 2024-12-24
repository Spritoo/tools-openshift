import jwt from 'jsonwebtoken'
import { jwt_secret } from '../config.js'
import logger from '../utils/logger.js'
import User from '../models/user.js'

const extractToken = (authorizationHeader) => {
    return authorizationHeader ? authorizationHeader.slice(7) : ''
}

export const sendUnauthorized = (res) => {
    return res.status(401).send({ message: 'Unauthorized' }).end()
}

const authenticationMiddleware = (req, res, next) => {
    const token = extractToken(req.headers.authorization)

    if (!token) {
        return sendUnauthorized(res)
    }

    jwt.verify(token, jwt_secret, (err, data) => {
        if (err != null) {
            logger.error(err)

            sendUnauthorized(res)
        }

        const userId = data.id

        User.findById(userId)
            .then((user) => {
                if (!user) return sendUnauthorized(res)

                req.user = user

                next()
            })
            .catch((err) => {
                logger.error(`Failed to retrieve user: ${err}`)

                sendUnauthorized(res)
            })
    })
}

export default authenticationMiddleware
