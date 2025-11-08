"use client";

import type { ChatMessage } from "./types";

const DEFAULT_BASE_URL = "http://localhost:8000";

const resolveBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_CHAT_API_URL;
  if (!raw) return DEFAULT_BASE_URL;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

const API_BASE_URL = resolveBaseUrl();

type RequestOptions = { signal?: AbortSignal };
type ApiMessage = Pick<ChatMessage, "role" | "content">;
type ContentCarrier = { content?: unknown };

const CONTENT_KEY_PATTERN = /["']content["']\s*:\s*/i;
const ESCAPE_MAP: Record<string, string> = {
  n: "\n",
  r: "\r",
  t: "\t",
  b: "\b",
  f: "\f",
  v: "\v",
  0: "\0",
  "\\": "\\",
  '"': '"',
  "'": "'",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const decodeEscapedLiteral = (value: string): string =>
  value.replace(/\\(u[0-9a-fA-F]{4}|.)/g, (_, sequence: string) => {
    if (sequence.startsWith("u") && sequence.length === 5) {
      return String.fromCharCode(Number.parseInt(sequence.slice(1), 16));
    }
    return ESCAPE_MAP[sequence] ?? sequence;
  });

const extractContentFromPseudoJson = (raw: string): string | null => {
  const match = CONTENT_KEY_PATTERN.exec(raw);
  if (!match || match.index === undefined) {
    return null;
  }
  let cursor = match.index + match[0].length;
  const quote = raw[cursor];
  if (quote !== '"' && quote !== "'") {
    return null;
  }
  cursor += 1;
  let buffer = "";
  let escaped = false;
  for (; cursor < raw.length; cursor += 1) {
    const char = raw[cursor];
    if (escaped) {
      buffer += "\\";
      buffer += char;
      escaped = false;
      continue;   
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === quote) {
      return decodeEscapedLiteral(buffer);
    }
    buffer += char;
  }
  return null;
};

const tryParseInnerContent = (raw: string): string | null => {
  try {
    const parsed = JSON.parse(raw);
    if (isRecord(parsed)) {
      const { content } = parsed as ContentCarrier;
      if (typeof content === "string") {
        return decodeEscapedLiteral(content);
      }
    }
  } catch {
    // ignore
  }
  return extractContentFromPseudoJson(raw);
};

/**
 * assistant の content を正規化して抽出する
 */
const normaliseContent = (rawBody: string): string => {
  try {
    const outer = JSON.parse(rawBody);
    if (isRecord(outer)) {
      const { content } = outer as ContentCarrier;
      if (typeof content !== "string") {
        return rawBody;
      }
      const inner = tryParseInnerContent(content);
      if (typeof inner === "string") {
        return inner;
      }
      return decodeEscapedLiteral(content);
    }
    if (typeof outer === "string") {
      return decodeEscapedLiteral(outer);
    }
    return rawBody;
  } catch (err) {
    console.error("content抽出失敗:", err);
    return rawBody;
  }
};

/**
 * Send chat messages to the configured backend and return the response's extracted content.
 *
 * @param messages - Sequence of chat messages to send; each message's `role` and `content` are included in the request payload
 * @param options - Optional request settings
 * @param options.signal - AbortSignal to cancel the request
 * @returns The response content extracted and normalized from the backend; if extraction fails, the original response body is returned
 * @throws An Error containing HTTP status and backend detail when the response has a non-OK status
 */
export async function requestChatCompletion(
  messages: ChatMessage[],
  options: RequestOptions = {}
): Promise<string> {
  const payload = {
    messages: messages.map<ApiMessage>(({ role, content }) => ({ role, content })),
  };

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await safeReadError(response);
    throw new Error(detail);
  }

  const rawBody = await response.text();
  return normaliseContent(rawBody);
}

/**
 * Extracts a readable error message from an HTTP Response.
 *
 * @param response - The Response object to inspect for a JSON `detail` field
 * @returns A string in the form "`<status> <statusText>: <detail>`" if the body contains a `detail` field; otherwise "`<status> <statusText>`"
 */
async function safeReadError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data === "object" && "detail" in data) {
      return `${response.status} ${response.statusText}: ${String(data.detail)}`;
    }
  } catch {
    // ignore
  }
  return `${response.status} ${response.statusText}`;
}