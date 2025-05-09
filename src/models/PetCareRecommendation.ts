import mongoose, { model, Schema } from "mongoose";

interface IPetCareRecommendations {
    userId: mongoose.Types.ObjectId;
    petType: string;
    petAge: number;
    petHealthConcerns: string;
    petDietPreferences: string;
    activityLevel: string;
    weight: number;
    location: string;
    careTips:string;
    customInputs: Record<string, any>
    

}


const PetCareRecommendationsSchema  = new Schema<IPetCareRecommendations>({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    petType: {type:String, required:true},
    petAge: {type:Number, required: true},
    petHealthConcerns: {type:String},
    petDietPreferences: {type:String},
    activityLevel: {type:String},
    weight: {type:Number},
    location: {type:String},
    careTips:{type: String},
    customInputs: {type:Schema.Types.Mixed}

});


export const PetCareRecommendations = model<IPetCareRecommendations>('PetCareRecommendations', PetCareRecommendationsSchema) 







