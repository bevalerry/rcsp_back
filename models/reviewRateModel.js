import { Schema, model } from 'mongoose'

const ReviewRateSchema = new Schema({
    review: { type: Schema.Types.ObjectId, ref: "Review" },
    value: { type: Number, float: true, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" }
})

export const reviewRateModel = model("ReviewRate", ReviewRateSchema)