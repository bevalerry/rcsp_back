import { complaintService } from "../services/complaintService.js"

class ComplaintController {
    async create(req, res, next) {
        try {
            const { author, target, review, content } = req.body
            const complaintCreated = await complaintService.create(author, target, review, content)
            return res.json(complaintCreated)
        } catch (e) {
            next(e)
        }
    }
    async getAll(req, res, next) {
        try {
            const complaints = await complaintService.getAll()
            return res.json(complaints)
        } catch (e) {
            next(e)
        }
    }
    async getUserComplaints(req, res, next) {
        try {
            const { userId } = req.params
            const userComplaints = await complaintService.getUserComplaints(userId)
            return res.json(userComplaints)
        } catch (e) {
            next(e)
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params
            const { status } = req.body
            const updatedComplaint = await complaintService.update(id, status)
            return res.json(updatedComplaint)
        } catch (e) {
            next(e) 
        }
    }
    async remove(req, res, next) {
        try {
            const { id } = req.params
            const complaintDeleted = await complaintService.remove(id)
            return res.json(complaintDeleted)
        } catch (e) {
            next(e)  
        }
    }
}

export const complaintController = new ComplaintController()