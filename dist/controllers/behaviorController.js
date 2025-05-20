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
exports.getBehavioralInsightsByUser = exports.getBehavioralInsights = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const BehavioralInsight_1 = __importDefault(require("../models/BehavioralInsight"));
const getBehavioralInsights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.userId;
        const { petType, petAge, behaviorIssue, trainingHistory, activityLevel, customInputs } = req.body;
        if (!behaviorIssue || !petType || !petAge) {
            return res.status(400).json({ error: 'petType, petAge, behaviorIssue are required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User is not authenticated' });
        }
        const openai = new openai_1.default({ apiKey: config_1.default.openai_api_key });
        let customInfo = "";
        if (customInputs && typeof customInputs == "object") {
            customInfo = Object.entries(customInputs).map(([key, value]) => `-${key} : ${value}`).join('\n');
        }
        const prompt = `You are a professional animal behaviorist and trainer.
         A ${petAge}-year-old ${petType} is showing the following behavior issue: ${behaviorIssue}.
         ${trainingHistory ? `Training history: ${trainingHistory}. ` : ''}
         ${activityLevel ? `Activity level: ${activityLevel}.` : ''}
         Additional Info Provide by User: ${customInfo || "None"}
         Please provide:
         1. Possible reason for this behavior
         2. Behavioral insights (psychological/emotional aspects)
         3. Step-by-step training tips to improve or correct the behavior.
         `.trim();
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a professional pet behaviorist and trainer' },
                { role: 'user', content: prompt },
            ],
        });
        const insights = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No insights available';
        const newInsight = new BehavioralInsight_1.default({
            userId,
            petType,
            petAge,
            behaviorIssue,
            trainingHistory,
            activityLevel,
            customInputs,
            insights
        });
        yield newInsight.save();
        console.log('this is behavior Insights Data:', newInsight);
        return res.status(201).json({
            message: 'Behavioral insight generated and saved',
            suggestion: newInsight.insights,
        });
    }
    catch (error) {
        console.error('Behavioral insight error', error);
        return res.status(500).json({ error: 'Behavioral insight generation failed' });
    }
});
exports.getBehavioralInsights = getBehavioralInsights;
const getBehavioralInsightsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const insights = yield BehavioralInsight_1.default.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: 'Behavioral insights fetched successfully',
            data: insights,
        });
    }
    catch (error) {
        console.log('Fetching behavioral insights error:', error);
        return res.status(500).json({ error: 'Failed to fetch behavioral insights' });
    }
});
exports.getBehavioralInsightsByUser = getBehavioralInsightsByUser;
