import { Router } from "express";
import { getPetCareRecommendation } from "../controllers/petCareRecommendationController";
import { authenticate } from "../middlewares/authMiddleware";

const petCareRecommendationRouter = Router();

petCareRecommendationRouter.post('/petCare-Recommendation',authenticate, getPetCareRecommendation);

export default petCareRecommendationRouter;