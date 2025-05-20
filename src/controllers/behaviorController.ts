import { Request, Response } from "express"
import OpenAI from "openai";
import config from "../config";
import BehavioralInsight from "../models/BehavioralInsight";



interface AuthenticateRequest extends Request {
   userId?: string;
}


export const getBehavioralInsights = async (req: AuthenticateRequest, res: Response) => {
      try {
        const userId = req.userId; 
        const {petType, petAge, behaviorIssue, trainingHistory, activityLevel, customInputs} = req.body;
         
        if(!behaviorIssue || !petType || !petAge) {
            return res.status(400).json({error: 'petType, petAge, behaviorIssue are required'})
         }
        if(!userId) {
         return res.status(400).json({error: 'User is not authenticated'});
        } 
       const openai = new OpenAI({apiKey: config.openai_api_key as string});
        
       let customInfo = ""
       if(customInputs && typeof customInputs =="object") {
         customInfo = Object.entries(customInputs).map(([key, value]) => `-${key} : ${value}`).join('\n');
       }
        
       const prompt = `You are a professional animal behaviorist and trainer.
         A ${petAge}-year-old ${petType} is showing the following behavior issue: ${behaviorIssue}.
         ${trainingHistory ? `Training history: ${trainingHistory}. ` : ''}
         ${activityLevel ? `Activity level: ${activityLevel}.` : ''}
         Additional Info Provide by User: ${customInfo || "None"}
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
            customInputs,
            insights
        });
        await newInsight.save();
        console.log('this is behavior Insights Data:', newInsight)
        return res.status(201).json({
         message: 'Behavioral insight generated and saved',
         suggestion: newInsight.insights,
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


