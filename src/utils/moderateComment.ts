import {OpenAI} from 'openai';
import config from '../config';


const openai = new OpenAI({
    apiKey: config.openai_api_key as string,
})

export const moderateComment = async (text: string): Promise<{flagged: boolean; reason?: string}> => {
   try {
    const response = await openai.moderations.create({input: text});
    const results = response.results[0];
    if(results.flagged) {
        const categories = Object.entries(results.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category]) => category)
        .join(',');
                    
        return {
            flagged: true,
            reason: `Flagged by AI moderation for: ${categories}`,

        };
    }
       return {flagged: false};
   } catch(error: any) {
    console.error('Moderation API error:', error);
    return {flagged: false};
   }

}

