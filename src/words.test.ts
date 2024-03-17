import { countDaysToday, getTodayWord } from "./words";

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
      jest.useFakeTimers().setSystemTime(new Date(2024, 2, 2));
      const today = getTodayWord();
      expect(today).toBe("laser");
    });
  });
});
