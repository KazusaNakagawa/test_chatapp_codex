'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requestChatCompletion } from "./api";
import { appendMessage, createNewConversation, sortConversations } from "./state";
import { localConversationStorage, type ConversationStorage } from "./storage";
import type { Conversation } from "./types";

const CONNECTION_ERROR_MESSAGE =
  "サーバーとの通信に失敗しました。しばらく待ってから再度お試しください。";

export interface UseChatOptions {
  api?: typeof requestChatCompletion;
  storage?: ConversationStorage;
}

export const useChat = (options: UseChatOptions = {}) => {
  const chatClient = useMemo(
    () => options.api ?? requestChatCompletion,
    [options.api]
  );
  const storage = useMemo(
    () => options.storage ?? localConversationStorage,
    [options.storage]
  );
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    createNewConversation(),
  ]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0]?.id ?? "");
  const [hydrated, setHydrated] = useState(false);
  const [typingConversationId, setTypingConversationId] = useState<string | null>(null);
  const pendingReply = useRef<AbortController | null>(null);

  useEffect(() => {
    const restored = storage.load();
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
      pendingReply.current?.abort();
      pendingReply.current = null;
    };
  }, [storage]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    storage.save(conversations);
  }, [conversations, hydrated, storage]);

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

      if (pendingReply.current) {
        pendingReply.current.abort();
      }

      const controller = new AbortController();
      pendingReply.current = controller;

      const deliverReply = async () => {
        try {
          const replyContent = await chatClient(targetConversation.messages, {
            signal: controller.signal,
          });

          setConversations((prev) => {
            const current = prev.find((item) => item.id === targetConversation.id);
            if (!current) {
              return prev;
            }
            const updated = appendMessage(current, "assistant", replyContent);
            return sortConversations([
              updated,
              ...prev.filter((item) => item.id !== updated.id),
            ]);
          });
        } catch (error) {
          if (controller.signal.aborted) {
            return;
          }
          setConversations((prev) => {
            const current = prev.find((item) => item.id === targetConversation.id);
            if (!current) {
              return prev;
            }
            const fallback = appendMessage(current, "assistant", CONNECTION_ERROR_MESSAGE);
            return sortConversations([
              fallback,
              ...prev.filter((item) => item.id !== fallback.id),
            ]);
          });
        } finally {
          if (pendingReply.current === controller) {
            pendingReply.current = null;
          }
          setTypingConversationId((current) =>
            current === targetConversation.id ? null : current
          );
        }
      };

      void deliverReply();
    },
    [activeConversation, pushConversation, chatClient]
  );

  const removeTypingState = useCallback(() => {
    if (pendingReply.current) {
      pendingReply.current.abort();
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
