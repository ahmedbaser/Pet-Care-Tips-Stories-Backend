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
exports.analyzeSymptomImage = exports.upload = void 0;
const config_1 = __importDefault(require("../config"));
const multer_1 = __importDefault(require("multer"));
const generative_ai_1 = require("@google/generative-ai");
const AnalyzeSymptomImage_1 = require("../models/AnalyzeSymptomImage");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const isAllowed = allowedMimeTypes.includes(file.mimetype);
    if (isAllowed) {
        cb(null, true);
    }
    else {
        req.fileValidationError = 'Only JPG, JPEG, PNG files are allowed';
        cb(null, false);
    }
};
exports.upload = (0, multer_1.default)({ storage, fileFilter }).single("image");
const genAI = new generative_ai_1.GoogleGenerativeAI(config_1.default.gemini_api_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const analyzeSymptomImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const userId = req.userId;
        const { petType, petAge, symptomDescription, customInputs } = req.body;
        const imageFile = req.file;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }
        if (!imageFile) {
            return res.status(400).json({ error: "Image file is required" });
        }
        const base64Image = imageFile.buffer.toString("base64");
        const mimeType = imageFile.mimetype;
        const userPrompt = `
        This is an image of a ${petAge}-year-old ${petType}.
        ${symptomDescription ? `User description of symptoms: ${symptomDescription}.` : ""}
        Additional Info: ${customInputs ? JSON.stringify(customInputs) : "None"}
        
        Based on this image and info, provide:
        - Whether the situation is urgent or not
        - Possible causes of the symptoms
        - Recommended next steps
        `.trim();
        const result = yield model.generateContent([
            userPrompt,
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                },
            },
        ]);
        const response = yield result.response;
        const analysisResult = ((_e = (_d = (_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || "No analysis generated.";
        const PetAnalyzeSymptom = new AnalyzeSymptomImage_1.PetAnalyzeSymptomImage({
            userId,
            petType,
            petAge,
            symptomDescription,
            customInputs,
            analysisResult,
        });
        yield PetAnalyzeSymptom.save();
        return res.status(200).json({
            message: "Image analyzed successfully",
            analysis: PetAnalyzeSymptom.analysisResult,
        });
    }
    catch (error) {
        console.error("Gemini AI Vision error:", error);
        return res.status(500).json({ error: "Failed to analyze image with AI" });
    }
});
exports.analyzeSymptomImage = analyzeSymptomImage;
