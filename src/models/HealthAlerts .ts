import mongoose, { model, Schema } from "mongoose";

interface IHealthAlerts {
    userId: mongoose.Types.ObjectId;
    petType: string;
    petAge: number;
    symptoms: string;
    duration: string;
    recentBehavior: string;
    customInputs: Record<string, any>
    suggestion: string;
    alertMessage: string;

}


const HealthAlertsRecommendationSchema = new Schema<IHealthAlerts>({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    petType: {type: String, required: true},
    petAge: {type: Number, required: true},
    symptoms: {type: String, required: true},
    duration: {type: String},
    recentBehavior: {type: String},
    customInputs: {type: Schema.Types.Mixed},
    suggestion: {type: String},
    alertMessage: {type: String}

})


export const HealthAlertsRecommendation = model<IHealthAlerts>('HealthAlertsRecommendation',HealthAlertsRecommendationSchema)

