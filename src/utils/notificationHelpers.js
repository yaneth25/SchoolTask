/** Convierte dd/mm/aa o dd/mm/aaaa a Date (medianoche local). */
export function parseDueDate(dueDateStr) {
  if (!dueDateStr || typeof dueDateStr !== 'string') return null;
  const parts = dueDateStr.trim().split('/');
  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);
  if (year < 100) {
    year += year >= 70 ? 1900 : 2000;
  }
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;

  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function diffDays(from, to) {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/** Hoy → "HOY", ayer → "AYER", anteriores → dd/mm/aa */
export function formatNotificationSection(date, now = new Date()) {
  const days = diffDays(date, now);
  if (days === 0) return 'HOY';
  if (days === 1) return 'AYER';

  const d = startOfDay(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

export function formatDateKey(date) {
  const d = startOfDay(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
