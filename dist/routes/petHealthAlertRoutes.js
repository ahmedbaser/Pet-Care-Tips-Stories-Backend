"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const petHealthAlertController_1 = require("../controllers/petHealthAlertController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const petHealthAlertRouter = (0, express_1.Router)();
petHealthAlertRouter.post('/pet-health-alert', authMiddleware_1.authenticate, petHealthAlertController_1.getHealthAlerts);
exports.default = petHealthAlertRouter;
