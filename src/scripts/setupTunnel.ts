import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

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
 * Update the development environment file with the ngrok URL
 */
async function updateDevEnv(ngrokUrl: string): Promise<void> {
  try {
    // Load existing environment variables
    let envContent = '';
    if (fs.existsSync(devEnvPath)) {
      envContent = fs.readFileSync(devEnvPath, 'utf8');
    }
    
    // Parse existing environment variables
    const envConfig = dotenv.parse(envContent);
    
    // Update the SERVER_ENDPOINT with the ngrok URL
    // No need to add port to the URL as ngrok handles that
    envConfig.SERVER_ENDPOINT = `${ngrokUrl}/api/ga4/collect`;
    
    // Convert back to .env format
    const newEnvContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    // Write back to the file
    fs.writeFileSync(devEnvPath, newEnvContent);
    
    console.log(`Updated SERVER_ENDPOINT in ${devEnvPath} to ${ngrokUrl}/api/ga4/collect`);
  } catch (error) {
    console.error('Error updating dev.env file:', error);
  }
}

/**
 * Main function to set up the tunnel
 */
async function setupTunnel(): Promise<void> {
  // Only run in development mode
  if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode, skipping ngrok tunnel setup');
    return;
  }
  
  console.log('Setting up ngrok tunnel for development...');
  
  // Get the ngrok URL
  const ngrokUrl = await getNgrokUrl();
  if (!ngrokUrl) {
    console.error('Failed to get ngrok URL. Make sure ngrok is running.');
    return;
  }
  
  console.log(`Detected ngrok tunnel URL: ${ngrokUrl}`);
  
  // Update the development environment file
  await updateDevEnv(ngrokUrl);
  
  console.log('Tunnel setup complete!');
}

// Run the setup
setupTunnel().catch(console.error); 