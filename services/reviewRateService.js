import { ReviewRateDTO } from "../dtos/reviewRateDTO.js"
import { ApiError } from "../exceptions/apiError.js"
import { reviewRateModel } from "../models/reviewRateModel.js"
import { reviewService } from "./reviewService.js"

class ReviewRateService {
    async create(review, value, author) {
        const reviewRateExists = !!(await reviewRateModel.findOne({ review, author }))
        if (reviewRateExists) {
            throw ApiError.badRequestError('Вы уже оценили данный отзыв!')
        }
        await reviewRateModel.create({ review, value, author })

        const updatedReview = await reviewService.updateRate(review, value, 1)
        return updatedReview
    }

    async getOneByUserAndReview(review, author) {
        const rate = await reviewRateModel.findOne({ review, author })
        if (rate) {
            const rateData = new ReviewRateDTO(rate)
            return rateData
        }
        return (null)
    }

    async update(id, value) {
        const reviewRate = await reviewRateModel.findOne({ _id: id })
        if (!reviewRate) {
            throw ApiError.badRequestError('У вас нет оценок на данный отзыв!')
        }

        const reviewRateDifference = value - reviewRate.value
        reviewRate.value = value
        await reviewRate.save()

        const review = reviewRate.review
        const updatedReview = await reviewService.updateRate(review, reviewRateDifference, 0)
        return updatedReview
    }

    async remove(id) {
        const reviewRate = await reviewRateModel.findOne({ _id: id })
        if (!reviewRate) {
            throw ApiError.badRequestError('У вас нет оценок на данный отзыв!')
        }
        const value = reviewRate.value
        const review = reviewRate.review
        await reviewRateModel.deleteOne({ _id: id })
        const updatedReview = await reviewService.updateRate(review, value, -1)
        return updatedReview
    }
}

export const reviewRateService = new ReviewRateService()