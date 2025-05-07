import { Request, Response } from 'express';
import OpenAI from 'openai';
import config from '../config';




export const getPetCareRecommendation = async(req: Request, res: Response) => {
    try {
        const {petType, petAge, petHealthConcerns, petDietPreferences, activityLevel, weight, location} = req.body;
          if(!petType || !petAge) {
            return res.status(400).json({error: "Pet type and pet age are required"});
          }
         const openai = new OpenAI({
            apiKey: config.openai_api_key as string,
         });
        const prompt = `You are a professional pet care expert offering personalized and practical advice. Provide care tips for a ${petAge}-year-old ${petType}.
        ${petHealthConcerns ? `Health concerns include: ${petHealthConcerns}.` : ''}
        ${petDietPreferences ? `Diet preference: ${petDietPreferences}.` : ''}
        ${activityLevel ? `ActivityLevel: ${activityLevel}.` : ''}
        ${weight ? `Weight: ${weight} kg.`: ''}
        ${location ? `The pet lives in ${location}. Adjust care tips for the local climate if relevant.` : ''}
        Include suggestions for diet, exercise, grooming, mental stimulation, and routine health checks.
        `.trim();

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages:[
               {
                role: 'system',
                content: 'You are a pet care specialist...',
               },

               {role: 'user', content: prompt}  
            ],
        });
        const careTips = completion.choices[0]?.message.content || 'No tips generated.';
        return res.json({careTips});   
    } catch (error) {
      console.error('Pet care recommendation error:', error);
      return res.status(500).json({error: 'Failed pet care recommendations'});
    }
}

























