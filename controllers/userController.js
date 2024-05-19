import { userService } from "../services/userService.js"

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await userService.getAll()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params
            const user = await userService.getOne(id)
            return res.json(user)
        } catch (e) {
            next(e)            
        }
    }
    async banUser(req, res, next) {
        try {
            const { id } = req.params
            const bannedUser = await userService.banUser(id)
            return res.json(bannedUser)
        } catch (e) {
            next(e)            
        }
    }
}

export const userController = new UserController()
