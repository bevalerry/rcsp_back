import { ApiError } from "../exceptions/apiError.js"
import { jwtService } from "../services/jwtService.js"
import { userService } from "../services/userService.js"

export const authorityMiddlewareDecorator =
(requiredRole) => async function(req, res, next) {
    try {
        const { refreshToken } = req.cookies
        const { user } = await jwtService.findToken(refreshToken)
        const { role } = await userService.getOne(user)
        if (!requiredRole.includes(role)) {
            next(ApiError.lowAuthorityError())
        }
        next()
        
    } catch (e) {
        return next(ApiError.unauthorizedError())
    }
}