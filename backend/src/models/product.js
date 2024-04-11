import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      lowercase: true,
   },
   slug: {
      type: String,

   },
   category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
   },
   price: {
      type: Number,
      required: true,
      default: 0,
   },
   image: {
      type: String,
   },

   description: {
      type: String,
   },
   discount: {
      type: Number,
      default: 0,
   },
   countInStock: {
      type: Number,
      default: 0,
   },
   featured: {
      type: Boolean,
      default: false,
   },
   tag: {
      type: Array,
   },
});

export default mongoose.model('Product', productSchema);