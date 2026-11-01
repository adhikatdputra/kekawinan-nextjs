// Servers run in UTC, but "today" for Kekawinan users means a WIB (UTC+7) day.
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Start of the WIB calendar day `daysAgo` days before `now`, as a UTC Date */
export function startOfWibDay(now = new Date(), daysAgo = 0): Date {
  const wibMidnight = Math.floor((now.getTime() + WIB_OFFSET_MS) / DAY_MS) * DAY_MS;
  return new Date(wibMidnight - WIB_OFFSET_MS - daysAgo * DAY_MS);
}
