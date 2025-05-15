import { Request, Response } from "express"
import OpenAI from "openai";
import config from "../config";
import { HealthAlertsRecommendation } from "../models/HealthAlerts ";


interface AuthenticateRequest extends Request {
  userId?: string;
}


export const getHealthAlerts = async(req: AuthenticateRequest, res:Response) => {
    try {
        
        const userId = req.userId;
        const {petType, petAge, symptoms, duration, recentBehavior, customInputs} = req.body;
         
        if(!symptoms) {
            return res.status(400).json({error: 'Symptoms are required'});
          }
        if(!userId) {
          return res.status(400).json({error: 'User is not authenticated'})
        }  
          const openai = new OpenAI({apiKey: config.openai_api_key as string});

          let customInfo = ""
          if(customInputs && typeof customInputs == "object") {
              customInfo = Object.entries(customInputs).map(([key, value]) => `-${key} : ${value}`).join('\n')
          }


          const prompt = `You are a veterinary health assistant. A ${petAge}-year-old ${petType} is showing the following symptoms: ${symptoms}.
          ${recentBehavior ? `Recent behavior includes: ${recentBehavior}.` : ''}
          ${duration ? `The symptoms have been present for: ${duration}.` : ''}
           
          Additional Info Provide by User: ${customInfo || "None"}
          Include whether it's urgent, possible causes, and recommend next steps.
          `.trim();
         
          const completion = await openai.chat.completions.create({
            model:'gpt-4o-mini',
            messages: [
                {role: 'system', content: 'You are a veterinary health assistant.'},
                {role: 'user', content: prompt},
            ],
          });
          const alertMessage = completion.choices[0]?.message?.content || 'No alert generated.';
          
          const newAlertMessage = new HealthAlertsRecommendation({
            userId,
            petType, 
            petAge, 
            symptoms, 
            duration, 
            recentBehavior, 
            customInputs,
            alertMessage,
            
          });
          await newAlertMessage.save();
          return res.status(201).json({
            message: 'Pet health alerts generate successfully',
            suggestion: newAlertMessage.alertMessage
          })



    } catch(error) {
        console.error("health alert error:", error);
        return res.status(500).json({error: 'Health alert failed'});
    }
}