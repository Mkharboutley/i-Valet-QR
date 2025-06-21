
import { formatDate, formatTime, getRelativeTime } from '../../utils/time';

export const formatDateString = (date: Date) => {
  return formatDate(date);
};

export const formatTimeString = (date: Date) => {
  return formatTime(date);
};

export const getRelativeTimeString = (date: Date) => {
  return getRelativeTime(date);
};
