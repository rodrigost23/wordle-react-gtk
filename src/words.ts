import solutions from "./data/words/solutions-en.json";

import available from "./data/words/available-en.json";

const oneDay = 24 * 60 * 60 * 1000;

const baseDate = new Date(2024, 0, 1);

const words = solutions;

export const availableWords = available;

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
  return words[wordIndex]!;
}

export type LetterStatus = "absent" | "partial" | "perfect";
type LetterCounts = { [letter: string]: number };

/**
 * Count number of occurrences of each letter in a word
 */
function countLetters(word: string): LetterCounts {
  const counts: LetterCounts = {};

  for (const letter of word) {
    counts[letter] = (counts[letter] ?? 0) + 1;
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
    if (statuses[i] === "absent" && (letterCounts[letter] ?? 0) > 0) {
      statuses[i] = "partial";
      letterCounts[letter]--;
    }
  });

  return statuses;
}

export function checkLetters(
  guessedWords: string[],
  solution: string
): Record<string, LetterStatus> {
  const letterStatus: Record<string, LetterStatus> = {};
  for (const guessedWord of guessedWords) {
    const checked = checkGuess(guessedWord, solution);
    const row = [];
    for (let j = 0; j < 5; j++) {
      const letter = guessedWord[j] ?? "";
      const status = checked[j];
      if (!status) continue;

      letterStatus[letter] = getBetterStatus(letterStatus[letter], status);
    }
  }
  return letterStatus;
}
export function getBetterStatus(
  oldStatus: LetterStatus | undefined,
  newStatus: LetterStatus
): LetterStatus {
  if (!oldStatus || oldStatus === "absent" || newStatus === "perfect") {
    return newStatus;
  }
  return oldStatus;
}
