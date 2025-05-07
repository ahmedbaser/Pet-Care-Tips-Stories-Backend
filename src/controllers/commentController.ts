import { Response, Request } from 'express';  
import mongoose from 'mongoose';
import Comment, { IComment } from '../models/Comment';
import { AuthenticatedRequest } from '../types/types';
import Post from '../models/Post';
import { moderateComment } from '../utils/moderateComment';



// Create Comment Controller 
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

   // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // AI Moderation
    const moderationResult = await moderateComment(comment);
    if(moderationResult.flagged) {
      return res.status(400).json({
        success: false,
        message: 'Comment rejected due to content moderation',
        reason: moderationResult.reason,
      });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Create the new comment
    const newComment = new Comment({
      content: comment,
      author: req.user.id,
      post: postId,
    }) as unknown as IComment & { _id: mongoose.Types.ObjectId };

    await newComment.save();

    // Populate author field in the newly saved comment
    await newComment.populate('author', 'name');

    // Push the comment to the post's comments array
    post.comments.push(newComment._id as mongoose.Types.ObjectId);
    await post.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: newComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    const errMessage = error instanceof Error ? error.message : 'An unknown error occurred';
     res.status(500).json({
      success: false,
      message: 'Failed to create comment',
      error: errMessage,
    });
  }
};



// Get comments for an item
export const getComments = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    
      const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'name')  // Assuming 'name' is a field on the User model
          .populate('replies') // Populate replies with full comment documents
          .exec();

      return res.status(200).json({ success: true, data: comments });
  } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllComments = async (req: Request, res: Response): Promise<Response> => {
  console.log("Fetching all comments..."); // Debug log
  try {
      const comments = await Comment.find(); // Fetch all comments
      return res.status(200).json({ success: true, data: comments });
  } catch (error: any) {
      console.error("Error fetching comments:", error); // Error log
      return res.status(500).json({ success: false, message: error.message });
  }
};


// Update comment
export const updateComment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        // Ensure only the author can update the comment
        if (comment.author.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        
        
        comment.content = req.body.content || comment.content;
        // AI Moderation
      // const {content} =  req.body;
        const moderationResultTwo = await moderateComment(comment.content)
        if(moderationResultTwo.flagged) {
          return res.status(400).json({
            success: false,
            message: "Comment update reject due to content moderation",
            reason: moderationResultTwo.reason,
          })
        }
        
        
        await comment.save();
        return res.status(200).json({ success: true, message: "Comment updated", data: comment });
        }catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// Delete comment
export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

        // Ensure only the author can delete the comment
        if (comment.author.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await comment.deleteOne(); // Use deleteOne instead of remove
        return res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// Reply to a Comment
export const replyToComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { reply } = req.body;

  try {

    // AI Moderation
    const moderationResultThree = await moderateComment(reply)
     if(moderationResultThree.flagged) {
      return res.status(400).json({
        success: false,
        message: 'Comment rejected due to content moderation',
        reason: moderationResultThree.reason,
      })
     }

    // Fetch the original comment to get authorId and postId
    const originalComment = await Comment.findById(commentId);

    if (!originalComment) {
      return res.status(404).json({ message: 'Original comment not found' });
    }

    const newReply = new Comment({
      content: reply,
      author: originalComment.author, 
      post: originalComment.post, 
      parentComment: commentId,
    });

    await newReply.save();
    await Comment.findByIdAndUpdate(commentId, { $push: { replies: newReply._id } });

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: newReply,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reply to comment', error });
  }
};

