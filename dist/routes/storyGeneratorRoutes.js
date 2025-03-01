"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storyGeneratorController_1 = require("../controllers/storyGeneratorController");
const storyGeneratorRouter = (0, express_1.Router)();
storyGeneratorRouter.post('/generate-story', storyGeneratorController_1.generatePetStory);
exports.default = storyGeneratorRouter;
