const oneDay = 24 * 60 * 60 * 1000;

const baseDate = new Date(2024, 0, 1);

// TODO: Get list of five-letter words
const words = ["laser"];

function countDays(start: Date, end: Date) {
  const startDate = new Date(baseDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  return Math.floor((endDate.getTime() - startDate.getTime()) / oneDay);
}

export function countDaysToday(): number {
  return countDays(baseDate, new Date());
}

export function getTodayWord(): string {
  const today = baseDate.getDate();
  const wordIndex = today % words.length;
  return words[wordIndex];
}
