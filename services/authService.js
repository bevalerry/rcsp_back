import bcrypt from "bcrypt"
import { v4 } from "uuid"
import { userModel } from '../models/userModel.js'
import { mailService } from './mailService.js'
import { jwtService } from './jwtService.js'
import { UserDTO } from '../dtos/userDTO.js'
import { ApiError } from '../exceptions/apiError.js'

class AuthService {
    async register(email, password) {
        let user = await userModel.findOne({ email })
        if (user) {
            throw ApiError.badRequestError(`Пользователь с адресом ${email} уже существует!`)
        }

        const hashedPassword = await bcrypt.hash(password, 3)
        const activationLink = v4()
        const nickname = v4()
        user = await userModel.create({ email, password: hashedPassword, activationLink, nickname })
        await mailService
            .sendActivationMail(email,`${process.env.MODE === "production"
                ? process.env.API_DEPLOYED_URL
                : process.env.API_LOCAL_URL
        }/api/auth/activate_account/${activationLink}`)
        const userDTO = new UserDTO(user)
        const tokens = jwtService.generateTokens({ ...userDTO })
        await jwtService.saveToken(userDTO.id, tokens.refreshToken, activationLink)

        return { ...tokens, user: userDTO}
    }

    async login(email, password) {
        let user = await userModel.findOne({ email })

        if (!user) {
            throw ApiError.badRequestError(`Пользователь с адресом ${email} не существует!`)
        }
        
        const isPassEqual = await bcrypt.compare(password, user.password)
        if (!isPassEqual) {
            throw ApiError.badRequestError(`Неверный пароль`)
        }

        if (!user.isActivated) {
            await mailService
                .sendActivationMail(email,`${process.env.MODE === "production"
                    ? process.env.API_DEPLOYED_URL
                    : process.env.API_LOCAL_URL
                }/api/auth/activate_account/${user.activationLink}`)
            throw ApiError.inactiveAccountError()
        }

        const userDTO = new UserDTO(user)

        await jwtService.cleanExpiredSessions(userDTO.id)

        const tokens = jwtService.generateTokens({ ...userDTO })

        const authenticationLink = v4()
        await jwtService.saveToken(userDTO.id, tokens.refreshToken, authenticationLink)

        await mailService
            .sendActivationMail(email,`${process.env.MODE === "production"
                ? process.env.API_DEPLOYED_URL
                : process.env.API_LOCAL_URL
            }/api/auth/authenticate_session/${authenticationLink}`)

        return { ...tokens, user: userDTO }
    }

    async activate(activationLink) {
        const user = await userModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.badRequestError("Некорректная ссылка")
        }
        user.isActivated = true
        await user.save()
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorizedError()
        }
        const userData = jwtService.validateRefreshToken(refreshToken)
        const tokenFound = await jwtService.findToken(refreshToken)
        if (!userData || !tokenFound) {
            throw ApiError.unauthorizedError()
        }

        const user = await userModel.findById(userData.id)
        const userDTO = new UserDTO(user);
        const tokens = jwtService.generateTokens({ ...userDTO })

        await jwtService.saveToken(userData.id, tokens.refreshToken, tokenFound.authenticationLink)
        return { ...tokens, user: userDTO }
    }

    async logout(refreshToken) {
        const token = await jwtService.removeSession(refreshToken)
        return token
    }

    
    async updateUserData(id, email, nickname, password) {
        const user = await userModel.findOne({ _id: id })
        if (user.email !== email) {
            user.email = email
        }
        if (user.nickname !== nickname && nickname.length > 0) {
            user.nickname = nickname
        }
        if (user.password !== password && password.length > 0) {
            const hashedPassword = await bcrypt.hash(password, 3)
            user.password = hashedPassword
        }
        const updatedUser = await user.save()
        const updatedUserData = new UserDTO(updatedUser)
        return updatedUserData
    }
}

export const authService = new AuthService()
