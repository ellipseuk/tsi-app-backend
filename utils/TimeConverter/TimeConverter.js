class UnixTimeConverter {
  dateToUnix(date) {
    return parseInt((new Date(date).getTime() / 1000).toFixed(0));
  }

  unixToDatetime(unixTime) {
    var datetime = new Date(unixTime * 1000);
    return datetime.toISOString();
  }
}

export default UnixTimeConverter;
