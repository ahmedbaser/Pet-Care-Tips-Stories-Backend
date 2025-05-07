import mongoose from "mongoose";

const behavioralInsightSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    petType: String,
    petAge: Number,
    behaviorIssue: String,
    trainingHistory: String,
    activityLevel: String,
    insights: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const BehavioralInsight  = mongoose.model('BehavioralInsight', behavioralInsightSchema);
export default BehavioralInsight;