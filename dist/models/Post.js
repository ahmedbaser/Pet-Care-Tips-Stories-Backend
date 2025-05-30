"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Tip', 'Story', 'Activity', 'Diseases'], required: true },
    isPremium: { type: Boolean, default: false },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    downvotedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Comment' }],
    isPublished: { type: Boolean, default: false },
    previewContent: { type: String, required: false },
    isFlagged: { type: Boolean, default: false },
    moderationReason: { type: String, default: null },
    imageUrl: { type: String }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Post', PostSchema);
