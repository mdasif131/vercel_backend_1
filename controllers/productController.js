import fs from 'fs/promises';
import asycHandler from '../middleware/asyncHandler.js';
import ProductModel from '../models/productModel.js';
import { getValidImagePath } from '../utils/removeUploadImgPath.js';

export const addProduct = asycHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // validation
    switch (true) {
      case !name:
        return res.status(400).json({ message: 'Name is required' });
      case !description:
        return res.status(400).json({ message: 'Description is required' });
      case !price:
        return res.status(400).json({ message: 'Price is required' });
      case !category:
        return res.status(400).json({ message: 'Category is required' });
      case !quantity:
        return res.status(400).json({ message: 'Quantity is required' });
      case !brand:
        return res.status(400).json({ message: 'Brand is required' });
    }

    const product = new ProductModel({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export const updateProductDetails = asycHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;

    // validation
    switch (true) {
      case !name:
        return res.status(400).json({ message: 'Name is required' });
      case !description:
        return res.status(400).json({ message: 'Description is required' });
      case !price:
        return res.status(400).json({ message: 'Price is required' });
      case !category:
        return res.status(400).json({ message: 'Category is required' });
      case !quantity:
        return res.status(400).json({ message: 'Quantity is required' });
      case !brand:
        return res.status(400).json({ message: 'Brand is required' });
    }
    const proudct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    res.json(proudct);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export const removeProduct = asycHandler(async (req, res) => {
 const { id } = req.params;

 const product = await ProductModel.findById(id);
 if (!product) {
   return res.status(404).json({ message: 'Product not found' });
 }

 // Delete image if exists
 if (product.image) {
   try {
     const imagePath = getValidImagePath(product.image); // ✅ Correct name
     if (imagePath) {
       await fs.unlink(imagePath);
       console.log("Deleted image successfully");
     }
   } catch (err) {
     console.warn(`⚠️ Could not delete image: ${err.message}`);
   }
 }

 // Delete from DB
 await ProductModel.findByIdAndDelete(id);
 return res.json(product);

 
});


// export const removeProduct = asycHandler(async (req, res) => {

//   try {
//     const product = await ProductModel.findByIdAndDelete(req.params.id);

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error.message);
//   }
// });
// 
export const fetchProducts = asycHandler(async (req, res) => {
  try {   
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const count = await ProductModel.countDocuments({ ...keyword });
    const products = await ProductModel.find({ ...keyword }).limit(pageSize);
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  }catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export const fetchProductById = asycHandler(async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Product not found' });
  }
});

export const fetchAllProducts = asycHandler(async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Product not found' });
  }
});

export const addProductReview = asycHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
         res.status(400);
         throw new Error('Product already reviewed');
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
export const fetchTopProducts = asycHandler(async (req, res) => {
  try {
    const products = await ProductModel.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Product not found' });
  }
});
export const fetchNewProducts = asycHandler(async (req, res) => {
  try {
    const products = await ProductModel.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Product not found' });
  }
});

export const filterProducts = asycHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked.length > 0) args.category = checked; 
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; 
    
    const products = await ProductModel.find(args); 
   res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Could not filter products' });
  }
})