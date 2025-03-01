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
exports.deletePremiumContent = exports.getSinglePremiumContent = exports.getPremiumContent = exports.createPremiumContent = void 0;
const PremiumContent_1 = __importDefault(require("../models/PremiumContent"));
// Create premium content
const createPremiumContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, content, isPremium } = req.body;
        const premiumContent = new PremiumContent_1.default({ title, description, content, isPremium: isPremium === true });
        yield premiumContent.save();
        return res.status(201).json({ success: true, message: "Premium content created", data: premiumContent });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.createPremiumContent = createPremiumContent;
// Get all premium content
const getPremiumContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, isPremium } = req.query;
        // Build query object
        const query = {};
        if (search) {
            // Searching in title and description (case-insensitive)
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (isPremium !== undefined) {
            // Filter by premium status
            query.isPremium = isPremium === 'true'; // Convert to boolean
        }
        const contents = yield PremiumContent_1.default.find(query);
        return res.status(200).json({ success: true, data: contents });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getPremiumContent = getPremiumContent;
// Get single premium content (restricted if premium)
const getSinglePremiumContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = yield PremiumContent_1.default.findById(req.params.contentId);
        if (!content)
            return res.status(404).json({ success: false, message: "Content not found" });
        // Check if the user exists and is not a premium user
        if (content.isPremium && (!req.user || !req.user.isPremium)) {
            return res.status(403).json({ success: false, message: "Access denied. Premium members only." });
        }
        return res.status(200).json({ success: true, data: content });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getSinglePremiumContent = getSinglePremiumContent;
// Delete premium content
const deletePremiumContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = yield PremiumContent_1.default.findById(req.params.contentId);
        if (!content)
            return res.status(404).json({ success: false, message: "Content not found" });
        // Use deleteOne instead of remove
        yield content.deleteOne();
        return res.status(200).json({ success: true, message: "Content deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.deletePremiumContent = deletePremiumContent;
