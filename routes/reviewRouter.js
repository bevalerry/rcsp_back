import { reviewController } from "../controllers/reviewController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorityMiddlewareDecorator } from "../middleware/authorityMiddlewareDecorator.js"
import { Router } from "express"

const router = new Router()

router.post('/', authMiddleware, authorityMiddlewareDecorator(['user', 'admin']), reviewController.create)

router.get('/', reviewController.getAll)

router.get('/:id', reviewController.getOne)

router.get('/by_user/:userId', reviewController.getUserReviews)

router.delete('/:id', authMiddleware, reviewController.remove)

export const reviewRouter = router