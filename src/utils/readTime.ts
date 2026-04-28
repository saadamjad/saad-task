export const wordsPerMinute = 200;

export const calculateReadTime = (text: string): number => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};
