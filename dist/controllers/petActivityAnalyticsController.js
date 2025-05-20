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
exports.getPetActivityAnalytics = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const PetActivityInsight_1 = __importDefault(require("../models/PetActivityInsight"));
;
const getPetActivityAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.userId;
        const { activities } = req.body;
        if (!userId || !activities || !Array.isArray(activities)) {
            return res.status(400).json({ error: "userId and activities are required" });
        }
        const activitySummary = activities.map((activity) => {
            return `-${activity.date} | ${activity.activityType} | ${activity.details || ''}`;
        }).join("\n");
        const openai = new openai_1.default({ apiKey: config_1.default.openai_api_key });
        const prompt = `You are a professional pet wellness expert. Here is the activity log for the pet over the last 7 days: ${activitySummary}
        Please provide:
        1. General overview of the pet's lifestyle based on the activities
        2. Any concerns you notice (low activity, irregular meals, poor sleep, etc.)
        3. Suggestions to improve the pet's health and happiness
        4. Motivational advice for the pet owner
        `.trim();
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: "system", content: 'You are a professional pet wellness expert.' },
                { role: 'user', content: prompt },
            ],
        });
        const insights = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No insights available';
        const newActivityInsight = new PetActivityInsight_1.default({
            userId,
            insights,
        });
        yield newActivityInsight.save();
        return res.status(201).json({
            message: 'Pet activity analytics generated successfully',
            data: newActivityInsight,
        });
    }
    catch (error) {
        console.error('Pet Activity Analytic error:', error);
        return res.status(500).json({ error: 'Failed to generate pet activity analytics' });
    }
});
exports.getPetActivityAnalytics = getPetActivityAnalytics;
