import { Schema, model } from 'mongoose'

const RequestSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    content: { type: String },
    status: { type: String, default: 'В обработке' },
    date: { type: Schema.Types.Date, required: true }
})

export const requestModel = model("UserRequest", RequestSchema)
