import express from 'express';
import { uploadImage } from '../controllers/imageUploadController';
const router = express.Router();

router.post('/upload/image', uploadImage);

export default router;
