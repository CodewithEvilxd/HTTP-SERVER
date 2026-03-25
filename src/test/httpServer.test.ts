import { expect, test } from "bun:test";
import { SERVER_ID } from "../../constants";
import { serializeHttpResponse } from "../httpResponse";
import { parseHeader } from "../parseHeader";
import { parseRequestLine } from "../parseRequestLine";
import { parseHttpRequest } from "../parseStreamRequest";
import { handleRequest } from "../routes";
import { encodeText } from "../utils/byteUtils";

test("parseRequestLine parses a valid HTTP/1.1 request line", () => {
  const result = parseRequestLine("GET /health HTTP/1.1");

  expect(result.method).toBe("GET");
  expect(result.requestTarget).toBe("/health");
  expect(result.httpVersion).toBe("HTTP/1.1");
});

test("parseRequestLine rejects invalid input", () => {
  expect(() => parseRequestLine("GET /health HTTP/1.0")).toThrow("Unsupported HTTP version.");
  expect(() => parseRequestLine("health HTTP/1.1")).toThrow("Invalid request line format.");
});

test("parseHeader normalizes the key and trims the value", () => {
  const result = parseHeader("Content-Type: application/json");

  expect(result.key).toBe("content-type");
  expect(result.value).toBe("application/json");
});

test("parseHttpRequest waits for a full request before completing", () => {
  const partial = encodeText("POST /echo HTTP/1.1\r\nHost: localhost\r\nContent-Length: 11\r\n\r\nhello");
  const incomplete = parseHttpRequest(partial);

  expect(incomplete.kind).toBe("incomplete");

  const full = encodeText("POST /echo HTTP/1.1\r\nHost: localhost\r\nContent-Length: 11\r\n\r\nhello world");
  const complete = parseHttpRequest(full);

  expect(complete.kind).toBe("complete");
  if (complete.kind === "complete") {
    expect(complete.request.body).toBe("hello world");
    expect(complete.request.headers.host).toBe("localhost");
  }
});

test("handleRequest returns branded JSON for GET /health", () => {
  const request = parseHttpRequest(encodeText("GET /health HTTP/1.1\r\nHost: localhost\r\n\r\n"));

  expect(request.kind).toBe("complete");
  if (request.kind !== "complete") {
    return;
  }

  const response = handleRequest(request.request);
  expect(response.status).toBe(200);
  expect(response.body).toContain('"status": "ok"');
});

test("handleRequest echoes request bodies on POST /echo", () => {
  const request = parseHttpRequest(
    encodeText("POST /echo HTTP/1.1\r\nHost: localhost\r\nContent-Type: text/plain\r\nContent-Length: 13\r\n\r\nhello nishant"),
  );

  expect(request.kind).toBe("complete");
  if (request.kind !== "complete") {
    return;
  }

  const response = handleRequest(request.request);
  expect(response.status).toBe(200);
  expect(response.body).toBe("hello nishant");
});

test("serializeHttpResponse emits a valid HTTP response frame", () => {
  const response = serializeHttpResponse({
    status: 200,
    statusText: "OK",
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
    body: "pong",
  });

  expect(response).toContain("HTTP/1.1 200 OK");
  expect(response).toContain(`server: ${SERVER_ID}`);
  expect(response).toContain("content-length: 4");
});
