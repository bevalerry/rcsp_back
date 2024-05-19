import { CategoryDTO } from "../dtos/categoryDTO.js"
import { ReviewDTO } from "../dtos/reviewDTO.js"
import { UserDTO } from "../dtos/userDTO.js"
import { categoryModel } from "../models/categoryModel.js"
import { reviewCommentModel } from "../models/reviewCommentModel.js"
import { reviewModel } from "../models/reviewModel.js"
import { reviewRateModel } from "../models/reviewRateModel.js"
import { userModel } from "../models/userModel.js"
import { fileService } from "./fileService.js"
import { reviewRateService } from "./reviewRateService.js"

class ReviewService {
    async create(title, content, author, categoryName, picture) {
        const pictureName = picture ? fileService.saveFile(picture) : null
        const date = new Date()
        const categoryData = new CategoryDTO(await categoryModel.findOne({ title: categoryName }))
        const category = categoryData.id
        const review = await reviewModel
            .create({ title, content, author, category, pictureName, date })
        const relatedAuthor = await userModel.findOne(review.author)
        const relatedCategory = await categoryModel.findOne(review.category)
        const reviewData = new ReviewDTO(review, new UserDTO(relatedAuthor), relatedCategory.title)
        return reviewData
    }

    async getAll(minMark, minDate, maxDate, category, title, orderBy, page, portion) {
        let reviews = Promise.all((await reviewModel.find()).map(async (model) => {
            const category = await categoryModel.findOne(model.category)
            const author = await userModel.findOne(model.author)
            return new ReviewDTO(model, new UserDTO(author), category.title)
        }))
        if (minMark || minDate || maxDate || category || title || orderBy || page || portion) {
            reviews = (await reviews).filter((review, index) => {
                let query = true
                if (page) {
                    if (portion) {
                        query = query && index < page * portion
                    }
                    else {
                        query = query && index < page * 20
                    }
                }
                if (minMark) query = query && review.reliability >= minMark
                if (minDate) query = query && review.date.getTime() >= new Date(minDate).getTime()
                if (maxDate) query = query && review.date.getTime() <= new Date(maxDate).getTime() + 86400000
                if (category) query = query && review.category.toLowerCase().includes(category.toLowerCase())
                if (title) query = query && review.title.toLowerCase().includes(title.toLowerCase())
                return query
            })
            switch (orderBy) {
                case "title_asc":
                    reviews = (await reviews).sort((a,b) =>
                        a.title.localeCompare(b.title, undefined, { numeric: true }))
                    break
                case "title_desc":
                    reviews = (await reviews).sort((a,b) =>
                        b.title.localeCompare(a.title, undefined, { numeric: true }))
                    break
                case "mark_asc":
                    reviews = (await reviews).sort((a,b) => a.reliability >= b.reliability)
                    break
                case "mark_desc":
                    reviews = (await reviews).sort((a,b) => b.reliability >= a.reliability)
                    break
                case "date_asc":
                    reviews = (await reviews).sort((a,b) => a.date.getTime() >= b.date.getTime())
                    break
                case "date_desc":
                    reviews = (await reviews).sort((a,b) => b.date.getTime() >= a.date.getTime())
                    break
                default:
                    break
            }
        }
        return reviews
    }

    async getUserReviews(userId) {
        const reviews = Promise.all((await reviewModel.find({ author: userId }))
            .map(async (model) => {
                const author = await userModel.findOne(model.author)
                const relatedCategory = await categoryModel.findOne(model.category)
                return new ReviewDTO(model, new UserDTO(author), relatedCategory.title)
            })
        )
        return reviews
    }

    async getOne(id) {
        const review = await reviewModel.findOne({ _id: id })
        const author = await userModel.findOne({ _id: review.author })
        const relatedCategory = await categoryModel.findOne(review.category)
        const reviewData = new ReviewDTO(review, new UserDTO(author), relatedCategory.title)
        return reviewData
    }

    async updateRate(id, rate, amountChange) {
        const review = await reviewModel.findOne({ _id: id })
        const newUsersRatedAmount = review.usersRatedAmount + amountChange
        const newSumRates = review.reliability * review.usersRatedAmount + rate
        review.reliability = newUsersRatedAmount === 0 ? 0 : newSumRates / newUsersRatedAmount
        review.usersRatedAmount = newUsersRatedAmount
        const reviewData = await review.save()
        return reviewData
    }

    async remove(id) {
        const deletedReview = await reviewModel.findOne({ _id: id })
        await reviewModel.deleteOne({ _id: id })
        await reviewRateModel.deleteMany({ review: id })
        await reviewCommentModel.deleteMany({ review: id })
        const deletedReviewData = new ReviewDTO(deletedReview, null, null)
        fileService.removeFile(deletedReviewData.pictureName)
        return deletedReviewData
    }
}

export const reviewService = new ReviewService()