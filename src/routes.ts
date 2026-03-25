import { OWNER_PROFILE, PROJECT_NAME, SUPPORTED_ROUTES } from "../constants";
import type { HttpResponse, ParsedHttpRequest } from "../types";
import { jsonResponse, textResponse } from "./httpResponse";

function getPathname(requestTarget: string): string {
  return new URL(requestTarget, "http://127.0.0.1").pathname;
}

export function handleRequest(request: ParsedHttpRequest): HttpResponse {
  const { method, requestTarget } = request.requestLine;
  const pathname = getPathname(requestTarget);

  if (method === "GET" && pathname === "/") {
    return jsonResponse(200, {
      project: PROJECT_NAME,
      owner: OWNER_PROFILE.name,
      github: OWNER_PROFILE.github,
      portfolio: OWNER_PROFILE.portfolio,
      routes: SUPPORTED_ROUTES,
      message: "Raw TCP HTTP server is online and owned by Nishant Gaurav.",
    });
  }

  if (method === "GET" && pathname === "/health") {
    return jsonResponse(200, {
      status: "ok",
      service: PROJECT_NAME,
      owner: OWNER_PROFILE.github,
    });
  }

  if (method === "GET" && pathname === "/about") {
    return jsonResponse(200, OWNER_PROFILE);
  }

  if (pathname === "/echo") {
    if (method !== "POST") {
      return jsonResponse(
        405,
        {
          error: "Use POST /echo to send a body.",
        },
        {
          allow: "POST",
        },
      );
    }

    const contentType = request.headers["content-type"] ?? "text/plain; charset=utf-8";
    const body = request.body.length > 0 ? request.body : "echo endpoint is live";
    return textResponse(200, body, {
      "content-type": contentType,
    });
  }

  return jsonResponse(404, {
    error: "Route not found.",
    path: pathname,
    availableRoutes: SUPPORTED_ROUTES,
  });
}
