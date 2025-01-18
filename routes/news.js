import express from 'express';
import RSSRepository from '../repositories/RSSRepository.js';
import NewsService from '../services/NewsService.js';
import NewsController from '../controllers/NewsController.js';

const router = express.Router();

const rssRepository = new RSSRepository('https://tsi.lv/feed/');
const newsService = new NewsService(rssRepository);
const newsController = new NewsController(newsService);

router.get('/news', newsController.getNews.bind(newsController));
export default router;
