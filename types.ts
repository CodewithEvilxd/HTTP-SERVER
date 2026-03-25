export interface OwnerProfile {
  name: string;
  github: string;
  email: string;
  portfolio: string;
}

export interface RequestLine {
  method: string;
  requestTarget: string;
  httpVersion: "HTTP/1.1";
}

export interface ParsedHttpRequest {
  requestLine: RequestLine;
  headers: Record<string, string>;
  body: string;
  bodyBytes: Uint8Array;
  rawBytes: Uint8Array;
  consumedBytes: number;
}

export type ParseHttpRequestResult =
  | { kind: "incomplete" }
  | {
      kind: "complete";
      request: ParsedHttpRequest;
      remaining: Uint8Array;
    };

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface SocketState {
  buffer: Uint8Array;
}
