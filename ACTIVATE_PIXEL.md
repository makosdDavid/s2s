# Activating the Web Pixel Extension

After deploying the app, you need to activate the web pixel extension for it to start collecting data. This README explains how to do that.

## Prerequisites

Before activating the web pixel, ensure that:

1. Your web pixel extension has been successfully deployed (using `npm run deploy`)
2. You have installed the app on the target Shopify store
3. You have the necessary API access token with `write_pixels` and `read_customer_events` scopes

## Installation

First, install the required dependencies:

```bash
npm install
```

## Configuration

The script uses your app's client secret as the API access token. This is already configured in the `.env` file:

```
SHOPIFY_API_ACCESS_TOKEN=a94cf01e9eaa74bd5e36789eb0d2b7bb
```

You may need to modify the `activate-pixel.js` script to set the correct account ID and other settings:

```javascript
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
```

## Activating the Web Pixel

Run the following command, replacing `your-store.myshopify.com` with your actual store domain:

```bash
npm run activate-pixel your-store.myshopify.com
```

If the activation is successful, you should see a response like this:

```json
Web pixel activated successfully:
{
  "webPixelCreate": {
    "webPixel": {
      "id": "gid://shopify/WebPixel/12345",
      "settings": "{\"accountID\":\"your-account-id\",\"enableDebug\":\"true\",\"storeEventsInLocalStorage\":\"false\"}"
    },
    "userErrors": []
  }
}
```

## Verification

To verify that your web pixel is working:

1. Open your Shopify store in a web browser
2. Right-click anywhere on the page and select "Inspect" to open developer tools
3. Go to the "Console" tab
4. You should see logs from your web pixel (especially if debug mode is enabled)

## Troubleshooting

If you encounter any errors:

1. Make sure your app has the required scopes (`write_pixels` and `read_customer_events`)
2. Verify that your access token is correct
3. Check that the store URL is formatted correctly
4. Ensure that the app is properly installed on the store
5. Check the response for any specific error messages

For more information, see the [Shopify Web Pixel API documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/webPixelCreate) 