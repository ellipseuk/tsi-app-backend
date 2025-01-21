import { Router } from "express";
import newsRouter from "./news.js";
import eventsRouter from "./events.js";

const router = Router();

router.use(newsRouter);
router.use(eventsRouter);

export default router;
