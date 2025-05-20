"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    jwt_secret: process.env.JWT_SECRET,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    openai_api_key: process.env.OPENAI_SECRET_API_KEY,
    cohere_api_key: process.env.COHERE_API_KEY,
    generate_stroy_key: process.env.GENERATE_PET_KEY,
    gemini_api_key: process.env.GEMINI_API_KEY
};
