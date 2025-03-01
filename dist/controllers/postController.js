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
exports.deletePost = exports.downvotePost = exports.upvotePost = exports.getPostById = exports.getPostsByAuthorId = exports.getPosts = exports.updatePost = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
// Create a Post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, category, isPremium, isPublished, imageUrl } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const post = new Post_1.default({
            title,
            content,
            category,
            isPremium,
            isPublished,
            author: req.user._id,
            imageUrl,
        });
        yield post.save();
        res.status(201).json(post);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating post', error });
    }
});
exports.createPost = createPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, category, isPremium, isPublished, imageUrl } = req.body;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own posts' });
        }
        const updatePost = yield Post_1.default.findByIdAndUpdate(req.params.id, { $set: { title, content, category, isPremium, isPublished, imageUrl } }, { new: true, runValidators: true });
        console.log("Received Update Request:", req.body);
        console.log("Updated Post in Backend:", updatePost === null || updatePost === void 0 ? void 0 : updatePost.content);
        res.json(updatePost);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating post', error });
    }
});
exports.updatePost = updatePost;
// Get All Posts
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().populate('author', 'name');
        console.log('this is backend Posts:', posts);
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});
exports.getPosts = getPosts;
// Get Post by author Id
const getPostsByAuthorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorId = req.params.authorId;
    try {
        const posts = yield Post_1.default.find({ author: authorId }).populate('author', 'name'); // Filter posts by author ID
        if (!posts.length) {
            return res.status(404).json({ message: "No posts found for this author" });
        }
        console.log("Posts by author:", posts);
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts by author', error });
    }
});
exports.getPostsByAuthorId = getPostsByAuthorId;
// Get Single Post
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving post", error });
    }
});
exports.getPostById = getPostById;
// Upvote post
const upvotePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (post) {
            post.upvotes = (post.upvotes || 0) + 1;
            yield post.save();
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to upvote post', error });
    }
});
exports.upvotePost = upvotePost;
// Downvote post
const downvotePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (post) {
            post.downvotes = (post.downvotes || 0) + 1;
            yield post.save();
            res.status(200).json(post);
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to downvote post', error });
    }
});
exports.downvotePost = downvotePost;
// Delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const postId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }
        // Use deleteOne instead of remove
        yield Post_1.default.deleteOne({ _id: post._id });
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});
exports.deletePost = deletePost;
