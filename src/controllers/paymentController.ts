import { Request, Response } from 'express';
import Stripe from 'stripe';
import config from '../config';
import Payment from '../models/Payment';

const stripe = new Stripe(config.stripe_secret_key as string, { apiVersion: '2024-06-20' });

// Create Payment Intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  const { postId, userId } = req.body; 
  console.log('Request body:', req.body)
  if (!postId || !userId) {
    return res.status(400).send({ error: 'Post ID and User ID are required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // Example amount
      currency: 'usd',
      metadata: { postId, userId },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Payment processing failed' });
  }
}




export const checkPaymentStatus = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log('Payment intent ID:', paymentIntent.id);  // Debugging the payment intent ID
    console.log('Payment intent status:', paymentIntent.status);  // Debugging the payment intent status

    if (paymentIntent.status === 'succeeded') {
      const payment = new Payment({
        userId: paymentIntent.metadata.userId,
        postId: paymentIntent.metadata.postId,
        amount: paymentIntent.amount / 100,  // Ensure amount is in dollars (divide by 100)
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentDate: new Date(paymentIntent.created * 1000),
        paymentMethod: paymentIntent.payment_method_types[0],
      });

      try {
        const savedPayment = await payment.save();
        console.log('Saved payment to database:', savedPayment);
        return res.json({ message: 'Payment successful and recorded', data: payment });
      } catch (err) {
        console.error('Error saving payment to the database:', err);
        return res.status(500).json({ message: 'Error saving payment', error: err });
      }
    } else {
      return res.status(400).json({
        message: `Payment failed with status: ${paymentIntent.status}`,
      });
    }
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return res.status(500).json({ message: 'Unable to check payment status', error });
  }
};

