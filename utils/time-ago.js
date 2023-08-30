function timeAgo(date) {
  const currentDate = new Date();
  const timestamp =
    date instanceof Date ? date.getTime() : new Date(date).getTime();
  const elapsedMilliseconds = currentDate - timestamp;

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (elapsedMilliseconds < minute) {
    return "Just now";
  } else if (elapsedMilliseconds < hour) {
    const minutesAgo = Math.floor(elapsedMilliseconds / minute);
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  } else if (elapsedMilliseconds < day) {
    const hoursAgo = Math.floor(elapsedMilliseconds / hour);
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else if (elapsedMilliseconds < month) {
    const daysAgo = Math.floor(elapsedMilliseconds / day);
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  } else if (elapsedMilliseconds < year) {
    const monthsAgo = Math.floor(elapsedMilliseconds / month);
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  } else {
    const yearsAgo = Math.floor(elapsedMilliseconds / year);
    return `${yearsAgo} ${yearsAgo === 1 ? "year" : "years"} ago`;
  }
}

module.exports = timeAgo;
