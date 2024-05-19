import jwt from "jsonwebtoken"
import { tokenModel } from '../models/tokenModel.js'
import { ApiError } from "../exceptions/apiError.js"

class JWTService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async isSessionActive(refreshToken) {
        const refreshTokenData = await tokenModel.findOne({ refreshToken })
        if (!refreshTokenData.isActivated) {
            return false
        }
        return true
    }

    async cleanExpiredSessions(userId) {
        const sessions = await tokenModel.find({ user: userId })
        await Promise.all(sessions.map( async (session) => {
            const isTokenValid = this.validateRefreshToken(session.refreshToken)
            if (isTokenValid === null) {
                await this.removeSession(session.refreshToken)
            }
        }))
    }

    async saveToken(userId, refreshToken, authenticationLink) {
        const tokenData = await tokenModel.findOne({ user: userId, authenticationLink })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({ user: userId, refreshToken, authenticationLink })
        return token
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }

    async authenticateSession(authenticationLink) {
        const session = await tokenModel.findOne({ authenticationLink })
        if (!session) {
            throw ApiError.badRequestError("Некорректная сессия")
        }
        session.isActivated = true
        await session.save()
    }

    async removeSession(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData
    }
}

export const jwtService = new JWTService()
