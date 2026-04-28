import {calculateReadTime} from 'utils/readTime';

describe('calculateReadTime', () => {
  it('returns minimum read time for empty text', () => {
    expect(calculateReadTime('')).toBe(1);
  });

  it('scales read time based on word count', () => {
    const text = new Array(500).fill('word').join(' ');
    expect(calculateReadTime(text)).toBe(3);
  });
});
