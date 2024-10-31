import express from 'express';
import { getSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/', getSchedule);

export default router;