// File: src/utils/moderateContent.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';

interface ModerationResult {
    flagged: boolean;
    reason: string | null;
    harmType?: string; 
}

const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);
const moderationModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' }); 

export const moderateContent = async (text: string): Promise<ModerationResult> => {
    try {
        const prompt = `You are a content moderator. Your task is to analyze the provided input and classify it based on the following harm types:

           * Sexual: Sexually suggestive or explicit.
           
           * SCAM: Exploits, abuses, or endangers children.
           
           * Hate: Promotes violence against, threatens, or attacks people based on their protected characteristics.
           
           * Harassment: Harass, intimidate, or bully others.
           
           * Dangerous: Promotes illegal activities, self-harm, or violence towards oneself or others.
           
           * Toxic: Rude, disrespectful, or unreasonable.
           
           * Violent: Depicts violence, gore, or harm against individuals or groups.
           
           * Profanity: Obscene or vulgar language.
           
           * Illicit: Mentions illicit drugs, alcohol, firearms, tobacco, online gambling.

           Output should be in JSON format: {"violation": (yes or no), "harm_type": "<one of the harm types or null>"}.
          
          Input Prompt: ${text}`;

        const result = await moderationModel.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: prompt }],
            }],
        });

        let responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('Gemini Moderation Response (Prompt-Based):', responseText);
        console.log('Gemini Moderation Response (Raw):', responseText);
        if (responseText) {
            const cleanedResponse = responseText.replace(/```json\n/g, '').replace(/```/g, '')
            try {
                const jsonResponse = JSON.parse(cleanedResponse);
                if (jsonResponse.violation === 'yes') {
                    return {
                        flagged: true,
                        reason: `Flagged by AI for: ${jsonResponse.harm_type}`,
                        harmType: jsonResponse.harm_type,
                     };
                }
            } catch (error) {
                console.error('Error parsing Gemini moderation response:', error);
                return { flagged: false, reason: 'Could not parse moderation response.' };
            }
        }
      return { flagged: false, reason: null };
      } catch (error: any) {
        console.error('Gemini API moderation error:', error);
        return { flagged: false, reason: 'Moderation service is currently unavailable.' };
    }
};
