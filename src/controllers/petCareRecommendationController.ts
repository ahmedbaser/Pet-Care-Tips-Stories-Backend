import { Request, Response } from 'express';
import OpenAI from 'openai';
import config from '../config';
import { PetCareRecommendations } from '../models/PetCareRecommendation';


interface AuthenticateRequest extends Request {
  userId?: string;
}

export const getPetCareRecommendation = async(req: AuthenticateRequest, res: Response) => {
    try {
        const {userId,petType, petAge, petHealthConcerns, petDietPreferences, activityLevel, weight, location, customInputs} = req.body;
          if(!petType || !petAge) {
            return res.status(400).json({error: "Pet type and pet age are required"});
          }
         const openai = new OpenAI({
            apiKey: config.openai_api_key as string,
         });

        let customInfo = "";
        if(customInputs && typeof customInputs == 'object') {
          customInfo = Object.entries(customInputs).map(([key, value]) => `-${key}: ${value}`).join('\n')
        }


        const prompt = `You are a professional pet care expert offering personalized and practical advice. Provide care tips for a ${petAge}-year-old ${petType}.
        ${petHealthConcerns ? `Health concerns include: ${petHealthConcerns}.` : ''}
        ${petDietPreferences ? `Diet preference: ${petDietPreferences}.` : ''}
        ${activityLevel ? `ActivityLevel: ${activityLevel}.` : ''}
        ${weight ? `Weight: ${weight} kg.`: ''}
        ${location ? `The pet lives in ${location}. Adjust care tips for the local climate if relevant.` : ''}

        Additional Info Provide by User: ${customInfo || 'None'}

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

        const newCareTips = new PetCareRecommendations({
          userId,
          petType, 
          petAge, 
          petHealthConcerns, 
          petDietPreferences, 
          activityLevel, 
          weight, 
          location, 
          customInputs,
          careTips,
        })
        return res.status(201).json({
        message: 'Pet health prediction generate successfully',
        suggestion: newCareTips.careTips
       });

  } catch (error) {
      console.error('Pet care recommendation error:', error);
      return res.status(500).json({error: 'Failed pet care recommendations'});
    }
}

























