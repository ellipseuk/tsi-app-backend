
import express from 'express';
import { getSchedule } from '../controllers/scheduleController.js';

// Initialize the router
const router = express.Router();

// Define the routes
router.post('/', getSchedule);

// Export the router
export default router;