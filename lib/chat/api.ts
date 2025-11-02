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

/**
 * assistant の content を正規化して抽出する
 */
const normaliseContent = (rawBody: string): string => {
  try {
    // 外側 JSON をパース
    const outer = JSON.parse(rawBody);
    let innerRaw = outer.content;

    // シングルクォートをダブルクォートに変換
    // 改行やタブなどをエスケープ
    innerRaw = innerRaw
      .replace(/'/g, '"')
      .replace(/\r?\n/g, "\\n")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f")
      .replace(/\v/g, "\\v");

    // "最初の }" 以降の余分な文章を除去
    //  → 内側JSONの末尾を検出してそこまで切り出す
    const match = innerRaw.match(/^\s*{.*?}\s*/s);
    if (match) {
      innerRaw = match[0]; // JSON 部分だけに限定
    }

    // 内側 JSON をパース
    const inner = JSON.parse(innerRaw);

    // content を返す
    if (typeof inner.content === "string") {
      // 文字列内の \n を実際の改行に変換（任意）
      return inner.content.replace(/\\n/g, "\n");
    }

    return innerRaw;
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

  console.log(rawBody)
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