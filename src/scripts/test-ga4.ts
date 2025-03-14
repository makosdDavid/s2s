import { GA4Service } from '../services/ga4Service';
import { GA4Event } from '../types';
import { config } from '../config/env';

// Validate configuration
if (!config.ga4.measurementId || !config.ga4.apiSecret) {
  console.error('Missing required GA4 configuration. Please check your environment variables.');
  process.exit(1);
}

// Create GA4 service
const ga4Service = new GA4Service();

// Generate a random client ID
function generateClientId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Create a test event
const testEvent: GA4Event = {
  name: 'test_event',
  client_id: generateClientId(),
  params: {
    test_param: 'test_value',
    timestamp: new Date().toISOString(),
    source: 'test_script'
  }
};

// Send the test event
async function sendTestEvent() {
  console.log('Sending test event to GA4...');
  console.log('GA4 Measurement ID:', config.ga4.measurementId);
  console.log('Event:', JSON.stringify(testEvent, null, 2));
  
  try {
    const result = await ga4Service.sendEvent(testEvent);
    
    if (result.success) {
      console.log('✅ Test event sent successfully!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Failed to send test event:');
      console.error(result.message);
    }
  } catch (error) {
    console.error('❌ Error sending test event:');
    console.error(error);
  }
}

// Run the test
sendTestEvent(); 