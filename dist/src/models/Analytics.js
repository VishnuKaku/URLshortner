// src/models/Analytics.ts
import mongoose, { Schema } from 'mongoose';
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
export default mongoose.model('Analytics', AnalyticsSchema);
