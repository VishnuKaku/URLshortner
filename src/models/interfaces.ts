// Shared interfaces
// src/models/interfaces.ts

import { Document } from 'mongoose';
import { Request } from 'express';

// User related interfaces
export interface IUserDocument extends Document {
  email: string;
  googleId: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
}

export interface IUrlCreate {
  longUrl: string;
  customAlias?: string;
  topic?: string;
}

// Analytics related interfaces
export interface IAnalyticsDocument extends Document {
  urlId: string;
  userId: string;
  accessTime: Date;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  location?: ILocation;
  device?: IDevice;
  geoInfo?: {
    country: string;
  };
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
  urls: ITopicUrl[];
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