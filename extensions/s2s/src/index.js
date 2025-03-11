import {register} from "@shopify/web-pixels-extension";

register(({ analytics, browser, init, settings }) => {
  // Configuration with fallback defaults
  const CONFIG = {
    // Whether to enable debug mode (logs events to console)
    DEBUG: settings.enableDebug === "true" || settings.enableDebug === true || true, // Default to true if not provided
    // JSON storage for events (in localStorage)
    STORAGE_KEY: 'shopify_pixel_events',
    // Whether to store events in localStorage
    STORE_EVENTS: settings.storeEventsInLocalStorage === "true" || settings.storeEventsInLocalStorage === true || true, // Default to true if not provided
    // Account ID from settings
    ACCOUNT_ID: settings.accountID || 'default'
  };

  // Helper function to generate a client ID if it doesn't exist
  function getClientId() {
    const cookieName = "_s2s_client_id";
    let clientId = getCookie(cookieName);
    
    if (!clientId) {
      // Generate UUID v4 format
      clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      setCookie(cookieName, clientId, 730); // 2 years expiry
    }
    
    return clientId;
  }
  
  // Get a cookie by name
  function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  // Set a cookie with name, value and expiry days
  function setCookie(name, value, days) {
    if (typeof document === 'undefined') return value;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    return value;
  }
  
  // Get all cookies as an object
  function getAllCookies() {
    const cookies = {};
    if (typeof document === 'undefined' || !document.cookie) return cookies;
    
    document.cookie.split(';').forEach(function(cookie) {
      const parts = cookie.trim().split('=');
      const name = parts[0];
      const value = parts.length > 1 ? decodeURIComponent(parts[1]) : '';
      cookies[name] = value;
    });
    return cookies;
  }
  
  // Get UTM parameters from URL
  function getUtmParameters() {
    if (typeof window === 'undefined') return {};
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      gclid: urlParams.get('gclid'),
      fbclid: urlParams.get('fbclid')
    };
  }
  
  // Get attribution data from cookies
  function getAttributionData() {
    return {
      utm_source: getCookie('utm_source'),
      utm_medium: getCookie('utm_medium'),
      utm_campaign: getCookie('utm_campaign'),
      utm_term: getCookie('utm_term'),
      utm_content: getCookie('utm_content'),
      gclid: getCookie('gclid'),
      fbclid: getCookie('fbclid')
    };
  }
  
  // Function to handle event storage
  function saveEventToStorage(eventName, eventData) {
    if (!CONFIG.STORE_EVENTS || typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      // Get existing events or create empty array
      let events = [];
      const stored = window.localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        events = JSON.parse(stored);
      }
      
      // Add new event
      events.push({
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      });
      
      // Limit storage size (keep last 100 events)
      if (events.length > 100) {
        events = events.slice(events.length - 100);
      }
      
      // Save back to storage
      window.localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      if (CONFIG.DEBUG) console.error('Error saving event to storage', e);
    }
  }
  
  // Function to handle Shopify events
  function handleShopifyEvent(event) {
    if (CONFIG.DEBUG) {
      console.log(`Shopify Event Received: ${event.name}`, event);
    }
    
    // Format the event data
    const formattedEvent = {
      client_id: getClientId(),
      account_id: CONFIG.ACCOUNT_ID,
      data: event.data,
      timestamp: new Date().toISOString(),
      attribution: getAttributionData(),
      cookies: getAllCookies(),
      source: 'shopify_pixel'
    };
    
    // Save to storage
    saveEventToStorage(event.name, formattedEvent);
    
    // Log for debugging
    if (CONFIG.DEBUG) {
      console.group(`%c🔍 Event: ${event.name}`, 'color: #4285F4; font-weight: bold;');
      console.log('Event Name:', event.name);
      console.log('Full Data:', JSON.stringify(formattedEvent, null, 2));
      console.groupEnd();
    }
  }
  
  // Store UTM parameters if present in URL
  function storeUtmParameters() {
    const utmParams = getUtmParameters();
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        setCookie(key, value, 30); // Store for 30 days
      }
    });
  }
  
  // Initialize the extension
  function initialize() {
    // Check if in browser environment
    if (typeof window === 'undefined') return;
    
    // Store UTM parameters from URL if any
    storeUtmParameters();
    
    // Subscribe to all Shopify events    
    analytics.subscribe('all_events', handleShopifyEvent);
    
    // Also set up specific subscribers for better visibility
    analytics.subscribe('page_viewed', (event) => {
      if (CONFIG.DEBUG) console.log('Page viewed event received', event);
    });
    
    analytics.subscribe('all_standard_events', (event) => {
      if (CONFIG.DEBUG) console.log('Standard event received', event);
    });
    
    analytics.subscribe('all_custom_events', (event) => {
      if (CONFIG.DEBUG) console.log('Custom event received', event);
    });
    
    if (CONFIG.DEBUG) {
      console.log('S2S Web Pixel initialized successfully');
      console.log('Settings:', {
        DEBUG: CONFIG.DEBUG,
        STORE_EVENTS: CONFIG.STORE_EVENTS,
        ACCOUNT_ID: CONFIG.ACCOUNT_ID
      });
    }
  }
  
  // Initialize the extension
  initialize();
});
