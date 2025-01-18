import * as cheerio from 'cheerio';
import xml2js from 'xml2js';
import News from '../models/News.js';

class NewsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getNews() {
    const xmlData = await this.repository.fetchRSSFeed();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);

    const items = result.rss.channel.item;

    return items
      .filter(item => {
        const guid = item.guid ? item.guid.toString() : '';
        return !guid.includes('post_type=events') && !item.event_date;
      })
      .map(item => {
        const content = item['content:encoded'] || item.content || item.description || '';
        const $ = cheerio.load(content);
        const imageUrl = $('img').first().attr('src') || item.enclosure?.url || null;

        return new News({
          title: item.title,
          link: item.link,
          date: item.pubDate,
          description: item.contentSnippet || $(content).text() || '',
          image: imageUrl,
        });
      });
  }
}

export default NewsService;