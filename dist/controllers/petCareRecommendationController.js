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
exports.getPetCareRecommendation = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const PetCareRecommendation_1 = require("../models/PetCareRecommendation");
const getPetCareRecommendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId, petType, petAge, petHealthConcerns, petDietPreferences, activityLevel, weight, location, customInputs } = req.body;
        if (!petType || !petAge) {
            return res.status(400).json({ error: "Pet type and pet age are required" });
        }
        const openai = new openai_1.default({
            apiKey: config_1.default.openai_api_key,
        });
        let customInfo = "";
        if (customInputs && typeof customInputs == 'object') {
            customInfo = Object.entries(customInputs).map(([key, value]) => `-${key}: ${value}`).join('\n');
        }
        const prompt = `You are a professional pet care expert offering personalized and practical advice. Provide care tips for a ${petAge}-year-old ${petType}.
        ${petHealthConcerns ? `Health concerns include: ${petHealthConcerns}.` : ''}
        ${petDietPreferences ? `Diet preference: ${petDietPreferences}.` : ''}
        ${activityLevel ? `ActivityLevel: ${activityLevel}.` : ''}
        ${weight ? `Weight: ${weight} kg.` : ''}
        ${location ? `The pet lives in ${location}. Adjust care tips for the local climate if relevant.` : ''}

        Additional Info Provide by User: ${customInfo || 'None'}

        Include suggestions for diet, exercise, grooming, mental stimulation, and routine health checks.
        `.trim();
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a pet care specialist...',
                },
                { role: 'user', content: prompt }
            ],
        });
        const careTips = ((_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content) || 'No tips generated.';
        const newCareTips = new PetCareRecommendation_1.PetCareRecommendations({
            userId,
            petType,
            petAge,
            petHealthConcerns,
            petDietPreferences,
            activityLevel,
            weight,
            location,
            customInputs,
            careTips,
        });
        return res.status(201).json({
            message: 'Pet health prediction generate successfully',
            suggestion: newCareTips.careTips
        });
    }
    catch (error) {
        console.error('Pet care recommendation error:', error);
        return res.status(500).json({ error: 'Failed pet care recommendations' });
    }
});
exports.getPetCareRecommendation = getPetCareRecommendation;
