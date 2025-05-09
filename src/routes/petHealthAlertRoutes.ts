import { Router } from "express";
import { getHealthAlerts } from "../controllers/petHealthAlertController";
import { authenticate } from "../middlewares/authMiddleware";

const petHealthAlertRouter = Router();

petHealthAlertRouter.post('/pet-health-alert', authenticate, getHealthAlerts);

export default petHealthAlertRouter;