"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petCareRecommendationController_1 = require("../controllers/petCareRecommendationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const petCareRecommendationRouter = (0, express_1.Router)();
petCareRecommendationRouter.post('/petCare-Recommendation', authMiddleware_1.authenticate, petCareRecommendationController_1.getPetCareRecommendation);
exports.default = petCareRecommendationRouter;
