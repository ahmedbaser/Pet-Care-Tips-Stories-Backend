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
exports.checkPaymentStatus = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config"));
const Payment_1 = __importDefault(require("../models/Payment"));
const stripe = new stripe_1.default(config_1.default.stripe_secret_key, { apiVersion: '2024-06-20' });
// Create Payment Intent
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, userId } = req.body;
    console.log('Request body:', req.body);
    if (!postId || !userId) {
        return res.status(400).send({ error: 'Post ID and User ID are required' });
    }
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: 10000, // Example amount
            currency: 'usd',
            metadata: { postId, userId },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Payment processing failed' });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const checkPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentIntentId } = req.params;
    try {
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('Payment intent ID:', paymentIntent.id); // Debugging the payment intent ID
        console.log('Payment intent status:', paymentIntent.status); // Debugging the payment intent status
        if (paymentIntent.status === 'succeeded') {
            const payment = new Payment_1.default({
                userId: paymentIntent.metadata.userId,
                postId: paymentIntent.metadata.postId,
                amount: paymentIntent.amount / 100, // Ensure amount is in dollars (divide by 100)
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                paymentDate: new Date(paymentIntent.created * 1000),
                paymentMethod: paymentIntent.payment_method_types[0],
            });
            try {
                const savedPayment = yield payment.save();
                console.log('Saved payment to database:', savedPayment);
                return res.json({ message: 'Payment successful and recorded', data: payment });
            }
            catch (err) {
                console.error('Error saving payment to the database:', err);
                return res.status(500).json({ message: 'Error saving payment', error: err });
            }
        }
        else {
            return res.status(400).json({
                message: `Payment failed with status: ${paymentIntent.status}`,
            });
        }
    }
    catch (error) {
        console.error('Error retrieving payment intent:', error);
        return res.status(500).json({ message: 'Unable to check payment status', error });
    }
});
exports.checkPaymentStatus = checkPaymentStatus;
