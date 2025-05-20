"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petActivityAnalyticsController_1 = require("../controllers/petActivityAnalyticsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const PetActivityAnalyticsRouter = (0, express_1.Router)();
PetActivityAnalyticsRouter.post('/pet-analytics', authMiddleware_1.authenticate, petActivityAnalyticsController_1.getPetActivityAnalytics);
exports.default = PetActivityAnalyticsRouter;
