import { categoryController } from "../controllers/categoryController.js"
import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorityMiddlewareDecorator } from "../middleware/authorityMiddlewareDecorator.js"
import { Router } from "express"

const router = new Router()

router.post('/', authMiddleware,
    authorityMiddlewareDecorator(['admin']), categoryController.create)

router.get('/', categoryController.getAll)

router.get('/:id', authMiddleware,
    authorityMiddlewareDecorator(['admin']), categoryController.getOne)

router.put('/', authMiddleware,
    authorityMiddlewareDecorator(['admin']), categoryController.update)

router.delete('/:id', authMiddleware,
    authorityMiddlewareDecorator(['admin']), categoryController.remove)

export const categoryRouter = router