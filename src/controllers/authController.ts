import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User,{ IUser }from '../models/User';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer'; 
import crypto from 'crypto';

// Generate JWT token
const generateToken = (id: string | mongoose.Types.ObjectId, isAdmin: boolean, phone: string, address: string) => {
    return jwt.sign({ id: id.toString(), isAdmin}, process.env.JWT_SECRET!, { expiresIn: '48h' });
};



export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, address} = req.body;

        const newUser = new User({
            name,
            email,
            password, 
            phone,
            address,
           
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};





export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email, });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        
        console.log('Password entered during login:', password);
        console.log('Hashed password in DB:', user.password);
        console.log('Does password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
      const token = generateToken(user._id as mongoose.Types.ObjectId, user.isAdmin, user.address || '', user.role || 'user');  // Explicit cast
        res.json({ token, user:  { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, phone: user.phone, address: user.address, role: user.role || 'user',} });
      } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
    
};


// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ userId: (user._id as mongoose.Types.ObjectId).toString() }, process.env.JWT_SECRET!, { expiresIn: '10h' });
        console.log(`Reset token: ${resetToken}`);
        res.status(200).json({ message: 'Reset token generated', resetToken });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process forgot password', error });
    }
};



export const resetPassword = async (req: Request, res: Response) => {
    const {token} = req.params;
    const {newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const userId = decoded.userId;

        
        // Find the user by the decoded userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('New hashed password:', hashedPassword);

        // Save the hashed password to the user's record
        user.password = hashedPassword;
        await user.updateOne({password: hashedPassword});

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Failed to reset password', error });
    }
};





interface AuthenticatedRequest extends Request {
    userId?: string;
}
// Get user info
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'No user ID provided' });
        }

        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



// Update User Profile (Protected)
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    const { name, email, phone, address } = req.body; 
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // Find the user by ID and update their profile
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, email, phone, address }, 
            { new: true, runValidators: true } 
        ).select('-password'); 

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
         
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error });
    }
};




































