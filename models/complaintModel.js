import { Schema, model } from 'mongoose'

const ComplaintSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    target: { type: Schema.Types.ObjectId, ref: "User" },
    review: { type: Schema.Types.ObjectId, ref: "Review" },
    content: { type: String, required: true },
    status: { type: String, default: 'В обработке' },
    date: { type: Schema.Types.Date, required: true }
})

export const complaintModel = model("Complaint", ComplaintSchema)