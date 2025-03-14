import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
const envFile = process.env.NODE_ENV === 'production' 
  ? path.resolve(process.cwd(), '.env') 
  : path.resolve(process.cwd(), 'env', 'dev.env');

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  console.warn(`Environment file ${envFile} not found. Using process.env variables.`);
  dotenv.config();
}

export const config = {
  // Google Analytics 4 configuration
  ga4: {
    measurementId: process.env.GA4_MEASUREMENT_ID || '',
    apiSecret: process.env.GA4_API_SECRET || '',
    streamId: process.env.GA4_STREAM_ID || '',
  },
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    endpoint: process.env.SERVER_ENDPOINT || 'http://localhost:3000/api/ga4/collect',
  },
  // Shopify configuration
  shopify: {
    appUrl: process.env.SHOPIFY_APP_URL || '',
    appHost: process.env.SHOPIFY_APP_HOST || '',
    adminApiAccessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || '',
    apiKey: process.env.SHOPIFY_API_KEY || '',
    apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY || '',
  }
};

// Validate required configuration
export function validateConfig(): boolean {
  const requiredGa4Fields = ['measurementId', 'apiSecret'];
  const missingGa4Fields = requiredGa4Fields.filter(field => !config.ga4[field as keyof typeof config.ga4]);
  
  if (missingGa4Fields.length > 0) {
    console.error(`Missing required GA4 configuration: ${missingGa4Fields.join(', ')}`);
    return false;
  }
  
  return true;
} 