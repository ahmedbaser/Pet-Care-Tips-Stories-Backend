import { Router } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword,getMe, updateProfile } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { updateProfileValidation, validate } from '../middlewares/validationMiddleware';



const authRouter = Router();

// Signup Route
authRouter.post('/signup', registerUser);

// Login Route
authRouter.post('/login', loginUser);

// Forgot Password Route
authRouter.post('/forgot-password', forgotPassword);

// Reset Password Route
authRouter.post('/reset-password/:token', resetPassword);

// Protected Route (Example)
authRouter.get('/me', authenticate, getMe);

authRouter.put('/update-profile', authenticate, updateProfileValidation, validate, updateProfile);


export default authRouter;

