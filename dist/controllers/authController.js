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
exports.updateProfile = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
// Generate JWT token
const generateToken = (id, isAdmin, phone, address) => {
    return jsonwebtoken_1.default.sign({ id: id.toString(), isAdmin }, process.env.JWT_SECRET, { expiresIn: '48h' });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, address } = req.body;
        const newUser = new User_1.default({
            name,
            email,
            password,
            phone,
            address,
        });
        yield newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = yield User_1.default.findOne({ email, });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }
        // Compare the entered password with the hashed password in the database
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        console.log('Password entered during login:', password);
        console.log('Hashed password in DB:', user.password);
        console.log('Does password match:', isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id, user.isAdmin, user.address || '', user.role || 'user'); // Explicit cast
        res.json({ token, user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, phone: user.phone, address: user.address, role: user.role || 'user', } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.loginUser = loginUser;
// Forgot password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '10h' });
        console.log(`Reset token: ${resetToken}`);
        res.status(200).json({ message: 'Reset token generated', resetToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to process forgot password', error });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        // Find the user by the decoded userId
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        console.log('New hashed password:', hashedPassword);
        // Save the hashed password to the user's record
        user.password = hashedPassword;
        yield user.updateOne({ password: hashedPassword });
        res.status(200).json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Failed to reset password', error });
    }
});
exports.resetPassword = resetPassword;
// Get user info
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'No user ID provided' });
        }
        const user = yield User_1.default.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getMe = getMe;
// Update User Profile (Protected)
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, address } = req.body;
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        // Find the user by ID and update their profile
        const updatedUser = yield User_1.default.findByIdAndUpdate(req.userId, { name, email, phone, address }, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error });
    }
});
exports.updateProfile = updateProfile;
