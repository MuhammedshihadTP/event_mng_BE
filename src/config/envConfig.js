import dotenv from 'dotenv';


dotenv.config();

// Export environment variables
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT || 5000;