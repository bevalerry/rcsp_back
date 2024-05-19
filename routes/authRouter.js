import { body } from "express-validator"
import { authController } from '../controllers/authController.js'
import { authMiddleware } from "../middleware/authMiddleware.js"
import { Router } from "express"

const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 24}),
    authController.registration)

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 24}),
    authController.login)

router.post('/logout', authController.logout)

router.put('/update_user_data/:id',
    body('email').isEmail(),
    authMiddleware, 
    authController.updateUserData)

router.get('/activate_account/:link', authController.activate)

router.get('/authenticate_session/:link', authController.authenticateSession)

router.get('/refresh', authController.refresh)

export const authorizationRouter = router