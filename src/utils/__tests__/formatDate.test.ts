import { describe, it, expect } from "vitest";
import { formatDate, formatRelativeDate } from "../formatDate";

describe('formatDate', () => {
    it('formats a date in YYYY/MM/DD format', () => {
        const date = new Date('2026-03-15T10:30:00')
        expect(formatDate(date)).toBe('2026/03/15')
    })

    it('accepts a custom format', () => {
        const date = new Date('2026-03-15T10:30:00')
        expect(formatDate(date, "YYYY-MM-DD")).toBe('2026-03-15')
    })

    it('throws an error for an invalid date', () => {
        expect(() => formatDate(new Date("invalid"))).toThrow("Invalid date");
    })
})

describe("formatDate - edge cases", () => {
    it("throws an error when null is passed", () => {
      expect(() => formatDate(null as unknown as Date)).toThrow();
    });
  
    it("throws an error when undefined is passed", () => {
      expect(() => formatDate(undefined as unknown as Date)).toThrow();
    });
  
    it("correctly formats the first day of the month", () => {
      const date = new Date("2026-01-01T00:00:00");
      expect(formatDate(date)).toBe("2026/01/01");
    });
  
    it("correctly formats the last day of the month", () => {
      const date = new Date("2026-12-31T23:59:59");
      expect(formatDate(date)).toBe("2026/12/31");
    });
  
    it("correctly formats Feb 29 on a leap year", () => {
      const date = new Date("2028-02-29T12:00:00");
      expect(formatDate(date)).toBe("2028/02/29");
    });
  });

describe('formatRelativeDate', () => {
    it("displays 1 minute ago", () => {
        const date = new Date(Date.now() - 60 * 1000);
        expect(formatRelativeDate(date)).toBe("1 minute ago");
    });

    it("displays 1 hour ago", () => {
        const date = new Date(Date.now() - 60 * 60 * 1000);
        expect(formatRelativeDate(date)).toBe("1 hour ago");
    });

    it("displays 1 day ago", () => {
        const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
        expect(formatRelativeDate(date)).toBe("1 day ago");
    });

    it("displays the date when more than 7 days ago", () => {
        const date = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
        expect(formatRelativeDate(date)).toMatch(/\d{4}\/\d{2}\/\d{2}/);
    });
})

describe("formatRelativeDate - edge cases", () => {
    it("displays the date as-is when a future date is passed", () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const result = formatRelativeDate(futureDate);
      expect(result).toMatch(/\d{4}\/\d{2}\/\d{2}/);
    });
  
    it("returns 'just now' when the current date is passed", () => {
      const now = new Date();
      expect(formatRelativeDate(now)).toBe("just now");
    });
  
    it("returns 'just now' for 59 seconds ago", () => {
      const date = new Date(Date.now() - 59 * 1000);
      expect(formatRelativeDate(date)).toBe("just now");
    });
  
    it("throws an error for an invalid date", () => {
      expect(() => formatRelativeDate(new Date("invalid"))).toThrow(
        "Invalid date"
      );
    });
});
