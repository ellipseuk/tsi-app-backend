import express from "express";
import { getEvents } from "../controllers/eventsController.js";

const router = express.Router();
router.get("/events", getEvents);

export default router;
