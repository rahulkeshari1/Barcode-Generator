export const parseLines = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  return text
    .split(/\r?\n/)
    .map((line) => {
      // Remove special characters but keep spaces
      let cleaned = line.replace(/[^a-zA-Z0-9\s]/g, "").trim();
      // Remove extra spaces
      cleaned = cleaned.replace(/\s+/g, " ");
      return cleaned;
    })
    .filter((line) => {
      // Filter out empty lines and lines that are just numbers/symbols
      const trimmed = line.trim();
      if (!trimmed) return false;
      // Keep lines with at least 2 characters
      if (trimmed.length < 2) return false;
      // Filter out lines that are just numbers with no meaning
      if (/^\d+$/.test(trimmed) && trimmed.length < 3) return false;
      return true;
    });
};