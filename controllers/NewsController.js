class NewsController {
  constructor(newsService) {
    this.newsService = newsService;
  }

  async getNews(req, res) {
    try {
      const news = await this.newsService.getNews();
      res.status(200).json({ news });
    } catch (error) {
      console.error('Error fetching news:', error.message);
      res.status(500).json({ error: `Failed to fetch news: ${error.message}` });
    }
  }
}

export default NewsController;