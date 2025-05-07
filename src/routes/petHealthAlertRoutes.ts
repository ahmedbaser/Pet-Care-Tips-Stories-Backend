import { Router } from "express";
import { getHealthAlerts } from "../controllers/petHealthAlertController";

const petHealthAlertRouter = Router();

petHealthAlertRouter.post('/pet-health-alert', getHealthAlerts);

export default petHealthAlertRouter;