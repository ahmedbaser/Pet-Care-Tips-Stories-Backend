"use strict";
// import { model, Schema } from "mongoose";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
// interface IChat {
//     message?: string;
//     GetChat: string;
// }
// const ChatSchema = new Schema<IChat>({
//     message:{type: String},
//     GetChat:{type: String}
// })
// export const Chat = model<IChat>('Chat', ChatSchema);
// models/chat.model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    role: { type: String, required: true }, // e.g., 'assistant'
    createdAt: { type: Date, default: Date.now }
});
exports.Chat = mongoose_1.default.model('Chat', chatSchema);
