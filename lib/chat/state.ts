import { DEFAULT_TITLE, INITIAL_ASSISTANT_MESSAGE } from "./constants";
import type { ChatMessage, Conversation, Role } from "./types";

export const sortConversations = (items: Conversation[]) =>
  [...items].sort((a, b) => b.updatedAt - a.updatedAt);

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createAssistantMessage = (): ChatMessage => ({
  id: randomId(),
  role: "assistant",
  content: INITIAL_ASSISTANT_MESSAGE,
  createdAt: Date.now(),
});

export const createNewConversation = (): Conversation => ({
  id: randomId(),
  title: DEFAULT_TITLE,
  messages: [createAssistantMessage()],
  updatedAt: Date.now(),
});

export const reviveConversation = (candidate: unknown): Conversation | undefined => {
  if (
    typeof candidate !== "object" ||
    !candidate ||
    !("id" in candidate) ||
    !("title" in candidate) ||
    !("messages" in candidate) ||
    !("updatedAt" in candidate)
  ) {
    return undefined;
  }

  const restored = candidate as Conversation;
  const messages = Array.isArray(restored.messages)
    ? restored.messages.map(
        (message): ChatMessage => ({
          ...message,
          createdAt: Number(message.createdAt),
        })
      )
    : [];

  return {
    id: `${restored.id}`,
    title: `${restored.title}`,
    messages,
    updatedAt: Number(restored.updatedAt),
  };
};

export const parseConversations = (raw: string | null): Conversation[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(reviveConversation).filter((item): item is Conversation => Boolean(item));
  } catch {
    return [];
  }
};

export const summariseTitle = (conversation: Conversation): Conversation => {
  if (conversation.title !== DEFAULT_TITLE) {
    return conversation;
  }
  const firstUserMessage = conversation.messages.find((message) => message.role === "user");
  if (!firstUserMessage) {
    return conversation;
  }
  const firstLine = firstUserMessage.content.split("\n")[0] ?? DEFAULT_TITLE;
  const label = firstLine.length > 18 ? `${firstLine.slice(0, 18).trimEnd()}…` : firstLine;
  return { ...conversation, title: label };
};

export const appendMessage = (
  conversation: Conversation,
  role: Role,
  content: string
): Conversation => {
  const message: ChatMessage = {
    id: randomId(),
    role,
    content,
    createdAt: Date.now(),
  };

  return summariseTitle({
    ...conversation,
    messages: [...conversation.messages, message],
    updatedAt: Date.now(),
  });
};
