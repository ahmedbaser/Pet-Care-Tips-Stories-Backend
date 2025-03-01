"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/:postId/comments', authMiddleware_1.authenticate, commentController_1.createComment); // Use postId from the URL
router.get('/comments', commentController_1.getAllComments);
router.get('/:postId/comments/', commentController_1.getComments); // Get comments for an item
router.put('/comments/:commentId', authMiddleware_1.authenticate, commentController_1.updateComment); // Update comment
router.delete('/comments/:commentId', authMiddleware_1.authenticate, commentController_1.deleteComment); // Delete comment
router.post('/comments/:commentId/reply', commentController_1.replyToComment); // Reply comment
exports.default = router;
