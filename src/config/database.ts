// Database configuration 

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = async () => {
  try {
    const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener';
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

