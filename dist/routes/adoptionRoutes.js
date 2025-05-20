"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiAdoptionMatchController_1 = require("../controllers/aiAdoptionMatchController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const AdoptionRouter = (0, express_1.Router)();
AdoptionRouter.post('/pet-adoption-match', authMiddleware_1.authenticate, aiAdoptionMatchController_1.getPetAdoption);
exports.default = AdoptionRouter;
