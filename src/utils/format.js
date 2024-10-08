// 123456 => 00:00:00 或 00:00
import moment from "moment";

export function formatMinutesToTime(minutes) {
  const hour = Math.floor(minutes / 3600);
  const second = Math.floor((minutes - hour * 3600) / 60);
  const minute = minutes - hour * 3600 - second * 60;
  let timeStr = '';
  if (hour > 0) {
    timeStr = `${String(hour).padStart(2, '0')}:${String(second).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  } else {
    timeStr = `${String(second).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  // console.log('formatMinutesDiff', minutes, timeStr);
  return timeStr;
}

// 123456 => 17'36
export function formatMinutesToSeconds(minutes) {
  const second = Math.floor(minutes / 60);
  const minute = minutes - second * 60;
  let timeStr = second.toString() + "'" + minute.toString();
  // console.log('formatMinutesToSeconds', minutes, timeStr);
  return timeStr;
}

export function formatTimeToHHMM(time) {
  if (!time) {
    return '00:00';
  }
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function formatTimeRange(startTime, endTime) {
  const formatStart = 'YYYY年MM月DD日 HH:mm';
  const startMoment = moment(startTime);
  const endMoment = moment(endTime);

  let formatEnd = 'HH:mm';
  if (startMoment.year() !== endMoment.year()) {
    formatEnd = 'YYYY年MM月DD日 HH:mm';
  } else if (startMoment.month() !== endMoment.month()) {
    formatEnd = 'MM月DD日 HH:mm';
  } else if (startMoment.date() !== endMoment.date()) {
    formatEnd = 'DD日 HH:mm';
  }

  return `${startMoment.format(formatStart)} - ${endMoment.format(formatEnd)}`;
}
