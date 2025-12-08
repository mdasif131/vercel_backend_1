import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 32, unique: true },
  },
  { versionKey: false }
);

const CategoryModel = model('category', categorySchema);
export default CategoryModel;
