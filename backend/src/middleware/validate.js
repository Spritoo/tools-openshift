import { validationResult } from 'express-validator'

const validate = (validations) => {
    validations.push((req, res, next) => {
        // Check for validation errors
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // Proceed to the next middleware or route handler if no errors
        next()
    })

    return validations
}

export default validate
