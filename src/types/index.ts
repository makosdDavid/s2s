// Google Analytics 4 event types
export interface GA4Event {
  name: string;
  params?: Record<string, any>;
  client_id?: string;
  user_id?: string;
  timestamp_micros?: number;
}

// Shopify event types
export interface ShopifyEvent {
  name: string;
  data: Record<string, any>;
  timestamp?: string;
  client_id?: string;
  source?: string;
}

// Configuration for the GA4 service
export interface GA4Config {
  measurementId: string;
  apiSecret: string;
  streamId?: string;
}

// Response from GA4 API
export interface GA4Response {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: any;
}

// Server configuration
export interface ServerConfig {
  port: number;
  endpoint: string;
}

// Shopify configuration
export interface ShopifyConfig {
  appUrl: string;
  appHost: string;
  adminApiAccessToken: string;
  apiKey: string;
  apiSecretKey: string;
}

// Web pixel settings
export interface WebPixelSettings {
  accountID: string;
  enableDebug?: boolean;
  storeEventsInLocalStorage?: boolean;
}

// Request body for the collect endpoint
export interface CollectRequestBody {
  client_id: string;
  events: GA4Event[];
  user_id?: string;
  non_personalized_ads?: boolean;
  timestamp_micros?: number;
} 