const { GraphQLClient, gql } = require('graphql-request');
require('dotenv').config();

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

async function activateWebPixel() {
  // Get the shop name from command line argument
  const shop = process.argv[2];
  if (!shop) {
    console.error('Please provide a shop domain. Example: npm run activate-pixel your-store.myshopify.com');
    process.exit(1);
  }

  // Read the access token from environment variable
  const accessToken = process.env.SHOPIFY_API_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('SHOPIFY_API_ACCESS_TOKEN environment variable is missing');
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
    const variables = {
      webPixel: {
        settings: JSON.stringify({
          accountID: "your-account-id", // Replace with actual account ID
          enableDebug: "true",
          storeEventsInLocalStorage: "false"
        })
      }
    };

    // Execute the mutation
    const response = await client.request(ACTIVATE_WEB_PIXEL, variables);
    
    console.log('Web pixel activated successfully:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error activating web pixel:');
    console.error(error.message);
    if (error.response?.errors) {
      console.error(JSON.stringify(error.response.errors, null, 2));
    }
  }
}

activateWebPixel(); 