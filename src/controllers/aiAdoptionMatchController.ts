import {Request, Response} from 'express';
import OpenAI from 'openai';
import config from '../config';
import PetAdoptionMatch from '../models/PetAdoptionMatch';




export const getPetAdoption = async (req: Request, res:Response) => {
     try {
       
        const {pets, user} = req.body;
        if(!user || !pets || !Array.isArray(pets)) {
           return res.status(400).json({error: 'User and pets data are required.'});
        }
        const userSummary = 
        `Name: ${user.name}
         Age: ${user.age}
         LifeStyle: ${user.lifestyle} 
         Allergies: ${user.allergies}
         Home Environment: ${user.home}
         Experience with Pets: ${user.experienceWithPets}
        `.trim();
      
       const petSummaries = pets.map((pet: any, index: number) => {
           return `
            Pet ${index + 1}:
            - Name: ${pet.name}
            - Breed: ${pet.breed}
            - Size: ${pet.size}
            - Temperament: ${pet.temperament}
            - Needs: ${pet.needs}
           `.trim();
       }).join("\n\n");
       
       const openai = new OpenAI({apiKey: config.openai_api_key as string});

       const prompt = `
        You are an expert pet adoption counselor.Based on the following user and pet information, suggest the best pet(s) for the user to adopt and explain your reasoning clearly.

        User Details:
        ${userSummary}

        Available Pets:
        ${petSummaries}

        Provide:
        1. Recommend pet(s) to adopt
        2. Reasons why each recommend pet is a good fit Respond in friendly and encouraging tone.
       `.trim();
    
       const completion = await openai.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: [
            {role: 'system', content: 'You are a professional pet adoption counselor.'},
            {role: 'user', content: prompt}
         ],
       });
       const matchSuggestion = completion.choices[0]?.message?.content || 'No suggestion available.';

       const newPetAdoptionMatch = new PetAdoptionMatch({
        //  userId: user.id,
         userId: req.userId,
         suggestion: matchSuggestion,
       });
       await newPetAdoptionMatch.save();
       return res.status(201).json({
         message: 'Pet adoption match generated successfully',
         data: newPetAdoptionMatch,
       })
       
     } catch(error) {
       console.error('Pet Adoption Match Error:', error);
       return res.status(500).json({error: 'Failed to generate adoption match.'})
     }
};