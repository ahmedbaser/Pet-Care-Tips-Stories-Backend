import { Router } from "express";
import { getBehavioralInsights, getBehavioralInsightsByUser } from "../controllers/behaviorController";


const BehavioralInsightsRouter = Router();

BehavioralInsightsRouter.post('/behavior-insights', getBehavioralInsights);
BehavioralInsightsRouter.get('/behavior-insights/:userId', getBehavioralInsightsByUser);
export default BehavioralInsightsRouter;
