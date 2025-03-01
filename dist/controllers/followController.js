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
exports.getDiscoverableUsers = exports.getFollowingList = exports.getFollowedUsersContent = exports.unfollowUser = exports.followUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }
        // Convert userId to ObjectId
        const userToFollow = yield User_1.default.findById(new mongoose_1.default.Types.ObjectId(userId));
        console.log('this is userToFollow:', userToFollow);
        if (!userToFollow) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const currentUser = req.user; // Ensure the currentUser is available
        // Ensure current user has "User" role, not "Admin"
        if (currentUser.role !== 'User') {
            return res.status(403).json({ success: false, message: "Only users can follow other users" });
        }
        // Prevent following oneself
        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }
        // Check if the current user is already following the other user
        if (!currentUser.following.includes(userToFollow._id)) {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
            yield currentUser.save();
            yield userToFollow.save();
            return res.status(200).json({ success: true, message: "User followed" });
        }
        return res.status(400).json({ success: false, message: "Already following this user" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.followUser = followUser;
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        console.log('Received userId:', userId);
        // Validate userId format and convert it to ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }
        // Find the user to unfollow
        const userToUnfollow = yield User_1.default.findById(new mongoose_1.default.Types.ObjectId(userId));
        console.log('Backend userToUnfollow:', userToUnfollow);
        if (!userToUnfollow) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const currentUser = req.user;
        console.log('Authenticated currentUser:', currentUser);
        // Ensure current user has "User" role, not "Admin"
        if (currentUser.role !== 'User') {
            return res.status(403).json({ success: false, message: "Only users can unfollow other users" });
        }
        // Ensure following and followers arrays exist
        currentUser.following = currentUser.following || [];
        userToUnfollow.followers = userToUnfollow.followers || [];
        // Remove the user from following and followers arrays
        currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
        // Save updates
        yield currentUser.save();
        yield userToUnfollow.save();
        return res.status(200).json({ success: true, message: "User unfollowed" });
    }
    catch (error) {
        console.error("Error in unfollowUser:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.unfollowUser = unfollowUser;
const getFollowedUsersContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
        const skip = (Number(page) - 1) * Number(limit);
        const currentUser = req.user;
        if (!currentUser.following || currentUser.following.length === 0) {
            return res.status(200).json({ success: true, content: [], metadata: { total: 0, page, limit } });
        }
        const followedContent = yield Post_1.default.find({ author: { $in: currentUser.following } })
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = yield Post_1.default.countDocuments({ author: { $in: currentUser.following } });
        return res.status(200).json({
            success: true,
            content: followedContent,
            metadata: { total, page: Number(page), limit: Number(limit) },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFollowedUsersContent = getFollowedUsersContent;
const getFollowingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10 } = req.query; // Default pagination
        const skip = (Number(page) - 1) * Number(limit);
        // Find the current user and populate basic info of followed users
        const user = yield User_1.default.findById(currentUser._id).populate("following", "_id name email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const followingList = user.following || [];
        // Fetch posts for each followed user
        const followingWithContent = yield Promise.all(followingList.map((followedUser) => __awaiter(void 0, void 0, void 0, function* () {
            const posts = yield Post_1.default.find({ author: followedUser._id })
                .populate("author", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit));
            const totalPosts = yield Post_1.default.countDocuments({ author: followedUser._id });
            return {
                _id: followedUser._id,
                name: followedUser.name,
                email: followedUser.email,
                posts,
                metadata: {
                    totalPosts,
                    page: Number(page),
                    limit: Number(limit),
                },
            };
        })));
        return res.status(200).json({ success: true, following: followingWithContent });
    }
    catch (error) {
        console.error("Error in getFollowingList:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFollowingList = getFollowingList;
const getDiscoverableUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user;
        const followingIds = currentUser.following || [];
        const discoverableUsers = yield User_1.default.find({
            _id: { $nin: [...followingIds, currentUser._id] },
            role: "User"
        }).select("name email");
        return res.status(200).json({ success: true, users: discoverableUsers });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDiscoverableUsers = getDiscoverableUsers;
