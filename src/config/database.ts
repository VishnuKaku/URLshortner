// src/config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async () => {
    try {
        // Use the exact database name from your Compass connection
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url-shortener';
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            family: 4  // Force IPv4
        };

        await mongoose.connect(mongoURI, options);
        console.log('Successfully connected to MongoDB at:', mongoURI);
        
        // Add connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connection established');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose connection disconnected');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

export default connectDatabase;