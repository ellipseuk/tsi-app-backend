import * as cheerio from 'cheerio';
import xml2js from 'xml2js';
import Event from '../models/Event.js';

class EventService {
  constructor(repository) {
    this.repository = repository;
  }

  async getEvents() {
    const xmlData = await this.repository.fetchRSSFeed();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);
  
    const items = result.rss.channel.item;
  
    return items
      .filter(item => {
        const guid = item.guid ? item.guid.toString() : '';
        return guid.includes('post_type=events') || item.event_date;
      })
      .map(item => {
        const content = item['content:encoded'] || item.description || '';
        const $ = cheerio.load(content);
        const imageUrl = $('img').first().attr('src') || item.enclosure?.url || null;
  
        return new Event({
          title: item.title,
          link: item.link,
          date: item.pubDate,
          description: item.contentSnippet || $(content).text() || '',
          image: imageUrl,
          eventDate: item.event_date || null,
          eventEndDate: item.event_end_date || null,
        });
      });
  }  
}

export default EventService;
