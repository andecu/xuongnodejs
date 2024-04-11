
import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlenght: 30,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlenght: 30,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar: {
        type: String,
        default: "../upload/default-avata.png"
    }
}, { timestamps: true, versionKey: false })

export default mongoose.model("User", userSchema)