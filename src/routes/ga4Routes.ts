import { Router } from 'express';
import { GA4Controller } from '../controllers/ga4Controller';

const router = Router();
const ga4Controller = new GA4Controller();

// Route for collecting GA4 events
router.post('/collect', (req, res) => ga4Controller.collect(req, res));

// Route for processing Shopify events
router.post('/shopify', (req, res) => ga4Controller.shopifyEvent(req, res));

// Route for testing GA4 connection
router.get('/test', (req, res) => ga4Controller.testEvent(req, res));

export default router; 