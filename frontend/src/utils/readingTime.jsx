export const calculateReadingStats = (text = "") => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / 200);

  return { wordCount, readingTime };
};
