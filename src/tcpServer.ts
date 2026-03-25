import { DEFAULT_HOST, DEFAULT_PORT, PROJECT_NAME } from "../constants";
import type { SocketState } from "../types";
import { jsonResponse, serializeHttpResponse } from "./httpResponse";
import { parseHttpRequest } from "./parseStreamRequest";
import { handleRequest } from "./routes";
import { concatBytes } from "./utils/byteUtils";

function createErrorResponse(message: string): string {
  const normalized = message.toLowerCase();
  const status = normalized.includes("size limit") ? 431 : 400;
  return serializeHttpResponse(
    jsonResponse(status, {
      error: message,
    }),
  );
}

const server = Bun.listen<SocketState>({
  hostname: DEFAULT_HOST,
  port: DEFAULT_PORT,
  data: {
    buffer: new Uint8Array(0),
  },
  socket: {
    binaryType: "uint8array",
    open(socket) {
      socket.data.buffer = new Uint8Array(0);
      socket.timeout(30);
    },
    data(socket, data) {
      socket.data.buffer = concatBytes(socket.data.buffer, data);

      try {
        const parsed = parseHttpRequest(socket.data.buffer);
        if (parsed.kind === "incomplete") {
          return;
        }

        socket.data.buffer = parsed.remaining;
        const response = handleRequest(parsed.request);
        socket.end(serializeHttpResponse(response));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected server error.";
        socket.end(createErrorResponse(message));
      }
    },
    timeout(socket) {
      socket.end(
        serializeHttpResponse(
          jsonResponse(408, {
            error: "Request timed out before a full HTTP message was received.",
          }),
        ),
      );
    },
    close(socket) {
      socket.data.buffer = new Uint8Array(0);
    },
    error(_socket, error) {
      console.error(`[${PROJECT_NAME}] socket error`, error);
    },
  },
});

console.log(`[${PROJECT_NAME}] listening on http://${server.hostname}:${server.port}`);
