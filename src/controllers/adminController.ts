import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';
import Stripe from 'stripe';
import config from '../config';
import Payment from '../models/Payment';


const stripe = new Stripe(config.stripe_secret_key as string, { apiVersion: '2024-06-20' });

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    console.log('this is users:', users)
    // Map users to include a role property based on isAdmin
    const usersWithRole = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isPremium: user.isPremium,
      following: user.following,
      followers: user.followers,
      role: user.isAdmin ? 'Admin' : 'User', // Map isAdmin to role
      __v: user.__v
    }));

    res.status(200).json(usersWithRole);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


// Get all posts (admin-only)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};


// // Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};



// Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    console.log("Attempting to delete post with ID:", req.params.id);

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      console.log("Post not found with ID:", req.params.id);
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: 'Error deleting post', error });
  }
};




// Publish/Unpublish post (admin-only)
export const togglePostPublish = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.isPublished = !post.isPublished;
      await post.save();
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post status' });
  }
};



// Fetch payment history
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
      const { userId, status, startDate, endDate } = req.query;

      const query: any = {};

      if (userId) query.userId = userId;
      if (status) query.status = status;

      if (startDate || endDate) {
          query.paymentDate = {};
          if (startDate) query.paymentDate.$gte = new Date(startDate as string);
          if (endDate) query.paymentDate.$lte = new Date(endDate as string);
      }

      const payments = await Payment.find(query).sort({ paymentDate: -1 });
       console.log('this is payments:', payments)
       
      return res.status(200).json({
          success: true,
          message: 'Payment history retrieved successfully',
          data: payments
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: 'Failed to retrieve payment history',
      });
  }
};


export const getFlaggedPosts = async(req:Request, res:Response) => {
  try {
    const posts = await Post.find({isFlagged: true}).populate('author', 'name');
    res.status(200).json(posts)
  } catch(error) {
    res.status(500).json({message: 'Failed to fetch posts', error})
  }
}














