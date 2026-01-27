import express from 'express';
import formidable from 'express-formidable';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import checkId from '../middleware/checkId.js';
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  searchAndPaginateProducts,
} from '../controllers/productController.js';
const router = express.Router();

router
  .route('/')
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route('/allProduct').get(fetchAllProducts);
router
  .route('/:id/reviews')
  .post(authenticate,checkId, addProductReview);

router.route('/top').get(fetchTopProducts);
router.route('/new').get(fetchNewProducts);

router
  .route('/:id')
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route('/filtered-products').post(filterProducts);
router
  .route('/products-list/:pageNo/:perPage/:searchKeyword')
  .get(searchAndPaginateProducts);
export default router;
