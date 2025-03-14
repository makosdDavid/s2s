import { Request, Response } from 'express';
import { GA4Service } from '../services/ga4Service';
import { CollectRequestBody, GA4Event } from '../types';

export class GA4Controller {
  private ga4Service: GA4Service;

  constructor() {
    this.ga4Service = new GA4Service();
  }

  /**
   * Handle the collect endpoint for receiving events
   * @param req Express request
   * @param res Express response
   */
  public async collect(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as CollectRequestBody;
      
      // Validate request body
      if (!body || !body.events || body.events.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid request body. Events array is required.',
        });
        return;
      }

      // Process and send events to GA4
      const result = await this.ga4Service.sendEvents(body.events);
      
      // Return response
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Events processed successfully',
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to process events',
        });
      }
    } catch (error) {
      console.error('Error in collect endpoint:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Handle Shopify events and convert them to GA4 format
   * @param req Express request
   * @param res Express response
   */
  public async shopifyEvent(req: Request, res: Response): Promise<void> {
    try {
      const shopifyEvent = req.body;
      
      // Validate Shopify event
      if (!shopifyEvent || !shopifyEvent.name) {
        res.status(400).json({
          success: false,
          message: 'Invalid Shopify event. Event name is required.',
        });
        return;
      }

      // Map Shopify event to GA4 format
      const ga4Event = this.ga4Service.mapShopifyEventToGA4(shopifyEvent);
      
      // Send event to GA4
      const result = await this.ga4Service.sendEvent(ga4Event);
      
      // Return response
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Shopify event processed successfully',
          eventName: ga4Event.name,
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to process Shopify event',
        });
      }
    } catch (error) {
      console.error('Error in shopifyEvent endpoint:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Handle a test event to verify GA4 connection
   * @param req Express request
   * @param res Express response
   */
  public async testEvent(req: Request, res: Response): Promise<void> {
    try {
      // Create a test event
      const testEvent: GA4Event = {
        name: 'test_event',
        params: {
          test_param: 'test_value',
          timestamp: new Date().toISOString(),
        },
      };

      // Send test event to GA4
      const result = await this.ga4Service.sendEvent(testEvent);
      
      // Return response
      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Test event sent successfully',
          event: testEvent,
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to send test event',
        });
      }
    } catch (error) {
      console.error('Error in testEvent endpoint:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
} 