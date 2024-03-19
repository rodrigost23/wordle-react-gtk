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

type LetterCorrectness = "wrong" | "partial" | "perfect";
/**
 * Checks if the letters in the guessed word match the correct word.
 *
 * Rules:
 * - Only one instance of a repeated letter in the guess can match the correct word.
 * - Matches are "partial" if the letter is in the correct word but wrong position.
 * - Matches are "perfect" if the letter is in the correct word and correct position.
 *
 * @param guessedWord - The guessed word
 * @param correctWord - The correct word
 * @returns {LetterCorrectness[]}
 */
export function checkGuess(
  guessedWord: string,
  correctWord: string
): LetterCorrectness[] {
  const lettersCount: { [letter: string]: number } = {};

  for (const letter of correctWord) {
    lettersCount[letter] = (lettersCount[letter] || 0) + 1;
  }

  const result: LetterCorrectness[] = [];

  for (let i = 0; i < guessedWord.length; i++) {
    if (guessedWord[i] === correctWord[i]) {
      result[i] = "perfect";
      lettersCount[guessedWord[i]]--;
    }
  }

  for (let i = 0; i < guessedWord.length; i++) {
    if (result[i] === "perfect") {
      continue;
    }

    if (lettersCount[guessedWord[i]] > 0) {
      result[i] = "partial";
      lettersCount[guessedWord[i]]--;
    } else {
      result[i] = "wrong";
    }
  }

  return result;
}
