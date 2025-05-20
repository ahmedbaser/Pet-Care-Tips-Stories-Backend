"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageRecognitionController_1 = require("../controllers/imageRecognitionController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const imageRecognitionRouter = (0, express_1.Router)();
imageRecognitionRouter.post('/image-recognition', authMiddleware_1.authenticate, imageRecognitionController_1.upload, imageRecognitionController_1.analyzeSymptomImage);
exports.default = imageRecognitionRouter;
