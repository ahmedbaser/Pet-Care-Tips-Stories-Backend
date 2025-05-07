import OpenAI from "openai";
import config from "../config";

const openai = new OpenAI({
    apiKey: config.openai_api_key as string,
});

export const moderateContent = async(text:string):Promise<boolean> => {
    const response = await openai.moderations.create({
        input: text,
    });
    const results = response.results[0];
    return results.flagged;
}