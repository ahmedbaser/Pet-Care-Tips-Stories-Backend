import { Router } from "express";
import { chatWithBot } from "../controllers/chatbotcontroller";

const chatRouter = Router();

chatRouter.post('/chatbot', chatWithBot);

export default chatRouter;