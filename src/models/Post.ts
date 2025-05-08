import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from './Comment'; 

export interface IPost extends Document {
    title: string;
    content: string;
    category: 'Tip' | 'Story' | 'Activity' | 'Diseases';
    isPremium: boolean;
    author: Schema.Types.ObjectId;
    upvotes: number;
    downvotes: number;
    upvotedBy: Schema.Types.ObjectId[]; 
    downvotedBy: Schema.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[]; 
    isPublished: boolean;
    imageUrl?: string;
    previewContent?: string;
    isFlagged: boolean;
    moderationReason: string;
}

const PostSchema: Schema<IPost> = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Tip', 'Story','Activity','Diseases'], required: true },
    isPremium: { type: Boolean, default: false },  
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
    upvotes: { type: Number, default: 0 },   
    downvotes: { type: Number, default: 0 }, 
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    downvotedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment'}],
    isPublished: { type: Boolean, default: false },  
    previewContent: { type: String, required: false },
    isFlagged: {type: Boolean, default: false},
    moderationReason: {type: String, default: null},  
    imageUrl: {type: String}
}, { timestamps: true });

export default mongoose.model<IPost>('Post', PostSchema);




















