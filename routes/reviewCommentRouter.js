
import { reviewCommentController } from "../controllers/reviewCommentController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorityMiddlewareDecorator } from "../middleware/authorityMiddlewareDecorator.js"
import { Router } from "express"

const router = new Router()

router.post('/', authMiddleware, authorityMiddlewareDecorator(['user', 'admin']), reviewCommentController.create)

router.get('/:review', reviewCommentController.getAllByReview)

router.delete('/:id', authMiddleware, reviewCommentController.remove)

export const reviewCommentRouter = router