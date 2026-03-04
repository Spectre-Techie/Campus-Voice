import dotenv from 'dotenv';

// Load .env before anything else
dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  DIRECT_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  CORS_ORIGIN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

function getEnv(): EnvConfig {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    DIRECT_URL: process.env.DIRECT_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  };
}

export const env = getEnv();
