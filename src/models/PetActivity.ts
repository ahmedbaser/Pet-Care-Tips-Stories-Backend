import mongoose, { Schema } from "mongoose";

interface IPetActivity extends Document {
    useId: mongoose.Types.ObjectId;
    activityType: string;
    details: string;
    timestamp: Date;
}

const PetActivitySchema: Schema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    activityType: {type:String, required: true},
    details: {type: String, required: false},
    timestamp: {type: Date, default: Date.now},
});

const PetActivity = mongoose.model<IPetActivity>('PetActivity', PetActivitySchema);
export default PetActivity;