"use client";

import { useEffect, useRef, useState } from "react";

async function writeClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard API is unavailable.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.5 2.5A2 2 0 0 1 7.5.5h5A2 2 0 0 1 14.5 2.5v6a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z" />
      <path d="M3.5 5.5h-1a1 1 0 0 0-1 1v7a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.5 4.5 6.75 11.25 2.5 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 4 12 12" />
      <path d="M12 4 4 12" />
    </svg>
  );
}

export function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      await writeClipboard(text);
      setState("copied");
    } catch {
      setState("error");
    }

    timeoutRef.current = window.setTimeout(() => {
      setState("idle");
      timeoutRef.current = null;
    }, 1800);
  }

  const label = state === "copied" ? "Copied" : state === "error" ? "Retry" : "Copy";
  const Icon = state === "copied" ? CheckIcon : state === "error" ? ErrorIcon : CopyIcon;
  const ariaLabel = state === "copied" ? "Code copied" : state === "error" ? "Copy failed, try again" : "Copy code";

  return (
    <button
      type="button"
      className={`copy-button${state !== "idle" ? ` is-${state}` : ""}${className ? ` ${className}` : ""}`}
      onClick={handleCopy}
      aria-label={ariaLabel}
      title={label}
    >
      <span className="copy-button-icon" aria-hidden="true">
        <Icon />
      </span>
    </button>
  );
}
