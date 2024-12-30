// URL model 
// src/models/Url.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the IUrl interface with `createdAt` and `updatedAt`
export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  userId: mongoose.Types.ObjectId;
  expiresAt?: Date;
  customDomain?: string;
  isCustom: boolean;
  createdAt: Date; // Include createdAt
  updatedAt: Date; // Include updatedAt
}

// Define the schema
const urlSchema = new Schema<IUrl>(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    customDomain: {
      type: String,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Enable `createdAt` and `updatedAt` automatically
  }
);

// Define and export the model
export const Url: Model<IUrl> = mongoose.model<IUrl>('Url', urlSchema);
