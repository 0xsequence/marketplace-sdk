import { describe, expect, test } from 'vitest';
import { dateToUnixTime } from '../date';

describe('date utils', () => {
  describe('dateToUnixTime', () => {
    test('should convert date to unix timestamp string', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      const result = dateToUnixTime(date);
      expect(result).toBe('1704067200');
    });

    test('should handle current date', () => {
      const now = new Date();
      const result = dateToUnixTime(now);
      const expectedTimestamp = Math.floor(now.getTime() / 1000).toString();
      expect(result).toBe(expectedTimestamp);
    });

    test('should handle dates with milliseconds', () => {
      const date = new Date('2024-01-01T00:00:00.999Z');
      const result = dateToUnixTime(date);
      expect(result).toBe('1704067200');
    });

    test('should handle dates before unix epoch', () => {
      const date = new Date('1969-12-31T23:59:59Z');
      const result = dateToUnixTime(date);
      expect(result).toBe('-1');
    });
  });
});