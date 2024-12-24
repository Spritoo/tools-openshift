import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import { DetailedUserDTO } from '../dto/user.js'
import user from '../models/user.js'

const router = new Router()

router.use(authenticationMiddleware)

router.get('/@me', (req, res) => {
    res.send(new DetailedUserDTO(req.user)).end()
})

router.get('/driver/:id', async (req, res) => {
    try {
        const _user = await user.findById(req.params.id)

        if (!_user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (_user.role !== 'driver') {
            return res.status(400).json({ message: 'User is not a driver' })
        }

        res.status(200).json(new DetailedUserDTO(_user))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router
