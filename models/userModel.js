import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    nickname: { type: String, unique: true, default: null },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    role: { type: String, default: 'user' }
})

export const userModel = model("User", UserSchema)