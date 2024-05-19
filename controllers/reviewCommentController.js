import { reviewCommentService } from "../services/reviewCommentService.js"

class ReviewCommentController {
    async create(req, res, next) {
        try {
            const { author, review, content } = req.body
            const reviewComment = await reviewCommentService.create(author, review, content)
            return res.json(reviewComment)
        } catch (e) {
            next(e)
        }
    }
    async getAllByReview(req, res, next) {
        try {
            const { review } = req.params
            const reviewComments = await reviewCommentService.getAllByReview(review)
            return res.json(reviewComments)
        } catch (e) {
            next(e)
        }
    }
    async remove(req, res, next) {
        try {
            const { id } = req.params
            const deletedReviewComment = await reviewCommentService.remove(id)
            return res.json(deletedReviewComment)
        } catch (e) {
            next(e)  
        }
    }
}

export const reviewCommentController = new ReviewCommentController()