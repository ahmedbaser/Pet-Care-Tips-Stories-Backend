import { Router } from "express";
import { getPetAdoption } from "../controllers/aiAdoptionMatchController";
import { authenticate } from "../middlewares/authMiddleware";

const AdoptionRouter = Router();

AdoptionRouter.post('/pet-adoption-match',authenticate, getPetAdoption);

export default AdoptionRouter;