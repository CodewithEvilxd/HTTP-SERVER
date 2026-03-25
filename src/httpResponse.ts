import { SERVER_ID } from "../constants";
import type { HttpResponse } from "../types";

const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  400: "Bad Request",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  431: "Request Header Fields Too Large",
  500: "Internal Server Error",
};

function createResponse(status: number, body: string, headers: Record<string, string>): HttpResponse {
  return {
    status,
    statusText: STATUS_TEXT[status] ?? "OK",
    headers,
    body,
  };
}

export function jsonResponse(status: number, payload: unknown, headers: Record<string, string> = {}): HttpResponse {
  return createResponse(status, JSON.stringify(payload, null, 2), {
    "content-type": "application/json; charset=utf-8",
    ...headers,
  });
}

export function textResponse(status: number, body: string, headers: Record<string, string> = {}): HttpResponse {
  return createResponse(status, body, {
    "content-type": "text/plain; charset=utf-8",
    ...headers,
  });
}

export function serializeHttpResponse(response: HttpResponse): string {
  const contentLength = new TextEncoder().encode(response.body).length;
  const headers = {
    server: SERVER_ID,
    connection: "close",
    "content-length": String(contentLength),
    ...response.headers,
  };

  const serializedHeaders = Object.entries(headers).map(([key, value]) => `${key}: ${value}`);
  return [`HTTP/1.1 ${response.status} ${response.statusText}`, ...serializedHeaders, "", response.body].join("\r\n");
}
