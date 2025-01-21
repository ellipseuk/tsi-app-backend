class TimeConverter {
  // Use ISO 8601 format: 2025-01-10T10:30:00.000Z
  ToUnix(date) {
    return parseInt((new Date(date).getTime() / 1000).toFixed(0));
  }

  ToDatetime(unixTime) {
    var datetime = new Date(unixTime * 1000);
    return datetime.toISOString();
  }
}

export default TimeConverter;
