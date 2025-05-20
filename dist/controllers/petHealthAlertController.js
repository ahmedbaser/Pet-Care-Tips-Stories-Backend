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
exports.getHealthAlerts = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const HealthAlerts_1 = require("../models/HealthAlerts ");
const getHealthAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.userId;
        const { petType, petAge, symptoms, duration, recentBehavior, customInputs } = req.body;
        if (!symptoms) {
            return res.status(400).json({ error: 'Symptoms are required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User is not authenticated' });
        }
        const openai = new openai_1.default({ apiKey: config_1.default.openai_api_key });
        let customInfo = "";
        if (customInputs && typeof customInputs == "object") {
            customInfo = Object.entries(customInputs).map(([key, value]) => `-${key} : ${value}`).join('\n');
        }
        const prompt = `You are a veterinary health assistant. A ${petAge}-year-old ${petType} is showing the following symptoms: ${symptoms}.
          ${recentBehavior ? `Recent behavior includes: ${recentBehavior}.` : ''}
          ${duration ? `The symptoms have been present for: ${duration}.` : ''}
           
          Additional Info Provide by User: ${customInfo || "None"}
          Include whether it's urgent, possible causes, and recommend next steps.
          `.trim();
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a veterinary health assistant.' },
                { role: 'user', content: prompt },
            ],
        });
        const alertMessage = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No alert generated.';
        const newAlertMessage = new HealthAlerts_1.HealthAlertsRecommendation({
            userId,
            petType,
            petAge,
            symptoms,
            duration,
            recentBehavior,
            customInputs,
            alertMessage,
        });
        yield newAlertMessage.save();
        return res.status(201).json({
            message: 'Pet health alerts generate successfully',
            suggestion: newAlertMessage.alertMessage
        });
    }
    catch (error) {
        console.error("health alert error:", error);
        return res.status(500).json({ error: 'Health alert failed' });
    }
});
exports.getHealthAlerts = getHealthAlerts;
