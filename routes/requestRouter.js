import { requestController } from "../controllers/requestController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorityMiddlewareDecorator } from "../middleware/authorityMiddlewareDecorator.js"
import { Router } from "express"

const router = new Router()

router.post('/', authMiddleware, authorityMiddlewareDecorator(['user', 'admin']), requestController.create)

router.get('/', authMiddleware, requestController.getAll)

router.get('/by_user/:userId', authMiddleware, requestController.getUserRequests)

router.put('/:id', authMiddleware, authorityMiddlewareDecorator(['admin', 'moderator']), requestController.update)

router.delete('/:id', authMiddleware, authorityMiddlewareDecorator(['user','admin']), requestController.remove)

export const requestRouter = router