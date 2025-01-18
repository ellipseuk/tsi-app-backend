import axios from 'axios';

class RSSRepository {
  constructor(feedUrl) {
    this.feedUrl = feedUrl;
  }

  async fetchRSSFeed() {
    const response = await axios.get(this.feedUrl, { responseType: 'text' });
    return response.data;
  }
}

export default RSSRepository;