import type { SupportedLanguage } from "@/components/code-block";

export interface DocumentationSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface DocumentationSnippet {
  title: string;
  language: SupportedLanguage;
  code: string;
  note?: string;
}

export interface DocumentationPageContent {
  slug: "architecture" | "parser" | "routes" | "verification";
  label: string;
  title: string;
  summary: string;
  sections: DocumentationSection[];
  snippets: DocumentationSnippet[];
}

export interface DocumentationLandingContent {
  title: string;
  summary: string;
  sections: DocumentationSection[];
  snippets: DocumentationSnippet[];
}

export const documentationPages: DocumentationPageContent[] = [
  {
    slug: "architecture",
    label: "architecture",
    title: "Server architecture",
    summary:
      "The TCP server keeps state per connection, accumulates bytes conservatively, and only routes a request after a complete HTTP frame is present.",
    sections: [
      {
        id: "listener",
        title: "Listener and socket ownership",
        paragraphs: [
          "The server starts in src/tcpServer.ts with Bun.listen(). The important decision there is that each socket owns its own Uint8Array buffer. That prevents the usual beginner mistake where partial bytes from separate clients are treated as one stream.",
          "Socket state is intentionally small. The server only persists the unread bytes that still matter. There is no request queue, session state, or long-lived object graph. That keeps failure cases local and makes the transport layer easier to inspect.",
        ],
      },
      {
        id: "flow",
        title: "What happens when bytes arrive",
        paragraphs: [
          "The data handler does not try to decode the request immediately. It appends the new bytes to the existing socket buffer and asks parseHttpRequest() whether the buffer now contains a complete message.",
          "If the parser returns incomplete, the handler exits without side effects. If the parser returns complete, the handler preserves any unread trailing bytes, routes the parsed request, serializes the response, and closes the connection cleanly.",
        ],
      },
      {
        id: "failure",
        title: "Failure and timeout behavior",
        paragraphs: [
          "Malformed input is converted into an HTTP error response instead of crashing the server. Errors related to invalid headers, invalid request lines, or impossible Content-Length values are handled in one place, which keeps the transport code small.",
          "The timeout path matters because raw TCP clients can stall after sending only part of a request. The socket timeout returns 408 so incomplete traffic does not stay around forever.",
        ],
      },
    ],
    snippets: [
      {
        title: "socket lifecycle",
        language: "ts",
        code: `const server = Bun.listen<SocketState>({
  hostname: DEFAULT_HOST,
  port: DEFAULT_PORT,
  data: { buffer: new Uint8Array(0) },
  socket: {
    binaryType: "uint8array",
    open(socket) {
      socket.data.buffer = new Uint8Array(0);
      socket.timeout(30);
    },
    data(socket, data) {
      socket.data.buffer = concatBytes(socket.data.buffer, data);
      const parsed = parseHttpRequest(socket.data.buffer);
      if (parsed.kind === "incomplete") return;
      socket.data.buffer = parsed.remaining;
      socket.end(serializeHttpResponse(handleRequest(parsed.request)));
    }
  }
});`,
        note: "The socket only advances after a full request exists.",
      },
      {
        title: "timeout path",
        language: "ts",
        code: `timeout(socket) {
  socket.end(
    serializeHttpResponse(
      jsonResponse(408, {
        error: "Request timed out before a full HTTP message was received."
      })
    )
  );
}`,
        note: "A stalled client gets a real HTTP response instead of a silent disconnect.",
      },
    ],
  },
  {
    slug: "parser",
    label: "parser",
    title: "Parser behavior",
    summary:
      "The parser is strict on purpose: it waits for CRLF CRLF, validates the request line, normalizes headers, and refuses to guess when the body is incomplete.",
    sections: [
      {
        id: "boundary",
        title: "Header boundary detection",
        paragraphs: [
          "src/parseStreamRequest.ts treats the incoming buffer as raw bytes first. The parser searches for CRLF CRLF, which is the only signal that the header section is complete. Until that marker exists, the parser returns incomplete and leaves the buffer untouched.",
          "That behavior matters in real TCP traffic because a request can arrive in multiple packets. The parser is written to tolerate fragmentation instead of assuming line-oriented input.",
        ],
      },
      {
        id: "request-line",
        title: "Request line validation",
        paragraphs: [
          "Once the header boundary exists, the first line is passed into parseRequestLine(). The method must be an uppercase token, the request target must begin with a slash, and the version must be exactly HTTP/1.1.",
          "This is intentionally narrower than a fully general HTTP implementation. The goal is a dependable learning server, not a compatibility layer for every possible client variation.",
        ],
      },
      {
        id: "headers",
        title: "Header normalization and body completion",
        paragraphs: [
          "Header parsing lives in src/parseHeader.ts. Field names are lowercased, invalid characters are rejected, and whitespace in the wrong place fails immediately. That gives the rest of the application a stable header shape.",
          "Content-Length is the decisive body rule. If it exists, it must parse as a non-negative integer. The parser then checks whether the buffer contains enough body bytes. If not, it returns incomplete rather than producing a half-valid request object.",
        ],
      },
    ],
    snippets: [
      {
        title: "boundary logic",
        language: "ts",
        code: `const headerEndIndex = findSequence(buffer, [13, 10, 13, 10]);
if (headerEndIndex === -1) {
  if (buffer.length > MAX_HEADER_BYTES) {
    throw new Error("Request headers exceeded the configured size limit.");
  }
  return { kind: "incomplete" };
}`,
        note: "No boundary means no request object yet.",
      },
      {
        title: "request line checks",
        language: "ts",
        code: `if (parts.length !== 3) throw new Error("Invalid request line format.");
if (!METHOD_PATTERN.test(method)) throw new Error("Invalid HTTP method.");
if (!requestTarget.startsWith("/")) throw new Error("Request target must start with '/'.");
if (httpVersion !== "HTTP/1.1") throw new Error("Unsupported HTTP version.");`,
        note: "The parser is narrow and explicit, not permissive.",
      },
      {
        title: "header parsing",
        language: "ts",
        code: `const colonIndex = line.indexOf(":");
if (colonIndex <= 0) throw new Error("Header line must contain a field name followed by ':'.");
const key = rawKey.trim().toLowerCase();
if (!HEADER_NAME_PATTERN.test(key)) throw new Error("Header field name contains invalid characters.");`,
      },
    ],
  },
  {
    slug: "routes",
    label: "routes",
    title: "Application routes",
    summary:
      "The route layer stays deliberately small so the project can prove its transport and parsing behavior without hiding behind application complexity.",
    sections: [
      {
        id: "surface",
        title: "Why the route surface is small",
        paragraphs: [
          "Routing lives in src/routes.ts. The server exposes only four endpoints: GET /, GET /health, GET /about, and POST /echo. That is enough to test metadata responses, status probes, owner data, and request-body handling.",
          "A small route surface is useful here because it keeps the project honest. If one endpoint fails, the reason is usually obvious: transport, parser, or route logic.",
        ],
      },
      {
        id: "contracts",
        title: "Endpoint contracts",
        paragraphs: [
          "GET / returns project-level metadata and supported routes. GET /health is a lightweight health probe. GET /about returns owner information. POST /echo returns the submitted body using the incoming content type when one exists.",
          "Unsupported methods on /echo return 405 with an Allow header. Unknown paths return 404 with a small JSON payload describing the failure.",
        ],
      },
      {
        id: "responses",
        title: "Response framing",
        paragraphs: [
          "The route handler returns plain response objects, not framework response classes. serializeHttpResponse() converts that object into the final HTTP frame by computing content length, injecting the server header, and writing Connection: close.",
          "That keeps the application layer readable. Route logic chooses status, headers, and body. The serializer handles the wire format.",
        ],
      },
    ],
    snippets: [
      {
        title: "route handler excerpt",
        language: "ts",
        code: `if (method === "GET" && pathname === "/health") {
  return jsonResponse(200, {
    status: "ok",
    service: PROJECT_NAME,
    owner: OWNER_PROFILE.github,
  });
}

if (pathname === "/echo") {
  if (method !== "POST") {
    return jsonResponse(405, { error: "Use POST /echo to send a body." }, { allow: "POST" });
  }
  return textResponse(200, request.body, { "content-type": contentType });
}`,
      },
      {
        title: "raw request",
        language: "http",
        code: `POST /echo HTTP/1.1
Host: 127.0.0.1:8080
Content-Type: text/plain
Content-Length: 19

hello from nishant`,
      },
      {
        title: "serialized response shape",
        language: "http",
        code: `HTTP/1.1 200 OK
server: nishant-raw-http-server
connection: close
content-length: 19
content-type: text/plain; charset=utf-8

hello from nishant`,
      },
    ],
  },
  {
    slug: "verification",
    label: "verification",
    title: "Verification workflow",
    summary:
      "This project is small enough that verification should be routine. Tests, typecheck, and live smoke requests together give a clear signal about transport, parser, and route health.",
    sections: [
      {
        id: "unit-tests",
        title: "What the automated tests prove",
        paragraphs: [
          "The Bun test suite checks request line parsing, header normalization, incomplete-body behavior, route selection, and response serialization. That covers the most fragile parts of the server contract.",
          "If these tests fail, the problem is usually local and deterministic. That is exactly what you want for parser-heavy code.",
        ],
      },
      {
        id: "typecheck",
        title: "Why strict typecheck matters here",
        paragraphs: [
          "The server keeps state inside socket data and passes partially structured values between parser and route layers. Strict TypeScript catches drift early, especially when changing request shapes, response helpers, or per-socket state.",
          "Typecheck is not decoration in this project. It is part of the contract between transport code and application code.",
        ],
      },
      {
        id: "smoke-tests",
        title: "Runtime smoke tests",
        paragraphs: [
          "After tests and typecheck, the next proof is a running server. GET /health confirms the listener is live, GET /about confirms JSON routes behave correctly, and POST /echo confirms that body parsing still matches Content-Length.",
          "The UDP smoke test remains separate because it verifies the helper transport and its ack path, not the HTTP parser itself.",
        ],
      },
    ],
    snippets: [
      {
        title: "verification commands",
        language: "bash",
        code: `bun test
bun x tsc --noEmit
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/about
curl -X POST http://127.0.0.1:8080/echo -H "Content-Type: text/plain" -d "hello from verification"`,
        note: "This is the minimum path worth running after transport or parser changes.",
      },
      {
        title: "expected health response",
        language: "json",
        code: `{
  "status": "ok",
  "service": "Nishant Raw HTTP Server",
  "owner": "https://github.com/codewithevilxd"
}`,
      },
    ],
  },
];

