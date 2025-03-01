"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/categories', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, categoryController_1.createCategory); // Create category (admin only)
router.get('/categories', categoryController_1.getCategories); // Get all categories
router.put('/categories/:categoryId', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, categoryController_1.updateCategory); // Update category (admin only)
router.delete('/categories/:categoryId', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, categoryController_1.deleteCategory); // Delete category (admin only)
exports.default = router;
