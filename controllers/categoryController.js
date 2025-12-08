import asycHandler from "../middleware/asyncHandler.js";
import CategoryModel from "../models/categoryModel.js";

export const createCategory = asycHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existingCategory = await CategoryModel.findOne({ name }); 
    if (existingCategory) {
      return res.status(400).json({ message: "Already exists" });
    }
 const category = await CategoryModel({ name }).save();
    return res.status(201).json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
})

export const updateCategory = asycHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await CategoryModel.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.name = name 
    const updatedCategory = await category.save();
    res.json({
      status: "success",
      data: updatedCategory,
    });
  }catch (error) {
    console.error(error);
    return res.status(400).json(error);
  } 
})

export const removeCategory = asycHandler(async (req, res) => {
  try {
    const removed = await CategoryModel.findByIdAndDelete(req.params.categoryId);
    res.json({
      status: "success",
      data: removed,
    })
  
}catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
}) 

export const listCategory = asycHandler(async (req, res) => {
  try {
    const categories = await CategoryModel.find({}) 
    res.status(200).json({
      status: "success",
      total: categories.length,
      data: categories,
    });
}catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
})

export const readCategory = asycHandler(async (req, res) => {
  try {
  const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      status: "success",
      data: category,
    });
}catch (error) {
    console.error(error);
    return res.status(400).json(error);
  } 
})