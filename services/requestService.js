import { RequestDTO } from "../dtos/requestDTO.js"
import { UserDTO } from "../dtos/userDTO.js"
import { userModel } from "../models/userModel.js"
import { requestModel } from "../models/requestModel.js"

class RequestService {
    async create(title, content, author) {
        const date = new Date()
        const request = await requestModel.create({ title, content, author, date })
        const relatedAuthor = await userModel.findById(request.author)
        const requestData = new RequestDTO(request, new UserDTO(relatedAuthor))
        return requestData
    }

    async getAll() {
        const requests = Promise.all((await requestModel.find()).map(async model => {
            const author = await userModel.findById(model.author)
            return new RequestDTO(model, new UserDTO(author))
        }))
        return requests
    }

    async getUserRequests(userId) {
        const requests = Promise.all((await requestModel.find({ author: userId }))
            .map(async (model) => {
                const author = await userModel.findOne(model.author)
                return new RequestDTO(model, new UserDTO(author))
            })
        )
        return requests
    }

    // async getOne() {

    // }

    async update(id, status) {
        const request = await requestModel.findOne({ _id: id })
        request.status = status
        const updatedRequest = await request.save()
        const relatedAuthor = await userModel.findOne(updatedRequest.author)
        return new RequestDTO(updatedRequest, new UserDTO(relatedAuthor))
    }

    async remove(id) {
        const deletedRequest = await requestModel.deleteOne({ _id: id })
        const deletedRequestData = new RequestDTO(deletedRequest, null)
        return deletedRequestData
    }
}

export const requestService = new RequestService()