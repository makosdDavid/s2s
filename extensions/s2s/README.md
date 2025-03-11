# Shopify Event Tracking Web Pixel

This Shopify Web Pixel extension subscribes to all store events and collects them for analytics and tracking purposes.

## Features

- Subscribes to all Shopify events (`all_events`, `all_standard_events`, `all_custom_events`)
- Captures user information including client ID and attribution data
- Stores event data in browser's localStorage (limited to last 100 events)
- Includes UTM parameters and attribution data for marketing analysis
- Captures all cookies for complete context

## Configuration

This web pixel extension can be configured with the following settings:

1. **Account ID** - Your account identifier for tracking purposes (required)
2. **Enable Debug Mode** - Enter "true" to enable debug console logs (optional, defaults to true)
3. **Store Events in localStorage** - Enter "true" to store events in browser's localStorage (optional, defaults to true)

All settings except Account ID are optional. If not provided, the extension will use sensible defaults.

## Event Data Format

Each captured event includes:

```json
{
  "event": "event_name",
  "data": {
    "client_id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
    "account_id": "your-account-id",
    "data": { /* Original Shopify event data */ },
    "timestamp": "2023-01-01T00:00:00.000Z",
    "attribution": {
      "utm_source": "...",
      "utm_medium": "...",
      "utm_campaign": "...",
      "utm_term": "...",
      "utm_content": "...",
      "gclid": "...",
      "fbclid": "..."
    },
    "cookies": { /* All cookies */ },
    "source": "shopify_pixel"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Usage

This extension is automatically activated when installed on a Shopify store. Configure the settings in the Shopify admin panel.

### Accessing Stored Events

Events are stored in the browser's localStorage under the key `shopify_pixel_events`. You can access them using:

```javascript
const events = JSON.parse(localStorage.getItem('shopify_pixel_events') || '[]');
console.log(events);
```

## Debug Mode

When debug mode is enabled, the extension will log all events to the browser console, making it easier to verify that data is being collected correctly.
