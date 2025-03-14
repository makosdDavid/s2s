import axios from 'axios';
import { GA4Event, GA4Response, GA4Config } from '../types';
import { config } from '../config/env';

export class GA4Service {
  private readonly measurementId: string;
  private readonly apiSecret: string;
  private readonly apiEndpoint: string;

  constructor(ga4Config: GA4Config = config.ga4) {
    this.measurementId = ga4Config.measurementId;
    this.apiSecret = ga4Config.apiSecret;
    this.apiEndpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`;
  }

  /**
   * Send a single event to Google Analytics 4
   * @param event The event to send
   * @returns Promise with the response
   */
  public async sendEvent(event: GA4Event): Promise<GA4Response> {
    return this.sendEvents([event]);
  }

  /**
   * Send multiple events to Google Analytics 4
   * @param events Array of events to send
   * @returns Promise with the response
   */
  public async sendEvents(events: GA4Event[]): Promise<GA4Response> {
    try {
      if (!events || events.length === 0) {
        return {
          success: false,
          message: 'No events to send',
        };
      }

      // Ensure client_id is set for each event
      const eventsWithClientId = events.map(event => {
        if (!event.client_id) {
          // Generate a random client ID if not provided
          event.client_id = this.generateClientId();
        }
        return event;
      });

      // Prepare the payload
      const payload = {
        client_id: eventsWithClientId[0].client_id,
        events: eventsWithClientId.map(event => ({
          name: event.name,
          params: event.params || {},
        })),
      };

      // Send the request to GA4
      const response = await axios.post(this.apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: response.status === 200 || response.status === 204,
        statusCode: response.status,
        message: 'Events sent successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('Error sending events to GA4:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Map a Shopify event to a GA4 event
   * @param shopifyEvent The Shopify event to map
   * @returns GA4Event
   */
  public mapShopifyEventToGA4(shopifyEvent: any): GA4Event {
    // Extract the event name and data
    const { name, data, client_id } = shopifyEvent;
    
    // Default GA4 event
    const ga4Event: GA4Event = {
      name: this.normalizeEventName(name),
      client_id: client_id || this.generateClientId(),
      params: {},
    };

    // Map common parameters
    if (data) {
      // Add page information if available
      if (data.page) {
        ga4Event.params = {
          ...ga4Event.params,
          page_location: data.page.url,
          page_title: data.page.title,
          page_referrer: data.page.referrer,
        };
      }

      // Add product information for product-related events
      if (data.productVariant) {
        ga4Event.params = {
          ...ga4Event.params,
          items: [{
            item_id: data.productVariant.id,
            item_name: data.productVariant.title,
            price: data.productVariant.price?.amount,
            currency: data.productVariant.price?.currencyCode,
          }],
        };
      }

      // Add checkout information for checkout events
      if (data.checkout) {
        ga4Event.params = {
          ...ga4Event.params,
          transaction_id: data.checkout.id,
          value: data.checkout.totalPrice?.amount,
          currency: data.checkout.currencyCode,
          items: data.checkout.lineItems?.map((item: any) => ({
            item_id: item.variant?.id,
            item_name: item.title,
            price: item.variant?.price,
            quantity: item.quantity,
          })),
        };
      }
    }

    return ga4Event;
  }

  /**
   * Normalize Shopify event names to GA4 format
   * @param eventName The Shopify event name
   * @returns Normalized event name
   */
  private normalizeEventName(eventName: string): string {
    // Map Shopify event names to GA4 event names
    const eventMap: Record<string, string> = {
      'page_viewed': 'page_view',
      'product_added_to_cart': 'add_to_cart',
      'checkout_started': 'begin_checkout',
      'checkout_completed': 'purchase',
      'payment_info_submitted': 'add_payment_info',
      'checkout_address_info_submitted': 'add_shipping_info',
    };

    return eventMap[eventName] || eventName;
  }

  /**
   * Generate a random client ID for GA4
   * @returns Random client ID
   */
  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
} 