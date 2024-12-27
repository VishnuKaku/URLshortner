// Auth configuration 

import dotenv from 'dotenv';

dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtExpiry: process.env.JWT_EXPIRY || '1h',
};