export const documentationLanding: DocumentationLandingContent = {
  title: "Documentation",
  summary:
    "The docs section is split by responsibility so transport, parser, route behavior, and verification can be read independently without flattening everything into one long page.",
  sections: [
    {
      id: "start-here",
      title: "How to read this project",
      paragraphs: [
        "Start with architecture if you want the request lifecycle. Move to parser if you are changing request handling. Read routes if you are modifying endpoint behavior. Finish with verification before you trust the change.",
        "This split is deliberate. The project is compact, but transport code becomes confusing quickly when socket ownership, parser rules, and route semantics are mixed into one page.",
      ],
    },
    {
      id: "why-these-docs",
      title: "Why the docs are structured this way",
      paragraphs: [
        "Each page mirrors a real subsystem in the repository. That avoids the usual documentation problem where pages are organized around marketing headings instead of actual code boundaries.",
        "The intent is that someone opening the docs can jump directly from a concept to the source file that implements it, without decoding vague language first.",
      ],
    },
  ],
  snippets: [
    {
      title: "repo map",
      language: "text",
      code: `src/
  tcpServer.ts
  parseStreamRequest.ts
  parseRequestLine.ts
  parseHeader.ts
  routes.ts
  httpResponse.ts
  test/httpServer.test.ts`,
      note: "These are the files that define the current HTTP path.",
    },
    {
      title: "quick verify",
      language: "bash",
      code: `bun test
bun x tsc --noEmit
curl http://127.0.0.1:8080/health`,
    },
  ],
};

export const documentationCards = documentationPages.map((page) => ({
  slug: page.slug,
  label: page.label,
  title: page.title,
  summary: page.summary,
}));

export function getDocumentationPage(slug: string): DocumentationPageContent | undefined {
  return documentationPages.find((page) => page.slug === slug);
}
