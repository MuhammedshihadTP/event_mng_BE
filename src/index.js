import express from 'express';
import cors from 'cors';
import { PORT } from './config/envConfig.js';
import connectDB from './config/db.js';
import routes from './routes/index.js';


const app = express();

// Middleware
app.use(express.json());

connectDB()

app.use(cors());


app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
