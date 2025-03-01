import express from 'express';
import { createComment, getComments, updateComment, deleteComment, getAllComments, replyToComment } from '../controllers/commentController';
import { authenticate } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/:postId/comments', authenticate, createComment);  // Use postId from the URL
router.get('/comments', getAllComments);
router.get('/:postId/comments/', getComments);      // Get comments for an item
router.put('/comments/:commentId',  authenticate, updateComment);  // Update comment
router.delete('/comments/:commentId',  authenticate, deleteComment);  // Delete comment
router.post('/comments/:commentId/reply', replyToComment);  // Reply comment

export default router;


