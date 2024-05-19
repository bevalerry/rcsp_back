import { ApiError } from "../exceptions/apiError.js"
import { jwtService } from "../services/jwtService.js"


export async function authMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.unauthorizedError())
        }
        
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(ApiError.unauthorizedError())
        }

        const { refreshToken } = req.cookies
        const sessionActivated = await jwtService.isSessionActive(refreshToken)
        if (!sessionActivated) {
            return next(ApiError.inactiveSessionError())
        }
        
        const userData = jwtService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.unauthorizedError())
        }

        req.user = userData
        next()
        
    } catch (e) {
        return next(ApiError.unauthorizedError())
    }
}