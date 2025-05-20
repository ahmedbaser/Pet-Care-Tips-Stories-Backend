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
exports.moderateComment = void 0;
const openai_1 = require("openai");
const config_1 = __importDefault(require("../config"));
const openai = new openai_1.OpenAI({
    apiKey: config_1.default.openai_api_key,
});
const moderateComment = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield openai.moderations.create({ input: text });
        const results = response.results[0];
        if (results.flagged) {
            const categories = Object.entries(results.categories)
                .filter(([_, flagged]) => flagged)
                .map(([category]) => category)
                .join(',');
            return {
                flagged: true,
                reason: `Flagged by AI moderation for: ${categories}`,
            };
        }
        return { flagged: false };
    }
    catch (error) {
        console.error('Moderation API error:', error);
        return { flagged: false };
    }
});
exports.moderateComment = moderateComment;
