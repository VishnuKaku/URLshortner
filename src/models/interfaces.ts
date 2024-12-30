// src/models/interfaces.ts

import { Document, ObjectId, Types } from 'mongoose';
import { Request } from 'express';
import { type } from 'os';

// User related interfaces
export interface IUserDocument extends Document {
    name: any;
    email: string;
    googleId: string;
    createdAt: Date;
    _id: ObjectId;
}

export interface IUserPayload {
    id: string;
    email: string;
}

// URL related interfaces
export interface IUrlDocument extends Document {
    originalUrl: string;
    shortCode: string;
    userId: string;
    topic?: string;
    customAlias?: string;
    createdAt: Date;
    _id: ObjectId;
}

export interface IUrlCreate {
    longUrl: string;
    customAlias?: string;
    topic?: string;
}

// Analytics related interfaces
export interface IAnalyticsDocument extends Document {
    urlId: ObjectId;
    userId: ObjectId;
    accessTime: Date;
    ipAddress: string;
    userAgent: string;
    referrer?: string;
    location?: ILocation;
    device?: {
        type?: string;
        os?: string;
        deviceType?: string;
        deviceName?: string;
    };
    geoInfo?: {
        country: string;
    };
}
export interface IAnalytics {
    _id: ObjectId;
    urlId: ObjectId;
    accessTime: Date;
    ipAddress: string;
    userAgent: string;
    device?: {
      type?: string;
      os?: string;
      deviceType?: string; // <-- Add this
      deviceName?: string; // <-- Add this
    };
    location?: {
      country?: string;
      city?: string;
      [key: string]: any;
    };
    referrer?: string;
    userId?: ObjectId;
  }
  


export interface ILocation {
    country?: string;
    city?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
}

export interface IDevice {
    type: string;
    browser: string;
    os: string;
}

// Analytics response interfaces
export interface IUrlAnalytics {
    totalClicks: number;
    uniqueClicks: number;
    clicksByDate: IClicksByDate[];
    osType: IOSStats[];
    deviceType: IDeviceStats[];
}

export interface IClicksByDate {
    date: string;
    count: number;
}

export interface IOSStats {
    osName: string;
    uniqueClicks: number;
    uniqueUsers: number;
}

export interface IDeviceStats {
    deviceName: string;
    uniqueClicks: number;
    uniqueUsers: number;
}


export interface ITopicAnalytics {

    totalClicks: number;
  
    uniqueClicks: number;
  
    clicksByDate: IClicksByDate[];
  
    urls: {
  
      shortUrl: string;
  
      totalClicks: number;
  
      uniqueClicks: number;
  
    }[];
  
  }
  

export interface ITopicUrl {
    shortUrl: string;
    totalClicks: number;
    uniqueClicks: number;
}

export interface IOverallAnalytics {
    timeframe: {
        start: Date;
        end: Date;
    };
    totalUrls: number;
    totalClicks: number;
    uniqueClicks: number;
    clicksByDate: IClicksByDate[];
    osType: IOSStats[];
    deviceType: IDeviceStats[];
    topUrls: [string, number][];
    geoDistribution: Record<string, number>;
    hourlyDistribution: Record<string, number>;
}

// Cache related interfaces
export interface ICacheOptions {
    expiresIn?: number;
}

// Error handling interfaces
export interface IApiError extends Error {
    statusCode: number;
    errors?: any[];
}

// Request handling interfaces
export interface IRequestWithUser extends Request {
    user?: IUserPayload;
}

// Response interfaces
export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Rate limiting interfaces
export interface IRateLimitConfig {
    windowMs: number;
    max: number;
    message: string;
}

// Google Auth interfaces
export interface IGoogleAuthProfile {
    id: string;
    emails: Array<{ value: string; verified: boolean }>;
    displayName: string;
    photos: Array<{ value: string }>;
}

// User interface
export interface IUser {
    id: string;
    email: string;
    name: string;
}

// URL creation interface
export interface IUrlCreate {
    longUrl: string;
    customAlias?: string;
    topic?: string;
}

export interface IGeoInfo {
    country: string;
    region: string;
    city: string;
    timezone: string;
}

export interface IDeviceInfo {
    type: string;
    deviceName: string;
    uniqueClicks: number;
    uniqueUsers: number;
    model?: string;
    vendor?: string;
    browser?: string;
    browserVersion?: string;
  }

  export interface IClickInfo {
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    deviceInfo: IDeviceInfo;
    geoInfo?: {
      country?: string;
      city?: string;
      region?: string;
    };
    referrer?: string;
  }

export interface IUser {
    email: string;
    googleId: string;
    createdAt: Date;
  }

  export interface IGoogleUser {
    id: string;
    email: string;
    googleId: string;
    displayName?: string;
    createdAt: Date;
  }
  
  // Extend Express Request to include our user type
  export interface IGoogleAuthRequest extends Request {
    user?: IGoogleUser;
  }

  export interface IAuthRequest extends Request {
    user?: IUserDocument;
  }