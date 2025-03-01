"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbotcontroller_1 = require("../controllers/chatbotcontroller");
const chatRouter = (0, express_1.Router)();
chatRouter.post('/chatbot', chatbotcontroller_1.chatWithBot);
exports.default = chatRouter;
