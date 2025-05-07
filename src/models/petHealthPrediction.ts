import { model, Schema } from "mongoose";

interface IPetHealthPrediction {
    petName: string;
    species: string;
    breed?: string;
    age: number;
    weight: number;
    gender: string;
    activityLevel: string;
    diet: string;
    vaccinationStatus: string;
    pastIllnesses: string;
    currentSymptoms:string;
    lastVetVisit: string;
    medications: string;
    spayedNeutered: string;
    healthPrediction: string
    customInputs: Record<string, any>;
    suggestion: string;
}


const petHealthPredictionSchema = new Schema<IPetHealthPrediction>({
    petName: {type: String, required: true},
    species: {type: String, required: true},
    breed: {type: String},
    age: {type: Number, required: true},
    weight: {type: Number, required: true},
    gender:{type: String},
    activityLevel: {type: String},
    diet: {type:String},
    vaccinationStatus: {type: String},
    pastIllnesses: {type: String},
    currentSymptoms:{type: String},
    lastVetVisit: {type: String},
    medications: {type: String},
    spayedNeutered: {type: String},
    healthPrediction: {type:String},
    customInputs: {type: Schema.Types.Mixed},
    suggestion: {type: String, required: true},
})



export const PetHealthPrediction = model<IPetHealthPrediction>('PetHealthPrediction', petHealthPredictionSchema);
