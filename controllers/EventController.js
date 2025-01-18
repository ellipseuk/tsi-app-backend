class EventController {
  constructor(eventService) {
    this.eventService = eventService;
  }

  async getEvents(req, res) {
    try {
      const events = await this.eventService.getEvents();
      res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching events:', error.message);
      res.status(500).json({ error: `Failed to fetch events: ${error.message}` });
    }
  }
}

export default EventController;