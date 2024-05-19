import { reviewRateService } from "../services/reviewRateService.js"

class ReviewRateController {
    async create(req, res, next) {
        try {
            const { review, value, author } = req.body
            const updatedReview = await reviewRateService.create(review, value, author)
            return res.json(updatedReview)
        } catch (e) {
            next(e)
        }
    }
    async getOneByUserAndReview(req, res, next) {
        try {
            const { review, author } = req.params
            const rate = await reviewRateService.getOneByUserAndReview(review, author)
            return res.json(rate)
        } catch (e) {
            next(e)
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { value } = req.body
            const updatedReview = await reviewRateService.update(id, value)
            return res.json(updatedReview)
        } catch (e) {
            next(e)            
        }
    }
    async remove(req, res, next) {
        try {
            const { id } = req.params
            const updatedReview = await reviewRateService.remove(id)
            return res.json(updatedReview)
        } catch (e) {
            next(e)            
        }
    }
}

export const reviewRateController = new ReviewRateController()
