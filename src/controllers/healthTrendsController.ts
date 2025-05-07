import { Response, Request } from "express";
import OpenAI from "openai";
import config from "../config";
import { PetHealthPrediction } from "../models/petHealthPrediction";


export const getPetHealthPrediction = async (req: Request, res: Response) => {
    try {
       const {petName, species, breed, age, weight, gender, activityLevel, diet, vaccinationStatus, pastIllnesses,  currentSymptoms, lastVetVisit, medications, spayedNeutered, customInputs} = req.body;
       if(!petName || !species || !age || !weight) {
        return res.status(400).json({error: "Pet name, species, age, and weight are required."});
      }
      const openai = new OpenAI({
        apiKey: config.openai_api_key as string,
      });

      let customInfo = "";
      if(customInputs && typeof customInputs == "object") {
        customInfo = Object.entries(customInputs).map(([key, value]) => `-${key}: ${value}`).join('\n')
      }


      const prompt = `
      You are an experienced veterinarian and pet health analyst.
      Analyze the following pet's current health data and predict potential health risks over the next year.
      Also suggest 3 personalized health tips.

      Pet Information:
      - Name: ${petName}
      - Species: ${species}
      - Breed: ${breed || "Unknown"}
      - Age: ${age} years
      - Weight: ${weight} kg
      - Gender: ${gender || "Unknown"}
      - Activity Level: ${activityLevel || "Unknown"}
      - Diet: ${diet || "Unknown"}
      - Vaccination Status: ${vaccinationStatus || 'Unknown'}
      - Past Illnesses: ${pastIllnesses || "None"}
      - Current Symptoms: ${currentSymptoms?.length}
      - Last Vet Visit: ${lastVetVisit || "Unknown"}
      - Medications: ${medications}
      - Spayed/Neutered: ${spayedNeutered ? "Yes" : "No"}
      
      Additional Info Provide by User: ${customInfo || "None"}

      Please predict:
      1. Likely health risks to monitor
      2. Early warning signs for the owner
      3. preventive health tips customized to this pet.
      `.trim();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: 'You are a profession veterinarian providing predictive health analysis and preventive advice for pets.'
            },
            {
                role: 'user',
                content: prompt,
            }
        ],
      });
      const healthPrediction = completion.choices[0]?.message?.content || 'No prediction generated.';
      
      const newHealthPrediction = new PetHealthPrediction({
        petName,
        species,
        breed,
        age,
        weight,
        gender,
        activityLevel,
        diet,
        vaccinationStatus,
        pastIllnesses,
        currentSymptoms,
        lastVetVisit,
        medications,
        spayedNeutered,
        customInputs,
        suggestion: healthPrediction
      });

   
      await newHealthPrediction.save();

      return res.status(201).json({
        message: 'Pet health prediction generated successfully',
        data: newHealthPrediction.suggestion,
      });
    
    
    } catch(error) {
        console.error("Pet health prediction error:", error);
        return res.status(500).json({error: 'Failed to generate pet '})
    }
}
