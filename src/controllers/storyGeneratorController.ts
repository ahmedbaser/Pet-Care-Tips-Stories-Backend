import { Request, Response } from 'express';
import OpenAI from 'openai';
import config from '../config';


console.log('API Key from environment:', process.env.GENERATE_PET_KEY);

export const generatePetStory = async (req: Request, res: Response) => {
  try {
    const { petType, petName } = req.body;

    if (!petType || !petName) {
      return res.status(400).json({ error: 'Pet type and pet name are required' });
    }
    console.log('Pet Type:', petType);
    console.log('Pet Name:', petName);
    console.log("Using API Key:", config.generate_stroy_key);


    const openai = new OpenAI({
      apiKey: config.generate_stroy_key as string,
    });
     console.log('this is openAi key:', openai)
    const prompt = `Write a short, fun, and engaging story about a ${petType} named ${petName}. The story should be suitable for pet owners and highlight the unique personality of ${petName}.`;

    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
      messages: [
        {
          role: 'system',
          content: 'You are a creative writer who specializes in crafting fun and engaging stories about pets.',
        },
        { role: 'user', content: prompt },
        
      ],
    });

    const story = completion.choices[0]?.message?.content || 'No story generated.';
    return res.json({ story });

  } catch (error) {
    console.error('Story generation error:', error);
    return res.status(500).json({ error: 'Failed to generate story' });
  }
};