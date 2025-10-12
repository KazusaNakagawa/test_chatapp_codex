'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_TITLE, RESPONSE_PATTERNS, STORAGE_KEY } from "./constants";
import { appendMessage, createNewConversation, parseConversations } from "./state";
import type { Conversation } from "./types";

const sortConversations = (items: Conversation[]) =>
  [...items].sort((a, b) => b.updatedAt - a.updatedAt);

const fallbackAssistantReply = () =>
  [
    "良い質問ですね！",
    "このデモは TypeScript・React・Next.js のレイヤーを意識して設計しています。",
    "",
    "実際に本番環境へ展開する際は、",
    "- UI: React コンポーネントで管理しやすい構造を維持",
    "- 状態: カスタムフックや外部ストアで会話履歴を制御",
    "- 通信: API Routes や Edge Functions で OpenAI 等と連携",
    "- SSR: Next.js のハイブリッドレンダリングを活かして初期表示を最適化",
    "といった構成を検討してみてください。",
  ].join("\n");

const buildAssistantResponse = (message: string) => {
  const matched = RESPONSE_PATTERNS.find((entry) => entry.pattern.test(message));
  return matched ? matched.reply(message) : fallbackAssistantReply();
};

const toJSON = (conversations: Conversation[]) =>
  JSON.stringify(conversations, (key, value) => {
    if (key === "createdAt" || key === "updatedAt") {
      return Number(value);
    }
    return value;
  });

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    createNewConversation(),
  ]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0]?.id ?? "");
  const [hydrated, setHydrated] = useState(false);
  const [typingConversationId, setTypingConversationId] = useState<string | null>(null);
  const pendingReply = useRef<number | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const restored = sortConversations(parseConversations(raw));
    if (restored.length > 0) {
      setConversations(restored);
      setActiveId(restored[0].id);
    } else {
      const fresh = createNewConversation();
      setConversations([fresh]);
      setActiveId(fresh.id);
    }
    setHydrated(true);
    return () => {
      if (pendingReply.current) {
        window.clearTimeout(pendingReply.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, toJSON(conversations));
  }, [conversations, hydrated]);

  const activeConversation = useMemo(() => {
    const current = conversations.find((item) => item.id === activeId);
    return current ?? conversations[0];
  }, [conversations, activeId]);

  const selectConversation = useCallback((conversationId: string) => {
    setActiveId(conversationId);
  }, []);

  const startNewChat = useCallback(() => {
    setConversations((prev) => {
      const fresh = createNewConversation();
      setActiveId(fresh.id);
      return [fresh, ...prev];
    });
  }, []);

  const pushConversation = useCallback(
    (conversation: Conversation) => {
      setConversations((prev) => sortConversations([conversation, ...prev.filter(
        (item) => item.id !== conversation.id
      )]));
      setActiveId(conversation.id);
    },
    []
  );

  const sendMessage = useCallback(
    (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || !activeConversation) {
        return;
      }

      const targetConversation = appendMessage(activeConversation, "user", content);
      pushConversation(targetConversation);
      setTypingConversationId(targetConversation.id);

      const reply = buildAssistantResponse(content);
      const delay = 600 + Math.random() * 800;

      if (pendingReply.current) {
        window.clearTimeout(pendingReply.current);
      }

      const timeoutId = window.setTimeout(() => {
        setConversations((prev) => {
          const current = prev.find((item) => item.id === targetConversation.id);
          if (!current) {
            return prev;
          }
          const updated = appendMessage(current, "assistant", reply);
          return sortConversations([updated, ...prev.filter((item) => item.id !== updated.id)]);
        });
        setTypingConversationId((current) =>
          current === targetConversation.id ? null : current
        );
        pendingReply.current = null;
      }, delay);

      pendingReply.current = timeoutId;
    },
    [activeConversation, pushConversation]
  );

  const removeTypingState = useCallback(() => {
    if (pendingReply.current) {
      window.clearTimeout(pendingReply.current);
      pendingReply.current = null;
    }
    setTypingConversationId(null);
  }, []);

  const isTyping = typingConversationId === activeConversation?.id;

  return {
    conversations,
    activeConversation,
    activeId,
    selectConversation,
    startNewChat,
    sendMessage,
    isTyping,
    hydrated,
    typingConversationId,
    removeTypingState,
  };
};
