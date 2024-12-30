// src/config/auth.config.ts
interface AuthConfig {
  jwtSecret: string;
  jwtExpiry: string;
  google: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
}

const config: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  }
};

export default config;