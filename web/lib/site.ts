export const siteConfig = {
  name: "Nishant Raw HTTP Server",
  shortName: "NRHS",
  description:
    "Minimal documentation-style website for a low-level HTTP/1.1 server built on raw TCP sockets with Bun.",
  url: "https://nishant-http-server.vercel.app",
  owner: {
    name: "Nishant Gaurav",
    github: "https://github.com/codewithevilxd",
    email: "codewithevilxd@gmail.com",
    portfolio: "https://nishantdev.space",
  },
  repo: "https://github.com/codewithevilxd",
};

export const navLinks = [
  { href: "/", label: "home" },
  { href: "/documentation", label: "docs" },
  { href: "/configuration", label: "config" },
  { href: "/security", label: "security" },
];

export const installCommand = "bun install && bun run start";

export const terminalLines = [
  "$ bun run start",
  "[Nishant Raw HTTP Server] listening on http://127.0.0.1:8080",
  "$ curl http://127.0.0.1:8080/health",
  "{",
  '  "status": "ok",',
  '  "service": "Nishant Raw HTTP Server",',
  '  "owner": "https://github.com/codewithevilxd"',
  "}",
];

export const features = [
  {
    title: "Raw TCP Control",
    body: "Built directly on Bun.listen() so request parsing stays explicit instead of hiding behind a framework layer.",
  },
  {
    title: "Incremental Parsing",
    body: "Buffers incoming bytes, detects header termination, validates Content-Length, and only completes when the message is whole.",
  },
  {
    title: "Strict Validation",
    body: "Request line and header parsing reject malformed HTTP early, which keeps server behavior predictable and easier to reason about.",
  },
  {
    title: "Focused Surface Area",
    body: "A small route set, zero client-side data collection, and no unnecessary third-party scripts keep the site and project easy to trust.",
  },
];

export const routeDocs = [
  {
    method: "GET",
    path: "/",
    description: "Returns project metadata, owner details, and supported routes.",
    example: "curl http://127.0.0.1:8080/",
  },
  {
    method: "GET",
    path: "/health",
    description: "Simple health probe for uptime and smoke tests.",
    example: "curl http://127.0.0.1:8080/health",
  },
  {
    method: "GET",
    path: "/about",
    description: "Owner profile and contact links.",
    example: "curl http://127.0.0.1:8080/about",
  },
  {
    method: "POST",
    path: "/echo",
    description: "Echoes request bodies back to the caller for quick transport checks.",
    example: 'curl -X POST http://127.0.0.1:8080/echo -H "Content-Type: text/plain" -d "hello from nishant"',
  },
];

export const architecture = [
  {
    step: "01",
    title: "Socket Accept",
    body: "Each TCP client gets an isolated in-memory buffer.",
  },
  {
    step: "02",
    title: "Parse Safely",
    body: "The parser waits for CRLF CRLF, validates the request line, then merges normalized headers.",
  },
  {
    step: "03",
    title: "Route Predictably",
    body: "A tiny handler layer maps method plus pathname to JSON or text responses.",
  },
  {
    step: "04",
    title: "Close Cleanly",
    body: "Responses include Connection: close and the socket ends after a full frame is written.",
  },
];

export const usageBlock = `# Install dependencies
bun install

# Start the TCP server
bun run start

# Run tests
bun run test

# Typecheck the project
bun run typecheck`;

export const commandBlock = `start:tcp      Launch the raw TCP HTTP server
start:udp      Run the UDP listener helper
inspect:asset  Print the bundled text asset
test           Execute Bun unit tests
typecheck      Verify TypeScript types`;

export const scriptDocs = [
  { name: "dev", desc: "Start the Next.js website locally with fast refresh." },
  { name: "build", desc: "Create a production build for deployment." },
  { name: "start", desc: "Serve the production build." },
];

export const runtimeConfig = [
  { key: "HOST", desc: "TCP and UDP bind host. Defaults to 127.0.0.1." },
  { key: "PORT", desc: "TCP HTTP port. Defaults to 8080." },
  { key: "UDP_PORT", desc: "UDP listener port. Defaults to 9090." },
  { key: "MAX_HEADER_BYTES", desc: "Maximum allowed HTTP header bytes before the parser rejects the request." },
];

export const configExample = `{
  "server": {
    "host": "127.0.0.1",
    "port": 8080,
    "udpPort": 9090,
    "maxHeaderBytes": 16384
  },
  "owner": {
    "name": "Nishant Gaurav",
    "github": "https://github.com/codewithevilxd",
    "portfolio": "https://nishantdev.space"
  }
}`;

export const verificationChecks = [
  {
    name: "bun test",
    desc: "Validates request line parsing, header normalization, request completion, routing, and response serialization.",
  },
  {
    name: "bun x tsc --noEmit",
    desc: "Ensures the TCP server, parser, website, and helpers compile under strict TypeScript settings.",
  },
  {
    name: "HTTP smoke test",
    desc: "Checks GET /, GET /health, GET /about, and POST /echo against the running Bun server.",
  },
  {
    name: "UDP smoke test",
    desc: "Sends a datagram to the Bun UDP listener and expects an ack response.",
  },
];

export const securityNotes = [
  "Static Next.js presentation with no form handling, auth state, or user-generated HTML.",
  "Security headers are configured in next.config.ts, including CSP, X-Frame-Options, and nosniff.",
  "No external analytics, ad scripts, trackers, or remote media are required for the page to render.",
  "All content is project-owned copy that mirrors the current server implementation instead of placeholder marketing text.",
];
