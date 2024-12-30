// URL model 
// src/models/Url.ts
import mongoose, { Schema } from 'mongoose';
// Define the schema
const urlSchema = new Schema({
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
}, {
    timestamps: true, // Enable `createdAt` and `updatedAt` automatically
});
// Define and export the model
export const Url = mongoose.model('Url', urlSchema);
