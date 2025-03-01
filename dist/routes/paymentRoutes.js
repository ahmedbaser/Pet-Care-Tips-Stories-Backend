"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const paymentRouter = (0, express_1.Router)();
// Create Payment Intent
paymentRouter.post('/create-payment-intent', paymentController_1.createPaymentIntent);
// Payment Status Check
paymentRouter.get('/status/:paymentIntentId', paymentController_1.checkPaymentStatus);
exports.default = paymentRouter;
