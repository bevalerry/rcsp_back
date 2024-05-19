import { ReviewCommentDTO } from "../dtos/reviewCommentDTO.js"
import { UserDTO } from "../dtos/userDTO.js"
import { ApiError } from "../exceptions/apiError.js"
import { reviewCommentModel } from "../models/reviewCommentModel.js"
import { userModel } from "../models/userModel.js"


class ReviewCommentService {
    async create(author, review, content) {
        const reviewCommentExists = await reviewCommentModel.findOne({ author, review })
        if (reviewCommentExists) {
            throw ApiError.badRequestError("Вы уже оставляли комментарий на данный отзыв!")
        }
        const date = new Date()
        const reviewComment = await reviewCommentModel.create({ author, review, content, date })
        const authorData = userModel.findOne({ _id: author })
        return new ReviewCommentDTO(reviewComment, new UserDTO(authorData))
    }

    async getAllByReview(review) {
        const comments = Promise.all((await reviewCommentModel.find({ review }))
            .map(async (comment) => {
                const author = await userModel.findOne({ _id: comment.author })
                return new ReviewCommentDTO(comment, new UserDTO(author))
            })
        )
        return comments
    }

    async remove(id) {
        await reviewCommentModel.deleteOne({ _id: id })
        return true
    }
}

export const reviewCommentService = new ReviewCommentService()