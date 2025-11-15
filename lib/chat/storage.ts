import { STORAGE_KEY } from "./constants";
import { parseConversations, sortConversations } from "./state";
import type { Conversation } from "./types";

const toJSON = (conversations: Conversation[]) =>
  JSON.stringify(conversations, (key, value) => {
    if (key === "createdAt" || key === "updatedAt") {
      return Number(value);
    }
    return value;
  });

const isBrowser = () => typeof window !== "undefined" && Boolean(window.localStorage);

export interface ConversationStorage {
  load: () => Conversation[];
  save: (conversations: Conversation[]) => void;
}

export const localConversationStorage: ConversationStorage = {
  load: () => {
    if (!isBrowser()) {
      return [];
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const restored = parseConversations(raw);
    return restored.length > 0 ? sortConversations(restored) : [];
  },
  save: (conversations) => {
    if (!isBrowser()) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, toJSON(conversations));
  },
};

export const createMemoryConversationStorage = (
  initial: Conversation[] = []
): ConversationStorage => {
  let memory = sortConversations([...initial]);
  return {
    load: () => [...memory],
    save: (conversations) => {
      memory = sortConversations([...conversations]);
    },
  };
};
