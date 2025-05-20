"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlaggedPosts = exports.getPaymentHistory = exports.togglePostPublish = exports.deletePost = exports.deleteUser = exports.getAllPosts = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
const Payment_1 = __importDefault(require("../models/Payment"));
const stripe = new stripe_1.default(config_1.default.stripe_secret_key, { apiVersion: '2024-06-20' });
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find();
        console.log('this is users:', users);
        // Map users to include a role property based on isAdmin
        const usersWithRole = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isPremium: user.isPremium,
            following: user.following,
            followers: user.followers,
            role: user.isAdmin ? 'Admin' : 'User', // Map isAdmin to role
            __v: user.__v
        }));
        res.status(200).json(usersWithRole);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});
exports.getAllUsers = getAllUsers;
// Get all posts (admin-only)
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find();
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});
exports.getAllPosts = getAllPosts;
// // Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUser = deleteUser;
// Delete post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to delete post with ID:", req.params.id);
        const post = yield Post_1.default.findByIdAndDelete(req.params.id);
        if (!post) {
            console.log("Post not found with ID:", req.params.id);
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ success: true, message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: 'Error deleting post', error });
    }
});
exports.deletePost = deletePost;
// Publish/Unpublish post (admin-only)
const togglePostPublish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (post) {
            post.isPublished = !post.isPublished;
            yield post.save();
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update post status' });
    }
});
exports.togglePostPublish = togglePostPublish;
// Fetch payment history
const getPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, status, startDate, endDate } = req.query;
        const query = {};
        if (userId)
            query.userId = userId;
        if (status)
            query.status = status;
        if (startDate || endDate) {
            query.paymentDate = {};
            if (startDate)
                query.paymentDate.$gte = new Date(startDate);
            if (endDate)
                query.paymentDate.$lte = new Date(endDate);
        }
        const payments = yield Payment_1.default.find(query).sort({ paymentDate: -1 });
        console.log('this is payments:', payments);
        return res.status(200).json({
            success: true,
            message: 'Payment history retrieved successfully',
            data: payments
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve payment history',
        });
    }
});
exports.getPaymentHistory = getPaymentHistory;
const getFlaggedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find({ isFlagged: true }).populate('author', 'name');
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error });
    }
});
exports.getFlaggedPosts = getFlaggedPosts;
