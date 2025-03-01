import mongoose from 'mongoose';
import config from './config';
import app from './app';

const PORT = config.port || 5000;
const DB_URI = config.db_url as string;

mongoose.connect(DB_URI,)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

  
