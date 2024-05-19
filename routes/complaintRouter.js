import { complaintController } from "../controllers/complaintController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorityMiddlewareDecorator } from "../middleware/authorityMiddlewareDecorator.js"
import { Router } from "express"

const router = new Router()

router.post('/', authMiddleware, authorityMiddlewareDecorator(['user', 'admin']), complaintController.create)

router.get('/', authMiddleware, complaintController.getAll)

router.get('/:userId', authMiddleware, complaintController.getUserComplaints)

router.put('/:id', authMiddleware, authorityMiddlewareDecorator(['admin', 'moderator']), complaintController.update)

router.delete('/:id', authMiddleware, authorityMiddlewareDecorator(['user','admin']), complaintController.remove)

export const complaintRouter = router