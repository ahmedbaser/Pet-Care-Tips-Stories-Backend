import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import paymentRoutes from './routes/paymentRoutes';
import nutritionRoutes from './routes/nutritionRoutes';
import adminRoutes from './routes/adminRoutes';
import commentRoutes from './routes/commentRoutes';
import followRoutes from './routes/followRoutes';
import categoryRoutes from './routes/categoryRoutes';
import premiumContentRoutes from './routes/premiumContentRoutes';
import imageUploadRoutes from './routes/imageUploadRoutes';
import path from 'path';
import chatRouter from './routes/chatRoutes';
import storyGeneratorRouter from './routes/storyGeneratorRoutes';
import { getPetCareRecommendation } from './controllers/petCareRecommendationController';
import petCareRecommendationRouter from './routes/petCareRecommendationRoutes';
import petHealthAlertRouter from './routes/petHealthAlertRoutes';
import BehavioralInsightsRouter from './routes/BehavioralInsightsRoutes';
import PetActivityAnalyticsRouter from './routes/PetActivityAnalyticsRoutes';
import AdoptionRouter from './routes/adoptionRoutes';
import healthTrendsRouter from './routes/healthTrendsRoutes';
import imageRecognitionRouter from './routes/imageRecognitionRoute';



const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

const allowedOrigins = ['https://pet-care-tips-stories-backend.vercel.app',
  'http://localhost:5173'
  
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));




// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', commentRoutes);
app.use('/api', followRoutes);
app.use('/api', imageUploadRoutes);
app.use('/api', categoryRoutes);
app.use('/api', petCareRecommendationRouter);
app.use('/api', petHealthAlertRouter);
app.use('/api', storyGeneratorRouter);
app.use('/api', PetActivityAnalyticsRouter);
app.use('/api', BehavioralInsightsRouter);
app.use('/api', AdoptionRouter);
app.use('/api', healthTrendsRouter);
app.use('/api', imageRecognitionRouter);
app.use('/api', premiumContentRoutes);
app.use('/api', chatRouter)




// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Care Tips & Stories Backend')
  });

export default app;