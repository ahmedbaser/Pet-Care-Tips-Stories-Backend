import { Request, Response } from 'express';
import PremiumContent, { IPremiumContent } from '../models/PremiumContent';
import { AuthenticatedRequest } from '../types/types';



// Create premium content
export const createPremiumContent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { title, description, content, isPremium } = req.body;
        const premiumContent: IPremiumContent = new PremiumContent({ title, description, content, isPremium: isPremium ===true });
        await premiumContent.save();
        return res.status(201).json({ success: true, message: "Premium content created", data: premiumContent });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Get all premium content
export const getPremiumContent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { search, isPremium } = req.query;

        // Build query object
        const query: any = {};
        
        if (search) {
            // Searching in title and description (case-insensitive)
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (isPremium !== undefined) {
            // Filter by premium status
            query.isPremium = isPremium === 'true'; // Convert to boolean
        }

        const contents = await PremiumContent.find(query);
        return res.status(200).json({ success: true, data: contents });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




// Get single premium content (restricted if premium)
export const getSinglePremiumContent = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const content = await PremiumContent.findById(req.params.contentId);
        if (!content) return res.status(404).json({ success: false, message: "Content not found" });

        // Check if the user exists and is not a premium user
        if (content.isPremium && (!req.user || !req.user.isPremium)) {
            return res.status(403).json({ success: false, message: "Access denied. Premium members only." });
        }

        return res.status(200).json({ success: true, data: content });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




// Delete premium content
export const deletePremiumContent = async (req: Request, res: Response): Promise<Response> => {
    try {
        const content = await PremiumContent.findById(req.params.contentId);
        if (!content) return res.status(404).json({ success: false, message: "Content not found" });
        
        // Use deleteOne instead of remove
        await content.deleteOne(); 
        return res.status(200).json({ success: true, message: "Content deleted" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};






















