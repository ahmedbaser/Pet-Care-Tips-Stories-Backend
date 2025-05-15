import mongoose, { model, Schema } from "mongoose";

interface AnalyzeSymptomImage {
  userId: mongoose.Types.ObjectId;
  petType: string;
  petAge: number;
  symptomDescription: string;
  customInputs: Record<string, any>;
  analysisResult: string;

}


const AnalyzeSymptomImageSchema = new Schema<AnalyzeSymptomImage>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  petType: {type: String, required: true},
  petAge: {type: Number, required: true},
  symptomDescription: {type: String, required: true},
  analysisResult: {type: String},
  customInputs: {type: Schema.Types.Mixed},
 
})


export const PetAnalyzeSymptomImage = model<AnalyzeSymptomImage>('PetAnalyzeSymptomImage', AnalyzeSymptomImageSchema);




