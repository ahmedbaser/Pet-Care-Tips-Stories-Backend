import User, { IUser } from "../models/User";
import Post from "../models/Post"; 
import { AuthenticatedRequest } from "../types/types";
import { Response } from 'express';
import mongoose from 'mongoose';



export const followUser = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }
        // Convert userId to ObjectId
        const userToFollow = await User.findById(new mongoose.Types.ObjectId(userId));
        console.log('this is userToFollow:', userToFollow);

        if (!userToFollow) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const currentUser = req.user!;  // Ensure the currentUser is available

        // Ensure current user has "User" role, not "Admin"
          if(currentUser.role !== 'User') {
            return res.status(403).json({success: false, message: "Only users can follow other users"});

        }

        // Prevent following oneself
        if (userToFollow._id.toString() === currentUser._id.toString()) {
         return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        // Check if the current user is already following the other user
        if (!currentUser.following.includes(userToFollow._id)) {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);

            await currentUser.save();
            await userToFollow.save();

            return res.status(200).json({ success: true, message: "User followed" });
        }
            return res.status(400).json({ success: false, message: "Already following this user" });
        }   catch (error: any) {
           return res.status(500).json({ success: false, message: error.message });
        }
};




export const unfollowUser = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const  userId  = req.params.userId;
        console.log('Received userId:', userId);

        // Validate userId format and convert it to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }
       

        // Find the user to unfollow
        const userToUnfollow = await User.findById(new mongoose.Types.ObjectId(userId));
        console.log('Backend userToUnfollow:', userToUnfollow);

        if (!userToUnfollow) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const currentUser = req.user!;
        console.log('Authenticated currentUser:', currentUser);

             // Ensure current user has "User" role, not "Admin"
             if(currentUser.role !== 'User') {
               return res.status(403).json({success: false, message: "Only users can unfollow other users"})
             }

        // Ensure following and followers arrays exist
        currentUser.following = currentUser.following || [];
        userToUnfollow.followers = userToUnfollow.followers || [];

        // Remove the user from following and followers arrays
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToUnfollow._id.toString()
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            id => id.toString() !== currentUser._id.toString()
        );

        // Save updates
        await currentUser.save();
        await userToUnfollow.save();

        return res.status(200).json({ success: true, message: "User unfollowed" });
      } catch (error: any) {
        console.error("Error in unfollowUser:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const getFollowedUsersContent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
   
    try {
        const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
        const skip = (Number(page) - 1) * Number(limit);

        const currentUser = req.user!;
        if (!currentUser.following || currentUser.following.length === 0) {
            return res.status(200).json({ success: true, content: [], metadata: { total: 0, page, limit } });
        }

        const followedContent = await Post.find({ author: { $in: currentUser.following } })
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Post.countDocuments({ author: { $in: currentUser.following } });

        return res.status(200).json({
            success: true,
            content: followedContent,
            metadata: { total, page: Number(page), limit: Number(limit) },
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



export const getFollowingList = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUser: IUser = req.user!;
        const { page = 1, limit = 10 } = req.query; // Default pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Find the current user and populate basic info of followed users
        const user = await User.findById(currentUser._id).populate("following", "_id name email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const followingList = user.following || [];

        // Fetch posts for each followed user
        const followingWithContent = await Promise.all(
            followingList.map(async (followedUser: any) => {
                const posts = await Post.find({ author: followedUser._id })
                    .populate("author", "name email")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(Number(limit));

                const totalPosts = await Post.countDocuments({ author: followedUser._id });

                return {
                    _id: followedUser._id,
                    name: followedUser.name,
                    email: followedUser.email,
                    posts,
                    metadata: {
                        totalPosts,
                        page: Number(page),
                        limit: Number(limit),
                    },
                };
            })
        );

        return res.status(200).json({ success: true, following: followingWithContent });
    } catch (error: any) {
        console.error("Error in getFollowingList:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};







export const getDiscoverableUsers = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const currentUser: IUser = req.user!;

        const followingIds = currentUser.following || [];

        const discoverableUsers = await User.find({ 
            _id: { $nin: [...followingIds, currentUser._id] },
            role: "User"
        }).select("name email"); 
        return res.status(200).json({ success: true, users: discoverableUsers });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

