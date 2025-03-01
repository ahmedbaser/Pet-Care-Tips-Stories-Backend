import { Router } from 'express';
import { checkPaymentStatus, createPaymentIntent } from '../controllers/paymentController';



const paymentRouter = Router();

// Create Payment Intent
paymentRouter.post('/create-payment-intent', createPaymentIntent);

// Payment Status Check
paymentRouter.get('/status/:paymentIntentId', checkPaymentStatus);


export default paymentRouter;



 