import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: Number,
        price: Number,
    }],
    total: Number,
    totalAfterDiscount: Number,
    information: {
        lastName: String,
        firstName: String,
        phone: String,
        company: String,
        country: String,
        address: String,
        city: String,
        province: String,
        zip_code: String,
        email: String,
        note: String,
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, {
    versionKey: false,
    timestamps: true,
});

//Export the model
export default mongoose.model('order', cartSchema);