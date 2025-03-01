import { Router } from 'express';
import { createPost, getPosts, upvotePost, downvotePost, getPostById, deletePost, getPostsByAuthorId, updatePost } from '../controllers/postController';
import { authenticate } from '../middlewares/authMiddleware';




const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.get('/:id', getPostById)
postRouter.put('/:id', authenticate, updatePost)
postRouter.get('/author/:authorId', getPostsByAuthorId)
postRouter.post('/', authenticate, createPost);
postRouter.delete('/:id', authenticate, deletePost);
postRouter.post('/:id/upvote', authenticate, upvotePost);
postRouter.post('/:id/downvote', authenticate, downvotePost);


export default postRouter;

