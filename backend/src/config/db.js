import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        const connection = await mongoose.connect("mongodb://127.0.0.1:27017/xuongnodejs").then(()=>{
            console.log("mongodb://localhost:27017/xuongnodejs")
        });
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}