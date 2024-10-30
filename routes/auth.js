import { Router } from 'express';
import authController from '../controllers/authController.js';
const router = Router();

// Endpoints
router.post('/login', authController.login);

export default router;