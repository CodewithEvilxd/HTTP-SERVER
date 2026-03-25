import type { OwnerProfile } from "./types";

export const PROJECT_NAME = "Nishant Raw HTTP Server";
export const SERVER_ID = "nishant-raw-http-server";
export const DEFAULT_HOST = Bun.env.HOST ?? "127.0.0.1";

const requestedPort = Number(Bun.env.PORT ?? "8080");
export const DEFAULT_PORT = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 8080;

const requestedUdpPort = Number(Bun.env.UDP_PORT ?? "9090");
export const DEFAULT_UDP_PORT = Number.isInteger(requestedUdpPort) && requestedUdpPort > 0 ? requestedUdpPort : 9090;

const requestedHeaderLimit = Number(Bun.env.MAX_HEADER_BYTES ?? "16384");
export const MAX_HEADER_BYTES =
  Number.isInteger(requestedHeaderLimit) && requestedHeaderLimit > 0 ? requestedHeaderLimit : 16_384;

export const OWNER_PROFILE: OwnerProfile = {
  name: "Nishant Gaurav",
  github: "https://github.com/codewithevilxd",
  email: "codewithevilxd@gmail.com",
  portfolio: "https://nishantdev.space",
};

export const SUPPORTED_ROUTES = ["/", "/health", "/about", "/echo"] as const;
