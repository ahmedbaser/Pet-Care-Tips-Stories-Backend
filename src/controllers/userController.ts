import { Request, Response } from 'express';
import User from '../models/User';

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming `req.user` contains authenticated user info
    const user = await User.findById(userId).populate('posts').populate('followers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id; // Get user ID from JWT token
      const { name, email, profilePicture } = req.body; // Get updated fields
  
      // Update user information
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, profilePicture },
        { new: true } // Return updated document
      );
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  };
