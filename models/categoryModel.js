import { Schema, model } from 'mongoose'

const CategorySchema = new Schema({
    title: { type: String, required: true },
    pictureName: { type: String, required: true },
    request: { type: Schema.Types.ObjectId, ref: "UserRequest", default: null},
    author: { type: Schema.Types.ObjectId, ref: "User" }
})

export const categoryModel = model("Category", CategorySchema)
