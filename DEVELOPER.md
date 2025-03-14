# Developer Documentation

This document provides detailed information for developers working on the S2S GA4 Tracking project.

## Project Structure

```
s2s/
├── dist/                  # Compiled TypeScript output
├── env/                   # Environment configuration files
│   └── dev.env            # Development environment variables
├── extensions/            # Shopify extensions
│   └── s2s/               # Web pixel extension
│       ├── src/           # Extension source code
│       └── shopify.extension.toml  # Extension configuration
├── logs/                  # Application logs
├── node_modules/          # Node.js dependencies
├── src/                   # Application source code
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── public/            # Static files
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── services/          # Business logic services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── server.ts          # Main application entry point
├── .gitignore             # Git ignore file
├── .gitlab-ci.yml         # GitLab CI/CD configuration
├── package.json           # Node.js package configuration
├── README.md              # Project overview
└── tsconfig.json          # TypeScript configuration
```

## Setup and Installation

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- A Shopify Partner account
- A Shopify development store
- A Google Analytics 4 property

### Installation Steps

1. Clone the repository:

```bash
git clone https://gitlab.com/your-username/s2s.git
cd s2s
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `env/dev.env` file with the following variables:

```env
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret
GA4_STREAM_ID=your_stream_id

# The endpoint where the GA4 server is running
SERVER_ENDPOINT=https://your-domain.com/api/ga4/collect

# Shopify API credentials
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_access_token
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET_KEY=your_api_secret_key

# Port for the GA4 endpoint server
PORT=3000
```

## Development Workflow

### Running the Application

Start the development server:

```bash
npm run dev
```

This will start the server with hot reloading enabled.

### Building the Application

Build the project:

```bash
npm run build
```

This will compile TypeScript to JavaScript and copy static files to the `dist` directory.

### Testing

Test the GA4 connection:

```bash
npm run test-ga4
```

### Shopify Web Pixel Extension

The web pixel extension is located in the `extensions/s2s` directory. It collects events from Shopify stores and sends them to the server endpoint.

#### Activating the Web Pixel

To activate the web pixel on a Shopify store:

```bash
npm run activate-pixel your-store.myshopify.com
```

Replace `your-store.myshopify.com` with your actual Shopify store domain.

## API Endpoints

### POST /api/ga4/collect

Endpoint for collecting GA4 events.

**Request Body:**

```json
{
  "client_id": "client_id_string",
  "events": [
    {
      "name": "event_name",
      "params": {
        "param1": "value1",
        "param2": "value2"
      }
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Events processed successfully"
}
```

### POST /api/ga4/shopify

Endpoint for processing Shopify events.

**Request Body:**

```json
{
  "name": "event_name",
  "data": {
    "key1": "value1",
    "key2": "value2"
  },
  "client_id": "client_id_string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Shopify event processed successfully",
  "eventName": "event_name"
}
```

### GET /api/ga4/test

Endpoint for testing GA4 connection.

**Response:**

```json
{
  "success": true,
  "message": "Test event sent successfully",
  "event": {
    "name": "test_event",
    "params": {
      "test_param": "test_value",
      "timestamp": "2023-03-14T12:34:56.789Z"
    }
  }
}
```

## Deployment

### Manual Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` directory to your server.

3. Set up environment variables on your server.

4. Start the server:

```bash
npm start
```

### GitLab CI/CD

The project includes a `.gitlab-ci.yml` file for automated deployment using GitLab CI/CD. The pipeline includes the following stages:

- **Build**: Compiles TypeScript to JavaScript
- **Test**: Tests the GA4 connection
- **Deploy**: Deploys the application to staging or production

## Troubleshooting

### Common Issues

1. **Missing GA4 configuration**:
   - Ensure that `GA4_MEASUREMENT_ID` and `GA4_API_SECRET` are set in your environment variables.

2. **Web pixel not receiving events**:
   - Check that the web pixel is properly activated on the Shopify store.
   - Verify that the `SERVER_ENDPOINT` is correctly set and accessible.

3. **Events not showing up in GA4**:
   - Check the GA4 Realtime report to see if events are being received.
   - Verify that the GA4 Measurement ID and API Secret are correct.
   - Check the server logs for any errors.

### Debugging

- Enable debug mode in the web pixel extension by setting `enableDebug` to `true`.
- Check the browser console for any errors or logs from the web pixel.
- Check the server logs in the `logs` directory.

## Contributing

1. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:

```bash
git commit -m "Add your commit message"
```

3. Push your changes to the remote repository:

```bash
git push origin feature/your-feature-name
```

4. Create a merge request on GitLab.

## Code Style and Best Practices

- Follow TypeScript best practices and use strong typing.
- Use async/await for asynchronous operations.
- Write meaningful commit messages.
- Document your code with JSDoc comments.
- Write unit tests for new features.

## Future Enhancements

- IMAP email sender based on GA4 data
- Support for additional analytics platforms
- Enhanced event transformation and filtering
- User interface for configuration and monitoring 