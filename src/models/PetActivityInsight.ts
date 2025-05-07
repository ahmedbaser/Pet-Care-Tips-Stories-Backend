import mongoose, { Schema } from "mongoose";

interface IPetActivityInsight extends Document {
    userId: mongoose.Types.ObjectId;
    insights: string;
    createdAt: Date;
}

const PetActivityInsightSchema: Schema = new Schema ({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    insights: {type: String, required: true},
    cerated: {type:Date, default: Date.now}
});


const PetActivityInsight = mongoose.model<IPetActivityInsight>('PetActivityInsight', PetActivityInsightSchema)

export default PetActivityInsight;












