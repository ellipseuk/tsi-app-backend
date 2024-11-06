import axios from 'axios'
import * as cheerio from 'cheerio'
import xml2js from 'xml2js'

export const getEvents = async (req, res) => {
	try {
		const response = await axios.get('https://tsi.lv/feed/', {
			responseType: 'text',
		})
		const xml = response.data

		const parser = new xml2js.Parser({ explicitArray: false })
		parser.parseString(xml, (err, result) => {
			if (err) {
				console.error('Error parsing XML:', err)
				return res.status(500).json({ error: 'Failed to parse XML' })
			}

			const items = result.rss.channel.item
			const events = items
				.filter(item => {
					const guid = item.guid ? item.guid.toString() : ''
					return guid.includes('post_type=events') || item.event_date
				})
				.map(item => {
					const content = item['content:encoded'] || item.description || ''
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
						eventDate: item.event_date || null,
						eventEndDate: item.event_end_date || null,
					}
				})

			res.status(200).json({ events })
		})
	} catch (error) {
		console.error('Error fetching events:', error.message)
		res.status(500).json({ error: `Failed to fetch events: ${error.message}` })
	}
}