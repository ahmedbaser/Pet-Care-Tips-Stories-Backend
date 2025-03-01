import mongoose, { Schema, Document } from 'mongoose';

export interface IPremiumContent extends Document {
    title: string;
    description: string;
    content: string; // This can be text, image links, or anything relevant
    isPremium: boolean; // Flag to indicate if this is premium content
}

const premiumContentSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    isPremium: {
        type: Boolean,
        default: false, // False for non-premium content
    }
}, { timestamps: true });

export default mongoose.model<IPremiumContent>('PremiumContent', premiumContentSchema);
