import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  replies: mongoose.Schema.Types.ObjectId[];  
  parentComment?: mongoose.Schema.Types.ObjectId | null;  // Parent comment ID if it's a reply
  createdAt: Date;
}


const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],  // Array of reply IDs
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },  // Parent comment reference
    
  },
  { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);




