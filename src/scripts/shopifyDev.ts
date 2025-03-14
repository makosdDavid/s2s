import axios from 'axios';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Path to the development environment file
const devEnvPath = path.resolve(process.cwd(), 'env', 'dev.env');

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
 * Run the Shopify app dev command with the ngrok tunnel URL
 */
async function runShopifyDev(): Promise<void> {
  try {
    // Get the ngrok URL
    const ngrokUrl = await getNgrokUrl();
    if (!ngrokUrl) {
      console.error('Failed to get ngrok URL. Make sure ngrok is running.');
      return;
    }
    
    console.log(`Detected ngrok tunnel URL: ${ngrokUrl}`);
    
    // Format the URL correctly for Shopify CLI
    // Shopify expects the format: https://my-tunnel-url
    // No need to add port as ngrok handles that
    const formattedUrl = ngrokUrl;
    
    console.log(`Using formatted tunnel URL: ${formattedUrl}`);
    
    // Run the Shopify app dev command with the formatted URL
    const shopifyDev = spawn('shopify', ['app', 'dev', `--tunnel-url=${formattedUrl}`], {
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process exit
    shopifyDev.on('close', (code) => {
      console.log(`Shopify app dev process exited with code ${code}`);
    });
  } catch (error) {
    console.error('Error running Shopify app dev:', error);
  }
}

// Run the script
runShopifyDev().catch(console.error); 