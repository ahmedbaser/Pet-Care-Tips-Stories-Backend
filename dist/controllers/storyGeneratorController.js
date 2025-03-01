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
exports.generatePetStory = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
console.log('API Key from environment:', process.env.GENERATE_PET_KEY);
const generatePetStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { petType, petName } = req.body;
        if (!petType || !petName) {
            return res.status(400).json({ error: 'Pet type and pet name are required' });
        }
        console.log('Pet Type:', petType);
        console.log('Pet Name:', petName);
        console.log("Using API Key:", config_1.default.generate_stroy_key);
        const openai = new openai_1.default({
            apiKey: config_1.default.generate_stroy_key,
        });
        console.log('this is openAi key:', openai);
        const prompt = `Write a short, fun, and engaging story about a ${petType} named ${petName}. The story should be suitable for pet owners and highlight the unique personality of ${petName}.`;
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are a creative writer who specializes in crafting fun and engaging stories about pets.',
                },
                { role: 'user', content: prompt },
            ],
        });
        const story = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No story generated.';
        return res.json({ story });
    }
    catch (error) {
        console.error('Story generation error:', error);
        return res.status(500).json({ error: 'Failed to generate story' });
    }
});
exports.generatePetStory = generatePetStory;
