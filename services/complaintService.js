import { ComplaintDTO } from "../dtos/complaintDTO.js"
import { UserDTO } from "../dtos/userDTO.js"
import { ApiError } from "../exceptions/apiError.js"
import { complaintModel } from "../models/complaintModel.js"
import { reviewModel } from "../models/reviewModel.js"
import { userModel } from "../models/userModel.js"


class ComplaintService {
    async create(author, target, review, content) {
        const complaint = await complaintModel.findOne({ author, target, review })
        if (complaint) {
            throw ApiError.badRequestError("Вы уже оставляли жалобу на данный отзыв!")
        }
        const date = new Date()
        await complaintModel.create({ author, target, review, content, date })
        return true
    }

    async getAll() {
        const complaints = Promise.all((await complaintModel.find())
            .map(async (complaint) => {
                const author = await userModel.findOne({ _id: complaint.author })
                const target = await userModel.findOne({ _id: complaint.target })
                const review = await reviewModel.findOne({ _id: complaint.review })
                return new ComplaintDTO(complaint, new UserDTO(author), new UserDTO(target), review?.content)
            })
        )
        return complaints
    }

    async getUserComplaints(author) {
        const userComplaints = Promise.all((await complaintModel.find({ author }))
            .map(async (complaint) => {
                const author = await userModel.findOne({ _id: complaint.author })
                const target = await userModel.findOne({ _id: complaint.target })
                const review = await reviewModel.findOne({ _id: complaint.review })
                return new ComplaintDTO(complaint, new UserDTO(author), new UserDTO(target), review?.content)
            })
        )
        return userComplaints
    }

    async update(id, status) {
        const complaint = await complaintModel.findOne({ _id: id })
        complaint.status = status
        const updatedComplaint = await complaint.save()
        const relatedAuthor = await userModel.findById(updatedComplaint.author)
        const relatedTarget = await userModel.findById(updatedComplaint.target)
        const relatedReview = await reviewModel.findById(updatedComplaint.review)
        return new ComplaintDTO(updatedComplaint, new UserDTO(relatedAuthor), new UserDTO(relatedTarget), relatedReview?.content)
    }

    async remove(id) {
        await complaintModel.deleteOne({ _id: id })
        return true
    }
}

export const complaintService = new ComplaintService()