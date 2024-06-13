import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime1(date) {
  if (!date) return '';

  const d = new Date(date);

  // Define arrays for day and month names
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get day, month, date, and year
  const dayName = days[d.getUTCDay()]; // Day of the week
  const monthName = months[d.getUTCMonth()]; // Month name
  const day = String(d.getUTCDate()).padStart(2, '0'); // Day of the month
  const year = d.getUTCFullYear(); // Year

  return `${dayName}, ${monthName} ${day}, ${year}`;
}


export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
