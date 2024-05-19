import { Schema, model } from 'mongoose'

const TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    authenticationLink: { type: String }
})

export const tokenModel = model("Token", TokenSchema)
