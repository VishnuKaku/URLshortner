// src/models/Analytics.ts
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAnalytics {
  _id: ObjectId;
  urlId: ObjectId;
  accessTime: Date;
  ipAddress: string;
  userAgent: string;
  device?: {
    type?: string;
    os?: string;
  };
  location?: {
    country?: string;
    city?: string;
    [key: string]: any;
  };
  referrer?: string;
  userId?: ObjectId;
}

const AnalyticsSchema = new Schema({
  urlId: { type: Schema.Types.ObjectId, required: true },
  accessTime: { type: Date, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  device: {
    type: {
      type: String
    },
    os: {
      type: String
    }
  },
  location: {
    type: Object
  },
  referrer: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

export type IAnalyticsDocument = Document<unknown, {}, IAnalytics> & IAnalytics;
export default mongoose.model<IAnalyticsDocument>('Analytics', AnalyticsSchema);
