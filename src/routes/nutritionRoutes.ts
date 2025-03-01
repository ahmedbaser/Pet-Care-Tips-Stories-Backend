import express from 'express';
import { generateNutritionPDF } from '../controllers/nutritionController';
import { authenticate } from '../middlewares/authMiddleware';



const router = express.Router();

router.post('/generate-pdf', authenticate, generateNutritionPDF);
export default router;
