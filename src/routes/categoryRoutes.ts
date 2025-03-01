import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController';
import { adminOnly, authenticate } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/categories',  authenticate, adminOnly, createCategory);       // Create category (admin only)
router.get('/categories', getCategories);                            // Get all categories
router.put('/categories/:categoryId',  authenticate, adminOnly, updateCategory);  // Update category (admin only)
router.delete('/categories/:categoryId',  authenticate, adminOnly, deleteCategory); // Delete category (admin only)

export default router;
