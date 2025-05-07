import { Router } from "express";
import { getPetActivityAnalytics } from "../controllers/petActivityAnalyticsController";
import { authenticate } from "../middlewares/authMiddleware";

const PetActivityAnalyticsRouter = Router();

PetActivityAnalyticsRouter.post('/pet-analytics',authenticate, getPetActivityAnalytics);

export default PetActivityAnalyticsRouter;