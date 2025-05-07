import { Router } from "express";
import { getPetHealthPrediction } from "../controllers/healthTrendsController";
import { authenticate } from "../middlewares/authMiddleware";

const healthTrendsRouter = Router();

healthTrendsRouter.post('/predictive-health-trends', authenticate, getPetHealthPrediction);

export default healthTrendsRouter;