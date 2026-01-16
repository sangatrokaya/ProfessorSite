export const calculateReadingStats = (html = "") => {
  const text = html.replace(/<[^>]+>/g, ""); // strip HTML
  const words = text.trim().split(/\s+/).filter(Boolean);

  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return { wordCount, readingTime };
};
