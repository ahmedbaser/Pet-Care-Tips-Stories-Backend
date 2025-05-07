import { Request, Response } from "express";
import OpenAI from "openai";
import config from "../config";
import PetActivityInsight from "../models/PetActivityInsight";


interface AuthenticatedRequest extends Request {
    userId?: string;
};

export const  getPetActivityAnalytics = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userId;
        const {activities} = req.body;
        if(!userId || !activities || !Array.isArray(activities)) {
            return res.status(400).json({error: "userId and activities are required"});
      }

        const activitySummary = activities.map((activity) => {
            return `-${activity.date} | ${activity.activityType} | ${activity.details || ''}`;
        }).join("\n");
          
         
        const openai = new OpenAI({apiKey: config.openai_api_key as string});

        const prompt = `You are a professional pet wellness expert. Here is the activity log for the pet over the last 7 days: ${activitySummary}
        Please provide:
        1. General overview of the pet's lifestyle based on the activities
        2. Any concerns you notice (low activity, irregular meals, poor sleep, etc.)
        3. Suggestions to improve the pet's health and happiness
        4. Motivational advice for the pet owner
        `.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role: "system", content: 'You are a professional pet wellness expert.'},
                {role: 'user', content: prompt},
            ],
        });
        const insights = completion.choices[0]?.message?.content || 'No insights available';

        const newActivityInsight = new PetActivityInsight({
            userId,
            insights,
        });

        await newActivityInsight.save();
        return res.status(201).json({
           message: 'Pet activity analytics generated successfully',
           data: newActivityInsight,
        });
    } catch(error) {
        console.error('Pet Activity Analytic error:', error);
        return res.status(500).json({error: 'Failed to generate pet activity analytics'});
    }
};