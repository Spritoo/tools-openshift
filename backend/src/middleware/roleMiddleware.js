const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' }) // Forbidden
        }
        next() // Role matches, proceed to next middleware/route handler
    }
}

export default authorizeRoles
