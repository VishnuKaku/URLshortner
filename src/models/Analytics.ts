// Analytics model 
// src/models/Analytics.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalytics extends Document {
  urlId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  accessTime: Date;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  location?: {
    country?: string;
    city?: string;
  };
  device?: {
    type?: string;
    browser?: string;
    os?: string;
  };
}

const analyticsSchema = new Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accessTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: String,
  location: {
    country: String,
    city: String
  },
  device: {
    type: String,
    browser: String,
    os: String
  }
});

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);