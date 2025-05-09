import mongoose from "mongoose";


interface IBehaviorInsights extends Document {
    userId: mongoose.Types.ObjectId;
    petType?: string;
    petAge: number;
    behaviorIssue: string;
    trainingHistory: string;
    activityLevel?: string;
    insights: string;
    customInputs: Record<string, any>;
    createdAt?: Date;
}

const behavioralInsightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    petType: {type: String},
    petAge: {type: Number},
    behaviorIssue: {type: String},
    trainingHistory: {type: String},
    activityLevel: {type: String},
    insights: {type:String},
    createdAt: { type: Date, default: Date.now}
});

const BehavioralInsight  = mongoose.model<IBehaviorInsights>('BehavioralInsight', behavioralInsightSchema);
export default BehavioralInsight;