import express from 'express';
import { getAllUsers, getAllPosts, togglePostPublish, getPaymentHistory, deleteUser, deletePost, getFlaggedPosts } from '../controllers/adminController';
import { adminOnly, authenticate } from '../middlewares/authMiddleware';


const router = express.Router();

router.get('/users', authenticate, adminOnly, getAllUsers);
router.delete('/users/:id', authenticate, adminOnly, deleteUser);
router.get('/posts', authenticate, adminOnly, getAllPosts);
router.put('/posts/:id/publish', authenticate, adminOnly, togglePostPublish);
router.get('/payments',authenticate, adminOnly, getPaymentHistory);
router.delete('/posts/:id', authenticate, adminOnly, deletePost); 
router.get('/flagged', authenticate, getFlaggedPosts)

export default router;






















