const HEADER_NAME_PATTERN = /^[A-Za-z0-9!#$%&'*+\-.^_`|~]+$/;

export function parseHeader(line: string): { key: string; value: string } {
  if (line.includes("\r") || line.includes("\n")) {
    throw new Error("Header lines must not contain embedded CRLF characters.");
  }

  const colonIndex = line.indexOf(":");
  if (colonIndex <= 0) {
    throw new Error("Header line must contain a field name followed by ':'.");
  }

  const rawKey = line.slice(0, colonIndex);
  if (rawKey.endsWith(" ")) {
    throw new Error("Header field name cannot contain trailing whitespace.");
  }

  const key = rawKey.trim().toLowerCase();
  if (!HEADER_NAME_PATTERN.test(key)) {
    throw new Error("Header field name contains invalid characters.");
  }

  const value = line.slice(colonIndex + 1).trim();
  return { key, value };
}
