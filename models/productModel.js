import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema 
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId, 
    required: true,
    ref: 'User'
  }
}, { timestamps: true, versionKey: false }); 

const productSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: ObjectId, ref: 'category', required: true },
  description: { type: String, required: true },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },

}, { timestamps: true, versionKey: false });

const ProductModel = model('Product', productSchema);
export default ProductModel;