import { Request, Response } from "express"
import OpenAI from "openai";
import config from "../config";
import BehavioralInsight from "../models/BehavioralInsight";



export const getBehavioralInsights = async (req: Request, res: Response) => {
      try {
        const {petType, petAge, behaviorIssue, trainingHistory, activityLevel, userId} = req.body;
         if(!behaviorIssue || !petType || !petAge || !userId) {
            return res.status(400).json({error: 'petType, petAge, behaviorIssue, and userId are required'})
         }
         const openai = new OpenAI({apiKey: config.openai_api_key as string});
         const prompt = `You are a professional animal behaviorist and trainer.
         A ${petAge}-year-old ${petType} is showing the following behavior issue: ${behaviorIssue}.
         ${trainingHistory ? `Training history: ${trainingHistory}. ` : ''}
         ${activityLevel ? `Activity level: ${activityLevel}.` : ''}
         Please provide:
         1. Possible reason for this behavior
         2. Behavioral insights (psychological/emotional aspects)
         3. Step-by-step training tips to improve or correct the behavior.
         `.trim();

         const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role: 'system', content: 'You are a professional pet behaviorist and trainer'},
                {role: 'user', content: prompt},
            ],
         });
         const insights = completion.choices[0]?.message?.content || 'No insights available';
      
         const newInsight = new BehavioralInsight({
            userId,
            petType,
            petAge,
            behaviorIssue,
            trainingHistory,
            activityLevel,
            insights
        });
        await newInsight.save();

        return res.status(201).json({
         message: 'Behavioral insight generated and saved',
         data: newInsight,
        });
    
      } catch(error) {
        console.error('Behavioral insight error', error);
        return res.status(500).json({error: 'Behavioral insight generation failed'})
      }
};



export const getBehavioralInsightsByUser = async(req: Request, res:Response) => {
   try {
      const {userId} = req.params;
      if(!userId) {
         return res.status(400).json({error: 'User ID is required'});
      }
      const insights = await BehavioralInsight.find({userId}).sort({createdAt: -1});

      return res.status(200).json({
         message: 'Behavioral insights fetched successfully',
         data: insights,
      });
   } catch (error) {
      console.log('Fetching behavioral insights error:', error);
      return res.status(500).json({error:'Failed to fetch behavioral insights'})
   }
}


