import express from 'express';
import { followUser,   getDiscoverableUsers,   getFollowedUsersContent,  getFollowingList,  unfollowUser } from '../controllers/followController';
import { authenticate } from '../middlewares/authMiddleware';
const router = express.Router();



router.put('/users/follow/:userId',  authenticate, followUser);
router.delete('/users/:userId/unfollow',  authenticate, unfollowUser);
router.get('/users/followed', authenticate, getFollowedUsersContent ); //  route for getting followed users
router.get('/users/profile/following', authenticate, getFollowingList);
router.get('/users/discover', authenticate, getDiscoverableUsers);


export default router;









