import express from 'express';
import { createPremiumContent, getPremiumContent, getSinglePremiumContent, deletePremiumContent } from '../controllers/premiumContentController';
import { adminOnly, authenticate } from '../middlewares/authMiddleware';
const router = express.Router();

router.post('/premium-content',  authenticate, adminOnly, createPremiumContent);       // Admin only to create
router.get('/premium-content', getPremiumContent);                               // Public can view list of premium contents
router.get('/premium-content/:contentId',  authenticate, getSinglePremiumContent);     // Protected, premium users get access
router.get('/premium-content/:contentId',  authenticate, getSinglePremiumContent);
router.delete('/premium-content/:contentId',  authenticate, adminOnly, deletePremiumContent);  // Admin only to delete

export default router;







