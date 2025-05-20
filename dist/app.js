"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const nutritionRoutes_1 = __importDefault(require("./routes/nutritionRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const premiumContentRoutes_1 = __importDefault(require("./routes/premiumContentRoutes"));
const imageUploadRoutes_1 = __importDefault(require("./routes/imageUploadRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const storyGeneratorRoutes_1 = __importDefault(require("./routes/storyGeneratorRoutes"));
const petCareRecommendationRoutes_1 = __importDefault(require("./routes/petCareRecommendationRoutes"));
const petHealthAlertRoutes_1 = __importDefault(require("./routes/petHealthAlertRoutes"));
const BehavioralInsightsRoutes_1 = __importDefault(require("./routes/BehavioralInsightsRoutes"));
const PetActivityAnalyticsRoutes_1 = __importDefault(require("./routes/PetActivityAnalyticsRoutes"));
const adoptionRoutes_1 = __importDefault(require("./routes/adoptionRoutes"));
const healthTrendsRoutes_1 = __importDefault(require("./routes/healthTrendsRoutes"));
const imageRecognitionRoute_1 = __importDefault(require("./routes/imageRecognitionRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const allowedOrigins = ['https://pet-care-tips-stories-backend.vercel.app',
    'http://localhost:5173'
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/nutrition', nutritionRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api', commentRoutes_1.default);
app.use('/api', followRoutes_1.default);
app.use('/api', imageUploadRoutes_1.default);
app.use('/api', categoryRoutes_1.default);
app.use('/api', petCareRecommendationRoutes_1.default);
app.use('/api', petHealthAlertRoutes_1.default);
app.use('/api', storyGeneratorRoutes_1.default);
app.use('/api', PetActivityAnalyticsRoutes_1.default);
app.use('/api', BehavioralInsightsRoutes_1.default);
app.use('/api', adoptionRoutes_1.default);
app.use('/api', healthTrendsRoutes_1.default);
app.use('/api', imageRecognitionRoute_1.default);
app.use('/api', premiumContentRoutes_1.default);
app.use('/api', chatRoutes_1.default);
// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Care Tips & Stories Backend');
});
exports.default = app;
