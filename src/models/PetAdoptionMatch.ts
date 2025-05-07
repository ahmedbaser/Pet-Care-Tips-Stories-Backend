import mongoose, { Schema } from "mongoose";

export interface IPetAdoptionMatch extends Document {
    useId: string;
    suggestion: string;
}


const PetAdoptionMatchSchema: Schema = new Schema({
    userId: {type: String, required: true},
    suggestion: {type: String, required: true},
    
}, {timestamps: true});

const PetAdoptionMatch = mongoose.model<IPetAdoptionMatch>('PetAdoptionMatch', PetAdoptionMatchSchema);
export default PetAdoptionMatch;