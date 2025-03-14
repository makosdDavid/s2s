import { GraphQLClient, gql } from 'graphql-request';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' 
  ? path.resolve(process.cwd(), '.env') 
  : path.resolve(process.cwd(), 'env', 'dev.env');

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  console.warn(`Environment file ${envFile} not found. Using process.env variables.`);
  dotenv.config();
}

// The webPixelCreate mutation
const ACTIVATE_WEB_PIXEL = gql`
  mutation webPixelCreate($webPixel: WebPixelInput!) {
    webPixelCreate(webPixel: $webPixel) {
      webPixel {
        id
        settings
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface WebPixelSettings {
  accountID: string;
  enableDebug: string;
  storeEventsInLocalStorage: string;
  serverEndpoint: string;
}

interface WebPixelInput {
  settings: string;
}

interface WebPixelCreateResponse {
  webPixelCreate: {
    webPixel: {
      id: string;
      settings: string;
    };
    userErrors: {
      field: string;
      message: string;
    }[];
  };
}

async function activateWebPixel(): Promise<void> {
  // Get the shop name from command line argument
  const shop = process.argv[2];
  if (!shop) {
    console.error('Please provide a shop domain. Example: npm run activate-pixel your-store.myshopify.com');
    process.exit(1);
  }

  // Read the access token from environment variable
  const accessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('SHOPIFY_ADMIN_API_ACCESS_TOKEN environment variable is missing');
    process.exit(1);
  }

  // Create GraphQL client
  const client = new GraphQLClient(`https://${shop}/admin/api/2025-01/graphql.json`, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  try {
    // Variables for the mutation
    const settings: WebPixelSettings = {
      accountID: process.env.GA4_MEASUREMENT_ID || 'default-account-id',
      enableDebug: "true",
      storeEventsInLocalStorage: "false",
      serverEndpoint: process.env.SERVER_ENDPOINT || 'https://tomcsanyi.eu/api/ga4/collect'
    };

    const variables = {
      webPixel: {
        settings: JSON.stringify(settings)
      }
    };

    // Execute the mutation
    const response = await client.request<WebPixelCreateResponse>(ACTIVATE_WEB_PIXEL, variables);
    
    console.log('Web pixel activated successfully:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error activating web pixel:');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    
    // Handle GraphQL errors
    const graphqlError = error as { response?: { errors?: any[] } };
    if (graphqlError.response?.errors) {
      console.error(JSON.stringify(graphqlError.response.errors, null, 2));
    }
  }
}

activateWebPixel(); 