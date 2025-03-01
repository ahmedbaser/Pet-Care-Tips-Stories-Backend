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
exports.chatWithBot = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const chatWithBot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }
        const openai = new openai_1.default({
            apiKey: config_1.default.openai_api_key,
        });
        console.log('this is OpenAI secret key:', openai);
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            store: true,
            messages: [
                { role: 'system', content: 'You are a helpful pet care assistant.' },
                { role: 'user', content: message }
            ]
        });
        return res.json({ response: ((_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) || 'No response' });
    }
    catch (error) {
        console.log('Chatbot error', error);
        return res.status(500).json({ error: 'Failed to fetch response' });
    }
});
exports.chatWithBot = chatWithBot;
