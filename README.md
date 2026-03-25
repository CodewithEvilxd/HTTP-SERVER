# Nishant Raw HTTP Server

Low-level HTTP/1.1 server built directly on top of `Bun.listen()` TCP sockets.
This repository is maintained by Nishant Gaurav under the `codewithevilxd`
identity.

## Owner

- GitHub: https://github.com/codewithevilxd
- Email: codewithevilxd@gmail.com
- Portfolio: https://nishantdev.space

## Features

- Incremental HTTP request parsing over raw TCP sockets
- Proper request line and header validation
- `Content-Length` body support
- Branded JSON routes for `/`, `/health`, `/about`
- `POST /echo` route for quick payload testing
- Bun test suite and TypeScript typecheck support

## Scripts

```bash
bun install
bun run start
bun run test
bun run typecheck
```

Additional helpers:

```bash
bun run start:udp
bun run inspect:asset
```

## Routes

- `GET /` returns project metadata and supported routes
- `GET /health` returns a simple health response
- `GET /about` returns owner details
- `POST /echo` echoes the request body back to the client

## Example

```bash
curl http://127.0.0.1:8080/
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/about
curl -X POST http://127.0.0.1:8080/echo -H "Content-Type: text/plain" -d "hello from nishant"
```

## Notes

- The TCP server always responds with `Connection: close`
- Request bodies are decoded as UTF-8 text
- Sample raw requests live in `src/assets/`
