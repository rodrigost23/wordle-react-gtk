import solutions from "../data/words/solutions-en.json";

const oneDay = 24 * 60 * 60 * 1000;

const baseDate = new Date(2024, 0, 1);

const words = solutions;
/**
 * Calculate the number of days between two dates
 */
function getDaysBetweenDates(start: Date, end: Date) {
  const startDate = start;
  startDate.setHours(0, 0, 0, 0);

  const endDate = end;
  endDate.setHours(0, 0, 0, 0);

  return Math.floor((endDate.getTime() - startDate.getTime()) / oneDay);
}

/**
 * Get the number of days since the base date
 */
export function countDaysToday(): number {
  return getDaysBetweenDates(baseDate, new Date());
}

/**
 * Get the word for the current day
 */
export function getTodayWord(): string {
  const wordIndex = countDaysToday() % words.length;
  return words[wordIndex];
}

type LetterStatus = "absent" | "partial" | "perfect";
type LetterCounts = { [letter: string]: number };

/**
 * Count number of occurrences of each letter in a word
 */
function countLetters(word: string): LetterCounts {
  const counts: LetterCounts = {};

  for (const letter of word) {
    counts[letter] = (counts[letter] || 0) + 1;
  }

  return counts;
}

/**
 * Checks if the letters in the guessed word match the correct word.
 *
 * Rules:
 * - Only one instance of a repeated letter in the guess can match the correct word.
 * - Matches are "partial" if the letter is in the correct word but wrong position.
 * - Matches are "perfect" if the letter is in the correct word and correct position.
 *
 * @param guessedWord - The guessed word
 * @param solution - The correct word
 * @returns {LetterStatus[]} An array of letter statuses ('perfect', 'partial', 'absent')
 */
export function checkGuess(
  guessedWord: string,
  solution: string
): LetterStatus[] {
  const letterCounts = countLetters(solution);

  const statuses = new Array<LetterStatus>(guessedWord.length).fill("absent");

  guessedWord.split("").forEach((letter, i) => {
    if (letter === solution[i]) {
      statuses[i] = "perfect";
      letterCounts[letter]--;
    }
  });

  guessedWord.split("").forEach((letter, i) => {
    if (statuses[i] === "absent" && letterCounts[letter] > 0) {
      statuses[i] = "partial";
      letterCounts[letter]--;
    }
  });

  return statuses;
}
