import express from 'express'
import { body } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import user from '../models/user.js'
import validate from '../middleware/validate.js'
import { bcrypt_salt_rounds, jwt_expiry_time, jwt_secret } from '../config.js'
import { DetailedUserDTO } from '../dto/user.js'

const router = express.Router()

const sendError = (statusCode, message, res) => {
    return res
        .status(statusCode)
        .send({
            errors: [{ msg: message }],
        })
        .end()
}

const sendForbidden = (res) => {
    return sendError(403, 'Invalid email or password', res)
}

const loginValidator = validate([
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
])

const registerValidator = validate([
    body('name').isString().notEmpty().withMessage('Name cannot be empty'),
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
    body('phone')
        .isMobilePhone()
        .withMessage('Phone must be a valid phone number'),
])

export const login = (user, res) => {
    const token = jwt.sign({ id: user.id }, jwt_secret, {
        //expiresIn: jwt_expiry_time,
          expiresIn: '1h'
    })

    return res.status(200).send({
        token,
        user: new DetailedUserDTO(user),
    })
}

router.post('/login', loginValidator, async (req, res, _next) => {
    const newuser = await user.findOne({ email: req.body.email })
    const password = req.body.password

    if (newuser) {
        const isValidPassword = await bcrypt.compare(password, newuser.password)

        if (isValidPassword) {
            return login(newuser, res)
        } else {
            return sendForbidden(res)
        }
    } else {
        return sendForbidden(res)
    }
})

router.post('/register', registerValidator, async (req, res) => {
    //here I check if the role is not seller, driver or admin
    //I return an error
    if (
        req.body.role &&
        !['seller', 'driver', 'admin'].includes(req.body.role)
    ) {
        return sendError(
            400,
            'Role must be either seller, driver or admin',
            res,
        )
    }

    const existingUser = await user.findOne({ email: req.body.email })

    if (!existingUser) {
        // Set role to 'seller' if it wasn't provided in the request
        const newuser = new user({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: await bcrypt.hash(req.body.password, bcrypt_salt_rounds),
            role: req.body.role || 'seller', // Default role to 'seller'
        })

        await newuser.save()
        return login(newuser, res)
    } else {
        return sendError(
            400,
            'An account already exists with the same email.',
            res,
        )
    }
})

export default router
