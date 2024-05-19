import { validationResult } from "express-validator"
import { ApiError } from '../exceptions/apiError.js'
import { authService } from '../services/authService.js'
import { jwtService } from '../services/jwtService.js'

class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequestError("Ошибка валидации", errors.array()))
            }
            const { email, password } = req.body
            const userData = await authService.register(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 3600 * 1000,
                httpOnly: true,
                sameSite: process.env.MODE === "production" ? "None" : "Strict",
                secure: process.env.MODE === "production" ? true : false
            })
            return res.json({ ...userData.user, accessToken: userData.accessToken })
        } catch(e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await authService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 3600 * 1000,
                httpOnly: true,
                sameSite: process.env.MODE === "production" ? "None" : "Strict",
                secure: process.env.MODE === "production" ? true : false
            })
            return res.json({ ...userData.user, accessToken: userData.accessToken })
        } catch(e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await authService.activate(activationLink)
            await jwtService.authenticateSession(activationLink)
            return res.redirect(process.env.MODE === "production"
                ? process.env.CLIENT_DEPLOYED_URL
                : process.env.CLIENT_LOCAL_URL
            )
        } catch(e) {
            next(e)
        }
    }

    async authenticateSession(req, res, next) {
        try {
            const authenticationLink = req.params.link
            await jwtService.authenticateSession(authenticationLink)
            return res.redirect(process.env.MODE === "production"
                ? process.env.CLIENT_DEPLOYED_URL
                : process.env.CLIENT_LOCAL_URL
            )
        } catch(e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await authService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 3600 * 1000,
                httpOnly: true,
                sameSite: process.env.MODE === "production" ? "None" : "Strict",
                secure: process.env.MODE === "production" ? true : false
            })
            return res.json({ ...userData.user, accessToken: userData.accessToken })
        } catch(e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch(e) {
            next(e)
        }
    }

    async updateUserData(req, res, next) {
        try {
            const { id } = req.params
            const { email, nickname, password } = req.body
            const updatedUserData = await authService.updateUserData(id, email, nickname, password)
            return res.json(updatedUserData)
        } catch (e) {
            next(e)            
        }
    }
}

export const authController = new AuthController()