import moment from 'moment';

export function formatTime(date: string) {
  return moment.utc(date).local().format('hh:mm A');
  // return moment.utc(date).local().format('lll');
}

export const formatDate = (date: string) => {
  return moment.utc(date).local().format('MMM DD, YYYY');
};

export function formatDateAndTime(date: string) {
  return moment.utc(date).local().format('MMM Do YYYY, hh:mm A');
}
