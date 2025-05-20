import { Request, response, Response } from 'express';
import OpenAI from 'openai';
import config from '../config';

export const chatWithBot = async(req: Request, res: Response) => {
    try {
        const {message} = req.body;
        if(!message) {
            return res.status(400).json({error: 'Message cannot be empty'})
        }

        const openai = new OpenAI({
            apiKey: config.openai_api_key as string,
        });
        
        console.log('this is OpenAI secret key:', openai)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            store: true,
            messages: [
                {role: 'system', content: 'You are a helpful pet care assistant.'},
                {role: 'user', content: message}
            ]
        });
        return res.json({response: completion.choices[0]?.message || 'No response'})
    } catch (error) {
        console.log('Chatbot error', error);
        return res.status(500).json({error:'Failed to fetch response'})
    }
}

