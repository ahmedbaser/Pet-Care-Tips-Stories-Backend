"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followController_1 = require("../controllers/followController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.put('/users/follow/:userId', authMiddleware_1.authenticate, followController_1.followUser);
router.delete('/users/:userId/unfollow', authMiddleware_1.authenticate, followController_1.unfollowUser);
router.get('/users/followed', authMiddleware_1.authenticate, followController_1.getFollowedUsersContent); //  route for getting followed users
router.get('/users/profile/following', authMiddleware_1.authenticate, followController_1.getFollowingList);
router.get('/users/discover', authMiddleware_1.authenticate, followController_1.getDiscoverableUsers);
exports.default = router;
