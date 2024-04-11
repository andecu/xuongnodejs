import mongoose from "mongoose";

export const connectDB = async(uri) => {
    try {
        const connection = await mongoose.connect(uri);
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}