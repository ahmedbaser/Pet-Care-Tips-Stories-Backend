import { Router } from "express";
import { getPetCareRecommendation } from "../controllers/petCareRecommendationController";

const petCareRecommendationRouter = Router();

petCareRecommendationRouter.post('/petCare-Recommendation', getPetCareRecommendation);

export default petCareRecommendationRouter;