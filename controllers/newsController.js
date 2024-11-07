import RSSParser from 'rss-parser'
import * as cheerio from 'cheerio'

const parser = new RSSParser()

export const getNews = async (req, res) => {
	try {
		const feed = await parser.parseURL('https://tsi.lv/feed/')
		const news = feed.items
			.filter(
				item => !item.guid.includes('post_type=events') && !item.event_date
			)
			.map(item => {
				const content =
					item['content:encoded'] || item.content || item.description || ''
				const $ = cheerio.load(content)
				let imageUrl = $('img').first().attr('src') || null
        
				if (!imageUrl) {
					imageUrl = item.enclosure?.url || item['media:content']?.url || null
				}

				return {
					title: item.title,
					link: item.link,
					date: item.pubDate,
					description: item.contentSnippet || $(content).text() || '',
					image: imageUrl,
				}
			})

		res.status(200).json({ news })
	} catch (error) {
		console.error('Error fetching news:', error.message)
		res.status(500).json({ error: `Failed to fetch news: ${error.message}` })
	}
}