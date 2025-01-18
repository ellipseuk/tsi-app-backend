class Event {
  constructor({ title, link, date, description, image, eventDate, eventEndDate }) {
    this.title = title;
    this.link = link;
    this.date = date;
    this.description = description;
    this.image = image;
    this.eventDate = eventDate;
    this.eventEndDate = eventEndDate;
  }
}

export default Event;