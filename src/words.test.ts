import {
  LetterStatus,
  checkGuess,
  countDaysToday,
  getBetterStatus,
  getTodayWord,
} from "./words";

describe("Words", () => {
  describe("countDaysToday", () => {
    it("should return zero on base date", () => {
      jest.useFakeTimers().setSystemTime(new Date(2024, 0, 1));
      const days = countDaysToday();

      expect(days).toBe(0);
    });

    it("should return the correct word index for a given date", () => {
      jest.useFakeTimers().setSystemTime(new Date(2024, 2, 2));
      const days = countDaysToday();

      expect(days).toBe(61);
    });
  });

  describe("getTodayWord", () => {
    it("should return the correct word for a given date", () => {
      jest.useFakeTimers().setSystemTime(new Date(2024, 2, 1));
      const today = getTodayWord();
      expect(today).toBe("jolly");
    });
  });
});

describe("checkGuess", () => {
  it("should handle empty strings", () => {
    const result = checkGuess("", "");
    expect(result).toEqual([]);
  });

  it("should handle all letters absent", () => {
    const result = checkGuess("abcde", "fghij");
    expect(result).toEqual(["absent", "absent", "absent", "absent", "absent"]);
  });

  it("should handle some letters perfect", () => {
    const result = checkGuess("laser", "lakes");
    expect(result).toEqual([
      "perfect",
      "perfect",
      "partial",
      "perfect",
      "absent",
    ]);
  });

  it("should handle some letters partial", () => {
    const result = checkGuess("soare", "roses");
    expect(result).toEqual([
      "partial",
      "perfect",
      "absent",
      "partial",
      "partial",
    ]);
  });

  it("should handle duplicate letters", () => {
    const result = checkGuess("hello", "below");
    expect(result).toEqual([
      "absent",
      "perfect",
      "perfect",
      "absent",
      "partial",
    ]);
  });

  it("should handle all letters perfect", () => {
    const result = checkGuess("laser", "laser");
    expect(result).toEqual([
      "perfect",
      "perfect",
      "perfect",
      "perfect",
      "perfect",
    ]);
  });
});

describe("getBetterStatus", () => {
  it('should return "perfect" regardless of old status', () => {
    const statuses: (LetterStatus | undefined)[] = [
      undefined,
      "absent",
      "partial",
      "perfect",
    ];
    for (const oldStatus of statuses) {
      expect(getBetterStatus(oldStatus, "perfect")).toBe("perfect");
    }
  });

  it('should return "partial" only if old status is not "perfect"', () => {
    expect(getBetterStatus("perfect", "partial")).toBe("perfect");

    const statuses: (LetterStatus | undefined)[] = [
      undefined,
      "absent",
      "partial",
    ];
    for (const oldStatus of statuses) {
      expect(getBetterStatus(oldStatus, "partial")).toBe("partial");
    }
  });

  it('should return "absent" only if old status is not "absent" or undefined', () => {
    expect(getBetterStatus("perfect", "partial")).toBe("perfect");

    const statuses1: LetterStatus[] = ["partial", "perfect"];
    for (const oldStatus of statuses1) {
      expect(getBetterStatus(oldStatus, "absent")).toBe(oldStatus);
    }

    const statuses2: (LetterStatus | undefined)[] = [undefined, "absent"];
    for (const oldStatus of statuses2) {
      expect(getBetterStatus(oldStatus, "absent")).toBe("absent");
    }
  });
});
