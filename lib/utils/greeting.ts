const GREETINGS = {
  morning: "Selamat pagi",
  afternoon: "Selamat siang",
  evening: "Selamat sore",
  night: "Selamat malam",
} as const;

export function getTimeGreeting(date = new Date()): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Jakarta",
    }).format(date),
  );

  if (hour >= 5 && hour < 11) return GREETINGS.morning;
  if (hour >= 11 && hour < 15) return GREETINGS.afternoon;
  if (hour >= 15 && hour < 19) return GREETINGS.evening;
  return GREETINGS.night;
}

export function formatTodayDate(date = new Date()): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}
