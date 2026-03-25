import type { RequestLine } from "../types";

const METHOD_PATTERN = /^[A-Z!#$%&'*+.^_`|~-]+$/;

export function parseRequestLine(line: string): RequestLine {
  const normalized = line.trim();
  const parts = normalized.split(/\s+/);

  if (parts.length !== 3) {
    throw new Error("Invalid request line format.");
  }

  const [method, requestTarget, httpVersion] = parts as [string, string, string];

  if (!METHOD_PATTERN.test(method)) {
    throw new Error("Invalid HTTP method.");
  }

  if (!requestTarget.startsWith("/")) {
    throw new Error("Request target must start with '/'.");
  }

  if (httpVersion !== "HTTP/1.1") {
    throw new Error("Unsupported HTTP version.");
  }

  return {
    method,
    requestTarget,
    httpVersion: "HTTP/1.1",
  };
}
