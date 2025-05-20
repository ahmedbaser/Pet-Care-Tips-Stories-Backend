import { Router } from "express";
import { getBehavioralInsights, getBehavioralInsightsByUser } from "../controllers/behaviorController";
import { authenticate } from "../middlewares/authMiddleware";


const BehavioralInsightsRouter = Router();
console.log("BehavioralInsightsRouter loaded");

BehavioralInsightsRouter.post('/behavior-insights', authenticate, getBehavioralInsights);
BehavioralInsightsRouter.get('/behavior-insights/:userId', getBehavioralInsightsByUser);
export default BehavioralInsightsRouter;
