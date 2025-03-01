import dotenv from "dotenv"

dotenv.config();



export default {
    port: process.env.PORT,
    db_url:process.env.DB_URL,
    jwt_secret: process.env.JWT_SECRET,
    stripe_secret_key:process.env.STRIPE_SECRET_KEY,
    openai_api_key: process.env.OPENAI_SECRET_API_KEY,
    cohere_api_key: process.env.COHERE_API_KEY,
    generate_stroy_key: process.env.GENERATE_PET_KEY,
    
    
}