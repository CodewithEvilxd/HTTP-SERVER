import { MAX_HEADER_BYTES } from "../constants";
import type { ParseHttpRequestResult } from "../types";
import { parseHeader } from "./parseHeader";
import { parseRequestLine } from "./parseRequestLine";
import { decodeBytes, findSequence } from "./utils/byteUtils";

const HEADER_TERMINATOR = [13, 10, 13, 10] as const;
const HEADER_TERMINATOR_LENGTH = HEADER_TERMINATOR.length;

export function parseHttpRequest(buffer: Uint8Array): ParseHttpRequestResult {
  if (buffer.length === 0) {
    return { kind: "incomplete" };
  }

  const headerEndIndex = findSequence(buffer, HEADER_TERMINATOR);
  if (headerEndIndex === -1) {
    if (buffer.length > MAX_HEADER_BYTES) {
      throw new Error("Request headers exceeded the configured size limit.");
    }

    return { kind: "incomplete" };
  }

  const headerText = decodeBytes(buffer.slice(0, headerEndIndex));
  const [requestLineText, ...headerLines] = headerText.split("\r\n");

  if (!requestLineText) {
    throw new Error("HTTP request line is missing.");
  }

  const requestLine = parseRequestLine(requestLineText);
  const headers: Record<string, string> = {};

  for (const headerLine of headerLines) {
    if (headerLine.length === 0) {
      continue;
    }

    const { key, value } = parseHeader(headerLine);
    headers[key] = headers[key] ? `${headers[key]}, ${value}` : value;
  }

  const rawContentLength = headers["content-length"];
  let contentLength = 0;

  if (rawContentLength !== undefined) {
    if (!/^\d+$/.test(rawContentLength)) {
      throw new Error("Content-Length must be a non-negative integer.");
    }

    contentLength = Number(rawContentLength);
  }

  const consumedBytes = headerEndIndex + HEADER_TERMINATOR_LENGTH + contentLength;
  if (buffer.length < consumedBytes) {
    return { kind: "incomplete" };
  }

  const bodyBytes = buffer.slice(headerEndIndex + HEADER_TERMINATOR_LENGTH, consumedBytes);
  return {
    kind: "complete",
    request: {
      requestLine,
      headers,
      body: decodeBytes(bodyBytes),
      bodyBytes,
      rawBytes: buffer.slice(0, consumedBytes),
      consumedBytes,
    },
    remaining: buffer.slice(consumedBytes),
  };
}
