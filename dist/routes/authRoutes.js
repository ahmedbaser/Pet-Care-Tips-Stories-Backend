"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authRouter = (0, express_1.Router)();
// Signup Route
authRouter.post('/signup', authController_1.registerUser);
// Login Route
authRouter.post('/login', authController_1.loginUser);
// Forgot Password Route
authRouter.post('/forgot-password', authController_1.forgotPassword);
// Reset Password Route
authRouter.post('/reset-password/:token', authController_1.resetPassword);
// Protected Route (Example)
authRouter.get('/me', authMiddleware_1.authenticate, authController_1.getMe);
authRouter.put('/update-profile', authMiddleware_1.authenticate, validationMiddleware_1.updateProfileValidation, validationMiddleware_1.validate, authController_1.updateProfile);
exports.default = authRouter;
