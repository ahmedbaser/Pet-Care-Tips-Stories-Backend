"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const behavioralInsightSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    petType: { type: String },
    petAge: { type: Number },
    behaviorIssue: { type: String },
    trainingHistory: { type: String },
    activityLevel: { type: String },
    insights: { type: String },
    suggestion: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const BehavioralInsight = mongoose_1.default.model('BehavioralInsight', behavioralInsightSchema);
exports.default = BehavioralInsight;
