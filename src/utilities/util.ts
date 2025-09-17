

export function extractUrlsFromString(text: string): string[] {
  // This regex matches strings starting with http or https, followed by ://,
  // and then any non-whitespace characters until a space or end of string.
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);

  // If matches are found, return them as an array of strings.
  // Otherwise, return an empty array.
  return matches ? matches : [];
}
