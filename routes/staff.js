import express from 'express';
import { getAllStaff, getStaffByName } from '../controllers/staffController.js';

const router = express.Router();

router.get('/staff', getAllStaff);
router.get('/staff/:name', getStaffByName);

export default router;