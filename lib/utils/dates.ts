export function getJakartaDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getJakartaDateDaysAgo(daysAgo: number, from = new Date()): string {
  const adjusted = new Date(from.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return getJakartaDateString(adjusted);
}

export function isDateWithinRange(
  date: string,
  startDate: string,
  endDate: string,
): boolean {
  return date >= startDate && date <= endDate;
}

export function formatReportPeriodLabel(startDate: string, endDate: string): string {
  const start = parseJakartaDate(startDate);
  const end = parseJakartaDate(endDate);

  const dayFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
  });
  const monthFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    month: "short",
  });
  const yearFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
  });

  const startDay = dayFormatter.format(start);
  const endDay = dayFormatter.format(end);
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);
  const startYear = yearFormatter.format(start);
  const endYear = yearFormatter.format(end);

  if (startYear === endYear && startMonth === endMonth) {
    return `${startDay}–${endDay} ${startMonth} ${startYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
  }

  return `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
}

function parseJakartaDate(dateString: string): Date {
  return new Date(`${dateString}T12:00:00+07:00`);
}

export function toIsoString(date = new Date()): string {
  return date.toISOString();
}
