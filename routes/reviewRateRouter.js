import { reviewRateController } from "../controllers/reviewRateController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorityMiddlewareDecorator } from "../middleware/authorityMiddlewareDecorator.js"
import { Router } from "express"
import { body } from "express-validator"

const router = new Router()

router.post('/', 
    body('value').isInt({ min: 1, max: 5 }),
    authMiddleware,
    authorityMiddlewareDecorator(['user', 'admin']),
    reviewRateController.create)

router.get('/:review/:author', authMiddleware, reviewRateController.getOneByUserAndReview)

router.put('/:id',
    body('value').isInt({ min: 1, max: 5 }),
    authMiddleware,
    authorityMiddlewareDecorator(['user','admin']),
    reviewRateController.update)

router.delete('/:id', authMiddleware, reviewRateController.remove)

export const reviewRateRouter = router