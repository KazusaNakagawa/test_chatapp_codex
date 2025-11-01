"use client";

import type { ChatMessage, Role } from "./types";

const DEFAULT_BASE_URL = "http://localhost:8000";

const resolveBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_CHAT_API_URL;
  if (!raw) {
    return DEFAULT_BASE_URL;
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
};

const API_BASE_URL = resolveBaseUrl();

type RequestOptions = {
  signal?: AbortSignal;
};

type ApiMessage = Pick<ChatMessage, "role" | "content">;

interface ApiResponse {
  role: Role;
  content: string;
}

export async function requestChatCompletion(
  messages: ChatMessage[],
  options: RequestOptions = {}
): Promise<ApiResponse> {
  const payload = {
    messages: messages.map<ApiMessage>(({ role, content }) => ({
      role,
      content,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await safeReadError(response);
    throw new Error(detail);
  }

  const data = (await response.json()) as ApiResponse;
  return data;
}

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
