import express from "express";
import RSSRepository from "../repositories/RSSRepository.js";
import EventService from "../services/EventService.js";
import EventController from "../controllers/EventController.js";

const router = express.Router();

const rssRepository = new RSSRepository("https://tsi.lv/feed/");
const eventService = new EventService(rssRepository);
const eventController = new EventController(eventService);

router.get("/api/events", eventController.getEvents.bind(eventController));

export default router;
