import { DEFAULT_HOST, DEFAULT_UDP_PORT, PROJECT_NAME } from "../constants";
import { decodeBytes } from "./utils/byteUtils";

const socket = await Bun.udpSocket({
  hostname: DEFAULT_HOST,
  port: DEFAULT_UDP_PORT,
  binaryType: "uint8array",
  socket: {
    data(server, data, port, address) {
      const message = decodeBytes(data).trim();
      console.log(`[${PROJECT_NAME}] udp ${address}:${port} -> ${message}`);
      server.send(`ack:${message}`, port, address);
    },
    error(_server, error) {
      console.error(`[${PROJECT_NAME}] udp error`, error);
    },
  },
});

console.log(`[${PROJECT_NAME}] UDP listener on ${socket.hostname}:${socket.port}`);
