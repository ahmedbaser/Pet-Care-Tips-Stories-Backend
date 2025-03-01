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
exports.replyToComment = exports.deleteComment = exports.updateComment = exports.getAllComments = exports.getComments = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const Post_1 = __importDefault(require("../models/Post"));
// Create Comment Controller 
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Find the post by ID
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        // Create the new comment
        const newComment = new Comment_1.default({
            content: comment,
            author: req.user.id,
            post: postId,
        });
        yield newComment.save();
        // Populate author field in the newly saved comment
        yield newComment.populate('author', 'name');
        // Push the comment to the post's comments array
        post.comments.push(newComment._id);
        yield post.save();
        // Return success response
        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: newComment,
        });
    }
    catch (error) {
        console.error('Error creating comment:', error);
        const errMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({
            success: false,
            message: 'Failed to create comment',
            error: errMessage,
        });
    }
});
exports.createComment = createComment;
// Get comments for an item
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.default.find({ post: req.params.postId })
            .populate('author', 'name') // Assuming 'name' is a field on the User model
            .populate('replies') // Populate replies with full comment documents
            .exec();
        return res.status(200).json({ success: true, data: comments });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getComments = getComments;
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Fetching all comments..."); // Debug log
    try {
        const comments = yield Comment_1.default.find(); // Fetch all comments
        return res.status(200).json({ success: true, data: comments });
    }
    catch (error) {
        console.error("Error fetching comments:", error); // Error log
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAllComments = getAllComments;
// Update comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const comment = yield Comment_1.default.findById(req.params.commentId);
        if (!comment)
            return res.status(404).json({ success: false, message: "Comment not found" });
        // Ensure only the author can update the comment
        if (comment.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        comment.content = req.body.content || comment.content;
        yield comment.save();
        return res.status(200).json({ success: true, message: "Comment updated", data: comment });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateComment = updateComment;
// Delete comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const comment = yield Comment_1.default.findById(req.params.commentId);
        if (!comment)
            return res.status(404).json({ success: false, message: "Comment not found" });
        // Ensure only the author can delete the comment
        if (comment.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }
        yield comment.deleteOne(); // Use deleteOne instead of remove
        return res.status(200).json({ success: true, message: "Comment deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteComment = deleteComment;
// Reply to a Comment
const replyToComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const { reply } = req.body;
    try {
        // Fetch the original comment to get authorId and postId
        const originalComment = yield Comment_1.default.findById(commentId);
        if (!originalComment) {
            return res.status(404).json({ message: 'Original comment not found' });
        }
        const newReply = new Comment_1.default({
            content: reply,
            author: originalComment.author,
            post: originalComment.post,
            parentComment: commentId,
        });
        yield newReply.save();
        yield Comment_1.default.findByIdAndUpdate(commentId, { $push: { replies: newReply._id } });
        res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            data: newReply,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to reply to comment', error });
    }
});
exports.replyToComment = replyToComment;
