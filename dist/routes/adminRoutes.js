"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/users', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, adminController_1.getAllUsers);
router.delete('/users/:id', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, adminController_1.deleteUser);
router.get('/posts', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, adminController_1.getAllPosts);
router.put('/posts/:id/publish', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, adminController_1.togglePostPublish);
router.get('/payments', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, adminController_1.getPaymentHistory);
router.delete('/posts/:id', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, adminController_1.deletePost);
exports.default = router;
