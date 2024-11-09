import { Router } from 'express';
import { authentication } from '../controllers/authController.js';

const router = Router();


router.post('/login', authentication);

export default router;
