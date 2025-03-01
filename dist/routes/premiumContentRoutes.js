"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const premiumContentController_1 = require("../controllers/premiumContentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/premium-content', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, premiumContentController_1.createPremiumContent); // Admin only to create
router.get('/premium-content', premiumContentController_1.getPremiumContent); // Public can view list of premium contents
router.get('/premium-content/:contentId', authMiddleware_1.authenticate, premiumContentController_1.getSinglePremiumContent); // Protected, premium users get access
router.get('/premium-content/:contentId', authMiddleware_1.authenticate, premiumContentController_1.getSinglePremiumContent);
router.delete('/premium-content/:contentId', authMiddleware_1.authenticate, authMiddleware_1.adminOnly, premiumContentController_1.deletePremiumContent); // Admin only to delete
exports.default = router;
