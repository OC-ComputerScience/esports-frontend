function formatTimeToISO(timeString) {
  const timeRegex = /^(1[0-2]|0?[1-9]):(00|15|30|45)\s?(AM|PM|am|pm)$/;

  // Check if the time string matches the expected format
  if (!timeRegex.test(timeString)) {
    throw new Error(
      "Invalid time format. Time must be in 12-hour format with 15-minute increments.",
    );
  }

  // Convert the time string to 24-hour format
  let [hour, minute, period] = timeString.split(/:| /);
  hour = parseInt(hour);
  minute = parseInt(minute);
  if (period.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (period.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  // Format the time in ISO 8601 format
  const isoTime = `T${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:00.000Z`;
  return isoTime;
}

const testTimeFormat = (timeString) => {
  const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s(AM|PM|am|pm)$/;

  const is12HourFormat = timeRegex.test(timeString);

  if (is12HourFormat) {
    return true;
  } else {
    return "Time must be 12hr format (ie. 11:30am)";
  }
};

const testTimeIncrement = (timeString) => {
  const incrementRegex = /^(1[0-2]|0?[1-9]):(00|15|30|45)\s(AM|PM|am|pm)$/;

  const is15MinuteIncrement = incrementRegex.test(timeString);

  if (is15MinuteIncrement) {
    return true;
  } else {
    return "Time must be in 15 minute increment";
  }
};

const verifyInterval = (intervalValue) => {
  const intervalFormat = /^[1-6]$/;

  const valid = intervalFormat.test(intervalValue);

  if (valid) {
    return true;
  } else {
    return "Interval must be between 1-6 (inclusive)";
  }
};

export default {
  formatTimeToISO,
  testTimeFormat,
  testTimeIncrement,
  verifyInterval,
};
