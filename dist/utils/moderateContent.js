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
exports.moderateContent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const config_1 = __importDefault(require("../config"));
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.default.gemini_api_key);
const moderationModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
const moderateContent = (text) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const prompt = `You are a content moderator. Your task is to analyze the provided input and classify it based on the following harm types:

           * Sexual: Sexually suggestive or explicit.
           
           * SCAM: Exploits, abuses, or endangers children.
           
           * Hate: Promotes violence against, threatens, or attacks people based on their protected characteristics.
           
           * Harassment: Harass, intimidate, or bully others.
           
           * Dangerous: Promotes illegal activities, self-harm, or violence towards oneself or others.
           
           * Toxic: Rude, disrespectful, or unreasonable.
           
           * Violent: Depicts violence, gore, or harm against individuals or groups.
           
           * Profanity: Obscene or vulgar language.
           
           * Illicit: Mentions illicit drugs, alcohol, firearms, tobacco, online gambling.

           Output should be in JSON format: {"violation": (yes or no), "harm_type": "<one of the harm types or null>"}.
          
          Input Prompt: ${text}`;
        const result = yield moderationModel.generateContent({
            contents: [{
                    role: "user",
                    parts: [{ text: prompt }],
                }],
        });
        let responseText = (_e = (_d = (_c = (_b = (_a = result.response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        console.log('Gemini Moderation Response (Prompt-Based):', responseText);
        console.log('Gemini Moderation Response (Raw):', responseText);
        if (responseText) {
            const cleanedResponse = responseText.replace(/```json\n/g, '').replace(/```/g, '');
            try {
                const jsonResponse = JSON.parse(cleanedResponse);
                if (jsonResponse.violation === 'yes') {
                    return {
                        flagged: true,
                        reason: `Flagged by AI for: ${jsonResponse.harm_type}`,
                        harmType: jsonResponse.harm_type,
                    };
                }
            }
            catch (error) {
                console.error('Error parsing Gemini moderation response:', error);
                return { flagged: false, reason: 'Could not parse moderation response.' };
            }
        }
        return { flagged: false, reason: null };
    }
    catch (error) {
        console.error('Gemini API moderation error:', error);
        return { flagged: false, reason: 'Moderation service is currently unavailable.' };
    }
});
exports.moderateContent = moderateContent;
