import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
    userId: string; 
    postId: string; 
    amount: number; 
    paymentMethod: string; // Stripe, Aamarpay, etc.
    paymentDate: Date; 
    currency: string;
    status: string; 
}

const PaymentSchema: Schema = new Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    currency: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, required: true }
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
