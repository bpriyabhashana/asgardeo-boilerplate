import { APP_CONFIG } from "../Config";
const PERIODS_MAP = intializePeriods();

function intializePeriods() {
  let periodMap = {};
  //   APP_CONFIG.PERIODS.forEach((period) => {
  //     if (period.value) {
  //       periodMap[period.value] = period;
  //     }
  //   });
  return periodMap;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export function getDateForDB(date) {
  if (isValidDate(date)) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1; //Starts from 0
    var day = date.getDate();
    return (
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day)
    );
  }
  return date;
}

export function getDataWithNoTimezone(date) {
  var dbDate = getDateForDB(date);
  var dateWithNoTimezone = new Date(dbDate + "T00:00:00");
  return isValidDate(dateWithNoTimezone) ? dateWithNoTimezone : null;
}

export function getDisplayPeriod(period) {
  let displayPeriod = "Custom";
  if (PERIODS_MAP[period]) {
    displayPeriod = PERIODS_MAP[period].title;
  }
  return displayPeriod;
}

export function getGmailMailTo(email, subject) {
  var urlToReturn =
    "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=" + email;
  if (subject) {
    urlToReturn += "&su=" + subject;
  }
  return urlToReturn;
}
