"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthTrendsController_1 = require("../controllers/healthTrendsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const healthTrendsRouter = (0, express_1.Router)();
healthTrendsRouter.post('/predictive-health-trends', authMiddleware_1.authenticate, healthTrendsController_1.getPetHealthPrediction);
exports.default = healthTrendsRouter;
