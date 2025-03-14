import { spawn } from 'child_process';
import axios from 'axios';

// Define ports
const NGROK_PORT = 3001;
const SERVER_PORT = 3002;

/**
 * Get the ngrok tunnel URL from the local ngrok API
 */
async function getNgrokUrl(): Promise<string | null> {
  try {
    const response = await axios.get('http://localhost:4040/api/tunnels');
    const tunnels = response.data.tunnels;
    
    if (tunnels && tunnels.length > 0) {
      // Find the HTTPS tunnel
      const httpsTunnel = tunnels.find((tunnel: any) => tunnel.proto === 'https');
      if (httpsTunnel) {
        return httpsTunnel.public_url;
      }
    }
    
    console.error('No ngrok tunnels found');
    return null;
  } catch (error) {
    console.error('Error getting ngrok tunnel URL:', error);
    return null;
  }
}

/**
 * Start ngrok if it's not already running
 */
async function startNgrok(): Promise<void> {
  try {
    // Check if ngrok is already running
    try {
      await axios.get('http://localhost:4040/api/tunnels');
      console.log('ngrok is already running');
      return;
    } catch (error) {
      console.log('Starting ngrok...');
    }
    
    // Start ngrok on NGROK_PORT
    const ngrok = spawn('ngrok', ['http', NGROK_PORT.toString()], {
      stdio: 'inherit',
      shell: true,
      detached: true
    });
    
    // Don't wait for ngrok to exit
    ngrok.unref();
    
    // Wait for ngrok to start
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const url = await getNgrokUrl();
        if (url) {
          console.log(`ngrok started with URL: ${url}`);
          return;
        }
      } catch (error) {
        // Ignore errors and try again
      }
      
      attempts++;
    }
    
    console.error('Failed to start ngrok after multiple attempts');
  } catch (error) {
    console.error('Error starting ngrok:', error);
  }
}

/**
 * Start the development server
 */
function startDevServer(): void {
  console.log(`Starting development server on port ${SERVER_PORT}...`);
  
  // Set PORT environment variable for the server
  const env = { ...process.env, PORT: SERVER_PORT.toString() };
  
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env
  });
  
  server.on('close', (code) => {
    console.log(`Development server exited with code ${code}`);
    process.exit(code || 0);
  });
}

/**
 * Start a proxy server to forward requests from ngrok to the actual server
 */
function startProxyServer(): void {
  console.log(`Starting proxy server on port ${NGROK_PORT} to forward to ${SERVER_PORT}...`);
  
  // Use a simple express server to proxy requests
  const proxyServer = spawn('ts-node', ['src/scripts/proxyServer.ts'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      SOURCE_PORT: NGROK_PORT.toString(),
      TARGET_PORT: SERVER_PORT.toString()
    }
  });
  
  proxyServer.on('close', (code) => {
    console.log(`Proxy server exited with code ${code}`);
    process.exit(code || 0);
  });
}

/**
 * Start the Shopify app dev command with ngrok
 */
async function startShopifyDev(): Promise<void> {
  console.log('Starting Shopify app dev with ngrok...');
  
  // Get the ngrok URL
  const ngrokUrl = await getNgrokUrl();
  if (!ngrokUrl) {
    console.error('Failed to get ngrok URL. Make sure ngrok is running.');
    return;
  }
  
  // Format the URL correctly for Shopify CLI
  const url = new URL(ngrokUrl);
  const formattedUrl = `${url.protocol}//${url.host}:3001`;
  
  console.log(`Using formatted tunnel URL: ${formattedUrl}`);
  
  // Run the Shopify app dev command with the formatted URL
  const shopifyDev = spawn('shopify', ['app', 'dev', `--tunnel-url=${formattedUrl}`], {
    stdio: 'inherit',
    shell: true
  });
  
  shopifyDev.on('close', (code) => {
    console.log(`Shopify app dev process exited with code ${code}`);
    process.exit(code || 0);
  });
}

/**
 * Main function to run everything
 */
async function main(): Promise<void> {
  try {
    // Start ngrok
    await startNgrok();
    
    // Start the development server
    startDevServer();
    
    // Wait a bit for the server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start Shopify app dev
    await startShopifyDev();
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error); 