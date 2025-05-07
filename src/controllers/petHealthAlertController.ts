import { Request, Response } from "express"
import OpenAI from "openai";
import config from "../config";

export const getHealthAlerts = async(req: Request, res:Response) => {
    try {
        const {petType, petAge, symptoms, duration, recentBehavior} = req.body;
          if(!symptoms) {
            return res.status(400).json({error: 'Symptoms are required'});
          }
          const openai = new OpenAI({apiKey: config.openai_api_key as string});

          const prompt = `You are a veterinary health assistant. A ${petAge}-year-old ${petType} is showing the following symptoms: ${symptoms}.
          ${recentBehavior ? `Recent behavior includes: ${recentBehavior}.` : ''}
          ${duration ? `The symptoms have been present for: ${duration}.` : ''}
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
          return res.json({alertMessage});

    } catch(error) {
        console.error("health alert error:", error);
        return res.status(500).json({error: 'Health alert failed'});
    }
}